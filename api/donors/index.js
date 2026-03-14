// api/donors/index.js
// GET — ambil daftar donor
// POST — tambah donasi baru

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {

  // ===== CORS =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ===== GET =====
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('id, name, amount, message, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Tandai donor dengan amount tertinggi sebagai highlight
      const maxAmount = data.length
        ? Math.max(...data.map(d => d.amount))
        : 0;

      const donors = data.map(d => ({
        name:      d.name,
        amount:    d.amount,
        message:   d.message || '',
        highlight: d.amount === maxAmount,
      }));

      return res.status(200).json({
        success: true,
        donors,
      });

    } catch (e) {
      console.error('Error ambil donor:', e);
      return res.status(500).json({ error: 'Gagal mengambil data donor' });
    }
  }

  // ===== POST =====
  if (req.method === 'POST') {
    const { name, amount, message } = req.body;

    // Validasi
    if (!name || amount === undefined) {
      return res.status(400).json({ error: 'name dan amount wajib diisi' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'amount harus angka positif' });
    }

    if (name.length > 50) {
      return res.status(400).json({ error: 'nama maksimal 50 karakter' });
    }

    try {
      const { error } = await supabase
        .from('donors')
        .insert({
          name:    name.trim(),
          amount,
          message: message ? message.trim() : null,
        });

      if (error) throw error;

      return res.status(200).json({ success: true });

    } catch (e) {
      console.error('Error tambah donor:', e);
      return res.status(500).json({ error: 'Gagal menyimpan donasi' });
    }
  }

  // Method tidak diizinkan
  return res.status(405).json({ error: 'Method not allowed' });
}
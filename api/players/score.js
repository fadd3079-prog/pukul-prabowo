// api/players/score.js
// POST — simpan skor pemain ke database

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {

  // ===== CORS =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ===== VALIDASI =====
  const { name, province, score } = req.body;

  if (!name || !province || score === undefined) {
    return res.status(400).json({ error: 'name, province, score wajib diisi' });
  }

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'score harus angka positif' });
  }

  if (name.length > 50) {
    return res.status(400).json({ error: 'nama maksimal 50 karakter' });
  }

  // ===== SIMPAN SKOR =====
  try {
    const { error: insertError } = await supabase
      .from('players')
      .insert({
        name:     name.trim(),
        province: province.trim(),
        score,
      });

    if (insertError) throw insertError;

    // ===== AMBIL RANK =====
    // Hitung rank berdasarkan berapa pemain yang skornya lebih tinggi
    const { count, error: rankError } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gt('score', score);

    if (rankError) throw rankError;

    const rank = (count || 0) + 1;

    return res.status(200).json({
      success: true,
      rank,
    });

  } catch (e) {
    console.error('Error simpan skor:', e);
    return res.status(500).json({ error: 'Gagal menyimpan skor' });
  }
}
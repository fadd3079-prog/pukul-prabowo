// api/players/rank.js
// GET — ambil rank terkini pemain berdasarkan nama + provinsi

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {

  // ===== CORS =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // ===== VALIDASI =====
  const { name, province } = req.query;

  if (!name || !province) {
    return res.status(400).json({ error: 'name dan province wajib diisi' });
  }

  // ===== AMBIL SKOR TERTINGGI PEMAIN =====
  try {
    const { data, error: scoreError } = await supabase
      .from('players')
      .select('score')
      .eq('name', name.trim())
      .eq('province', province.trim())
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (scoreError) {
      // Pemain belum pernah main
      if (scoreError.code === 'PGRST116') {
        return res.status(200).json({ rank: 0, score: 0 });
      }
      throw scoreError;
    }

    const bestScore = data.score;

    // ===== HITUNG RANK =====
    // Rank = jumlah pemain dengan skor lebih tinggi + 1
    const { count, error: rankError } = await supabase
      .from('player_ranking')
      .select('*', { count: 'exact', head: true })
      .gt('score', bestScore);

    if (rankError) throw rankError;

    const rank = (count || 0) + 1;

    return res.status(200).json({
      rank,
      score: bestScore,
    });

  } catch (e) {
    console.error('Error ambil rank:', e);
    return res.status(500).json({ error: 'Gagal mengambil rank' });
  }
}
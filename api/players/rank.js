// api/players/rank.js
const { supabase } = require('../../lib/supabase');

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'name wajib diisi' });
  }

  try {

    const { data, error } = await supabase
      .from('player_ranking')
      .select('rank, score, province')
      .eq('name', name.trim())
      .single();

    if (error || !data) {
      return res.status(200).json({
        rank: 0,
        score: 0,
        province: null
      });
    }

    return res.status(200).json({
      rank: data.rank,
      score: data.score,
      province: data.province
    });

  } catch (e) {

    return res.status(500).json({
      error: 'Gagal mengambil rank'
    });

  }
};
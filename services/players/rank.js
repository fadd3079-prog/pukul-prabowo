// api/players/rank.js
const { supabase } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { name, province } = req.query;
  if (!name || !province) {
    return res.status(400).json({ error: 'name dan province wajib diisi' });
  }

  try {
    const { data, error } = await supabase
      .from('players')
      .select('score')
      .eq('name', name.trim())
      .eq('province', province.trim())
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error) return res.status(200).json({ rank: 0, score: 0 });

    const { count } = await supabase
      .from('player_ranking')
      .select('*', { count: 'exact', head: true })
      .gt('score', data.score);

    return res.status(200).json({ rank: (count || 0) + 1, score: data.score });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal mengambil rank' });
  }
};
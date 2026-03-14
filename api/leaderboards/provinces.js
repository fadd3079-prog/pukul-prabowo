// api/leaderboard/provinces.js
const { supabase } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const size = Math.min(20, Math.max(1, parseInt(req.query.size) || 5));
  const from = (page - 1) * size;
  const to   = from + size - 1;

  try {
    const { data, error } = await supabase
      .from('province_ranking')
      .select('rank, province, score')
      .range(from, to)
      .order('score', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ success: true, page, size, provinces: data || [] });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal mengambil leaderboard provinsi' });
  }
};
// api/players/score.js
const { supabase } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, province, score } = req.body;
  if (!name || !province || score === undefined) {
    return res.status(400).json({ error: 'name, province, score wajib diisi' });
  }

  try {
    const { error: insertError } = await supabase
      .from('players')
      .insert({ name: name.trim(), province: province.trim(), score });

    if (insertError) throw insertError;

    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gt('score', score);

    return res.status(200).json({ success: true, rank: (count || 0) + 1 });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal menyimpan skor' });
  }
};
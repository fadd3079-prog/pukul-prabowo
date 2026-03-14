const { supabase } = require('../../lib/supabase');

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const { name, province, score } = req.body || {};

    if (!name || !province || typeof score !== "number") {
      return res.status(400).json({
        error: 'name, province, score wajib diisi'
      });
    }

    const { error: insertError } = await supabase
      .from('players')
      .insert({
        name: name.trim(),
        province: province.trim(),
        score
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return res.status(500).json({ error: insertError.message });
    }

    const { count, error: countError } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gt('score', score);

    if (countError) {
      console.error("Count error:", countError);
      return res.status(500).json({ error: countError.message });
    }

    return res.status(200).json({
      success: true,
      rank: (count || 0) + 1
    });

  } catch (e) {

    console.error("Server error:", e);

    return res.status(500).json({
      error: 'Server error'
    });

  }

};
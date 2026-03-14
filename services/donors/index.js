// api/donors/index.js
const { supabase } = require('../../lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('id, name, amount, message, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const maxAmount = data.length ? Math.max(...data.map(d => d.amount)) : 0;
      const donors = data.map(d => ({
        name:      d.name,
        amount:    d.amount,
        highlight: d.amount === maxAmount,
      }));

      return res.status(200).json({ success: true, donors });
    } catch (e) {
      return res.status(500).json({ error: 'Gagal mengambil donor' });
    }
  }

  if (req.method === 'POST') {
    const { name, amount, message } = req.body;
    if (!name || !amount) return res.status(400).json({ error: 'name dan amount wajib' });

    try {
      const { error } = await supabase
        .from('donors')
        .insert({ name: name.trim(), amount, message: message || null });

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Gagal menyimpan donor' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
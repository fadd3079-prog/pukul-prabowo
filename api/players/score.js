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

  const playerName = name.trim();
  const playerProvince = province.trim();
  const playerScore = Number(score);

  try {

    // 1️⃣ cek apakah player sudah ada
    const { data: existingPlayer, error: fetchError } = await supabase
      .from('players')
      .select('*')
      .eq('name', playerName)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // 2️⃣ jika belum ada → insert
    if (!existingPlayer) {

      const { error: insertError } = await supabase
        .from('players')
        .insert({
          name: playerName,
          province: playerProvince,
          score: playerScore
        });

      if (insertError) throw insertError;

    } else {

      // 3️⃣ jika ada → update hanya jika skor lebih tinggi
      if (playerScore > existingPlayer.score) {

        const { error: updateError } = await supabase
          .from('players')
          .update({
            score: playerScore,
            province: playerProvince
          })
          .eq('name', playerName);

        if (updateError) throw updateError;

      }
    }

    // 4️⃣ hitung rank
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gt('score', playerScore);

    return res.status(200).json({
      success: true,
      rank: (count || 0) + 1
    });

  } catch (e) {

    console.error(e);

    return res.status(500).json({
      error: 'Gagal menyimpan skor'
    });

  }
};
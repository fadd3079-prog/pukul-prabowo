const { supabase } = require('../../lib/supabase')

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type')

  if(req.method === 'OPTIONS') return res.status(200).end()
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})

  try{

    const { id_player, name, province_id, score } = req.body

    if(!id_player || !name || !province_id || score === undefined){
      return res.status(400).json({error:'data tidak lengkap'})
    }

    const { data, error } = await supabase
      .from('players')
      .upsert(
        {
          id_player,
          name,
          province_id,
          score
        },
        {
          onConflict: 'id_player'
        }
      )
      .select()
      .single()

    if(error) throw error

    return res.status(200).json(data)

  }catch(err){

    return res.status(500).json({error:err.message})

  }
}

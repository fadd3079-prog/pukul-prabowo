const { supabase } = require('../../lib/supabase')

module.exports = async function handler(req, res){

  res.setHeader('Access-Control-Allow-Origin','*')

  if(req.method !== 'GET'){
    return res.status(405).json({error:'Method not allowed'})
  }

  try{

    const { id_player } = req.query

    const { data:player, error } = await supabase
      .from('players')
      .select('score')
      .eq('id_player', id_player)
      .single()

    if(error) throw error

    const { count } = await supabase
      .from('players')
      .select('*',{count:'exact', head:true})
      .gt('score', player.score)

    const rank = (count || 0) + 1

    return res.status(200).json({
      rank,
      score:player.score
    })

  }catch(err){

    return res.status(500).json({error:err.message})

  }

}

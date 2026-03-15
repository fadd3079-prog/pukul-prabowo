const { supabase } = require('../../lib/supabase')

module.exports = async function handler(req,res){

  res.setHeader('Access-Control-Allow-Origin','*')

  if(req.method !== 'GET'){
    return res.status(405).json({error:'Method not allowed'})
  }

  try{

    const { data, error } = await supabase
      .from('players')
      .select('id_player,name,score')
      .order('score',{ascending:false})
      .limit(10)

    if(error) throw error

    return res.status(200).json(data)

  }catch(err){

    return res.status(500).json({error:err.message})

  }

}

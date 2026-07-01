const { supabase } = require('../../lib/supabase')
const { validateMethod, jsonOk, jsonError, getPage } = require('../../lib/apiHelper')

module.exports = async function handler(req, res) {
  if (!validateMethod(req, res, 'GET')) return

  try {
    const { page, size } = getPage(req)
    const from = (page - 1) * size
    const to = from + size - 1

    const { data, error } = await supabase
      .from('province_leaderboard')
      .select('province_code, province_name, total_score, player_count, top_score')
      .range(from, to)

    if (error) {
      console.error('province leaderboard error:', error)
      return jsonError(res, 500, 'DB_ERROR', 'Failed to fetch province leaderboard')
    }

    return jsonOk(res, { provinces: data, page, size })
  } catch (err) {
    console.error('province leaderboard unexpected error:', err)
    return jsonError(res, 500, 'INTERNAL_ERROR', 'Something went wrong')
  }
}

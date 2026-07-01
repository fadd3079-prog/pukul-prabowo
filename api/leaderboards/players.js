const { supabase } = require('../../lib/supabase')
const { validateMethod, jsonOk, jsonError, getPage } = require('../../lib/apiHelper')

module.exports = async function handler(req, res) {
  if (!validateMethod(req, res, 'GET')) return

  try {
    const { page, size } = getPage(req)
    const from = (page - 1) * size
    const to = from + size - 1

    const { data, error, count } = await supabase
      .from('player_leaderboard')
      .select('id, name, province_name, score, max_combo, rank', { count: 'exact' })
      .range(from, to)

    if (error) {
      console.error('player leaderboard error:', error)
      return jsonError(res, 500, 'DB_ERROR', 'Failed to fetch leaderboard')
    }

    return jsonOk(res, { players: data, page, size, total: count })
  } catch (err) {
    console.error('player leaderboard unexpected error:', err)
    return jsonError(res, 500, 'INTERNAL_ERROR', 'Something went wrong')
  }
}

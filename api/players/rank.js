const { supabase } = require('../../lib/supabase')
const {
  validateMethod,
  jsonOk,
  jsonError,
  normalizeName,
  toProvinceCode,
} = require('../../lib/apiHelper')

module.exports = async function handler(req, res) {
  if (!validateMethod(req, res, 'GET')) return

  try {
    const { name, province } = req.query

    if (!name || typeof name !== 'string') {
      return jsonError(res, 400, 'INVALID_NAME', 'name query parameter is required')
    }
    if (!province || typeof province !== 'string') {
      return jsonError(res, 400, 'INVALID_PROVINCE', 'province query parameter is required')
    }

    const nameNormalized = normalizeName(name)
    const provinceCode = toProvinceCode(province)

    // Find the player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, name, score')
      .eq('name_normalized', nameNormalized)
      .eq('province_code', provinceCode)
      .single()

    if (playerError || !player) {
      return jsonError(res, 404, 'PLAYER_NOT_FOUND', 'Player not found')
    }

    // Count players with higher score to determine rank
    const { count, error: countError } = await supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .gt('score', player.score)

    if (countError) {
      console.error('rank count error:', countError)
      return jsonError(res, 500, 'DB_ERROR', 'Failed to calculate rank')
    }

    const rank = (count || 0) + 1

    return jsonOk(res, {
      rank,
      score: player.score,
      name: player.name,
    })
  } catch (err) {
    console.error('rank unexpected error:', err)
    return jsonError(res, 500, 'INTERNAL_ERROR', 'Something went wrong')
  }
}

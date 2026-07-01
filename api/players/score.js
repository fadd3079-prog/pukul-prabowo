const { supabase } = require('../../lib/supabase')
const {
  validateMethod,
  jsonOk,
  jsonError,
  toProvinceCode,
  VALID_PROVINCES,
} = require('../../lib/apiHelper')

module.exports = async function handler(req, res) {
  if (!validateMethod(req, res, 'POST')) return

  try {
    const { name, province, score, max_combo } = req.body || {}

    // --- Validate name ---
    if (!name || typeof name !== 'string') {
      return jsonError(res, 400, 'INVALID_NAME', 'Name is required and must be a string')
    }
    const trimmedName = name.trim()
    if (trimmedName.length < 1 || trimmedName.length > 30) {
      return jsonError(res, 400, 'INVALID_NAME', 'Name must be between 1 and 30 characters')
    }

    // --- Validate province ---
    if (!province || typeof province !== 'string') {
      return jsonError(res, 400, 'INVALID_PROVINCE', 'Province is required')
    }
    const trimmedProvince = province.trim()
    if (!VALID_PROVINCES.includes(trimmedProvince)) {
      return jsonError(res, 400, 'INVALID_PROVINCE', 'Province is not valid')
    }

    // --- Validate score ---
    if (score === undefined || score === null) {
      return jsonError(res, 400, 'INVALID_SCORE', 'Score is required')
    }
    const parsedScore = Number(score)
    if (!Number.isInteger(parsedScore) || parsedScore < 1 || parsedScore > 999999999) {
      return jsonError(res, 400, 'INVALID_SCORE', 'Score must be a positive integer up to 999999999')
    }

    // --- Validate max_combo (optional) ---
    let parsedCombo = 0
    if (max_combo !== undefined && max_combo !== null) {
      parsedCombo = Number(max_combo)
      if (!Number.isInteger(parsedCombo) || parsedCombo < 0) {
        return jsonError(res, 400, 'INVALID_COMBO', 'max_combo must be a non-negative integer')
      }
    }

    const provinceCode = toProvinceCode(trimmedProvince)

    const { data, error } = await supabase.rpc('submit_player_score', {
      p_name: trimmedName,
      p_province_code: provinceCode,
      p_province_name: trimmedProvince,
      p_score: parsedScore,
      p_max_combo: parsedCombo,
    })

    if (error) {
      console.error('submit_player_score rpc error:', error)
      return jsonError(res, 500, 'DB_ERROR', 'Failed to submit score')
    }

    const result = data
    return jsonOk(res, {
      player_id: result.player_id,
      score: result.final_score,
      rank: result.rank,
    })
  } catch (err) {
    console.error('score submit unexpected error:', err)
    return jsonError(res, 500, 'INTERNAL_ERROR', 'Something went wrong')
  }
}

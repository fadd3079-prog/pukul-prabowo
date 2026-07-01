const { supabase } = require('../../lib/supabase')
const { validateMethod, jsonOk, jsonError } = require('../../lib/apiHelper')

module.exports = async function handler(req, res) {
  if (!validateMethod(req, res, 'GET')) return

  try {
    const { data, error } = await supabase
      .from('donors')
      .select('name, amount, message')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      console.error('donors fetch error:', error)
      return jsonError(res, 500, 'DB_ERROR', 'Failed to fetch donors')
    }

    return jsonOk(res, { donors: data })
  } catch (err) {
    console.error('donors unexpected error:', err)
    return jsonError(res, 500, 'INTERNAL_ERROR', 'Something went wrong')
  }
}

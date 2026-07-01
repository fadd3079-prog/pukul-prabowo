const { supabase } = require('../lib/supabase')
const { validateMethod, jsonOk, jsonError } = require('../lib/apiHelper')

module.exports = async function handler(req, res) {
  if (!validateMethod(req, res, 'GET')) return

  try {
    const { error } = await supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .limit(0)

    if (error) {
      console.error('health check error:', error)
      return jsonError(res, 503, 'DB_UNREACHABLE', 'Database is not reachable')
    }

    return jsonOk(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('health check unexpected error:', err)
    return jsonError(res, 503, 'HEALTH_CHECK_FAILED', 'Health check failed')
  }
}

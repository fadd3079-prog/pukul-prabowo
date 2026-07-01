const VALID_PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau',
  'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung',
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Banten', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
  'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Sulawesi Tengah',
  'Sulawesi Selatan', 'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat',
  'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Selatan',
  'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya',
]

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function jsonOk(res, data, status = 200) {
  return res.status(status).json({ ok: true, data, error: null })
}

function jsonError(res, status, code, message) {
  return res.status(status).json({ ok: false, data: null, error: { code, message } })
}

/**
 * Validates the HTTP method and handles OPTIONS preflight.
 * Returns true if the request should continue, false if a response was already sent.
 */
function validateMethod(req, res, allowed) {
  cors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return false
  }

  const methods = Array.isArray(allowed) ? allowed : [allowed]
  if (!methods.includes(req.method)) {
    jsonError(res, 405, 'METHOD_NOT_ALLOWED', `Only ${methods.join(', ')} allowed`)
    return false
  }

  return true
}

function getPage(req) {
  let page = parseInt(req.query.page, 10)
  let size = parseInt(req.query.size, 10)
  if (!Number.isFinite(page) || page < 1) page = 1
  if (!Number.isFinite(size) || size < 1) size = 10
  if (size > 50) size = 50
  return { page, size }
}

function normalizeName(name) {
  return String(name).trim().toLowerCase()
}

function toProvinceCode(name) {
  return String(name).trim().toLowerCase().replace(/\s+/g, '-')
}

module.exports = {
  VALID_PROVINCES,
  cors,
  jsonOk,
  jsonError,
  validateMethod,
  getPage,
  normalizeName,
  toProvinceCode,
}

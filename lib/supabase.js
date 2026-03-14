const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  throw new Error("Supabase environment variables missing");
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

module.exports = { supabase };
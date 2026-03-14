// lib/supabase.js
// Koneksi Supabase client — dipakai semua endpoint API

import { createClient } from '@supabase/supabase-js';

// ===== ENV VARIABLES =====
// Isi di Vercel Dashboard → Settings → Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY; // pakai service key bukan anon key

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_KEY wajib diisi di environment variables');
}

// ===== CLIENT =====
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false, // serverless — tidak perlu simpan session
  },
});
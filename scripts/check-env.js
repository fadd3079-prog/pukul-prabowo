#!/usr/bin/env node
// Check that required environment variables are set

const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

console.log('\n🔍 Checking environment variables...\n');

let allOk = true;

required.forEach(key => {
  const value = process.env[key];
  if (value && value.length > 0) {
    console.log(`  ✅ ${key} — SET (${value.length} chars)`);
  } else {
    console.log(`  ❌ ${key} — MISSING`);
    allOk = false;
  }
});

console.log('');

if (allOk) {
  console.log('✅ All environment variables are set.\n');
  process.exit(0);
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('   Copy .env.example to .env and fill in the values.\n');
  process.exit(1);
}

# API Error Fix - TODO Steps

## Approved Plan
- [x] 1. Update services/*.js: Dynamic BASE_URL + 3x retry logic
- [x] 2. Update ui/donorTicker.js & ui/leaderboardUI.js: Add error toasts
- [ ] 3. Test locally: Install Vercel CLI (`npm i -g vercel`), run `vercel dev`
- [ ] 4. Deploy: `vercel --prod`
- [ ] 5. Verify Supabase tables & env vars exist

## Progress
API errors fixed with dynamic URLs, retries, and user-visible toasts using placeholders on failure. Open index.html or run dev server to test.

Updated TODO.md.

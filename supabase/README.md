# Pukul Prabowo — Supabase Database

Database schema and seed data for the **Pukul Prabowo** tap-tap game.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- A Supabase project (local or hosted)
- `psql` or the Supabase SQL Editor

## Quick Setup

### Option A: Supabase SQL Editor (Hosted)

1. Go to your Supabase Dashboard → **SQL Editor**
2. Paste and run `reset.sql` — this creates the full schema
3. Paste and run `seed.sql` — this populates sample data

### Option B: psql (Local / Remote)

```bash
# Set your database URL
export DATABASE_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"

# Run schema reset (WARNING: destroys existing game data)
psql "$DATABASE_URL" -f supabase/reset.sql

# Run seed data
psql "$DATABASE_URL" -f supabase/seed.sql
```

### Option C: Supabase CLI (Local Dev)

```bash
# Start local Supabase
supabase start

# Run against local database
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/reset.sql
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/seed.sql
```

## Schema Overview

### Tables

| Table | Description |
|-------|-------------|
| `players` | Registered players with high scores, keyed by `(name_normalized, province_code)` |
| `score_events` | Immutable audit log of every score submission |
| `donors` | Donation records displayed on the support page |

### Views

| View | Description |
|------|-------------|
| `player_leaderboard` | Ranked player list (`ROW_NUMBER` by score DESC) |
| `province_leaderboard` | Aggregated scores per province |

### Functions (RPC)

| Function | Description |
|----------|-------------|
| `submit_player_score(p_name, p_province_code, p_province_name, p_score, p_max_combo)` | Main game RPC — upserts player, records event, returns `{ player_id, score, rank }` |
| `update_updated_at()` | Internal trigger function for auto-updating timestamps |

### Entity Relationship

```
players (1) ──── (N) score_events
   │
   └── Views: player_leaderboard, province_leaderboard

donors (standalone)
```

## Province Codes

Province codes are URL-safe slugs derived from the province name. Examples:

| Province Name | Province Code |
|---------------|---------------|
| DKI Jakarta | `dki-jakarta` |
| Jawa Barat | `jawa-barat` |
| Jawa Tengah | `jawa-tengah` |
| DI Yogyakarta | `di-yogyakarta` |
| Sumatera Utara | `sumatera-utara` |
| Sulawesi Selatan | `sulawesi-selatan` |
| Papua Barat Daya | `papua-barat-daya` |

All 38 Indonesian provinces are supported.

## Row Level Security (RLS)

RLS is **enabled on all tables**. The policies are intentionally restrictive:

| Table | `anon` Role | `service_role` |
|-------|-------------|----------------|
| `players` | ✅ SELECT | Full access (bypasses RLS) |
| `score_events` | ❌ No access | Full access (bypasses RLS) |
| `donors` | ✅ SELECT (visible only) | Full access (bypasses RLS) |

### Important Notes

- **`anon` cannot write to any table directly.** All writes go through the `submit_player_score` RPC function, which uses `SECURITY DEFINER` to bypass RLS.
- **`score_events` is completely hidden** from anonymous users — it's an internal audit table.
- **Donors with `is_visible = false`** are hidden from the public API.
- The **`service_role` key** should NEVER be exposed to the client. Use it only in server-side code or Edge Functions.

## API Usage (from client)

### Submit a Score

```javascript
const { data, error } = await supabase.rpc('submit_player_score', {
  p_name: 'Rizky',
  p_province_code: 'jawa-barat',
  p_province_name: 'Jawa Barat',
  p_score: 125000,
  p_max_combo: 42
});
// data = { player_id: "uuid", score: 125000, rank: 5 }
```

### Get Player Leaderboard

```javascript
const { data } = await supabase
  .from('player_leaderboard')
  .select('*')
  .limit(100);
```

### Get Province Leaderboard

```javascript
const { data } = await supabase
  .from('province_leaderboard')
  .select('*');
```

### Get Donors

```javascript
const { data } = await supabase
  .from('donors')
  .select('name, amount, message')
  .order('created_at', { ascending: false });
```

## File Reference

| File | Purpose |
|------|---------|
| `reset.sql` | Drops and recreates all schema objects (⚠️ destructive) |
| `seed.sql` | Inserts sample donors and players via RPC |
| `README.md` | This documentation file |

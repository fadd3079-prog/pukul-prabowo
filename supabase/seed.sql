-- =============================================================================
-- PUKUL PRABOWO — Seed Data
-- =============================================================================
-- Run this AFTER reset.sql to populate the database with sample data.
-- Safe to run multiple times (uses ON CONFLICT to skip duplicates).
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- DONORS (8 entries)
-- ---------------------------------------------------------------------------

INSERT INTO donors (name, amount, message, is_visible) VALUES
    ('Andi Saputra',     500000, 'Semangat terus! Pukul yang keras! 💪',          true),
    ('Rina Marlina',     250000, 'Lucu banget gamenya haha',                      true),
    ('Budi Hartono',     100000, 'Salam dari Bandung!',                           true),
    ('Dewi Lestari',      50000, NULL,                                            true),
    ('Fajar Nugroho',    150000, 'Mantap, lanjutkan perjuangan!',                 true),
    ('Siti Rahayu',       75000, 'Semoga bermanfaat 🙏',                          true),
    ('Agus Prasetyo',     10000, 'Sedikit tapi ikhlas',                           true),
    ('Anonymous',        300000, 'Keep up the good work',                         false)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- PLAYERS (12 entries across 8 provinces)
-- ---------------------------------------------------------------------------
-- Using submit_player_score() to properly create players with audit trail.
-- This also tests the RPC function works correctly.
-- ---------------------------------------------------------------------------

-- Jawa Barat players
SELECT submit_player_score('Rizky Aditya',    'jawa-barat',           'Jawa Barat',           982450,  187);
SELECT submit_player_score('Nisa Fitriani',   'jawa-barat',           'Jawa Barat',           645200,  142);

-- DKI Jakarta players
SELECT submit_player_score('Arief Wicaksono', 'dki-jakarta',          'DKI Jakarta',         1250300,  223);
SELECT submit_player_score('Maya Putri',      'dki-jakarta',          'DKI Jakarta',          430100,   98);

-- Jawa Tengah players
SELECT submit_player_score('Bagas Pratama',   'jawa-tengah',          'Jawa Tengah',          875600,  165);
SELECT submit_player_score('Wulan Sari',      'jawa-tengah',          'Jawa Tengah',          312750,   76);

-- Jawa Timur player
SELECT submit_player_score('Dimas Kurniawan', 'jawa-timur',           'Jawa Timur',           567800,  134);

-- Sumatera Utara player
SELECT submit_player_score('Hotma Simbolon',  'sumatera-utara',       'Sumatera Utara',       723400,  155);

-- Bali player
SELECT submit_player_score('Kadek Wijaya',    'bali',                 'Bali',                 489300,  112);

-- Sulawesi Selatan player
SELECT submit_player_score('Andi Mappanyompa','sulawesi-selatan',     'Sulawesi Selatan',     356900,   89);

-- DI Yogyakarta player
SELECT submit_player_score('Galih Prasetyo',  'di-yogyakarta',        'DI Yogyakarta',       1105000,  210);

-- Kalimantan Timur player
SELECT submit_player_score('Rizal Mahendra',  'kalimantan-timur',     'Kalimantan Timur',     198500,   54);

COMMIT;

-- =============================================================================
-- Verify: check the leaderboards
-- =============================================================================

-- Uncomment these to verify after seeding:
-- SELECT rank, name, province_name, score, max_combo FROM player_leaderboard;
-- SELECT province_name, total_score, player_count, top_score FROM province_leaderboard;

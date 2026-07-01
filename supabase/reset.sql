-- =============================================================================
-- PUKUL PRABOWO — Database Reset & Schema Setup
-- =============================================================================
-- This file is IDEMPOTENT. Safe to run multiple times.
-- It drops all project objects in schema `public` and recreates them.
-- WARNING: Running this WILL destroy all existing game data.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. DROP existing project objects (reverse dependency order)
-- ---------------------------------------------------------------------------

DROP VIEW  IF EXISTS province_leaderboard, player_leaderboard CASCADE;
DROP FUNCTION IF EXISTS submit_player_score CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;
DROP TABLE IF EXISTS score_events CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- ---------------------------------------------------------------------------
-- 2. TABLE: players
-- ---------------------------------------------------------------------------
-- Stores every unique player identified by (name_normalized, province_code).
-- Score only goes UP (enforced by submit_player_score function).
-- ---------------------------------------------------------------------------

CREATE TABLE players (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            text        NOT NULL,
    name_normalized text        NOT NULL,       -- LOWER(TRIM(name))
    province_code   text        NOT NULL,       -- slug, e.g. 'jawa-barat'
    province_name   text        NOT NULL,       -- display, e.g. 'Jawa Barat'
    score           bigint      NOT NULL DEFAULT 0,
    max_combo       integer     NOT NULL DEFAULT 0,
    last_submit_at  timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT score_non_negative    CHECK (score >= 0),
    CONSTRAINT max_combo_non_negative CHECK (max_combo >= 0),
    CONSTRAINT name_length           CHECK (char_length(name) BETWEEN 1 AND 30),

    -- A player name is unique within a province
    UNIQUE (name_normalized, province_code)
);

-- Indexes for leaderboard queries
CREATE INDEX idx_players_score         ON players (score DESC);
CREATE INDEX idx_players_province_code ON players (province_code);

COMMENT ON TABLE  players IS 'Registered players with their high scores';
COMMENT ON COLUMN players.name_normalized IS 'Lowercased, trimmed version of name for uniqueness checks';
COMMENT ON COLUMN players.province_code IS 'Slug derived from province name, e.g. jawa-barat';

-- ---------------------------------------------------------------------------
-- 3. TABLE: score_events
-- ---------------------------------------------------------------------------
-- Immutable audit log of every score submission.
-- ---------------------------------------------------------------------------

CREATE TABLE score_events (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       uuid        NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    score_before    bigint      NOT NULL,
    score_after     bigint      NOT NULL,
    delta           bigint      NOT NULL,
    client_score    bigint      NOT NULL,       -- raw score sent by client
    max_combo       integer     DEFAULT 0,
    ip_hash         text,                       -- SHA-256 of IP for anti-cheat
    user_agent_hash text,                       -- SHA-256 of User-Agent
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_score_events_player_id  ON score_events (player_id);
CREATE INDEX idx_score_events_created_at ON score_events (created_at DESC);

COMMENT ON TABLE score_events IS 'Immutable audit trail of all score submissions';

-- ---------------------------------------------------------------------------
-- 4. TABLE: donors
-- ---------------------------------------------------------------------------
-- People who donated / supported the project.
-- ---------------------------------------------------------------------------

CREATE TABLE donors (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text        NOT NULL,
    amount      integer     NOT NULL CHECK (amount > 0),  -- in IDR
    message     text,
    is_visible  boolean     NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE donors IS 'Donation records displayed on the support page';

-- ---------------------------------------------------------------------------
-- 5. FUNCTION: update_updated_at()
-- ---------------------------------------------------------------------------
-- Generic trigger function that stamps updated_at on every UPDATE.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. TRIGGER: auto-update updated_at on players
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 7. VIEW: player_leaderboard
-- ---------------------------------------------------------------------------
-- Public-facing leaderboard ranked by score (ties broken by earliest update).
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW player_leaderboard AS
SELECT
    id,
    name,
    province_code,
    province_name,
    score,
    max_combo,
    updated_at,
    ROW_NUMBER() OVER (ORDER BY score DESC, updated_at ASC) AS rank
FROM players
ORDER BY score DESC;

COMMENT ON VIEW player_leaderboard IS 'Ranked player leaderboard for display';

-- ---------------------------------------------------------------------------
-- 8. VIEW: province_leaderboard
-- ---------------------------------------------------------------------------
-- Aggregated scores per province.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW province_leaderboard AS
SELECT
    province_code,
    province_name,
    SUM(score)  AS total_score,
    COUNT(*)    AS player_count,
    MAX(score)  AS top_score
FROM players
GROUP BY province_code, province_name
ORDER BY total_score DESC;

COMMENT ON VIEW province_leaderboard IS 'Province-level aggregated leaderboard';

-- ---------------------------------------------------------------------------
-- 9. FUNCTION: submit_player_score
-- ---------------------------------------------------------------------------
-- Main RPC called by the game client to submit a score.
--
-- Logic:
--   1. Normalize the player name (lowercase + trim).
--   2. UPSERT into players — create if new, update if exists.
--   3. Score NEVER decreases (only update when p_score > existing).
--   4. max_combo updates if the new value is higher.
--   5. Insert an audit row into score_events.
--   6. Return { player_id, score, rank } as JSONB.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION submit_player_score(
    p_name          text,
    p_province_code text,
    p_province_name text,
    p_score         bigint,
    p_max_combo     integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER          -- runs with table-owner privileges (bypasses RLS)
AS $$
DECLARE
    v_name_normalized text;
    v_player_id       uuid;
    v_score_before    bigint;
    v_score_after     bigint;
    v_rank            bigint;
BEGIN
    -- 1. Normalize name
    v_name_normalized := LOWER(TRIM(p_name));

    -- Guard: empty name after normalization
    IF v_name_normalized = '' THEN
        RAISE EXCEPTION 'Player name cannot be empty';
    END IF;

    -- 2. Fetch existing player (if any) to capture score_before
    SELECT id, score
      INTO v_player_id, v_score_before
      FROM players
     WHERE name_normalized = v_name_normalized
       AND province_code   = p_province_code;

    IF v_player_id IS NULL THEN
        -- ---------------------------------------------------------------
        -- NEW PLAYER — insert
        -- ---------------------------------------------------------------
        v_score_before := 0;

        INSERT INTO players (name, name_normalized, province_code, province_name,
                             score, max_combo, last_submit_at)
        VALUES (TRIM(p_name), v_name_normalized, p_province_code, p_province_name,
                p_score, GREATEST(p_max_combo, 0), now())
        RETURNING id INTO v_player_id;

        v_score_after := p_score;
    ELSE
        -- ---------------------------------------------------------------
        -- EXISTING PLAYER — update only if score is higher
        -- ---------------------------------------------------------------
        v_score_after := GREATEST(v_score_before, p_score);

        UPDATE players
           SET score          = v_score_after,
               max_combo      = GREATEST(max_combo, p_max_combo),
               last_submit_at = now(),
               -- keep the display name from the latest submission
               name           = TRIM(p_name),
               province_name  = p_province_name
         WHERE id = v_player_id;
    END IF;

    -- 3. Audit log
    INSERT INTO score_events (player_id, score_before, score_after, delta,
                              client_score, max_combo)
    VALUES (v_player_id, v_score_before, v_score_after,
            v_score_after - v_score_before, p_score,
            GREATEST(p_max_combo, 0));

    -- 4. Calculate current rank
    SELECT COUNT(*) + 1
      INTO v_rank
      FROM players
     WHERE score > v_score_after;

    -- 5. Return result
    RETURN jsonb_build_object(
        'player_id', v_player_id,
        'score',     v_score_after,
        'rank',      v_rank
    );
END;
$$;

COMMENT ON FUNCTION submit_player_score IS 'Main RPC: upserts player score (never decreases) and returns rank';

-- ---------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------
-- Enable RLS on all tables. Service role bypasses RLS automatically.
-- ---------------------------------------------------------------------------

-- Players -------------------------------------------------------------------
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "players_select_anon"
    ON players FOR SELECT
    TO anon
    USING (true);

-- No INSERT / UPDATE / DELETE for anon (only service_role can write)

-- Score Events --------------------------------------------------------------
ALTER TABLE score_events ENABLE ROW LEVEL SECURITY;

-- No access at all for anon (only service_role via submit_player_score)

-- Donors --------------------------------------------------------------------
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donors_select_visible_anon"
    ON donors FOR SELECT
    TO anon
    USING (is_visible = true);

-- No INSERT / UPDATE / DELETE for anon

COMMIT;

-- =============================================================================
-- Done! Schema is ready. Run seed.sql next to populate initial data.
-- =============================================================================

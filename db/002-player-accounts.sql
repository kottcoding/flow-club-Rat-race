-- Additive migration. Existing rooms and Guest seats are preserved.
CREATE TABLE IF NOT EXISTS player_profiles (
 account_key TEXT PRIMARY KEY,
 display_name TEXT NOT NULL,
 photo_url TEXT,
 avatar_id INTEGER NOT NULL DEFAULT 0,
 avatar_mode TEXT NOT NULL DEFAULT 'avatar',
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS guest_claims (
 guest_key TEXT PRIMARY KEY,
 account_key TEXT NOT NULL REFERENCES player_profiles(account_key),
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS guest_claims_account ON guest_claims(account_key);
CREATE TABLE IF NOT EXISTS game_results (
 room_id TEXT NOT NULL,
 player_id TEXT NOT NULL,
 owner_key TEXT NOT NULL,
 player_name TEXT NOT NULL,
 won INTEGER NOT NULL,
 fast_track INTEGER NOT NULL,
 rounds INTEGER NOT NULL,
 final_cash REAL NOT NULL,
 finished_at INTEGER NOT NULL,
 PRIMARY KEY(room_id,player_id)
);
CREATE INDEX IF NOT EXISTS game_results_owner ON game_results(owner_key);

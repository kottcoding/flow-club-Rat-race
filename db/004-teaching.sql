-- Ephemeral teaching presence and screen state, separate from game revisions.
CREATE TABLE IF NOT EXISTS teaching_watches (
 room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
 viewer_id TEXT NOT NULL,
 target_id TEXT NOT NULL,
 epoch TEXT NOT NULL,
 updated INTEGER NOT NULL,
 PRIMARY KEY(room_id,viewer_id)
);
CREATE TABLE IF NOT EXISTS teaching_screens (
 room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
 player_id TEXT NOT NULL,
 epoch TEXT NOT NULL,
 screen TEXT NOT NULL,
 updated INTEGER NOT NULL,
 PRIMARY KEY(room_id,player_id)
);

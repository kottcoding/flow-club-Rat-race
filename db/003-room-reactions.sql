-- One recent reaction per player. No changes to game state or existing records.
CREATE TABLE IF NOT EXISTS room_reactions (
 room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
 player_id TEXT NOT NULL,
 event_id TEXT NOT NULL,
 emoji TEXT NOT NULL,
 player_name TEXT NOT NULL,
 sent_at INTEGER NOT NULL,
 PRIMARY KEY (room_id, player_id)
);

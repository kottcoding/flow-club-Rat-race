export const ROOM_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// Old versions stored only last activity. Freeze that fallback on the next write.
export function roomCreatedAt(g, updated) { return Number.isFinite(g.createdAt) ? g.createdAt : updated; }
export function roomExpired(g, updated, now = Date.now()) { return roomCreatedAt(g, updated) <= now - ROOM_TTL_MS; }
export const ROOM_CREATED_SQL = "COALESCE(json_extract(state, '$.createdAt'), updated)";
export async function cleanupExpiredRooms(db, now = Date.now()) {
  return db.prepare(`DELETE FROM rooms WHERE ${ROOM_CREATED_SQL} <= ?`).bind(now - ROOM_TTL_MS).run();
}

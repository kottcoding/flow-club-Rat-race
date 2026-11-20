import {ROOM_TTL_MS,ROOM_CREATED_SQL} from './room-retention.mjs';
export const cleanName=(value,max)=>typeof value==='string'?value.normalize('NFKC').replace(/\s+/gu,' ').trim().slice(0,max):'';
export const nameKey=value=>cleanName(value,Infinity).toLowerCase();
export const playerNameTaken=(players,name,exceptId)=>players.some(p=>p.id!==exceptId&&nameKey(p.name)===nameKey(name));
// Optimistic insertion: all still-live room titles must match the checked snapshot.
// This single SQLite write serializes concurrent creators, including legacy rooms.
export const INSERT_NAMED_ROOM_SQL=`INSERT INTO rooms (id,state,revision,updated)
 SELECT ?,?,0,? WHERE NOT EXISTS (
 SELECT 1 FROM rooms r WHERE COALESCE(json_extract(r.state,'$.createdAt'),r.updated)>?
 AND NOT EXISTS (SELECT 1 FROM json_each(?) s
 WHERE json_extract(s.value,'$.id')=r.id
 AND json_extract(s.value,'$.title') IS json_extract(r.state,'$.title')))`;
export async function createNamedRoom(db,g,ownerKeys,now=Date.now()){
 const cutoff=now-ROOM_TTL_MS;
 for(let attempt=0;attempt<6;attempt++){
  const rows=await db.prepare(`SELECT id,state FROM rooms WHERE ${ROOM_CREATED_SQL}>?`).bind(cutoff).all();
  const rooms=rows.results.map(r=>({id:r.id,...JSON.parse(r.state)}));
  if(rooms.some(r=>nameKey(r.title)===nameKey(g.title)))throw Error('ROOM_NAME_TAKEN');
  if(rooms.filter(r=>r.players.some(p=>ownerKeys.includes(p.key))).length>=8)throw Error('ROOM_LIMIT');
  const snapshot=JSON.stringify(rooms.map(r=>({id:r.id,title:r.title})));
  const result=await db.prepare(INSERT_NAMED_ROOM_SQL).bind(g.id,JSON.stringify(g),now,cutoff,snapshot).run();
  if(result.meta.changes)return;
 }
 throw Error('STATE_CHANGED');
}

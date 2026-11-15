import {env} from 'cloudflare:workers';
import {identity} from '../../../lib/identity.mjs';
import {roomExpired} from '../../../lib/room-retention.mjs';
import {validEmoji} from '../../../lib/emojis.mjs';
export const dynamic='force-dynamic';
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
async function getRoom(id){const row=await env.DB.prepare('SELECT * FROM rooms WHERE id=?').bind(id).first();if(!row)throw Error('ROOM_NOT_FOUND');const g=JSON.parse(row.state);if(roomExpired(g,row.updated))throw Error('ROOM_NOT_FOUND');return g;}
const fail=e=>json({error:String(e.message).includes('no such table: room_reactions')?'REACTIONS_SETUP_REQUIRED':e.message},400);
export async function GET(req){try{
 const id=new URL(req.url).searchParams.get('room'),g=await getRoom(id);const now=Date.now();
 if(!['playing','finished'].includes(g.status))return json({error:'SPECTATOR_UNAVAILABLE'},403);
 const rows=await env.DB.prepare('SELECT event_id AS id,emoji,player_name AS name,sent_at AS sentAt FROM room_reactions WHERE room_id=? AND sent_at>=? ORDER BY sent_at').bind(id,now-10000).all();
 return json({events:g.status==='playing'?rows.results:[],serverNow:now});
 }catch(e){return fail(e);}}
export async function POST(req){try{
 if(req.headers.get('Origin')&&new URL(req.headers.get('Origin')).origin!==new URL(req.url).origin)return json({error:'BAD_ORIGIN'},403);
 const raw=await req.text();if(raw.length>1024)return json({error:'TOO_LARGE'},413);const b=JSON.parse(raw);
 if(!validEmoji(b.emoji))return json({error:'INVALID_EMOJI'},400);
 const who=await identity(req,env),g=await getRoom(b.room),p=g.players.find(p=>who.keys.includes(p.key));
 if(!p)return json({error:'NOT_MEMBER'},403);if(g.status!=='playing')return json({error:'GAME_NOT_PLAYING'},403);
 const now=Date.now(),id=crypto.randomUUID();
 // Recheck membership/status atomically, and enforce the cooldown on the server.
 const result=await env.DB.prepare(`INSERT INTO room_reactions(room_id,player_id,event_id,emoji,player_name,sent_at)
 SELECT r.id,?, ?, ?, ?, ? FROM rooms r WHERE r.id=? AND json_extract(r.state,'$.status')='playing'
 AND EXISTS(SELECT 1 FROM json_each(r.state,'$.players') p WHERE json_extract(p.value,'$.id')=?)
 ON CONFLICT(room_id,player_id) DO UPDATE SET event_id=excluded.event_id,emoji=excluded.emoji,player_name=excluded.player_name,sent_at=excluded.sent_at
 WHERE room_reactions.sent_at<=excluded.sent_at-3000`).bind(p.id,id,b.emoji,p.name,now,g.id,p.id).run();
 if(!result.meta.changes)return json({error:'EMOJI_COOLDOWN'},429);
 return json({event:{id,emoji:b.emoji,name:p.name,sentAt:now},serverNow:now});
 }catch(e){return fail(e);}}

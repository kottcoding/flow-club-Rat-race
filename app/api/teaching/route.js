import {env} from 'cloudflare:workers';
import {identity,adoptRoom} from '../../../lib/identity.mjs';
import {roomExpired} from '../../../lib/room-retention.mjs';
import {publicRoom,normalizeRoom} from '../../../lib/game.mjs';
import {canTeach,teacherIds,sanitizeScreen,WATCH_TTL,SCREEN_TTL} from '../../../lib/teaching.mjs';
export const dynamic='force-dynamic';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'Cache-Control':'no-store'}});
async function context(req,id){const who=await identity(req,env),row=await env.DB.prepare('SELECT * FROM rooms WHERE id=?').bind(id).first();if(!row)throw Error('ROOM_NOT_FOUND');const g=adoptRoom(normalizeRoom(JSON.parse(row.state)),who);if(roomExpired(g,row.updated))throw Error('ROOM_NOT_FOUND');const p=g.players.find(x=>x.key===who.key);if(!p)throw Error('NOT_MEMBER');return {g,p};}
const failure=e=>json({error:String(e.message).includes('no such table: teaching_')?'TEACHING_SETUP_REQUIRED':e.message},403);
export async function GET(req){try{
 const q=new URL(req.url).searchParams,{g,p}=await context(req,q.get('room')),now=Date.now();
 if(!g.teaching?.enabled||g.status==='lobby')return json({enabled:false,watchers:[]});
 const watchers=await env.DB.prepare('SELECT viewer_id FROM teaching_watches WHERE room_id=? AND target_id=? AND epoch=? AND updated>?').bind(g.id,p.id,g.teaching.epoch,now-WATCH_TTL).all();
 const names=watchers.results.filter(w=>teacherIds(g).includes(w.viewer_id)).map(w=>g.players.find(x=>x.id===w.viewer_id)?.name).filter(Boolean);
 const target=q.get('target');if(!target)return json({enabled:true,watchers:names});
 if(!canTeach(g,p))throw Error('MASTER_REQUIRED');
 if(!g.players.some(x=>x.id===target))throw Error('PLAYER_NOT_FOUND');
 const lease=await env.DB.prepare('SELECT * FROM teaching_watches WHERE room_id=? AND viewer_id=? AND target_id=? AND epoch=? AND updated>?').bind(g.id,p.id,target,g.teaching.epoch,now-WATCH_TTL).first();if(!lease)throw Error('WATCH_EXPIRED');
 const row=await env.DB.prepare('SELECT screen,updated FROM teaching_screens WHERE room_id=? AND player_id=? AND epoch=?').bind(g.id,target,g.teaching.epoch).first();
 return json({room:publicRoom(g),screen:row&&row.updated>now-SCREEN_TTL?sanitizeScreen(JSON.parse(row.screen)):null,updated:row?.updated||null,serverNow:now});
 }catch(e){return failure(e);}}
export async function POST(req){try{
 if(req.headers.get('Origin')&&new URL(req.headers.get('Origin')).origin!==new URL(req.url).origin)throw Error('BAD_ORIGIN');
 const raw=await req.text();if(raw.length>100000)return json({error:'TOO_LARGE'},413);
 const b=JSON.parse(raw),{g,p}=await context(req,b.room),now=Date.now();
 if(b.type==='stop'){await env.DB.batch([env.DB.prepare('DELETE FROM teaching_watches WHERE room_id=? AND viewer_id=?').bind(g.id,p.id),env.DB.prepare('DELETE FROM teaching_screens WHERE room_id=? AND player_id=?').bind(g.id,p.id)]);return json({ok:true});}
 if(!g.teaching?.enabled||g.status==='lobby')throw Error('TEACHING_OFF');
 if(b.epoch!==g.teaching.epoch)throw Error('TEACHING_CHANGED');
 if(b.type==='watch'){
  if(!canTeach(g,p))throw Error('MASTER_REQUIRED');if(b.target===p.id||!g.players.some(x=>x.id===b.target))throw Error('PLAYER_NOT_FOUND');
  await env.DB.prepare(`INSERT INTO teaching_watches VALUES(?,?,?,?,?) ON CONFLICT(room_id,viewer_id) DO UPDATE SET target_id=excluded.target_id,epoch=excluded.epoch,updated=excluded.updated`).bind(g.id,p.id,b.target,g.teaching.epoch,now).run();return json({ok:true});
 }
 if(b.type!=='screen')throw Error('INVALID_ACTION');
 const rows=await env.DB.prepare('SELECT viewer_id FROM teaching_watches WHERE room_id=? AND target_id=? AND epoch=? AND updated>?').bind(g.id,p.id,g.teaching.epoch,now-WATCH_TTL).all();
 if(!rows.results.some(w=>teacherIds(g).includes(w.viewer_id)))return json({ok:true,idle:true});
 const screen=sanitizeScreen(b.screen);
 await env.DB.prepare(`INSERT INTO teaching_screens VALUES(?,?,?,?,?) ON CONFLICT(room_id,player_id) DO UPDATE SET epoch=excluded.epoch,screen=excluded.screen,updated=excluded.updated WHERE teaching_screens.updated<=excluded.updated-350`).bind(g.id,p.id,g.teaching.epoch,JSON.stringify(screen),now).run();return json({ok:true});
 }catch(e){return failure(e);}}

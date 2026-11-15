import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {hashGuest} from '../lib/identity.mjs';
import {EMOJIS,createReactionTracker,validEmoji} from '../lib/emojis.mjs';
test('12 fixed emojis and no replay on initial load, repeated polls or return to a tab',()=>{
 assert.equal(EMOJIS.length,12);assert.equal(new Set(EMOJIS.map(e=>e[0])).size,12);assert.equal(validEmoji('../../x'),false);
 const t=createReactionTracker(),e={id:'a',emoji:'heart',sentAt:1001};
 assert.deepEqual(t.receive([e],1001),[]);assert.deepEqual(t.receive([e],1002),[]);assert.deepEqual(t.receive([{...e,id:'b',sentAt:1002}],1002).map(e=>e.id),['b']);
 assert.deepEqual(t.receive([{...e,id:'b',sentAt:1002}],1003),[]);
 t.reset();assert.deepEqual(t.receive([e],1004),[]);
 assert.deepEqual(t.receive([{...e,id:'old',sentAt:1000}],1005),[]);
});
test('reactions API: membership, status, cooldown, simultaneous senders and no game-state writes',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(await readFile(new URL('../drizzle/0000_aspiring_dragon_man.sql',import.meta.url),'utf8'));
 db.exec(await readFile(new URL('../db/003-room-reactions.sql',import.meta.url),'utf8'));
 function prepared(sql,args=[]){return {bind(...v){return prepared(sql,v);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}};}
 globalThis.__emojiEnv={DB:{prepare:prepared,async batch(qs){const out=[];for(const q of qs)out.push(await q.run());return out;}}};
 let source=await readFile(new URL('../app/api/reactions/route.js',import.meta.url),'utf8');source=source.replace("import {env} from 'cloudflare:workers';","const env=globalThis.__emojiEnv;").replace(/from '(\.\.\/[^']+)'/g,(_,rel)=>"from '"+new URL(rel,new URL('../app/api/reactions/route.js',import.meta.url)).href+"'");const api=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const key=crypto.randomUUID()+crypto.randomUUID(),other=crypto.randomUUID()+crypto.randomUUID();
 async function req(query='',body,auth){const r=await api[body?'POST':'GET'](new Request('https://flow.test/api/game'+query,{method:body?'POST':'GET',headers:{Origin:'https://flow.test',...(auth?{Authorization:'Bearer '+auth}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify({...body,clientVersion:3})}:{})}));return {code:r.status,...await r.json()};}

 try{
  const owner=await hashGuest(key),guest=await hashGuest(other),now=Date.now();
  const g={id:'EMOJI',title:'QA',createdAt:now,status:'playing',players:[{id:'p1',key:owner,name:'Owner'},{id:'p2',key:guest,name:'Guest'}]};
  db.prepare('INSERT INTO rooms(id,state,revision,updated) VALUES(?,?,?,?)').run(g.id,JSON.stringify(g),7,now);
  let d=await req('',{room:g.id,emoji:'heart'},key);assert.equal(d.code,200);assert.equal(d.event.name,'Owner');
  assert.equal((await req('',{room:g.id,emoji:'rocket'},key)).code,429);
  assert.equal((await req('',{room:g.id,emoji:'rocket'},other)).code,200);
  d=await req('?room='+g.id);assert.equal(d.events.length,2);assert.doesNotMatch(JSON.stringify(d),/player_id|owner_key|guest_key/);
  const saved=db.prepare('SELECT * FROM rooms WHERE id=?').get(g.id);assert.equal(saved.revision,7);assert.equal(saved.state,JSON.stringify(g));
  assert.equal((await req('',{room:g.id,emoji:'not-valid'},key)).code,400);
  assert.equal((await req('',{room:g.id,emoji:'heart'},crypto.randomUUID()+crypto.randomUUID())).code,403);
  db.prepare('UPDATE room_reactions SET sent_at=? WHERE room_id=?').run(now-4000,g.id);
  assert.equal((await req('',{room:g.id,emoji:'rich'},key)).code,200);
  g.status='finished';db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(g),g.id);
  assert.equal((await req('',{room:g.id,emoji:'heart'},key)).code,403);assert.deepEqual((await req('?room='+g.id)).events,[]);
  g.status='lobby';db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(g),g.id);assert.equal((await req('?room='+g.id)).code,403);
 }finally{delete globalThis.__emojiEnv;db.close();}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {setRoomLock,checkRoomPin} from '../lib/room-access.mjs';
import {publicRoom} from '../lib/game.mjs';
test('PIN validates four digits, supports leading zero, hides secrets and throttles guesses',async()=>{
 const g={creatorKey:'owner',status:'lobby',players:[]};
 await assert.rejects(setRoomLock(g,'other',true,'0123'),/CREATOR_ONLY/);
 for(const pin of ['123','12345','abcd',1234])await assert.rejects(setRoomLock(g,'owner',true,pin),/INVALID_PIN/);
 await setRoomLock(g,'owner',true,'0123');assert.equal(await checkRoomPin(g,'guest','0123'),null);
 assert.equal(await checkRoomPin(g,'guest',''),'PIN_REQUIRED');
 const view=publicRoom(g);assert.equal(view.locked,true);assert.equal(view.roomLock,undefined);assert.doesNotMatch(JSON.stringify(view),/0123|hash|salt/);
 for(let i=0;i<4;i++)assert.equal(await checkRoomPin(g,'guest','9999',1000),'PIN_INCORRECT');
 assert.equal(await checkRoomPin(g,'guest','9999',1000),'PIN_RATE_LIMIT');assert.equal(await checkRoomPin(g,'guest','0123',1001),'PIN_RATE_LIMIT');assert.equal(await checkRoomPin(g,'guest','0123',61001),null);
 await setRoomLock(g,'owner',false);assert.equal(await checkRoomPin(g,'guest',''),null);
});
test('API locks every join path, keeps existing seats, enforces creator and full/started rules',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(await readFile(new URL('../drizzle/0000_aspiring_dragon_man.sql',import.meta.url),'utf8'));
 function prepared(sql,args=[]){return {bind(...v){return prepared(sql,v);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}};}
 globalThis.__accessTestEnv={DB:{prepare:prepared,async batch(qs){const out=[];for(const q of qs)out.push(await q.run());return out;}}};
 let source=await readFile(new URL('../app/api/game/route.js',import.meta.url),'utf8');source=source.replace("import {env} from 'cloudflare:workers';","const env=globalThis.__accessTestEnv;").replace(/from '(\.\.\/[^']+)'/g,(_,rel)=>"from '"+new URL(rel,new URL('../app/api/game/route.js',import.meta.url)).href+"'");const api=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const key=crypto.randomUUID()+crypto.randomUUID(),other=crypto.randomUUID()+crypto.randomUUID();
 async function req(query='',body,auth){const r=await api[body?'POST':'GET'](new Request('https://flow.test/api/game'+query,{method:body?'POST':'GET',headers:{Origin:'https://flow.test',...(auth?{Authorization:'Bearer '+auth}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify({...body,clientVersion:4})}:{})}));return {code:r.status,...await r.json()};}

 try{
  const created=await req('',{type:'create',name:'Owner',title:'PIN test'},key),id=created.room.id;
  assert.equal(created.room.locked,false);
  assert.equal((await req('',{type:'create',name:'Other',title:'  PIN   TEST  '},other)).error,'ROOM_NAME_TAKEN');
  let d=await req('',{type:'action',room:id,revision:0,action:{type:'roomLock',locked:true,pin:'0123'}},key);assert.equal(d.code,200);assert.equal(d.room.locked,true);assert.equal(d.room.roomLock,undefined);
  const list=await req('',undefined,other);assert.equal(list.rooms.find(r=>r.id===id).locked,true);assert.doesNotMatch(JSON.stringify(list),/0123|hash|salt/);
  assert.equal((await req('',{type:'join',room:id,name:'Guest'},other)).error,'PIN_REQUIRED');
  assert.equal((await req('',{type:'join',room:id,name:'Guest',pin:'9999'},other)).error,'PIN_INCORRECT');
  assert.equal((await req('',{type:'join',room:id,name:'',pin:'0123'},other)).error,'NAME_REQUIRED');
  assert.equal((await req('',{type:'join',room:id,name:'  OWNER  ',pin:'0123'},other)).error,'NAME_TAKEN');
  d=await req('',{type:'join',room:id,name:'Guest',pin:'0123'},other);assert.equal(d.code,200);assert.equal(d.room.players.length,2);
  const again=await req('',{type:'join',room:id},other);assert.equal(again.code,200);assert.equal(again.room.players.length,2);
  assert.equal((await req('',{type:'action',room:id,revision:again.revision,action:{type:'appearance',name:' OWNER ',avatarId:0}},other)).error,'NAME_TAKEN');
  assert.equal((await req('',{type:'action',room:id,revision:again.revision,action:{type:'roomLock',locked:false}},other)).error,'CREATOR_ONLY');
  d=await req('',{type:'action',room:id,revision:again.revision,action:{type:'roomLock',locked:false}},key);assert.equal(d.room.locked,false);
  let g=JSON.parse(db.prepare('SELECT state FROM rooms WHERE id=?').get(id).state);g.status='playing';db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(g),id);
  const third=crypto.randomUUID()+crypto.randomUUID();assert.equal((await req('',{type:'join',room:id,name:'Late'},third)).error,'ALREADY_STARTED');
  g.status='lobby';while(g.players.length<6)g.players.push({...g.players[1],id:crypto.randomUUID(),key:crypto.randomUUID()});db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(g),id);
  assert.equal((await req('',{type:'join',room:id,name:'Late'},third)).error,'ROOM_FULL');
 }finally{delete globalThis.__accessTestEnv;db.close();}
});

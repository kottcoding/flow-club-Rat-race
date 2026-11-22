import '../scripts/test-api-memory.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {apply} from '../lib/game.mjs';
import {BOARD_VERSION} from '../lib/board-20261122.mjs';
test('new board and pending IPO survive API reload; duplicate completion cannot pay twice',async()=>{
 const keys=[crypto.randomUUID()+crypto.randomUUID(),crypto.randomUUID()+crypto.randomUUID()];
 async function req(i,body,id){const r=await fetch('http://localhost:8787/api/game'+(id?'?room='+id:''),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+keys[i],'Content-Type':'application/json'},...(body?{body:JSON.stringify({clientVersion:4,...body})}:{})});return {code:r.status,...await r.json()};}
 let d=await req(0,{type:'create',name:'IPO owner',title:'IPO API test'});const id=d.room.id;
 assert.equal(d.room.boardVersion,BOARD_VERSION);d=await req(1,{type:'join',room:id,name:'Other'});
 const db=globalThis.__boardTestEnv.DB,row=await db.prepare('SELECT * FROM rooms WHERE id=?').bind(id).first(),g=JSON.parse(row.state),p=g.players[0];
 g.status='playing';g.phase='roll';p.track='fast';p.position=28;p.cash=8000000;p.fastIncome=100000;p.fastGoal=10000000;
 apply(g,p.id,{type:'roll'},()=>0);await db.prepare('UPDATE rooms SET state=? WHERE id=?').bind(JSON.stringify(g),id).run();
 d=await req(0,null,id);d=await req(0,{type:'action',room:id,revision:d.revision,action:{type:'buy'}});
 assert.equal(d.room.phase,'businessRoll');assert.equal(d.room.players[0].cash,7750000);
 const reloaded=await req(0,null,id);assert.equal(reloaded.room.event.paid,true);assert.equal(reloaded.room.phase,'businessRoll');
 const denied=await req(1,{type:'action',room:id,revision:d.revision,action:{type:'businessRoll'}});assert.equal(denied.error,'NOT_YOUR_TURN');
 const results=await Promise.all([0,1].map(()=>req(0,{type:'action',room:id,revision:d.revision,action:{type:'businessRoll'}})));
 assert.equal(results.filter(x=>x.code===200).length,1);assert.equal(results.filter(x=>x.code===409).length,1);
 const after=await req(0,null,id),result=after.room.event.result;
 assert.equal(after.room.players[0].cash,7750000+result.payout);assert.equal(after.room.players[0].fastIncome,100000);assert.equal(after.room.players[0].fastAssets.length,1);
 const watch=await (await fetch('http://localhost:8787/api/game?spectate='+id)).json();assert.equal(watch.room.boardVersion,BOARD_VERSION);
 assert.equal(watch.room.players[0].fastAssets,undefined);
});

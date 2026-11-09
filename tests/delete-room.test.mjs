import assert from 'node:assert/strict';
import test from 'node:test';
import {room,player,apply,publicRoom,normalizeRoom} from '../lib/game.mjs';

test('creator ownership survives host transfer and is never returned publicly',()=>{
 const a=player('A','owner-secret'),b=player('B','guest-secret');
 const g=room('OWN','Owner',a);g.players.push(b);
 apply(g,a.id,{type:'leave'});
 assert.equal(g.host,b.id);assert.equal(g.creatorKey,a.key);
 assert.equal(publicRoom(g).creatorKey,undefined);
 assert.equal(publicRoom(g).players[0].key,undefined);
});
test('legacy rooms are not assigned to a possibly transferred host',()=>{
 const g=room('OLD','Old',player('A','secret'));delete g.creatorKey;
 normalizeRoom(g);assert.equal(g.creatorKey,undefined);
});

test('API deletion authorizes immutable creator, removes rooms, and blocks stale writes',async()=>{
 const base=process.env.TEST_URL||'http://127.0.0.1:8788';
 const tokens=Array.from({length:3},()=>crypto.randomUUID()+crypto.randomUUID());
 async function req(i,body,id){const res=await fetch(base+'/api/game'+(id?'?room='+id:''),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+tokens[i],...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify({...body,clientVersion:3})}:{})});return {status:res.status,...await res.json()};}
 let d=await req(0,{type:'create',name:'Owner',title:'Deletion test'});const id=d.room.id;
 assert.equal(d.canDelete,true);assert.equal(d.room.creatorKey,undefined);
 d=await req(1,{type:'join',room:id,name:'Guest'});assert.equal(d.canDelete,false);
 for(const i of [1,2])assert.equal((await req(i,{type:'deleteRoom',room:id})).status,403);
 let list=await req(0);assert.equal(list.rooms.find(r=>r.id===id).canDelete,true);
 assert.equal((await req(1)).rooms.find(r=>r.id===id).canDelete,false);
 d=await req(0,null,id);d=await req(0,{type:'action',room:id,revision:d.revision,action:{type:'leave'}});
 assert.equal(d.room.host,d.room.players[0].id);
 assert.equal((await req(1,{type:'deleteRoom',room:id})).status,403);
 assert.equal((await req(0,{type:'deleteRoom',room:id})).deleted,id);
 assert.equal((await req(1,null,id)).status,404);
 assert.equal((await req(1,{type:'action',room:id,revision:d.revision,action:{type:'ready'}})).status,404);
 assert.equal((await req(0,{type:'deleteRoom',room:id})).status,404);
 assert.ok(!(await req(0)).rooms.some(r=>r.id===id));
 // Even a creator who left an empty lobby retains access to its delete control.
 d=await req(0,{type:'create',name:'Owner',title:'Empty deletion test'});const empty=d.room.id;
 await req(0,{type:'action',room:empty,revision:d.revision,action:{type:'leave'}});
 assert.equal((await req(0)).rooms.find(r=>r.id===empty).canDelete,true);
 assert.ok(!(await req(1)).rooms.some(r=>r.id===empty));
 assert.equal((await req(0,{type:'deleteRoom',room:empty})).status,200);
 // Playing room: stale actions racing deletion cannot recreate a deleted row.
 d=await req(0,{type:'create',name:'Owner',title:'Playing deletion test'});const playing=d.room.id;
 d=await req(1,{type:'join',room:playing,name:'Guest'});
 for(const i of [0,1])d=await req(i,{type:'action',room:playing,revision:d.revision,action:{type:'ready'}});
 d=await req(0,{type:'action',room:playing,revision:d.revision,action:{type:'start'}});
 assert.equal(d.room.status,'playing');
 const turn=d.room.turn;
 const results=await Promise.all([req(0,{type:'deleteRoom',room:playing}),req(turn,{type:'action',room:playing,revision:d.revision,action:{type:'roll'}})]);
 assert.equal(results[0].status,200);assert.equal((await req(0,null,playing)).status,404);
});

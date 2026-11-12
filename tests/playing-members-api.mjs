import assert from 'node:assert/strict';
const base='http://127.0.0.1:8788',keys=Array.from({length:4},()=>crypto.randomUUID()+crypto.randomUUID());
async function call(i,body,id){const r=await fetch(base+'/api/game'+(id?'?room='+id:''),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+keys[i],...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify({...body,clientVersion:3})}:{})});return {status:r.status,...await r.json()};}
let d=await call(0,{type:'create',name:'Host QA',title:'Playing removal API QA'});const id=d.room.id;
try{
 for(let i=1;i<4;i++)d=await call(i,{type:'join',name:'Guest '+i,room:id});
 for(let i=0;i<4;i++)d=await call(i,{type:'action',room:id,revision:d.revision,action:{type:'ready'}});
 d=await call(0,{type:'action',room:id,revision:d.revision,action:{type:'start'}});assert.equal(d.room.status,'playing');
 const target=d.room.players[2].id;
 const denied=await call(1,{type:'action',room:id,revision:d.revision,action:{type:'kick',playerId:target}});assert.equal(denied.error,'CREATOR_ONLY');
 d=await call(0,{type:'action',room:id,revision:d.revision,action:{type:'kick',playerId:target}});assert.equal(d.room.players.length,3);
 assert.equal((await call(2,null,id)).error,'NOT_MEMBER');assert.equal((await call(2,{type:'join',room:id,name:'Guest 2'})).error,'ALREADY_STARTED');
 const left=await call(3,{type:'action',room:id,revision:d.revision,action:{type:'leave'}});assert.equal(left.left,true);
 d=await call(0,null,id);assert.equal(d.room.players.length,2);
 const ownerLeft=await call(0,{type:'action',room:id,revision:d.revision,action:{type:'leave'}});assert.equal(ownerLeft.left,true);
 d=await call(1,null,id);assert.equal(d.room.status,'finished');assert.equal(d.room.winner,null);assert.equal(d.room.endReason,'insufficientPlayers');
 console.log('PASS: API creator authorization, kick, revoked access, blocked rejoin, self-leave, no-winner termination');
}finally{await call(0,{type:'deleteRoom',room:id});}

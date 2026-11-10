import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:8788';const tokens=Array.from({length:4},()=>crypto.randomUUID()+crypto.randomUUID());
async function req(i,body,id){const r=await fetch(base+'/api/game'+(id?'?room='+id:''),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+tokens[i],...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify({...body,clientVersion:3})}:{})});return {status:r.status,...await r.json()};}
let d=await req(0,{type:'create',name:'Owner QA',title:'Lobby membership QA'});assert.equal(d.status,200);const id=d.room.id,owner=d.me;
try{
 d=await req(1,{type:'join',name:'Guest QA',room:id});const guest=d.me;d=await req(2,{type:'join',name:'Third QA',room:id});const third=d.me;
 const act=(i,action,revision=d.revision)=>req(i,{type:'action',room:id,revision,action});
 assert.equal((await act(1,{type:'kick',playerId:third})).error,'CREATOR_ONLY');
 const stale=d.revision;d=await act(0,{type:'kick',playerId:guest});assert.equal(d.status,200);assert.equal(d.room.players.length,2);assert.equal((await req(1,null,id)).error,'NOT_MEMBER');
 assert.equal((await act(2,{type:'ready'},stale)).error,'STATE_CHANGED');
 let listing=await req(1);assert.equal(listing.rooms.find(x=>x.id===id).mine,false);assert.equal(listing.rooms.find(x=>x.id===id).count,2);
 // Removed players may choose to join again; kicking does not create a ban.
 d=await req(1,{type:'join',name:'Guest QA',room:id});assert.equal(d.room.players.length,3);
 let left=await act(0,{type:'leave'});assert.equal(left.left,true);assert.equal(left.room,undefined);assert.equal((await req(0,null,id)).status,403);
 d=await req(2,null,id);assert.equal(d.room.host,third);assert.equal((await act(2,{type:'kick',playerId:d.room.players.find(p=>p.name==='Guest QA').id})).error,'CREATOR_ONLY');
 left=await act(2,{type:'leave'});assert.equal(left.left,true);d=await req(1,null,id);left=await act(1,{type:'leave'});assert.equal(left.left,true);
 d=await req(0,{type:'join',name:'Owner QA',room:id});assert.equal(d.room.host,d.me);assert.equal(d.canDelete,true);assert.equal(d.room.players.length,1);
 d=await req(3,{type:'join',name:'Fourth QA',room:id});d=await act(3,{type:'ready'});d=await act(0,{type:'ready'});d=await act(0,{type:'start'});
 assert.equal((await act(0,{type:'kick',playerId:d.room.players[1].id})).error,'LOBBY_ONLY');assert.equal((await act(3,{type:'leave'})).error,'LOBBY_ONLY');
 console.log('PASS: kick permission, removal, roster counts, stale revision, safe leave response, host transfer, empty-room recovery, rejoin and started-room restrictions');
}finally{await req(0,{type:'deleteRoom',room:id});}

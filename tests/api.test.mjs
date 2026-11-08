import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:8787';
const tokens=Array.from({length:7},()=>crypto.randomUUID()+crypto.randomUUID());
async function call(i,body,id){const r=await fetch(base+'/api/game'+(id?'?room='+id:''),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+tokens[i],...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify({...body,clientVersion:2})}:{})});return {status:r.status,...await r.json()};}
let d=await call(0,{type:'create',name:'Player 1',title:'API integration test'});assert.equal(d.status,200);const id=d.room.id;
assert.equal(d.room.currency,'THB');
assert.equal(d.room.schemaVersion,2);
const obsolete=await fetch(base+'/api/game',{method:'POST',headers:{Authorization:'Bearer '+tokens[0],'Content-Type':'application/json'},body:JSON.stringify({type:'action',room:id,revision:d.revision,action:{type:'ready'}})});
assert.equal(obsolete.status,409);assert.equal((await obsolete.json()).error,'CLIENT_UPDATE_REQUIRED');
d=await call(0,{type:'action',room:id,revision:d.revision,action:{type:'dream',value:'medical-research'}});
assert.equal(d.room.players[0].dream,'medical-research');

for(let i=1;i<6;i++){d=await call(i,{type:'join',room:id,name:'Player '+(i+1)});assert.equal(d.status,200);}
assert.equal((await call(6,{type:'join',room:id,name:'Seventh'})).error,'ROOM_FULL');
assert.equal((await call(6,null,id)).status,403);
assert.equal(d.room.players.length,6);assert.ok(d.room.players.every(p=>!('key' in p)));
for(let i=0;i<6;i++){d=await call(i,null,id);d=await call(i,{type:'action',room:id,revision:d.revision,action:{type:'ready'}});assert.equal(d.status,200);}
d=await call(0,{type:'action',room:id,revision:d.revision,action:{type:'start'}});assert.equal(d.room.status,'playing');
const current=d.room.turn,other=(current+1)%6;
assert.equal((await call(other,{type:'action',room:id,revision:d.revision,action:{type:'roll'}})).error,'NOT_YOUR_TURN');
const dup=await Promise.all([call(current,{type:'action',room:id,revision:d.revision,action:{type:'roll'}}),call(current,{type:'action',room:id,revision:d.revision,action:{type:'roll'}})]);assert.equal(dup.filter(x=>x.status===200).length,1);assert.equal(dup.filter(x=>x.status===409).length,1);
const views=await Promise.all(tokens.slice(0,6).map((_,i)=>call(i,null,id)));assert.ok(views.every(x=>x.revision===views[0].revision));assert.ok(views.every(x=>JSON.stringify(x.room)===JSON.stringify(views[0].room)));
console.log('PASS: 6-player create/join, seventh rejected, guest authorization, ready/start, out-of-turn rejection, concurrent duplicate prevention, synchronized state and token redaction.');


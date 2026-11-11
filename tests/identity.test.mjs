import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {verifyFirebase,hashGuest} from '../lib/identity.mjs';
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'test-key'};
const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
async function token(uid='alice',extra={}){const now=Math.floor(Date.now()/1000),head=enc({alg:'RS256',kid:jwk.kid}),body=enc({sub:uid,iss:'https://securetoken.google.com/test-project',aud:'test-project',iat:now,auth_time:now,exp:now+3600,name:'Alice Account',picture:'https://example.com/alice.png',firebase:{sign_in_provider:'google.com'},...extra}),sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(head+'.'+body));return head+'.'+body+'.'+Buffer.from(sig).toString('base64url');}
test('JWT verifies signatures, project, issuer, expiry and allowed providers',async()=>{
 const opts={keys:[jwk]},good=await token();assert.equal((await verifyFirebase(good,'test-project',opts)).sub,'alice');
 for(const change of [{aud:'other'},{iss:'evil'},{exp:0},{sub:''},{firebase:{sign_in_provider:'anonymous'}},{auth_time:99999999999}])await assert.rejects(()=>token('alice',change).then(t=>verifyFirebase(t,'test-project',opts)),/SIGN_IN_REQUIRED/);
 const parts=good.split('.');parts[1]=enc({sub:'attacker'});await assert.rejects(()=>verifyFirebase(parts.join('.'),'test-project',opts));
 await assert.rejects(()=>verifyFirebase(good,'other-project',opts));await assert.rejects(()=>hashGuest('account:alice'));
});
test('account API: Guest import, cross-device ownership, profile fallback, isolation and durable stats',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(await readFile(new URL('../drizzle/0000_aspiring_dragon_man.sql',import.meta.url),'utf8'));db.exec(await readFile(new URL('../db/002-player-accounts.sql',import.meta.url),'utf8'));
 function prepared(sql,args=[]){return {bind(...values){return prepared(sql,values);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}};}
 globalThis.__flowTestEnv={FIREBASE_PROJECT_ID:'test-project',FIREBASE_API_KEY:'public-test-key',FIREBASE_AUTH_DOMAIN:'test-project.firebaseapp.com',DB:{prepare:prepared,async batch(statements){db.exec('BEGIN');try{const results=[];for(const q of statements)results.push(await q.run());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}}}};
 const oldFetch=globalThis.fetch;globalThis.fetch=async url=>{assert.match(String(url),/googleapis.com\/service_accounts/);return Response.json({keys:[jwk]});};
 async function route(path){let source=await readFile(new URL(path,import.meta.url),'utf8');source=source.replace("import {env} from 'cloudflare:workers';","const env=globalThis.__flowTestEnv;");source=source.replace(/from '(\.\.\/[^']+)'/g,(_,rel)=>"from '"+new URL(rel,new URL(path,import.meta.url)).href+"'");return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}
 try{
 const game=await route('../app/api/game/route.js'),account=await route('../app/api/account/route.js');
 async function req(module,auth,body,id,guest){const r=new Request('https://flow.test/api/'+(module===game?'game':'account')+(id?'?room='+id:''),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+auth,Origin:'https://flow.test',...(body?{'Content-Type':'application/json'}:{}),...(guest?{'X-Guest-Session':guest}:{})},...(body?{body:JSON.stringify({...body,clientVersion:3})}:{})});const response=await module[body?'POST':'GET'](r);return {status:response.status,...await response.json()};}
 const guest=crypto.randomUUID()+crypto.randomUUID(),other=crypto.randomUUID()+crypto.randomUUID(),alice=await token(),secondDevice=await token(),bob=await token('bob');
 let created=await req(game,guest,{type:'create',name:'Guest Alice',title:'Import QA',avatarId:5});assert.equal(created.status,200);assert.equal(created.room.players[0].avatar.id,5);const id=created.room.id,pid=created.me;
 assert.equal((await req(account,alice)).profile.name,'Alice Account');
 assert.equal((await req(account,alice,{type:'claim'},null,guest)).claimed,true);
 assert.equal((await req(game,guest,null,id)).error,'GUEST_UPGRADED');
 let joined=await req(game,secondDevice,null,id);assert.equal(joined.me,pid);assert.equal(joined.canDelete,true);assert.equal(joined.room.players[0].avatar.mode,'photo');assert.equal(joined.room.players[0].key,undefined);assert.equal(joined.room.creatorKey,undefined);
 assert.equal((await req(game,bob,null,id)).error,'NOT_MEMBER');assert.equal((await req(game,bob,{type:'deleteRoom',room:id})).error,'CREATOR_ONLY');
 assert.equal((await req(account,bob,{type:'claim'},null,guest)).error,'GUEST_ALREADY_LINKED');
 const saved=await req(account,alice,{type:'profile',name:'My nickname',mode:'avatar',avatarId:8,photo:'https://attacker.test/pixel'});assert.equal(saved.profile.name,'My nickname');assert.equal(saved.profile.avatar.photo,'https://example.com/alice.png');assert.equal((await req(account,secondDevice)).profile.name,'My nickname');
 const noPhoto=await token('apple-user',{picture:null,name:undefined,firebase:{sign_in_provider:'apple.com'}});assert.equal((await req(account,noPhoto)).profile.avatar.mode,'avatar');
 const conflictGuest=crypto.randomUUID()+crypto.randomUUID();const conflict=await req(game,conflictGuest,{type:'create',name:'Temporary',title:'Conflict'});await req(game,alice,{type:'join',name:'Account seat',room:conflict.room.id});assert.equal((await req(account,alice,{type:'claim'},null,conflictGuest)).error,'SEAT_CONFLICT');
 await req(game,other,{type:'join',room:id,name:'Guest 2',avatarId:2});joined=await req(game,alice,null,id);
 const target=joined.room.players.find(p=>p.id!==pid).id;
 const kicked=await req(game,alice,{type:'action',room:id,revision:joined.revision,action:{type:'kick',playerId:target}});assert.equal(kicked.room.players.length,1);
 // Persist a server-owned completed fixture, then exercise idempotent result capture.
 const state=JSON.parse(db.prepare('SELECT state FROM rooms WHERE id=?').get(id).state);state.status='finished';state.winner=pid;state.players[0].track='fast';db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(state),id);
 for(let i=0;i<2;i++){const d=await req(game,alice,null,id);const r=await req(game,alice,{type:'action',room:id,revision:d.revision,action:{type:'appearance',avatarId:1}});assert.equal(r.status,200);}
 assert.equal((await req(account,alice)).stats.played,1);assert.equal((await req(account,alice)).stats.wins,1);
 assert.equal((await req(game,alice,{type:'deleteRoom',room:id})).deleted,id);assert.equal((await req(account,alice)).stats.played,1);
 // Authentication disabled remains compatible with old DB installations and Guest play.
 globalThis.__flowTestEnv.FIREBASE_PROJECT_ID='';assert.equal((await req(game,guest,null,id)).error,'GUEST_UPGRADED');const newGuest=crypto.randomUUID()+crypto.randomUUID();assert.equal((await req(game,newGuest,{type:'create',name:'Still Guest',title:'No providers',avatarId:11})).status,200);
 }finally{globalThis.fetch=oldFetch;delete globalThis.__flowTestEnv;db.close();}
});

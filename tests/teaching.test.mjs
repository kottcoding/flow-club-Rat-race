import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {configureTeaching,canTeach,sanitizeScreen} from '../lib/teaching.mjs';
test('roles are scoped to room membership and creator owns grants',()=>{
 const a={id:'a',key:'owner'},b={id:'b',key:'guest'},g={creatorKey:'owner',players:[a,b]};
 assert.equal(canTeach(g,a),false);assert.throws(()=>configureTeaching(g,b,{type:'teachingToggle',enabled:true}),/CREATOR_ONLY/);
 configureTeaching(g,a,{type:'teachingToggle',enabled:true});assert.equal(canTeach(g,a),true);assert.equal(canTeach(g,b),false);
 configureTeaching(g,a,{type:'teachingGrant',playerId:'b',granted:true});assert.equal(canTeach(g,b),true);
 g.players=[a];assert.equal(canTeach(g,b),false);
});
test('screen payload is inert, bounded, and strips secrets and external images',()=>{
 const screen=sanitizeScreen({width:99999,panels:{action:{tag:'div',cls:'modal-backdrop formula',style:'position:fixed',children:[{tag:'script',children:['alert(1)']},{tag:'input',value:'secret123'},{tag:'img',src:'https://evil.test/a.png'},{tag:'button',onclick:'attack()',children:['Buy']}]}}});
 assert.equal(screen.width,2560);assert.equal(screen.panels.action.cls,'formula');assert.equal(screen.panels.action.children.length,3);assert.equal(screen.panels.action.children[0].value,'123');assert.equal(screen.panels.action.children[1].src,undefined);assert.equal(screen.panels.action.children[2].onclick,undefined);
 assert.deepEqual(sanitizeScreen({private:true,panels:{action:{tag:'p',children:['private']}}}).panels,{});
});
test('API permissions, read-only lease, draft relay, revocation and shutdown',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(await readFile(new URL('../drizzle/0000_aspiring_dragon_man.sql',import.meta.url),'utf8'));db.exec(await readFile(new URL('../db/004-teaching.sql',import.meta.url),'utf8'));
 function prepared(sql,args=[]){return {bind(...v){return prepared(sql,v);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}};}
 globalThis.__teachingEnv={DB:{prepare:prepared,async batch(qs){db.exec('BEGIN');try{const out=[];for(const q of qs)out.push(await q.run());db.exec('COMMIT');return out;}catch(e){db.exec('ROLLBACK');throw e;}}}};
 async function load(path){const url=new URL(path,import.meta.url);let s=await readFile(url,'utf8');s=s.replace("import {env} from 'cloudflare:workers';","const env=globalThis.__teachingEnv;").replace(/from '(\.\.\/[^']+)'/g,(_,rel)=>"from '"+new URL(rel,url).href+"'");return import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));}
 const game=await load('../app/api/game/route.js'),teaching=await load('../app/api/teaching/route.js');
 const owner=crypto.randomUUID()+crypto.randomUUID(),guest=crypto.randomUUID()+crypto.randomUUID(),outsider=crypto.randomUUID()+crypto.randomUUID();
 async function req(api,key,body,query=''){const res=await api[body?'POST':'GET'](new Request('https://flow.test/api/'+(api===game?'game':'teaching')+query,{method:body?'POST':'GET',headers:{Origin:'https://flow.test',Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify({clientVersion:4,...body})}:{})}));return {code:res.status,...await res.json()};}
 try{
 let d=await req(game,owner,{type:'create',name:'Teacher',title:'Lesson'}),id=d.room.id,ownerId=d.me;
 let join=await req(game,guest,{type:'join',room:id,name:'Learner'}),guestId=join.me;
 assert.equal((await req(game,outsider,{type:'device',room:id,device:'pc'})).error,'NOT_MEMBER');
 assert.equal((await req(game,guest,{type:'device',room:id,device:'invalid'})).error,'INVALID_DEVICE');
 const revBefore=db.prepare('SELECT revision FROM rooms WHERE id=?').get(id).revision;
 assert.equal((await req(game,guest,{type:'device',room:id,device:'tablet',playerId:ownerId})).code,200);
 const withDevice=JSON.parse(db.prepare('SELECT state FROM rooms WHERE id=?').get(id).state);
 assert.equal(withDevice.players.find(p=>p.id===guestId).device,'tablet');
 assert.notEqual(withDevice.players.find(p=>p.id===ownerId).device,'tablet');
 assert.equal(db.prepare('SELECT revision FROM rooms WHERE id=?').get(id).revision,revBefore+1);
 await req(game,guest,{type:'device',room:id,device:'tablet'});
 assert.equal(db.prepare('SELECT revision FROM rooms WHERE id=?').get(id).revision,revBefore+1);
 let g=JSON.parse(db.prepare('SELECT state FROM rooms WHERE id=?').get(id).state);g.status='playing';db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(g),id);
 const change=async(key,action)=>req(game,key,{type:'action',room:id,revision:db.prepare('SELECT revision FROM rooms WHERE id=?').get(id).revision,action});
 assert.equal((await change(guest,{type:'teachingToggle',enabled:true})).error,'CREATOR_ONLY');
 d=await change(owner,{type:'teachingToggle',enabled:true});assert.equal(d.code,200);let epoch=d.room.teaching.epoch;
 assert.equal((await req(teaching,outsider,null,'?room='+id)).error,'NOT_MEMBER');
 assert.equal((await req(teaching,guest,{type:'watch',room:id,target:ownerId,epoch})).error,'MASTER_REQUIRED');
 assert.equal((await req(teaching,owner,{type:'watch',room:id,target:guestId,epoch})).code,200);
 assert.deepEqual((await req(teaching,guest,null,'?room='+id)).watchers,['Teacher']);
 assert.equal((await change(owner,{type:'loan',amount:10000})).error,'MASTER_READ_ONLY');
 const revision=db.prepare('SELECT revision FROM rooms WHERE id=?').get(id).revision;
 await req(teaching,guest,{type:'screen',room:id,epoch,screen:{section:'bank',width:390,panels:{finance:{tag:'input',value:'20,000'}}}});
 const view=await req(teaching,owner,null,'?room='+id+'&target='+guestId);assert.equal(view.screen.panels.finance.value,'20,000');assert.equal(view.room.creatorKey,undefined);assert.equal(view.room.decks,undefined);assert.equal(view.room.players[0].key,undefined);
 assert.equal(db.prepare('SELECT revision FROM rooms WHERE id=?').get(id).revision,revision);
 assert.equal((await req(teaching,guest,null,'?room='+id+'&target='+ownerId)).error,'MASTER_REQUIRED');
 await req(teaching,owner,{type:'stop',room:id});assert.equal(db.prepare('SELECT count(*) n FROM teaching_watches').get().n,0);
 d=await change(owner,{type:'teachingGrant',playerId:guestId,granted:true});epoch=d.room.teaching.epoch;
 assert.equal((await req(teaching,guest,{type:'watch',room:id,target:ownerId,epoch})).code,200);
 await change(owner,{type:'teachingGrant',playerId:guestId,granted:false});assert.equal((await req(teaching,guest,null,'?room='+id+'&target='+ownerId)).error,'MASTER_REQUIRED');
 await change(owner,{type:'teachingToggle',enabled:false});assert.equal((await req(teaching,guest,null,'?room='+id)).enabled,false);
 assert.equal(db.prepare('SELECT count(*) n FROM teaching_watches').get().n,0);assert.equal(db.prepare('SELECT count(*) n FROM teaching_screens').get().n,0);
 }finally{db.close();delete globalThis.__teachingEnv;}
});

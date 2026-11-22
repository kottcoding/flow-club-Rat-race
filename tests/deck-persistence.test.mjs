import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
test('API persists shared decks across players, reloads and stale requests for a complete cycle',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(await readFile(new URL('../drizzle/0000_aspiring_dragon_man.sql',import.meta.url),'utf8'));db.exec(await readFile(new URL('../db/004-teaching.sql',import.meta.url),'utf8'));
 function prepared(sql,args=[]){return {bind(...v){return prepared(sql,v);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}};}
 globalThis.__teachingEnv={DB:{prepare:prepared,async batch(qs){db.exec('BEGIN');try{const out=[];for(const q of qs)out.push(await q.run());db.exec('COMMIT');return out;}catch(e){db.exec('ROLLBACK');throw e;}}}};
 async function load(path){const url=new URL(path,import.meta.url);let s=await readFile(url,'utf8');s=s.replace("import {env} from 'cloudflare:workers';","const env=globalThis.__teachingEnv;").replace(/from '(\.\.\/[^']+)'/g,(_,rel)=>"from '"+new URL(rel,url).href+"'");return import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));}
 const game=await load('../app/api/game/route.js'),teaching=await load('../app/api/teaching/route.js');
 const owner=crypto.randomUUID()+crypto.randomUUID(),guest=crypto.randomUUID()+crypto.randomUUID(),outsider=crypto.randomUUID()+crypto.randomUUID();
 async function req(api,key,body,query=''){const res=await api[body?'POST':'GET'](new Request('https://flow.test/api/'+(api===game?'game':'teaching')+query,{method:body?'POST':'GET',headers:{Origin:'https://flow.test',Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify({clientVersion:4,...body})}:{})}));return {code:res.status,...await res.json()};}

 try{
 let d=await req(game,owner,{type:'create',name:'Audit',title:'Deck persistence audit'}),id=d.room.id;
 await req(game,guest,{type:'join',room:id,name:'Second'});
 for(const [deck,count] of [['small',49],['big',36]]){
  const seen=new Set();
  for(let i=0;i<count;i++){
   const row=db.prepare('SELECT * FROM rooms WHERE id=?').get(id);
   const state=JSON.parse(row.state);state.status='playing';state.phase='choose';state.turn=i%2;state.event={type:'deal'};
   db.prepare('UPDATE rooms SET state=? WHERE id=?').run(JSON.stringify(state),id);
   const key=i%2?guest:owner;
   const result=await req(game,key,{type:'action',room:id,revision:row.revision,action:{type:'draw',deck}});
   assert.equal(result.code,200,JSON.stringify(result));assert.ok(!seen.has(result.room.event.id));seen.add(result.room.event.id);
   assert.equal(result.room.decks,undefined);
   const saved=JSON.parse(db.prepare('SELECT state FROM rooms WHERE id=?').get(id).state);
   assert.equal(saved.decks[deck].length,count-i-1);
   const refresh=await req(game,key,null,'?room='+id);assert.equal(refresh.room.event.id,result.room.event.id);
   const stale=await req(game,key,{type:'action',room:id,revision:row.revision,action:{type:'draw',deck}});assert.equal(stale.error,'STATE_CHANGED');
   assert.equal(JSON.parse(db.prepare('SELECT state FROM rooms WHERE id=?').get(id).state).decks[deck].length,count-i-1);
  }
 }
 }finally{db.close();delete globalThis.__teachingEnv;}
});

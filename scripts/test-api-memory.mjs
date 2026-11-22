// Test-only adapter: execute the real route against SQLite without a live D1 service.
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
const db=new DatabaseSync(':memory:');
for(const path of ['../drizzle/0000_aspiring_dragon_man.sql','../db/004-teaching.sql'])db.exec(await readFile(new URL(path,import.meta.url),'utf8'));
function prepare(sql,args=[]){return {bind(...a){return prepare(sql,a);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};},execute(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}};}
globalThis.__boardTestEnv={DB:{prepare,async batch(statements){db.exec('BEGIN');try{const results=statements.map(s=>s.execute());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}}}};
const url=new URL('../app/api/game/route.js',import.meta.url);
let source=await readFile(url,'utf8');
source=source.replace("import {env} from 'cloudflare:workers';","const env=globalThis.__boardTestEnv;").replace(/from '(\.\.\/[^']+)'/g,(_,rel)=>"from '"+new URL(rel,url).href+"'");
const route=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const realFetch=globalThis.fetch;
globalThis.fetch=async(input,options)=>{const request=new Request(input,options),u=new URL(request.url);if(['127.0.0.1','localhost'].includes(u.hostname)&&u.pathname==='/api/game')return route[request.method](request);return realFetch(input,options);};
process.on('exit',()=>db.close());

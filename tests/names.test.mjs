import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {cleanName,nameKey,playerNameTaken,createNamedRoom} from '../lib/names.mjs';
import {ROOM_TTL_MS} from '../lib/room-retention.mjs';
const now=2000000000000;
function fixture(){
 const sql=new DatabaseSync(':memory:');sql.exec('CREATE TABLE rooms(id TEXT PRIMARY KEY,state TEXT,revision INTEGER,updated INTEGER)');
 function prepare(query,args=[]){return {bind(...v){return prepare(query,v);},async all(){return {results:sql.prepare(query).all(...args)};},async run(){return {meta:{changes:sql.prepare(query).run(...args).changes}};}};}
 const make=(id,title,createdAt=now)=>({id,title,createdAt,players:[{id:'p',key:id,name:'Owner'}],status:'lobby'});
 const seed=g=>sql.prepare('INSERT INTO rooms VALUES(?,?,0,?)').run(g.id,JSON.stringify(g),g.createdAt??now);
 return {sql,db:{prepare},make,seed};
}
test('canonical names collapse whitespace, normalize Unicode and ignore case',()=>{
 assert.equal(nameKey('  KOTT\t  Team  '),nameKey('kott team'));assert.equal(nameKey('ＫＯＴＴ'),'kott');
 assert.equal(cleanName('  ห้อง   ไทย  ',40),'ห้อง ไทย');assert.equal(cleanName(null,24),'');
});
test('player name uniqueness is scoped to members, excluding the returning player',()=>{
 const players=[{id:'a',name:' KOTT  Team '},{id:'b',name:'นก'}];
 assert.equal(playerNameTaken(players,'kott team'),true);assert.equal(playerNameTaken(players,'kott team','a'),false);
 assert.equal(playerNameTaken([], 'kott team'),false);assert.equal(playerNameTaken(players.filter(p=>p.id!=='a'),'kott team'),false);
});
test('all active statuses block room names; existing duplicate rooms are preserved',async()=>{
 const {sql,db,make,seed}=fixture();try{
 for(const status of ['lobby','playing','finished'])seed({...make(status,status),status});
 seed(make('olddup','finished'));
 for(const title of ['LOBBY',' playing ','finished'])await assert.rejects(createNamedRoom(db,make('new',title),['new'],now),/ROOM_NAME_TAKEN/);
 assert.equal(sql.prepare('SELECT count(*) n FROM rooms').get().n,4);
 }finally{sql.close();}
});
test('expiry uses creation time, boundary is seven days, deleted names can be reused',async()=>{
 const {sql,db,make,seed}=fixture();try{
 seed(make('old','Reuse',now-ROOM_TTL_MS));sql.prepare('UPDATE rooms SET updated=?').run(now);
 await createNamedRoom(db,make('new','Reuse'),['new'],now);
 sql.prepare('DELETE FROM rooms WHERE id=?').run('new');await createNamedRoom(db,make('again','Reuse'),['again'],now);
 seed(make('live','Blocked',now-ROOM_TTL_MS+1));await assert.rejects(createNamedRoom(db,make('blocked','Blocked'),['blocked'],now),/ROOM_NAME_TAKEN/);
 }finally{sql.close();}
});
test('search is not limited to first 80 or 200 rooms',async()=>{
 const {sql,db,make,seed}=fixture();try{
 for(let i=0;i<250;i++)seed(make('r'+i,'Room '+i));
 await assert.rejects(createNamedRoom(db,make('new',' room 249 '),['new'],now),/ROOM_NAME_TAKEN/);
 }finally{sql.close();}
});
test('simultaneous same-name requests insert exactly one room',async()=>{
 const {sql,db,make}=fixture();try{
 const results=await Promise.allSettled([createNamedRoom(db,make('a','Same name'),['a'],now),createNamedRoom(db,make('b',' SAME  NAME '),['b'],now)]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.message,'ROOM_NAME_TAKEN');
 assert.equal(sql.prepare('SELECT count(*) n FROM rooms').get().n,1);
 }finally{sql.close();}
});
test('simultaneous different names retry safely and both succeed',async()=>{
 const {sql,db,make}=fixture();try{
 await Promise.all([createNamedRoom(db,make('a','One'),['a'],now),createNamedRoom(db,make('b','Two'),['b'],now)]);
 assert.equal(sql.prepare('SELECT count(*) n FROM rooms').get().n,2);
 }finally{sql.close();}
});

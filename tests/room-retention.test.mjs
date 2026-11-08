import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {ROOM_TTL_MS,roomCreatedAt,roomExpired,cleanupExpiredRooms} from '../lib/room-retention.mjs';
import {room,player} from '../lib/game.mjs';
test('new rooms record creation; recent activity does not extend the seven-day lifetime',()=>{
 const g=room('A','A',player('A','key'));assert.ok(g.createdAt<=Date.now());
 const now=g.createdAt+ROOM_TTL_MS;
 assert.equal(roomExpired(g,now,now-1),false);assert.equal(roomExpired(g,now,now),true);
});
test('legacy fallback is frozen when persisted, rather than reset by subsequent activity',()=>{
 const g={};g.createdAt=roomCreatedAt(g,1000);
 assert.equal(roomCreatedAt(g,99999999),1000);
 assert.equal(roomExpired({},1000,1000+ROOM_TTL_MS),true);
});
test('scheduled cleanup deletes only expired rows, including legacy and all game statuses',async()=>{
 const sqlite=new DatabaseSync(':memory:');sqlite.exec('CREATE TABLE rooms (id TEXT PRIMARY KEY,state TEXT,updated INTEGER)');
 const now=2000000000000,cutoff=now-ROOM_TTL_MS;
 const insert=sqlite.prepare('INSERT INTO rooms VALUES (?,?,?)');
 for(const status of ['lobby','playing','finished'])insert.run(status,JSON.stringify({status,createdAt:cutoff}),now);
 insert.run('legacy-old','{}',cutoff-1);insert.run('legacy-young','{}',cutoff+1);
 insert.run('young',JSON.stringify({createdAt:cutoff+1}),now);
 const db={prepare(sql){return {bind(...args){return {run:async()=>sqlite.prepare(sql).run(...args)}}}}};
 await cleanupExpiredRooms(db,now);
 assert.deepEqual(sqlite.prepare('SELECT id FROM rooms ORDER BY id').all().map(x=>x.id),['legacy-young','young']);
 await cleanupExpiredRooms(db,now);assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM rooms').get().n,2);
 sqlite.close();
});

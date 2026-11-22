import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {BOARD_VERSION,photoSpaces,photoDreams,photoOuter,photoInner} from '../lib/board-20261122.mjs';
import {room,player,apply,roomBoard,roomInner,dreamFor,normalizeRoom,totals,inner,outer,publicRoom} from '../lib/game.mjs';
import {spectatorSnapshot} from '../lib/room-presentation.mjs';
import {soundCues} from '../lib/game-sounds.mjs';
function game(){const p=player('A','a'),q=player('B','b'),g=room('BOARD','Board',p);g.players.push(q);g.status='playing';p.track='fast';p.cash=20000000;p.fastIncome=100000;p.fastGoal=10000000;return g;}
function land(g,i){const p=g.players[0];p.position=(i+46)%48;g.phase='roll';apply(g,p.id,{type:'roll'},()=>0);assert.equal(p.position,i);}
test('new route has exactly 24/48 spaces and every reference asset exists',()=>{
 const count=a=>a.reduce((r,t)=>(r[t]=(r[t]||0)+1,r),{});
 assert.deepEqual(count(photoInner),{deal:12,doodad:3,charity:1,pay:3,market:3,baby:1,downsize:1});
 assert.deepEqual(count(photoSpaces.map(s=>s.type)),{lawsuit:1,dream:23,business:18,charity:1,cashday:3,audit:1,divorce:1});
 assert.equal(new Set(photoSpaces.filter(s=>s.dream).map(s=>s.dream)).size,23);
 for(const s of photoSpaces)assert.ok(existsSync(new URL('../public'+s.photo,import.meta.url)),s.photo);
 assert.equal(photoDreams.find(d=>d.id==='art-gallery').cost,1750000);
 assert.match(photoDreams.find(d=>d.id==='named-park').name[0],/สกายวอล์ค/);
});
test('persisted rooms retain original positions, boards and prices; public/master/spectator retain version',()=>{
 const g=game();assert.equal(g.boardVersion,BOARD_VERSION);assert.deepEqual(roomBoard(g),photoOuter);assert.deepEqual(roomInner(g),photoInner);
 assert.equal(publicRoom(g).boardVersion,BOARD_VERSION);assert.equal(spectatorSnapshot(g).boardVersion,BOARD_VERSION);
 delete g.boardVersion;const before=structuredClone(g);normalizeRoom(g);assert.deepEqual(g,before);assert.deepEqual(roomBoard(g),outer);assert.deepEqual(roomInner(g),inner);assert.equal(dreamFor(g,'art-gallery').cost,1250000);
});
for(const s of photoSpaces.filter(s=>s.type==='business'))test(`business ${s.spaceIndex}: fixed amount and exact outcome on all six die faces`,()=>{
 for(let die=1;die<=6;die++){
  const g=game(),p=g.players[0];land(g,s.spaceIndex);assert.deepEqual(g.event.name,s.name);assert.equal(g.event.cost,s.cost);assert.equal(g.event.flow,s.flow);
  const before=p.cash,income=p.fastIncome;assert.throws(()=>apply(g,g.players[1].id,{type:'buy'}),/NOT_YOUR_TURN/);
  assert.throws(()=>apply(g,p.id,{type:'businessRoll'},()=>die-1),/INVALID_ACTION/);
  apply(g,p.id,{type:'buy'});assert.equal(p.cash,before-s.cost);
  if(s.risk){assert.equal(g.phase,'businessRoll');assert.throws(()=>apply(g,p.id,{type:'end'}),/FINISH_ACTION/);assert.throws(()=>apply(g,p.id,{type:'pass'}),/INVALID_ACTION/);
   const position=p.position;apply(g,p.id,{type:'businessRoll'},()=>die-1);assert.equal(p.position,position);
   const success=die>=s.risk.min;assert.equal(p.cash,before-s.cost+(success&&s.risk.kind==='ipo'?5000000:0));assert.equal(p.fastIncome,income+(success&&s.risk.kind==='income'?s.flow:0));
   assert.throws(()=>apply(g,p.id,{type:'businessRoll'},()=>5),/INVALID_ACTION|GAME_OVER/);
  }else assert.equal(p.fastIncome,income+s.flow);
  assert.equal(p.fastAssets.length,1);assert.equal(p.assets.length,0);assert.throws(()=>apply(g,p.id,{type:'buy'}),/INVALID_ACTION|GAME_OVER/);
 }
});
test('insufficient cash and passing never invest; cashday pays once when passed or landed',()=>{
 const g=game(),p=g.players[0];land(g,2);p.cash=1;assert.throws(()=>apply(g,p.id,{type:'buy'}),/NO_CASH/);assert.equal(p.cash,1);apply(g,p.id,{type:'pass'});assert.equal(p.fastAssets,undefined);
 for(const position of [10,11]){g.phase='roll';p.position=position;p.cash=0;apply(g,p.id,{type:'roll'},()=>0);assert.equal(p.cash,p.fastIncome);}
});
test('rat payday map and Fast Track entry formula remain independent',()=>{
 const g=game(),p=g.players[0];p.track='rat';p.salary=20000;p.living=1000;p.position=4;p.cash=0;g.phase='roll';apply(g,p.id,{type:'roll'},()=>0);assert.equal(p.cash,19000);
 p.assets=[{type:'business',flow:2000,qty:1,cost:10000,down:10000}];g.phase='end';apply(g,p.id,{type:'end'});assert.equal(p.track,'fast');assert.equal(p.fastIncome,totals(p).passive*100);assert.equal(p.cash,200000);assert.equal(p.fastGoal,700000);
});
test('IPO dice trigger only dice and sale audio, not another landing sound',()=>{
 const g=game();land(g,30);apply(g,g.players[0].id,{type:'buy'});const before=structuredClone(g);apply(g,g.players[0].id,{type:'businessRoll'},()=>5);
 assert.deepEqual(new Set(soundCues(before,g)),new Set(['roll','sell']));
});

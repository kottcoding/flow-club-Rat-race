import test from 'node:test';
import assert from 'node:assert/strict';
import {eventCategory,newlyEscaped} from '../lib/event-presentation.mjs';
import {room,player,apply,inner} from '../lib/game.mjs';
test('photo quote retains Small Deal source even after resolution; market keeps Market',()=>{
 assert.equal(eventCategory({phase:'end',event:{type:'quote',deck:'small'},landedTile:'deal'}),'small');
 assert.equal(eventCategory({phase:'market',event:{type:'quote',deck:'market'}}),'market');
 assert.equal(eventCategory({phase:'roll',event:{deck:'big'},landedTile:'pay'}),null);
});
test('landing metadata distinguishes passing Pay Day from landing there and clears on skipped turn',()=>{
 const p=player('A','a'),q=player('B','b'),g=room('TEST','Test',p);g.ruleset='legacy';g.currency='USD';g.players.push(q);p.dream=0;q.dream=1;p.ready=q.ready=true;apply(g,p.id,{type:'start'},()=>0);
 p.position=inner.indexOf('pay')-1;apply(g,p.id,{type:'roll'},()=>0);assert.equal(eventCategory(g),'pay');
 g.phase='roll';p.position=inner.indexOf('pay')-1;apply(g,p.id,{type:'roll'},()=>1);assert.equal(g.landedTile,'deal');assert.equal(eventCategory(g),'deal');
 g.phase='roll';g.event=null;p.skip=1;apply(g,p.id,{type:'roll'},()=>0);assert.equal(eventCategory(g),null);
});
test('celebrate transitions only, never initial load, another room, or repeated poll',()=>{
 const before={id:'A',players:[{id:'p',track:'rat'}]},after={id:'A',players:[{id:'p',track:'fast',name:'A'}]};
 assert.equal(newlyEscaped(before,after).length,1);assert.deepEqual(newlyEscaped(null,after),[]);assert.deepEqual(newlyEscaped({...before,id:'B'},after),[]);assert.deepEqual(newlyEscaped(after,after),[]);
});

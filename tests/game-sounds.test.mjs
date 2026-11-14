import test from 'node:test';
import assert from 'node:assert/strict';
import {soundCues,melodies} from '../lib/game-sounds.mjs';
const base=()=>({id:'room',status:'playing',phase:'roll',players:[{id:'a',track:'rat',cash:1000,loan:500}],log:[]});
test('initial load, refresh, room switch and unchanged polling are silent',()=>{const g=base();g.log=[{id:'old',title:['','Bank loan received']}];assert.deepEqual(soundCues(null,g),[]);assert.deepEqual(soundCues(g,structuredClone(g)),[]);assert.deepEqual(soundCues({...g,id:'else'},g),[]);assert.deepEqual(soundCues(g,null),[]);});
test('confirmed accounting events have matching cues and no duplicate calculation sounds',()=>{for(const [title,cue] of [['Buy shares / bonds','buy'],['Invest: down payment / shares','buy'],['Asset sale after debt','sell'],['Bank loan received','loan'],['Debt repayment','repay'],['Pay Day: income − expenses','pay'],['A new baby','baby'],['Downsized: one month of expenses','downsize']]){const g=base(),next=structuredClone(g);next.log=[{id:'new',title:['',title]},{id:'formula',title:['','Pay Day calculation']}];assert.deepEqual(soundCues(g,next),[cue]);assert.deepEqual(soundCues(next,structuredClone(next)),[]);}const g=base(),n=structuredClone(g);n.players[0].loan=0;n.log=[{id:'r',title:['','Debt repayment']}];assert.deepEqual(soundCues(g,n),['repayBank']);});
test('card categories, landing and celebrations are differentiated',()=>{for(const [deck,type,cue] of [['small','split','small'],['big','investment','big'],['market','market','market'],['small','doodad','expense']]){const g=base(),n={...g,phase:'decision',event:{id:deck,type,deck}};assert.deepEqual(soundCues(g,n),type==='doodad'?['small','expense']:[cue]);}for(const [tile,cue] of [['charity','charity'],['deal','deal'],['baby','baby'],['market','market'],['downsize','downsize']]){const g=base(),n={...g,landedTile:tile,log:[{id:'r',title:['','Rolled dice']}]};assert.ok(soundCues(g,n).includes(cue));}const g=base(),n=structuredClone(g);n.players[0].track='fast';assert.deepEqual(soundCues(g,n),['escape']);n.winner='a';n.status='finished';assert.deepEqual(soundCues(g,n),['win']);assert.deepEqual(soundCues(n,structuredClone(n)),[]);});
test('spectators use fresh activity IDs; silent zero expense; all cues have short playable melodies',()=>{const g=base();delete g.log;g.activity=[];const n={...g,activity:[{id:'s',title:['','Buy shares / bonds']}]};assert.deepEqual(soundCues(g,n),['buy']);const before={...base(),phase:'payExpense',event:{id:'repair',amountDue:0,cost:5000}};assert.deepEqual(soundCues(before,{...before,phase:'end',event:{...before.event,paid:true}}),[]);for(const notes of Object.values(melodies)){assert.ok(notes.length<=8);assert.ok(notes.every(n=>n>0&&n<2000));}});

test('audio engine requires interaction, respects mute and hidden tabs, and stops queued tones',async()=>{
 const {configureSound,unlockSound,playSounds,stopSounds}=await import('../lib/game-sounds.mjs');
 const oldWindow=globalThis.window,oldDocument=globalThis.document;let starts=0,stops=0;
 class AudioMock{state='running';currentTime=0;destination={};createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){starts++;},stop(){stops++;}};}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}}
 globalThis.window={AudioContext:AudioMock};globalThis.document={hidden:false};
 const tick=()=>new Promise(resolve=>setTimeout(resolve,15));
 try{configureSound(true);playSounds(['buy']);await tick();assert.equal(starts,0);unlockSound();playSounds(['buy']);await tick();assert.equal(starts,6);configureSound(false);const count=starts;playSounds(['win']);await tick();assert.equal(starts,count);assert.ok(stops>=2);configureSound(true);document.hidden=true;playSounds(['win']);await tick();assert.equal(starts,count);document.hidden=false;playSounds(['sell']);stopSounds();await tick();assert.equal(starts,count);}finally{stopSounds();globalThis.window=oldWindow;globalThis.document=oldDocument;}
});

test('market acknowledgement clicks once and card draw uses shuffle even for expense cards',()=>{
 const g={...base(),phase:'market',event:{id:'card',done:[]}};
 const n={...g,phase:'end',event:{id:'card',done:['a']}};
 assert.deepEqual(soundCues(g,n),['click']);assert.deepEqual(soundCues(n,structuredClone(n)),[]);
});
test('requested audio designs and durations match, including 5 second angel and 8 second sad cue',async()=>{
 const {soundPlan,soundDuration}=await import('../lib/game-sounds.mjs');
 for(const k of ['loan','repay','repayBank','charity'])assert.equal(soundDuration(k),5);
 assert.equal(soundDuration('downsize'),8);
 assert.ok(soundPlan('small').every(n=>n.type==='noise'));
 assert.ok(soundPlan('big').length>soundPlan('small').length);
 assert.ok(soundDuration('click')<.1);
 assert.equal(soundPlan('pay').length,6);
 for(const k of Object.keys(melodies))for(const n of soundPlan(k)){assert.ok(n.duration>0);assert.ok(n.amp<=.3);}
});

test('dice tumble is a short decaying impact sound and precedes landing, payday and sad cues',async()=>{
 const {soundPlan,soundDuration}=await import('../lib/game-sounds.mjs');
 const plan=soundPlan('roll'),hits=plan.filter(n=>n.type==='noise');
 assert.equal(hits.length,10);assert.ok(hits[0].amp>hits.at(-1).amp);assert.ok(soundDuration('roll')>.8&&soundDuration('roll')<1);
 for(const [tile,title] of [['deal','Pay Day: income − expenses'],['downsize','Downsized: one month of expenses']]){
  const g=base(),n={...g,landedTile:tile,log:[{id:'new',title:['',title]},{id:'dice',title:['','Rolled dice']}]};
  assert.equal(soundCues(g,n)[0],'roll');assert.equal(soundCues(g,n).filter(c=>c==='roll').length,1);assert.deepEqual(soundCues(n,structuredClone(n)),[]);
 }
});

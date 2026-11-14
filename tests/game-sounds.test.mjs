import test from 'node:test';
import assert from 'node:assert/strict';
import {soundCues,melodies} from '../lib/game-sounds.mjs';
const base=()=>({id:'room',status:'playing',phase:'roll',players:[{id:'a',track:'rat',cash:1000,loan:500}],log:[]});
test('initial load, refresh, room switch and unchanged polling are silent',()=>{const g=base();g.log=[{id:'old',title:['','Bank loan received']}];assert.deepEqual(soundCues(null,g),[]);assert.deepEqual(soundCues(g,structuredClone(g)),[]);assert.deepEqual(soundCues({...g,id:'else'},g),[]);assert.deepEqual(soundCues(g,null),[]);});
test('confirmed accounting events have matching cues and no duplicate calculation sounds',()=>{for(const [title,cue] of [['Buy shares / bonds','buy'],['Invest: down payment / shares','buy'],['Asset sale after debt','sell'],['Bank loan received','loan'],['Debt repayment','repay'],['Pay Day: income − expenses','pay'],['A new baby','baby'],['Downsized: one month of expenses','downsize']]){const g=base(),next=structuredClone(g);next.log=[{id:'new',title:['',title]},{id:'formula',title:['','Pay Day calculation']}];assert.deepEqual(soundCues(g,next),[cue]);assert.deepEqual(soundCues(next,structuredClone(next)),[]);}const g=base(),n=structuredClone(g);n.players[0].loan=0;n.log=[{id:'r',title:['','Debt repayment']}];assert.deepEqual(soundCues(g,n),['repayBank']);});
test('card categories, landing and celebrations are differentiated',()=>{for(const [deck,type,cue] of [['small','split','small'],['big','investment','big'],['market','market','market'],['small','doodad','expense']]){const g=base(),n={...g,phase:'decision',event:{id:deck,type,deck}};assert.deepEqual(soundCues(g,n),type==='doodad'?['small','expense']:[cue]);}for(const [tile,cue] of [['charity','ting'],['deal','ting'],['baby','baby'],['market','ting'],['downsize','paew']]){const g=base(),n={...g,landedTile:tile,log:[{id:'r',title:['','Rolled dice']}]};assert.ok(soundCues(g,n).includes(cue));}const g=base(),n=structuredClone(g);n.players[0].track='fast';assert.deepEqual(soundCues(g,n),['escape']);n.winner='a';n.status='finished';assert.deepEqual(soundCues(g,n),['win']);assert.deepEqual(soundCues(n,structuredClone(n)),[]);});
test('spectators use fresh activity IDs; silent zero expense; all cues have short playable melodies',()=>{const g=base();delete g.log;g.activity=[];const n={...g,activity:[{id:'s',title:['','Buy shares / bonds']}]};assert.deepEqual(soundCues(g,n),['buy']);const before={...base(),phase:'payExpense',event:{id:'repair',amountDue:0,cost:5000}};assert.deepEqual(soundCues(before,{...before,phase:'end',event:{...before.event,paid:true}}),[]);for(const notes of Object.values(melodies)){assert.ok(notes.length<=8);assert.ok(notes.every(n=>n>0&&n<2000));}});

test('audio engine requires interaction, respects mute and hidden tabs, and stops queued tones',async()=>{
 const {configureSound,unlockSound,playSounds,stopSounds}=await import('../lib/game-sounds.mjs');
 const oldWindow=globalThis.window,oldDocument=globalThis.document;let starts=0,stops=0;
 class AudioMock{state='running';currentTime=0;destination={};createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){starts++;},stop(){stops++;}};}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}}
 globalThis.window={AudioContext:AudioMock};globalThis.document={hidden:false};
 const tick=()=>new Promise(resolve=>setTimeout(resolve,15));
 try{configureSound(true);playSounds(['deal']);await tick();assert.equal(starts,0);unlockSound();playSounds(['deal']);await tick();assert.equal(starts,3);configureSound(false);const count=starts;playSounds(['win']);await tick();assert.equal(starts,count);assert.ok(stops>=2);configureSound(true);document.hidden=true;playSounds(['win']);await tick();assert.equal(starts,count);document.hidden=false;playSounds(['sell']);stopSounds();await tick();assert.equal(starts,count);}finally{stopSounds();globalThis.window=oldWindow;globalThis.document=oldDocument;}
});

test('market acknowledgement does not duplicate local UI click over polling',()=>{
 const g={...base(),phase:'market',event:{id:'card',done:[]}};
 const n={...g,phase:'end',event:{id:'card',done:['a']}};
 assert.deepEqual(soundCues(g,n),[]);assert.deepEqual(soundCues(n,structuredClone(n)),[]);
});
test('requested audio designs and durations match, including MP3 overrides and 8 second sad cue',async()=>{
 const {soundPlan,soundDuration}=await import('../lib/game-sounds.mjs');
 assert.deepEqual(soundPlan('charity'),[]);
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

test('MP3 click honors mute, volume and visibility without requiring AudioContext',async()=>{
 const {configureSound,playButtonSound,stopButtonSound}=await import('../lib/game-sounds.mjs');
 const oldWindow=globalThis.window,oldDocument=globalThis.document;let clip,plays=0;
 class Clip{constructor(src){this.src=src;clip=this;}pause(){}play(){plays++;return Promise.resolve();}}
 globalThis.window={Audio:Clip};globalThis.document={hidden:false};
 try{configureSound(true,.2);playButtonSound();assert.equal(plays,1);assert.equal(clip.src,'/sounds/click-v1.mp3');assert.equal(clip.volume,.2);playButtonSound();assert.equal(plays,2);assert.equal(clip.currentTime,0);configureSound(false);playButtonSound();assert.equal(plays,2);configureSound(true,0);playButtonSound();assert.equal(plays,2);configureSound(true,.3);document.hidden=true;playButtonSound();assert.equal(plays,2);}finally{stopButtonSound();globalThis.window=oldWindow;globalThis.document=oldDocument;}
});
test('disabled buttons are silent; native buttons, summaries and role buttons are eligible',async()=>{
 const {isSoundButton}=await import('../lib/game-sounds.mjs');
 const element={disabled:false,getAttribute:()=>null,closest:()=>null,hasAttribute:()=>false};
 assert.equal(isSoundButton({closest:()=>element}),true);element.disabled=true;assert.equal(isSoundButton({closest:()=>element}),false);assert.equal(isSoundButton({closest:()=>null}),false);assert.equal(isSoundButton(null),false);
});

test('baby landing plays the supplied decoded MP3 once and stops on mute',async()=>{
 const audio=await import('../lib/game-sounds.mjs?baby-test');
 const saved={window:globalThis.window,document:globalThis.document,fetch:globalThis.fetch};let urls=[],starts=0,stops=0,source,gain;
 const buffer={duration:2.7};
 class Context{state='running';destination={};decodeAudioData(){return Promise.resolve(buffer);}createBufferSource(){source={connect(){},disconnect(){},start(){starts++;},stop(){stops++;}};return source;}createGain(){gain={gain:{value:0},connect(){},disconnect(){}};return gain;}}
 globalThis.window={AudioContext:Context};globalThis.document={hidden:false};globalThis.fetch=async path=>{urls.push(path);return {ok:true,arrayBuffer:async()=>new ArrayBuffer(1)};};
 try{audio.configureSound(true,.2);audio.unlockSound();audio.playSounds(['baby']);await new Promise(r=>setTimeout(r,20));assert.ok(urls.includes('/sounds/baby-cry-v1.mp3'));assert.equal(starts,1);assert.equal(source.buffer,buffer);assert.equal(source.loop,false);assert.equal(gain.gain.value,.2);assert.equal(audio.soundDuration('baby'),2.7);assert.deepEqual(audio.soundPlan('baby'),[]);audio.configureSound(false);assert.equal(stops,1);audio.playSounds(['baby']);assert.equal(starts,1);}finally{audio.stopSounds();Object.assign(globalThis,saved);}
});

test('every requested landing uses the correct MP3 once, without old landing music',()=>{
 for(const [tile,cue] of Object.entries({deal:'ting',business:'ting',pay:'ting',cashday:'ting',charity:'ting',market:'ting',doodad:'paew',downsize:'paew',lawsuit:'paew',audit:'paew',divorce:'paew'})){
  const g=base(),n={...g,landedTile:tile,log:[{id:'pay',title:['','Pay Day: income − expenses']},{id:'roll',title:['','Rolled dice']}],event:{id:'card',type:'doodad',deck:'doodad'}};
  assert.deepEqual(soundCues(g,n),['roll',cue],tile);assert.deepEqual(soundCues(n,structuredClone(n)),[]);
 }
});

test('all three bank actions play the supplied MP3 after confirmation and never on unchanged state',async()=>{
 const audio=await import('../lib/game-sounds.mjs?bank-test');
 const saved={window:globalThis.window,document:globalThis.document,fetch:globalThis.fetch};let starts=0;
 const buffer={duration:1.8};
 class Context{state='running';destination={};decodeAudioData(){return Promise.resolve(buffer);}createBufferSource(){return {connect(){},disconnect(){},start(){starts++;},stop(){}};}createGain(){return {gain:{value:0},connect(){},disconnect(){}};}}
 globalThis.window={AudioContext:Context};globalThis.document={hidden:false};globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
 try{
  audio.configureSound(true,.2);audio.unlockSound();
  for(const [cue,title] of [['loan','Bank loan received'],['repayBank','Debt repayment'],['repay','Debt repayment']]){
   const before=base(),after=structuredClone(before);after.log=[{id:cue,title:['',title]}];
   if(cue==='repayBank')after.players[0].loan=0;
   assert.equal(audio.sampleFiles[cue],'/sounds/bank-success-v1.mp3');assert.deepEqual(audio.soundPlan(cue),[]);
   const count=starts;audio.playSounds(audio.soundCues(before,after));await new Promise(r=>setTimeout(r,20));assert.equal(starts,count+1);assert.equal(audio.soundDuration(cue),1.8);
   audio.playSounds(audio.soundCues(after,structuredClone(after)));await new Promise(r=>setTimeout(r,20));assert.equal(starts,count+1);
  }
  audio.configureSound(false);audio.playSounds(['loan']);await new Promise(r=>setTimeout(r,20));assert.equal(starts,3);
 }finally{audio.stopSounds();Object.assign(globalThis,saved);}
});

test('buy, sell and confirmed donation use MP3; skipping or viewing charity is silent',async()=>{
 const audio=await import('../lib/game-sounds.mjs?trade-test');
 const saved={window:globalThis.window,document:globalThis.document,fetch:globalThis.fetch};let starts=0;
 class Context{state='running';destination={};decodeAudioData(){return Promise.resolve({duration:2});}createBufferSource(){return {connect(){},disconnect(){},start(){starts++;},stop(){}};}createGain(){return {gain:{value:0},connect(){},disconnect(){}};}}
 globalThis.window={AudioContext:Context};globalThis.document={hidden:false};globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
 try{
  audio.configureSound(true,.2);audio.unlockSound();
  for(const [cue,title,file] of [['buy','Buy shares on Market','money'],['sell','Asset sale (after mortgage)','money'],['charity','Charity','angel']]){
   const b=base(),n={...b,log:[{id:cue,title:['',title]}]};
   assert.deepEqual(audio.soundCues(b,n),[cue]);assert.equal(audio.sampleFiles[cue],`/sounds/${file}-v1.mp3`);assert.deepEqual(audio.soundPlan(cue),[]);
   const count=starts;audio.playSounds(audio.soundCues(b,n));await new Promise(r=>setTimeout(r,20));assert.equal(starts,count+1);assert.deepEqual(audio.soundCues(n,structuredClone(n)),[]);
  }
  const b={...base(),phase:'decision',event:{type:'charity'}};
  assert.deepEqual(audio.soundCues(base(),b),[]);
  assert.deepEqual(audio.soundCues(b,{...b,phase:'end'}),[]);
 }finally{audio.stopSounds();Object.assign(globalThis,saved);}
});

test('escape and victory play original MP3 once; victory takes priority and refresh stays silent',async()=>{
 const audio=await import('../lib/game-sounds.mjs?celebration-test');
 const saved={window:globalThis.window,document:globalThis.document,fetch:globalThis.fetch};let starts=0,source;
 class Context{state='running';destination={};decodeAudioData(){return Promise.resolve({duration:6});}createBufferSource(){source={connect(){},disconnect(){},start(){starts++;},stop(){}};return source;}createGain(){return {gain:{value:0},connect(){},disconnect(){}};}}
 globalThis.window={AudioContext:Context};globalThis.document={hidden:false};globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
 try{
  audio.configureSound(true,.2);audio.unlockSound();
  for(const [cue,file] of [['escape','kids-cheering'],['win','victory']]){
   const b=base(),n=structuredClone(b);n.players[0].track='fast';
   if(cue==='win'){n.winner='a';n.status='finished';}
   assert.deepEqual(audio.soundCues(b,n),[cue]);assert.equal(audio.sampleFiles[cue],`/sounds/${file}-v1.mp3`);assert.deepEqual(audio.soundPlan(cue),[]);
   const count=starts;audio.playSounds(audio.soundCues(b,n));await new Promise(r=>setTimeout(r,20));assert.equal(starts,count+1);assert.equal(source.loop,false);assert.equal(audio.soundDuration(cue),6);
   assert.deepEqual(audio.soundCues(n,structuredClone(n)),[]);assert.deepEqual(audio.soundCues(null,n),[]);
  }
  audio.configureSound(false);audio.playSounds(['win']);await new Promise(r=>setTimeout(r,20));assert.equal(starts,2);
 }finally{audio.stopSounds();Object.assign(globalThis,saved);}
});

test('revision tracker rejects late replies and repeated polling, but allows the next real action',async()=>{
 const {createSoundTracker}=await import('../lib/game-sounds.mjs');
 for(const title of ['Bank loan received','Debt repayment','Buy shares on Market','Asset sale (after mortgage)']){
  const track=createSoundTracker(),b=base(),n={...b,log:[{id:'one',title:['',title]}]},last={...b,log:[{id:'two',title:['',title]},...n.log]};
  assert.deepEqual(track(b,10),[]);assert.equal(track(n,11).length,1);
  assert.deepEqual(track(b,10),[]);assert.deepEqual(track(n,11),[]);assert.equal(track(last,12).length,1);
 }
 for(const tile of ['pay','market','deal']){
  const track=createSoundTracker(),b=base(),n={...b,landedTile:tile,log:[{id:'roll',title:['','Rolled dice']}]};
  track(b,1);assert.deepEqual(track(n,2),['roll','ting']);assert.deepEqual(track(b,1),[]);assert.deepEqual(track(n,2),[]);
 }
});
test('one update plays each shared MP3 once and event buttons suppress the generic click',async()=>{
 const {uniqueSoundCues,isSoundButton}=await import('../lib/game-sounds.mjs');
 assert.deepEqual(uniqueSoundCues(['buy','sell','loan','repay','repayBank']),['buy','loan']);
 assert.deepEqual(uniqueSoundCues(['roll','ting','ting']),['roll','ting']);
 const el={disabled:false,getAttribute:()=>null,closest:()=>null,hasAttribute:key=>key==='data-event-sound'};
 assert.equal(isSoundButton({closest:()=>el}),false);
 el.hasAttribute=()=>false;assert.equal(isSoundButton({closest:()=>el}),true);
});

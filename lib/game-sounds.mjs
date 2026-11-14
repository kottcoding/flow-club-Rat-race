// Sound cues are derived only from confirmed server state, never from clicks.
export function soundCues(before,after){
 if(!before||!after||before.id!==after.id)return [];
 const cues=new Set(),add=x=>x&&cues.add(x);
 const known=new Set((before.log||before.activity||[]).map(x=>x.id));
 const entries=(after.log||after.activity||[]).filter(x=>x.id&&!known.has(x.id));
 for(const e of entries){
  const title=Array.isArray(e.title)?e.title[1]:e.title||'';
  if(/^Rolled dice$/.test(title))add('roll');
  else if(/^Pay Day:|^CASHFLOW Day$/.test(title))add('pay');
  else if(/Bank loan received|Automatic emergency loan/.test(title))add('loan');
  else if(title==='Debt repayment')add((after.players||[]).some(p=>p.loan<(before.players||[]).find(q=>q.id===p.id)?.loan)?'repayBank':'repay');
  else if(/^Buy shares|^Invest:|Accept deal and invest/.test(title))add('buy');
  else if(/^Asset sale|Deal-right fee received|Deferred house sale settled/.test(title))add('sell');
  else if(title==='A new baby')add('baby');
  else if(/^Downsized:|^Restructuring:/.test(title))add('downsize');
  else if(/^(audit|lawsuit|Divorce):/.test(title))add('expense');
 }
 const rolled=cues.has('roll');
 if(rolled){const tile=after.landedTile;add(({deal:'deal',market:'market',doodad:'expense',baby:'baby',downsize:'downsize',charity:'charity',cashday:'pay',business:'big'})[tile]);}
 const event=after.event,changed=event&&(before.event?.id!==event.id||before.phase==='choose'&&after.phase!=='choose'||entries.some(x=>(x.title?.[1]||'').startsWith('Drew card:')));
 if(changed){add(({small:'small',big:'big',market:'market'})[event.deck]||({charity:'charity',fast:'big',dream:'dream'})[event.type]);if(event.type==='doodad')add('expense');}
 // Button clicks are local UI feedback; do not replay another player's click on polling.
 if(before.phase==='decision'&&after.phase!=='decision'&&['fast','dream'].includes(event?.type)&&(after.players||[]).some(p=>p.cash<(before.players||[]).find(q=>q.id===p.id)?.cash))add('buy');
 if(before.phase==='payExpense'&&after.phase!=='payExpense'&&event?.paid&&before.event?.id===event.id&&(before.event.amountDue??before.event.cost)>0)add('expense');
 if(before.phase==='decision'&&after.phase!=='decision'&&event?.type==='charity'&&(after.players||[]).some(p=>p.charity>(before.players||[]).find(q=>q.id===p.id)?.charity))add('charity');
 if((after.players||[]).some(p=>p.track==='fast'&&(before.players||[]).find(q=>q.id===p.id)?.track==='rat'))add('escape');
 if(after.winner&&after.winner!==before.winner)add('win');
 if(before.status==='lobby'&&after.status==='playing')add('start');
 const first=rolled?['roll']:[];
 if(cues.has('win'))return [...first,'win'];
 if(cues.has('escape'))return [...first,'escape'];
 if(cues.has('downsize'))return [...first,'downsize'];
 // Dice always precede the landing/result, even when accounting logs are newest-first.
 return [...first,...[...cues].filter(c=>c!=='roll').slice(rolled?-2:-3)];
}
export const melodies={
 click:[1200],roll:[330,440,350,520],deal:[440,660],small:[523,659,784],big:[392,523,659,1047],
 market:[523,784,659],buy:[740,988],sell:[659,988,1319],loan:[330,440,554],
 repay:[554,740,880],repayBank:[440,659,880,1109],expense:[440,349],pay:[784,988,1319],
 baby:[659,784,659,1047],downsize:[392,330,262],charity:[523,659,880],dream:[659,880,1047],
 escape:[523,659,784,1047,1319],win:[523,659,784,1047,784,1047,1319,1568],start:[392,523,784]
};
let context,enabled=true,volume=.22,timers=[],nodes=[];
export function configureSound(on,level=volume){enabled=on;volume=Math.max(0,Math.min(.5,level));if(!on){stopSounds();stopButtonSound();}if(buttonAudio)buttonAudio.volume=volume;}
export function stopSounds(){timers.forEach(clearTimeout);timers=[];for(const n of nodes){try{n.stop();}catch{}}nodes=[];}
export function unlockSound(){
 if(!enabled||typeof window==='undefined')return;
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;context ||= new Audio();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}
}
// Each plan describes an original synthesized effect (not recorded speech).
export function soundPlan(kind){
 const tone=(at,duration,freq,end=freq,amp=.22,type='sine')=>({at,duration,freq,end,amp,type});
 if(kind==='roll'){
  // Two dice: irregular hard-surface taps, slowing and fading as they settle.
  return [0,.037,.089,.142,.211,.292,.395,.518,.666,.82].flatMap((at,i)=>{
   const strength=.27*(1-i*.065),pitch=760+(i%3)*175;
   return [{...tone(at,.034,0,0,strength),type:'noise'},tone(at,.055,pitch,pitch*.55,strength*.65,'triangle')];
  });
 }
 if(kind==='click')return [tone(0,.045,1400,450,.3,'triangle')];
 if(kind==='small'||kind==='big')return Array.from({length:kind==='big'?10:7},(_,i)=>({...tone(i*.038,.055,0,0,.17),type:'noise'}));
 if(kind==='buy'||kind==='sell')return [0,.18].flatMap(at=>[tone(at,.24,1568,1400,.18),tone(at,.19,2349,2100,.08),tone(at,.14,3136,2800,.04)]);
 if(['loan','repay','repayBank','charity'].includes(kind))return [523,659,784,1047,1319,1047,784,659].flatMap((f,i)=>[tone(i*.5,1.5,f,f,.12),tone(i*.5,1.5,f*2,f*2,.025)]);
 if(kind==='deal')return [tone(0,.13,330,392,.25,'triangle'),tone(.16,.13,392,494,.25,'triangle'),tone(.32,.26,494,659,.25,'triangle')];
 if(kind==='expense')return [0,.012,.025].flatMap((at,i)=>[tone(at,.65,260+i*4,135+i*3,.12,'triangle'),tone(at,.65,520+i*5,270+i*3,.035)]);
 if(kind==='baby')return [0,.32,.68].flatMap(at=>[tone(at,.14,550,880,.18),tone(at+.14,.16,880,620,.15),tone(at,.3,1100,1450,.025)]);
 if(kind==='downsize')return [440,392,349,330,294,262,247,220].flatMap((f,i)=>[tone(i,1,f,f,.16,'triangle'),tone(i,1,f/2,f/2,.08)]);
 if(kind==='pay')return [523,523,659,784,784,1047].map((f,i)=>tone(i*.15,i===5?.35:.11,f,f,.23,'triangle'));
 return (melodies[kind]||melodies.deal).map((f,i)=>tone(i*.14,.22,f,f,.24));
}
export const soundDuration=kind=>Math.max(...soundPlan(kind).map(n=>n.at+n.duration));
function playCue(kind){
 if(!enabled||!context||context.state!=='running'||document.hidden)return;
 for(const note of soundPlan(kind)){
  const at=context.currentTime+note.at,gain=context.createGain();let source;
  if(note.type==='noise'){
   const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*note.duration),context.sampleRate),samples=buffer.getChannelData(0);let smooth=0;
   for(let i=0;i<samples.length;i++){smooth=.55*smooth+.45*(Math.random()*2-1);samples[i]=smooth;}
   source=context.createBufferSource();source.buffer=buffer;
  }else{source=context.createOscillator();source.type=note.type;source.frequency.setValueAtTime(note.freq,at);source.frequency.exponentialRampToValueAtTime(note.end,at+note.duration);}
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume*note.amp,at+Math.min(.015,note.duration/4));gain.gain.exponentialRampToValueAtTime(.0001,at+note.duration);
  source.connect(gain);gain.connect(context.destination);nodes.push(source);
  source.onended=()=>{source.disconnect();gain.disconnect();nodes=nodes.filter(n=>n!==source);};
  source.start(at);source.stop(at+note.duration+.005);
 }
}
export function playSounds(cues){
 if(!enabled||!context||context.state!=='running'||document.hidden||!cues.length)return;
 stopSounds();let offset=0;
 for(const cue of cues){timers.push(setTimeout(()=>playCue(cue),offset*1000));offset+=soundDuration(cue)+.06;}
}

// Separate channel: UI click must not cancel a dice roll or celebration.
let buttonAudio;
export function prepareButtonSound(){
 if(buttonAudio||typeof window==='undefined'||!window.Audio)return;
 try{buttonAudio=new window.Audio('/sounds/click-v1.mp3');buttonAudio.preload='auto';buttonAudio.volume=volume;}catch{}
}
export function stopButtonSound(){if(buttonAudio){buttonAudio.pause();try{buttonAudio.currentTime=0;}catch{}}}
export function playButtonSound(){
 if(!enabled||volume<=0||typeof document==='undefined'||document.hidden)return;
 prepareButtonSound();if(!buttonAudio)return;
 try{buttonAudio.pause();buttonAudio.currentTime=0;buttonAudio.volume=volume;const result=buttonAudio.play();result?.catch(()=>{});}catch{}
}
export function isSoundButton(target){
 const element=target?.closest?.('button, summary, [role="button"], a[href]');
 return !!element&&!element.disabled&&element.getAttribute('aria-disabled')!=='true'&&!element.closest('[inert]')&&!element.hasAttribute('data-sound-toggle');
}

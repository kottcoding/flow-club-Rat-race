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
 if(changed)add(event.type==='doodad'?'expense':({small:'small',big:'big',market:'market'})[event.deck]||({charity:'charity',fast:'big',dream:'dream'})[event.type]);
 if(before.phase==='decision'&&after.phase!=='decision'&&['fast','dream'].includes(event?.type)&&(after.players||[]).some(p=>p.cash<(before.players||[]).find(q=>q.id===p.id)?.cash))add('buy');
 if(before.phase==='payExpense'&&after.phase!=='payExpense'&&event?.paid&&before.event?.id===event.id&&(before.event.amountDue??before.event.cost)>0)add('expense');
 if(before.phase==='decision'&&after.phase!=='decision'&&event?.type==='charity'&&(after.players||[]).some(p=>p.charity>(before.players||[]).find(q=>q.id===p.id)?.charity))add('charity');
 if((after.players||[]).some(p=>p.track==='fast'&&(before.players||[]).find(q=>q.id===p.id)?.track==='rat'))add('escape');
 if(after.winner&&after.winner!==before.winner)add('win');
 if(before.status==='lobby'&&after.status==='playing')add('start');
 if(cues.has('win'))return ['win'];
 if(cues.has('escape'))return ['escape'];
 // Keep a busy turn musical rather than layering every accounting log.
 return [...cues].slice(-3);
}
export const melodies={
 roll:[330,440,350,520],deal:[440,660],small:[523,659,784],big:[392,523,659,1047],
 market:[523,784,659],buy:[740,988],sell:[659,988,1319],loan:[330,440,554],
 repay:[554,740,880],repayBank:[440,659,880,1109],expense:[440,349],pay:[784,988,1319],
 baby:[659,784,659,1047],downsize:[392,330,262],charity:[523,659,880],dream:[659,880,1047],
 escape:[523,659,784,1047,1319],win:[523,659,784,1047,784,1047,1319,1568],start:[392,523,784]
};
let context,enabled=true,volume=.22,timers=[],nodes=[];
export function configureSound(on,level=volume){enabled=on;volume=Math.max(0,Math.min(.5,level));if(!on)stopSounds();}
export function stopSounds(){timers.forEach(clearTimeout);timers=[];for(const n of nodes){try{n.stop();}catch{}}nodes=[];}
export function unlockSound(){
 if(!enabled||typeof window==='undefined')return;
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;context ||= new Audio();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}
}
function playCue(kind){
 if(!enabled||!context||context.state!=='running'||document.hidden)return;
 const notes=melodies[kind]||melodies.deal,step=kind==='win'?.14:.095;
 for(let i=0;i<notes.length;i++){
  const oscillator=context.createOscillator(),gain=context.createGain(),at=context.currentTime+i*step;
  oscillator.type=kind==='downsize'?'triangle':'sine';oscillator.frequency.value=notes[i];
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume*.3,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+step+.09);
  oscillator.connect(gain);gain.connect(context.destination);nodes.push(oscillator);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();nodes=nodes.filter(n=>n!==oscillator);};
  oscillator.start(at);oscillator.stop(at+step+.1);
 }
}
export function playSounds(cues){
 if(!enabled||!context||context.state!=='running'||document.hidden||!cues.length)return;
 stopSounds();cues.forEach((cue,i)=>timers.push(setTimeout(()=>playCue(cue),i*550)));
}

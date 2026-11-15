"use client";
import {useEffect,useRef,useState} from 'react';
import {EMOJIS,emojiSrc,createReactionTracker} from '../lib/emojis.mjs';
export default function RoomEmojis({roomId,canSend=false,authorization,lang}){
 const [open,setOpen]=useState(false),[active,setActive]=useState([]),[busy,setBusy]=useState(false),[until,setUntil]=useState(0),[now,setNow]=useState(Date.now()),[error,setError]=useState(''),[ready,setReady]=useState(false);
 const tracker=useRef(createReactionTracker()),mounted=useRef(false),locked=useRef(false),box=useRef(null),trigger=useRef(null);const th=lang==='th';
 const add=events=>{if(events.length)setActive(old=>[...old,...events.map(e=>({...e,expires:Date.now()+3000}))].slice(-3));};
 useEffect(()=>{let alive=true,timer;const abort=new AbortController();mounted.current=true;tracker.current.reset();setActive([]);setReady(false);
  async function poll(){try{if(!document.hidden){const r=await fetch('/api/reactions?room='+encodeURIComponent(roomId),{cache:'no-store',signal:abort.signal});const d=await r.json();if(!r.ok)throw Error(d.error);if(alive){add(tracker.current.receive(d.events,d.serverNow));setReady(true);}}}catch(e){if(alive&&e.message==='REACTIONS_SETUP_REQUIRED')setError(th?'ต้องติดตั้ง SQL สำหรับ Emojis ก่อน':'Install the Emojis SQL migration first.');}finally{if(alive)timer=setTimeout(poll,1000);}}
  const visibility=()=>{if(document.hidden){tracker.current.reset();setActive([]);setReady(false);}};document.addEventListener('visibilitychange',visibility);poll();
  const tick=setInterval(()=>{const n=Date.now();setNow(n);setActive(old=>old.some(e=>e.expires<=n)?old.filter(e=>e.expires>n):old);},150);
  return()=>{alive=false;mounted.current=false;abort.abort();clearTimeout(timer);clearInterval(tick);document.removeEventListener('visibilitychange',visibility);};
 },[roomId]);
 useEffect(()=>{if(!open)return;box.current?.querySelector('.emoji-grid button')?.focus();const outside=e=>{if(!box.current?.contains(e.target))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
 async function send(emoji){if(locked.current||Date.now()<until)return;locked.current=true;setBusy(true);setError('');setOpen(false);trigger.current?.focus();try{
  const r=await fetch('/api/reactions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:await authorization()},body:JSON.stringify({room:roomId,emoji})});const d=await r.json();if(!mounted.current)return;
  if(!r.ok){if(r.status===429)setUntil(Date.now()+3000);throw Error(d.error);}
  const fresh=tracker.current.receive([d.event],d.serverNow);tracker.current.mark(d.event.id);add(fresh);setUntil(Date.now()+3000);
 }catch(e){if(mounted.current)setError(e.message==='EMOJI_COOLDOWN'?(th?'รอ 3 วินาทีก่อนส่งอีกครั้ง':'Wait 3 seconds before sending again.'):(th?'ส่งไม่สำเร็จ กรุณาลองอีกครั้ง':'Could not send. Please retry.'));}finally{locked.current=false;if(mounted.current)setBusy(false);}}
 return <div className="room-emojis" ref={box} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}}}>
 {canSend&&<div className="emoji-tools"><button ref={trigger} type="button" className="btn secondary" data-event-sound aria-expanded={open} aria-label="Emojis" disabled={busy||!ready||now<until} onClick={()=>setOpen(!open)}>😊 Emojis{now<until?' · '+Math.ceil((until-now)/1000):''}</button>
 {open&&<div className="emoji-picker" role="group" aria-label={th?'เลือก Emojis':'Choose Emojis'}><div className="emoji-grid">{EMOJIS.map(([id,thai,english])=><button type="button" key={id} data-event-sound aria-label={th?thai:english} onClick={()=>send(id)}><img src={emojiSrc(id)} alt=""/></button>)}</div></div>}</div>}
 {error&&canSend&&<small className="emoji-error" role="status">{error}</small>}
 <div className="emoji-stage" aria-live="polite" aria-atomic="false">{active.map(e=><div className="emoji-bubble" key={e.id}><img className={'emoji-motion emoji-'+e.emoji} src={emojiSrc(e.emoji)} alt={EMOJIS.find(x=>x[0]===e.emoji)?.[th?1:2]||''}/><span>{e.name}</span></div>)}</div>
 </div>;
}

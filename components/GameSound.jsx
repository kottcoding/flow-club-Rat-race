"use client";
import {useEffect,useRef,useState} from 'react';
import {createSoundTracker,configureSound,unlockSound,playSounds,stopSounds,prepareButtonSound,playButtonSound,stopButtonSound,isSoundButton} from '../lib/game-sounds.mjs';
export function useGameSound(game,revision){
 const tracker=useRef(null),room=useRef(null);
 if(!tracker.current)tracker.current=createSoundTracker();
 useEffect(()=>{if(room.current!==game?.id){stopSounds();room.current=game?.id;}playSounds(tracker.current(game,revision));},[game,revision]);
 useEffect(()=>()=>stopSounds(),[]);
}
export default function GameSound({lang}){
 const [on,setOn]=useState(true),[level,setLevel]=useState(22);const menu=useRef(null);
 useEffect(()=>{const close=e=>{if(menu.current?.open&&!menu.current.contains(e.target))menu.current.open=false;};const escape=e=>{if(e.key==='Escape'&&menu.current?.open){menu.current.open=false;menu.current.querySelector('summary')?.focus();}};document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape);};},[]);
 useEffect(()=>{
  let enabled=true,value=22;try{enabled=localStorage.getItem('flow-sound')!=='off';const raw=localStorage.getItem('flow-sound-volume');if(raw!==null&&Number.isFinite(Number(raw)))value=Math.max(0,Math.min(50,Number(raw)));}catch{}
  setOn(enabled);setLevel(value);configureSound(enabled,value/100);
  prepareButtonSound();
  const click=e=>{if(isSoundButton(e.target))playButtonSound();};
  document.addEventListener('click',click,true);
  const unlock=()=>unlockSound(),hide=()=>{if(document.hidden){stopSounds();stopButtonSound();}};
  window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',hide);
  return()=>{document.removeEventListener('click',click,true);stopButtonSound();window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',hide);stopSounds();};
 },[]);
 const th=lang==='th';
 function toggle(){const next=!on;setOn(next);configureSound(next,level/100);try{localStorage.setItem('flow-sound',next?'on':'off');}catch{}if(next){unlockSound();playButtonSound();}}
 return <details ref={menu} className="sound-menu"><summary className="sound-trigger" aria-label={th?'ตั้งค่าเสียง':'Sound settings'}>{on?'🔊':'🔇'} {th?'เสียง':'Sound'}</summary><div className="sound-panel"><button data-sound-toggle className="btn secondary" aria-pressed={on} onClick={toggle}>{on?(th?'ปิดเสียง':'Mute'):(th?'เปิดเสียง':'Enable sound')}</button><label style={{display:'block',marginTop:12}}>{th?'ระดับเสียง':'Volume'} {level}%<input aria-label={th?'ระดับเสียง':'Volume'} type="range" min="0" max="50" value={level} onChange={e=>{const v=Number(e.target.value);setLevel(v);configureSound(on,v/100);try{localStorage.setItem('flow-sound-volume',String(v));}catch{}}}/></label><small>{th?'เสียงเริ่มทำงานหลังแตะหน้าจอ ไม่เล่นเสียงย้อนหลัง':'Sound starts after interaction. No replay of past events.'}</small></div></details>;
}

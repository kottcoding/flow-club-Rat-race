'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {bangkokDate,resolveTheme,THEMES,STATIC_THEMES} from '../lib/atmosphere.mjs';

export default function Atmosphere({lang,playing=false,busy=false}){
 const th=lang==='th',menu=useRef(null);
 const [ready,setReady]=useState(false),[date,setDate]=useState(''),[mode,setMode]=useState('auto'),[motion,setMotion]=useState('light'),[paused,setPaused]=useState(false);
 const id=date?resolveTheme(date,mode):'original',theme=THEMES[id];
 useEffect(()=>{
  try{const saved=JSON.parse(localStorage.getItem('flow-atmosphere-v1')||'{}');if(['auto','season','original'].includes(saved.mode))setMode(saved.mode);if(['off','light'].includes(saved.motion))setMotion(saved.motion);}catch{}
  setDate(bangkokDate());setReady(true);
  const timer=setInterval(()=>setDate(bangkokDate()),30000);
  const close=e=>{if(menu.current?.open&&!menu.current.contains(e.target))menu.current.open=false;};
  const escape=e=>{if(e.key==='Escape'&&menu.current?.open){menu.current.open=false;menu.current.querySelector('summary')?.focus();}};
  document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);
  return()=>{clearInterval(timer);document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape);};
 },[]);
 useEffect(()=>{if(ready)try{localStorage.setItem('flow-atmosphere-v1',JSON.stringify({mode,motion}));}catch{}},[mode,motion,ready]);
 useEffect(()=>{
  const check=()=>{const focus=document.activeElement;setPaused(document.hidden||!!document.querySelector('dialog[open],.modal-backdrop,details[open],.emoji-picker,.emoji-bubble,.escape-toast,.winner-fireworks')||['INPUT','TEXTAREA','SELECT'].includes(focus?.tagName));};
  // Observe child/attribute changes, not animation frames or style changes.
  const observer=new MutationObserver(check);observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
  document.addEventListener('focusin',check);document.addEventListener('focusout',check);document.addEventListener('visibilitychange',check);check();
  return()=>{observer.disconnect();document.removeEventListener('focusin',check);document.removeEventListener('focusout',check);document.removeEventListener('visibilitychange',check);};
 },[]);
 return <><details className="atmosphere-menu" ref={menu}><summary>{th?'❀ บรรยากาศ':'❀ Atmosphere'}</summary><div className="atmosphere-panel">
  <strong>{th?'บรรยากาศของแอป':'App atmosphere'}</strong>
  <label>{th?'ธีมพื้นหลัง':'Background theme'}<select aria-label={th?'ธีมพื้นหลัง':'Background theme'} value={mode} onChange={e=>setMode(e.target.value)}><option value="auto">{th?'อัตโนมัติ · วันสำคัญและฤดูกาล':'Automatic · occasions and seasons'}</option><option value="season">{th?'ฤดูกาลเท่านั้น':'Seasons only'}</option><option value="original">{th?'Flow Club เดิม':'Original Flow Club'}</option></select></label>
  <label>{th?'ภาพเคลื่อนไหว':'Animation'}<select aria-label={th?'ภาพเคลื่อนไหว':'Animation'} value={motion} onChange={e=>setMotion(e.target.value)}><option value="light">{th?'เบา':'Light'}</option><option value="off">{th?'ปิด':'Off'}</option></select></label>
  <p>{th?'ขณะนี้: ':'Now: '}{theme[th?0:1]}</p><small>{th?'ใช้เวลาประเทศไทย · บันทึกการตั้งค่าในเครื่องนี้ · ไม่มีเสียงพื้นหลัง':'Bangkok time · Saved on this device · No ambient sound'}</small>
 </div></details>
 {ready&&createPortal(<div aria-hidden="true" className={'atmosphere-scene '+(playing?'is-playing ':'')+(paused||busy?'is-paused ':'')+(motion==='light'&&!STATIC_THEMES.has(id)?'has-motion':'')} data-theme={id} style={{'--atmo-a':theme[2],'--atmo-b':theme[3],'--atmo-c':theme[4]}}>
  {id!=='original'&&<><img className="atmosphere-art" src={'/atmosphere/'+id+'.svg'} alt=""/><img className="atmosphere-art atmosphere-art-second" src={'/atmosphere/'+id+'.svg'} alt=""/></>}
 </div>,document.body)}
 </>;
}

'use client';
import {API_VERSION} from '../lib/game.mjs';
import {useEffect,useRef} from 'react';
import {cleanDevice,detectDevice,deviceLabel} from '../lib/device.mjs';
export function DeviceBadge({device,lang='th'}){
 const type=cleanDevice(device),label=deviceLabel(type,lang);
 return <small className="device-badge" title={lang==='th'?'ประเภทอุปกรณ์ล่าสุดที่รายงาน · ตรวจจับโดยประมาณ ไม่ใช่สถานะออนไลน์':'Last reported device type · estimated, not online presence'} style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.8em',lineHeight:1.5,whiteSpace:'normal',color:'inherit',opacity:.85}}><span aria-hidden="true">{type==='pc'?'💻':type==='tablet'?'▣':type==='mobile'?'📱':'?'}</span>{label}</small>;
}
export function DeviceReporter({room,player,authorization}){
 const auth=useRef(authorization);auth.current=authorization;
 useEffect(()=>{if(!room||!player)return;let disposed=false,timer,attempts=0;
  async function report(){if(disposed)return;try{const res=await fetch('/api/game',{method:'POST',headers:{Authorization:await auth.current(),'Content-Type':'application/json'},body:JSON.stringify({type:'device',room,clientVersion:API_VERSION,device:detectDevice(navigator)})});if(!res.ok){const d=await res.json();if(['NOT_MEMBER','ROOM_NOT_FOUND','CLIENT_UPDATE_REQUIRED'].includes(d.error))return;throw Error(d.error);}}catch{if(!disposed&&++attempts<3)timer=setTimeout(report,5000);}}
  const visible=()=>{if(!document.hidden){attempts=0;clearTimeout(timer);report();}};
  report();document.addEventListener('visibilitychange',visible);return()=>{disposed=true;clearTimeout(timer);document.removeEventListener('visibilitychange',visible);};
 },[room,player]);return null;
}

"use client";
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
export function TextScale({lang}){
 const [scale,setScale]=useState(1),[mounted,setMounted]=useState(false);
 useEffect(()=>{try{const saved=Number(localStorage.getItem('flow-text-scale'));if([1,2,3,4].includes(saved))setScale(saved);}catch{}setMounted(true);},[]);
 useEffect(()=>{if(!mounted)return;document.documentElement.dataset.readScale=String(scale);document.documentElement.style.removeProperty('--read-scale');try{localStorage.setItem('flow-text-scale',String(scale));}catch{}},[scale,mounted]);
 if(!mounted)return null;
 return createPortal(<aside className="reading-control" aria-label={lang==='th'?'ขยายข้อความและตัวเลข':'Text and number size'}><span>Aa <small>{lang==='th'?'ขนาด':'Size'}</small></span>{[1,2,3,4].map(n=><button type="button" key={n} aria-pressed={scale===n} title={(lang==='th'?'ระดับ ':'Level ')+n+' · '+[12,18,22,28][n-1]+' px'} aria-label={(lang==='th'?'ขนาดระดับ ':'Text level ')+n+' · '+[12,18,22,28][n-1]+' px'} onClick={()=>setScale(n)}>{n}</button>)}</aside>,document.body);
}

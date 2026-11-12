'use client';
import {useEffect,useRef,useState} from 'react';
import {categories,eventCategory,newlyEscaped} from '../lib/event-presentation.mjs';
export function EventFrame({g,lang,children}){
 const key=eventCategory(g),category=categories[key],th=lang==='th';
 return <section className={'card action-panel event-frame event-'+(key||'neutral')}>
  <header className="event-heading"><span className="event-symbol" aria-hidden="true">{category?.[2]||'⚄'}</span><div><small>{th?'เหตุการณ์ในตานี้':'THIS TURN'}</small><h3>{category?category[th?0:1]:(th?'การตัดสินใจครั้งต่อไป':'Your next move')}</h3></div><div className="dice" aria-label={th?'ลูกเต๋า':'Dice'}>{g.dice?.map((n,i)=><span key={i}>{['','⚀','⚁','⚂','⚃','⚄','⚅'][n]}</span>)}</div></header>
  <div className="event-body">{key==='downsize'&&<p className="event-explanation">{th?'บริษัทลดพนักงาน: จ่ายค่าใช้จ่าย 1 เดือน และพัก 2 ตาถัดไป ดูยอดที่จ่ายจริงในแท็บการคำนวณ':'Company downsizing: pay one month of expenses and skip your next 2 turns. See Calculations for the actual payment.'}</p>}{key==='pay'&&<p className="event-explanation">{th?'รับเงินเดือน: เงินสดเพิ่มตามรายได้รวม − ค่าใช้จ่ายรวม ดูยอดจริงในแท็บการคำนวณ':'Pay Day: cash changes by total income minus total expenses. See Calculations for the actual amount.'}</p>}{children}</div>
 </section>;
}
export function FastTrackCelebration({g,lang}){
 const previous=useRef(null),timer=useRef(null);const [names,setNames]=useState([]);
 useEffect(()=>{
  const escaped=newlyEscaped(previous.current,g);
  if(previous.current?.id!==g.id){clearTimeout(timer.current);setNames([]);}
  previous.current={id:g.id,players:g.players.map(({id,track})=>({id,track}))};
  if(escaped.length){clearTimeout(timer.current);setNames(escaped.map(p=>p.name));timer.current=setTimeout(()=>setNames([]),3600);}
 },[g]);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 return <div className="escape-announcer" role="status" aria-live="polite">{names.length>0&&<div className="escape-toast"><span aria-hidden="true">✦ ★ ✦</span><strong>{names.join(', ')}</strong><div>{lang==='th'?'ยินดีด้วย! เข้าสู่ Fast Track แล้ว':'Congratulations! Welcome to the Fast Track'}</div><div className="escape-confetti" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{'--i':i}}/>)}</div></div>}</div>;
}

export function WinnerCelebration({g,lang}){
 const th=lang==='th',winner=g.status==='finished'&&g.players.find(p=>p.id===g.winner);
 const [show,setShow]=useState(false),[run,setRun]=useState(0);
 useEffect(()=>{
  setShow(false);
  if(!winner)return;
  const key='flow-winner:'+g.id+':'+winner.id;
  try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch{}
  setShow(true);
 },[g.id,winner?.id]);
 useEffect(()=>{if(!show)return;const timer=setTimeout(()=>setShow(false),8500);return()=>clearTimeout(timer);},[show,run]);
 if(!winner)return g.status==='finished'?<section className="winner" role="status">{th?'จบการแข่งขัน — ผู้เล่นเหลือไม่ถึง 2 คน ไม่มีผู้ชนะ':'Game ended — fewer than two players remain. No winner.'}</section>:null;
 return <><section className="winner winner-banner" role="status"><span className="winner-trophy" aria-hidden="true">🏆</span><div><small>{th?'ยินดีกับผู้ชนะ · DREAM ACHIEVED':'CONGRATULATIONS · DREAM ACHIEVED'}</small><strong>{winner.name} — {th?'ทำความฝันสำเร็จแล้ว!':'Dream achieved!'}</strong><p>{th?'จากก้าวแรก สู่ความฝันที่เป็นจริง':'From the first step to a dream come true'}</p></div><button className="btn secondary" onClick={()=>{setRun(n=>n+1);setShow(true);}}>{th?'ฉลองอีกครั้ง ✨':'Celebrate again ✨'}</button></section>
 {show&&<div className="winner-fireworks" key={run}><button className="fireworks-close" onClick={()=>setShow(false)} aria-label={th?'ปิดพลุเฉลิมฉลอง':'Dismiss fireworks'}>✕</button><svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{Array.from({length:10},(_,i)=>{const x=[180,760,490,280,840,100,650,400,900,550][i],y=[200,250,130,440,480,580,390,610,140,520][i];return <g key={i} transform={`translate(${x} ${y})`}>{Array.from({length:24},(_,j)=>{const a=j*Math.PI/12,r=100+(j%3)*22;return <circle key={j} className="firework-spark" r={j%2?3:4} fill={['#ffcf57','#fc7fc5','#7ee5d3','#a49aff','#7ccfff'][i%5]} style={{'--dx':Math.cos(a)*r+'px','--dy':Math.sin(a)*r+'px','--delay':i*.55+'s'}}/>;})}</g>;})}</svg><div className="fireworks-message" aria-hidden="true">✨ {th?'ยินดีด้วย!':'Congratulations!'} ✨</div></div>}</>;
}

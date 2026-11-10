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

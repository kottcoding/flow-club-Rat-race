'use client';
import React,{useEffect,useRef,useState} from 'react';
import {DeviceBadge} from './DeviceBadge';
import {deviceLabel,detectDevice} from '../lib/device.mjs';
import {Dialog} from './RoomAccess';
import {createPortal} from 'react-dom';
import {sanitizeScreen} from '../lib/teaching.mjs';
import {FinancialPanel,DataLibrary} from './GameData';
import PhotoEvent from './PhotoEvent';
import {dreamFor} from '../lib/game.mjs';
const messages={TEACHING_SETUP_REQUIRED:'กรุณาติดตั้ง db/004-teaching.sql ก่อนเปิดการสอน',MASTER_REQUIRED:'สิทธิ์ Master ถูกถอนแล้ว',TEACHING_OFF:'ปิดการสอนแล้ว',TEACHING_CHANGED:'สิทธิ์การสอนเปลี่ยนแล้ว กรุณาเข้าโหมดใหม่',WATCH_EXPIRED:'การติดตามหมดเวลา กรุณาเข้าโหมดใหม่'};
function captureScreen(lang){
 const privateView=!!document.querySelector('.account-dialog[open],.master-workspace');
 let count=0;
 function walk(el){
  if(++count>1700)return null;
  if(el.nodeType===3)return el.textContent;
  if(el.nodeType!==1||['SCRIPT','STYLE','SVG'].includes(el.tagName)||el.matches('input[type=password]'))return null;
  const tag=el.tagName.toLowerCase();
  return {tag,cls:typeof el.className==='string'?el.className:'',src:el.getAttribute('src'),value:['input','select','option'].includes(tag)?el.value:undefined,open:el.open,focus:el===document.activeElement,children:[...el.childNodes].map(walk).filter(x=>x!==null)};
 }
 const page=document.querySelector('.game-page');
 const select=s=>page?.querySelector(s);
 const focus=document.activeElement;
 const sections=[['bank',select('.bank')],['statement',select('.statement')],['dream',select('.dream-note')],['action',select('.action-panel')]];
 let section=sections.find(([,el])=>el?.contains(focus))?.[0];
 if(!section)section=sections.filter(([,el])=>el&&el.getBoundingClientRect().bottom>0).sort((a,b)=>Math.abs(a[1].getBoundingClientRect().top-100)-Math.abs(b[1].getBoundingClientRect().top-100))[0]?.[0]||'action';
 const library=document.querySelector('.data-library');if(library)section='library';
 return sanitizeScreen({private:privateView,section:privateView?'private':section,width:innerWidth,scale:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reading-add'))||0,lang,
  panels:privateView?{}:{action:select('.action-panel')?walk(select('.action-panel')):null,finance:select('.finance')?walk(select('.finance')):null,library:library?walk(library):null}});
}
function ScreenNode({node}){
 if(!node)return null;if(typeof node==='string')return node;
 const props={className:(node.cls||'')+(node.focus?' master-field-focus':''), 'data-follow-focus':node.focus?'true':undefined};
 if(node.tag==='input')return <input {...props} readOnly value={node.value||''} tabIndex={-1}/>;
 if(node.tag==='select')return <select {...props} disabled value={node.value||''}>{node.children?.map((c,i)=><ScreenNode key={i} node={c}/>)}</select>;
 if(node.tag==='option')props.value=node.value;
 if(node.tag==='button'){props.disabled=true;props.type='button';props.title='Master · ดูอย่างเดียว';}
 if(node.tag==='details')props.open=node.open;
 if(node.tag==='img')return node.src?<img {...props} src={node.src} alt="" loading="lazy"/>:null;
 if(node.tag==='br')return <br/>;
 return React.createElement(node.tag,props,node.children?.map((c,i)=><ScreenNode key={i} node={c}/>));
}
export default function MasterMode({g,me,canManage,lang,authorization,action,onViewing,Board}){
 const [entryAdvice,setEntryAdvice]=useState(null);const [library,setLibrary]=useState(false);const [target,setTarget]=useState(''),[feed,setFeed]=useState(null),[watchers,setWatchers]=useState([]),[error,setError]=useState(''),[follow,setFollow]=useState(true),[replica,setReplica]=useState(false),[fit,setFit]=useState(false),[pending,setPending]=useState(false);
 const stopping=useRef(false),inFlight=useRef(null);
 const latest=useRef({}),scroll=useRef(null),lastFollow=useRef('');latest.current={authorization,g,me,target};
 const enabled=!!g.teaching?.enabled,allowed=enabled&&(canManage||(g.teaching?.masterIds||[]).includes(me.id)),th=lang==='th';
 const L=(a,b)=>th?a:b;
 async function request(body,query=''){
  const res=await fetch('/api/teaching'+query,{method:body?'POST':'GET',headers:{Authorization:await latest.current.authorization(),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const d=await res.json();if(!res.ok)throw Error(d.error);return d;
 }
 async function stop(){stopping.current=true;setPending(true);try{await inFlight.current;await request({type:'stop',room:g.id});setTarget('');setFeed(null);onViewing(false);setError('');}catch(e){setError(messages[e.message]||e.message);}finally{stopping.current=false;setPending(false);}}
 useEffect(()=>{if(!allowed||!g.players.some(p=>p.id===target)){setTarget('');setFeed(null);onViewing(false);}},[allowed,g.players.map(p=>p.id).join(','),g.teaching?.epoch]);
 useEffect(()=>{if(!target)return;setFeed(null);setFollow(true);lastFollow.current='';onViewing(true);let alive=true,timer;
  async function work(){try{if(!document.hidden&&!stopping.current){await request({type:'watch',room:g.id,target,epoch:g.teaching.epoch});const d=await request(null,'?room='+encodeURIComponent(g.id)+'&target='+encodeURIComponent(target));if(alive){setFeed(d);setError('');}}}catch(e){if(alive){setFeed(null);setError(messages[e.message]||e.message);if(['MASTER_REQUIRED','NOT_MEMBER','TEACHING_OFF','TEACHING_CHANGED','PLAYER_NOT_FOUND'].includes(e.message)){setTarget('');onViewing(false);}}}finally{if(alive)timer=setTimeout(poll,2000);}}
  function poll(){if(stopping.current)return;inFlight.current=work();}
  poll();return()=>{alive=false;clearTimeout(timer);};
 },[target,g.id,g.teaching?.epoch]);
 // No publisher or presence polling while room teaching is off.
 useEffect(()=>{if(!enabled||g.status==='lobby'){setWatchers([]);return;}let alive=true,timer,last='',lastSent=0,delay=3000;
  async function tick(){try{if(!document.hidden){const interest=await request(null,'?room='+encodeURIComponent(g.id));if(!alive)return;setWatchers(interest.watchers||[]);delay=interest.watchers?.length?750:3000;
   if(interest.watchers?.length){const screen=captureScreen(lang),encoded=JSON.stringify(screen);if(encoded!==last||Date.now()-lastSent>7000){await request({type:'screen',room:g.id,epoch:g.teaching.epoch,screen});last=encoded;lastSent=Date.now();}}
  }}catch(e){if(alive)setError(messages[e.message]||e.message);}finally{if(alive)timer=setTimeout(tick,delay);}}
  tick();return()=>{alive=false;clearTimeout(timer);};
 },[enabled,g.id,g.teaching?.epoch,g.status,lang]);
 useEffect(()=>{if(!target)return;const game=document.querySelector('.app');if(game)game.inert=true;return()=>{if(game)game.inert=false;};},[target]);
 useEffect(()=>{if(!follow||!feed?.screen)return;const s=feed.screen;function path(n,p=''){if(!n||typeof n==='string')return '';if(n.focus)return p;return (n.children||[]).map((x,i)=>path(x,p+'.'+i)).find(Boolean)||'';}const key=target+':'+s.section+':'+Object.entries(s.panels).map(([k,v])=>path(v,k)).join('|');
  if(lastFollow.current===key)return;lastFollow.current=key;
  const selector=s.section==='bank'?'.bank':s.section==='statement'?'.statement':s.section==='dream'?'.dream-note':s.section==='library'?'.data-library':'.action-panel';
  (scroll.current?.querySelector('[data-follow-focus=true]')||scroll.current?.querySelector(selector))?.scrollIntoView({block:'start',behavior:'instant'});
 },[feed,follow,target]);
 async function manage(a){setPending(true);try{const result=await action(a);if(!result)throw Error('บันทึกไม่สำเร็จ ตรวจการติดตั้ง SQL และลองใหม่');setError('');}catch(e){setError(messages[e.message]||e.message);}finally{setPending(false);}}
 const p=feed?.room?.players.find(p=>p.id===target),screen=feed?.screen;
 const teachers=g.players.filter(p=>p.id===g.teaching?.creatorId||(g.teaching?.masterIds||[]).includes(p.id));
 function enterMaster(){if(!allowed||g.status==='lobby')return;setEntryAdvice(null);setTarget(g.players.find(p=>p.id!==me.id)?.id||'');}
 function requestEntry(){const device=detectDevice(navigator);if(device==='mobile'||device==='unknown')setEntryAdvice(device);else enterMaster();}
 return <section className="teaching-bar">
  {entryAdvice&&allowed&&g.status!=='lobby'&&createPortal(<Dialog title={L('แนะนำก่อนเข้าโหมด Master','Before entering Master mode')} onClose={()=>setEntryAdvice(null)}>
   <p>{entryAdvice==='unknown'?L('ไม่สามารถระบุประเภทอุปกรณ์ของคุณได้ โหมด Master เหมาะกับ PC หรือแท็บเล็ต/iPad ที่มีจอใหญ่','Your device type could not be identified. Master mode works best on a PC or a large-screen tablet/iPad.'):L('โหมด Master เหมาะกับจอใหญ่ บนมือถือแนะนำให้หมุนจอแนวนอน','Master mode works best on a large screen. On a phone, landscape orientation is recommended.')}</p>
   <p>{L('คุณยังเข้าใช้งานต่อได้ โดยเลือก “ปรับตามจอฉัน” เพื่อให้อ่านง่ายขึ้น','You can continue. Use the layout adapted to your screen for easier reading.')}</p>
   <div className="row"><button className="btn" onClick={enterMaster}>{L('เข้าใช้งานต่อ','Continue')}</button><button className="btn secondary" onClick={()=>setEntryAdvice(null)}>{L('ยกเลิก','Cancel')}</button></div>
  </Dialog>,document.body)}
  <div className="row"><strong>🎓 {L('การสอน','Teaching')}: {enabled?L('เปิด','On'):L('ปิด','Off')}</strong>
   {canManage&&<><button className="btn secondary" disabled={pending} onClick={()=>manage({type:'teachingToggle',enabled:!enabled})}>{enabled?L('ปิดการสอน','Turn off'):L('เปิดการสอน','Turn on')}</button><details><summary>{L('จัดการสิทธิ์ Master','Manage Masters')}</summary>{g.players.filter(p=>p.id!==me.id).map(p=><label className="master-grant" key={p.id}><input type="checkbox" disabled={pending} checked={(g.teaching?.masterIds||[]).includes(p.id)} onChange={e=>manage({type:'teachingGrant',playerId:p.id,granted:e.target.checked})}/>{p.name}</label>)}</details></>}
   {allowed&&g.status!=='lobby'&&<button className="btn" disabled={g.players.length<2} onClick={requestEntry}>{L('เข้าโหมด Master','Enter Master mode')}</button>}
  </div>
  {enabled&&<p role="status">{L('ห้องนี้เปิดการสอน · Master ดูข้อมูลเกมและจำนวนที่กำลังกรอกได้ แต่ทำรายการแทนไม่ได้ · ผู้สอน: ','Teaching is on. Masters can view game data and drafts, but cannot act for you. Teachers: ')}{teachers.map(p=>p.name).join(', ')}</p>}
  {!!watchers.length&&<p className="master-watching" role="status">🎓 {watchers.join(', ')} {L('กำลังดูหน้าจอเกมของคุณ','is viewing your game screen')}</p>}
  {error&&<p role="alert">{error}</p>}
  {target&&allowed&&createPortal(<section className="master-workspace" role="dialog" aria-modal="true" aria-label="Master" onKeyDown={e=>{if(e.key==='Escape')stop();if(e.key==='Tab'){const nodes=[...e.currentTarget.querySelectorAll('button:not(:disabled),select:not(:disabled),summary,[tabindex="0"]')];const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}}}>
   <header className="master-toolbar"><strong>🎓 Master · {L('ดูอย่างเดียว','Read only')} — {g.players.find(p=>p.id===target)?.name}</strong><DeviceBadge device={g.players.find(p=>p.id===target)?.device} lang={lang}/><select aria-label={L('ผู้เล่นที่กำลังดู','Player to view')} value={target} onChange={e=>{setFeed(null);setTarget(e.target.value);}}>{g.players.filter(p=>p.id!==me.id).map(p=><option key={p.id} value={p.id}>{p.name} · {deviceLabel(p.device,lang)}</option>)}</select>
    <button className="btn secondary" onClick={()=>{lastFollow.current='';setFollow(!follow);}}>{follow?L('เปิดดูเอง','Explore independently'):L('กลับไปติดตาม','Resume following')}</button>
    <button className="btn secondary" onClick={()=>setReplica(!replica)}>{replica?L('ปรับตามจอฉัน','Fit my layout'):L('จำลองหน้าจอผู้เล่น','Simulate player layout')}</button>
    {replica&&<button className="btn secondary" onClick={()=>setFit(!fit)}>{fit?L('ขนาดอ่านชัด','Readable size'):L('พอดีจอ','Fit width')}</button>}
    <button autoFocus className="btn" disabled={pending} onClick={stop}>{L('กลับไปเล่น','Return to my game')}</button>
    {g.players[g.turn]?.id===me.id&&g.status==='playing'&&<b>{L('ถึงตาของคุณแล้ว','It is your turn')}</b>}
   </header>
   <p className="master-status">{error||(!screen?L('รอหน้าจอผู้เล่น · ผู้เล่นต้องเปิดแอปเวอร์ชันใหม่และอยู่หน้าเกม','Waiting for player screen · player must use the updated app and keep the game visible'):screen.private?L('ผู้เล่นกำลังเปิดเมนูส่วนตัวหรือโหมด Master','Player is in a private menu or Master mode'):L('กำลังดูส่วน: ','Viewing: ')+({action:'การ์ด / การตัดสินใจ',bank:'ธนาคาร',statement:'งบการเงิน',dream:'ความฝัน',library:'คลังการ์ด'}[screen.section]||screen.section))} {feed?.updated&&' · '+L('อัปเดตล่าสุด ','Updated ')+new Date(feed.updated).toLocaleTimeString(th?'th-TH':'en-GB')} {replica&&screen&&` · ${screen.width}px · `+L('หน้าจอจำลอง ไม่ใช่ภาพหน้าจอจริง','Simulated layout, not a screenshot')}</p>
   <div className="master-scroll" ref={scroll} onWheel={()=>setFollow(false)} onTouchMove={()=>setFollow(false)}>
    {p&&(!follow||screen&&!screen.private)&&<div data-follow-section={follow&&!replica?screen?.section:''} className={'master-canvas '+(replica?'replica '+((screen?.width||1024)<=760?'source-narrow':''):'adaptive')} style={replica?{width:screen?.width||1024,'--reading-add':(screen?.scale||0)+'px',zoom:fit?Math.min(1,(typeof window!=='undefined'?window.innerWidth-32:1024)/(screen?.width||1024)):1}:undefined}>
     {follow?<><div className="master-board"><Board players={feed.room.players} active={feed.room.players[feed.room.turn]?.id} lang={screen.lang} game={{...feed.room,status:'master'}}/></div><div className="master-action"><ScreenNode node={screen.panels.action}/></div><div className="master-finance"><ScreenNode node={screen.panels.finance}/></div>{screen.panels.library&&<div className="master-library"><ScreenNode node={screen.panels.library}/></div>}</>:<><div className="master-board"><Board players={feed.room.players} active={feed.room.players[feed.room.turn]?.id} lang={lang} game={{...feed.room,status:'master'}}/></div><div className="master-action"><fieldset disabled><legend>{L('การ์ด · ดูอย่างเดียว','Card · read only')}</legend>{feed.room.event?.source==='card-photo'?<PhotoEvent g={feed.room} me={p} lang={lang} busy action={()=>{}}/>:<p>{L('ดูข้อมูลล่าสุดจากกระดาน หรือกลับไปติดตามเพื่อดูปุ่มของผู้เล่น','See the board, or resume following to view player controls.')}</p>}</fieldset></div><div className="master-finance"><FinancialPanel key={target} g={feed.room} me={p} lang={lang} readOnly action={()=>{}} dream={dreamFor(feed.room,p.dream)} onLibrary={()=>setLibrary(true)}/></div></>}
    </div>}
   </div>
  {library&&<DataLibrary kind="dreams" lang={lang} onClose={()=>setLibrary(false)}/>}</section>,document.body)}
 </section>;
}

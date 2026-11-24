'use client';
import {CardReference} from './PhotoEvent';
import {formatNumber} from '../lib/number-format.mjs';
export default function FastBusinessEvent({g,me,lang,busy,action,readOnly=false}){
 const e=g.event,L=(th,en)=>lang==='th'?th:en,T=a=>a?.[lang==='th'?0:1],owner=g.players[g.turn],mine=!!me?.id&&owner?.id===me.id;
 const showControls=mine&&g.status==='playing',disabled=busy||readOnly||!mine||g.status!=='playing',m=n=>'฿'+formatNumber(n);
 return <div className="photo-event"><div className="formula">Fast Track · {L('ช่อง','Space')} {e.spaceIndex+1}</div><h3>{T(e.name)}</h3><CardReference card={e} lang={lang}/>
 <div className="deal-stats"><div><small>{L('เงินลงทุน','Investment')}</small><strong>{m(e.cost)}</strong></div><div><small>{e.risk?.kind==='ipo'?L('เงินขายหุ้นเมื่อสำเร็จ','Sale proceeds on success'):L('กระแสเงินสดต่อเดือน','Monthly cash flow')}</small><strong>{m(e.risk?.payout||e.flow)}</strong></div></div>
 {e.risk?.kind==='ipo'&&<p>{formatNumber(e.risk.shares)} {L('หุ้น × ราคาขาย','shares × sale price')} {m(e.risk.price)} = {m(e.risk.payout)}</p>}
 {showControls&&g.phase==='decision'&&<div className="row"><button className="btn" disabled={disabled||me.cash<e.cost} data-event-sound onClick={()=>action({type:'buy'})}>{e.risk?L('จ่ายเงินลงทุน','Pay investment'):L('ซื้อธุรกิจ','Buy business')}</button><button className="btn secondary" disabled={disabled} onClick={()=>action({type:'pass'})}>{L('ผ่าน','Pass')}</button>{mine&&me.cash<e.cost&&<p>{L('เงินสดไม่พอ','Not enough cash')}</p>}</div>}
 {g.phase==='businessRoll'&&<><p>{L('ชำระเงินลงทุนแล้ว ทอย 1 ลูกเพื่อรับผล ไม่เดินตัวผู้เล่น','Investment paid. Roll one die for the result; your token stays on this space.')}</p>{showControls&&<button className="btn" disabled={disabled} data-event-sound onClick={()=>action({type:'businessRoll'})}>{L('ทอยลูกเต๋าธุรกิจ','Roll business die')} ⚄</button>}</>}
 {e.result&&<div className="formula" role="status">{L('ทอยได้','Rolled')} <b>{e.result.die}</b> · {e.result.success?L('สำเร็จ','Success'):L('ไม่สำเร็จ · เงินลงทุนไม่คืน','No return · Investment not refunded')}<br/>{L('รับเงินสด','Cash received')} {m(e.result.payout)} · {L('รายได้เพิ่มต่อเดือน','Monthly income added')} {m(e.result.income)}</div>}
 {showControls&&g.phase==='end'&&<button className="btn" disabled={disabled} onClick={()=>action({type:'end'})}>{L('จบตา →','End turn →')}</button>}
 {!mine&&g.status==='playing'&&<div className="formula" role="status" style={{marginTop:20,borderLeft:'3px solid #6ba880',padding:'14px 16px'}}><strong>{L('ตาของ ','Current turn: ')}{owner?.name||L('ผู้เล่น','player')}</strong><div>{g.phase==='decision'?L('กำลังรอตัดสินใจซื้อธุรกิจหรือผ่าน','Waiting for this player to buy the business or pass'):g.phase==='businessRoll'?L('กำลังรอทอยลูกเต๋าธุรกิจ','Waiting for this player to roll the business die'):L('กำลังรอจบตา','Waiting for this player to end the turn')}</div><small>{L('เฉพาะเจ้าของตาเท่านั้นที่ทำรายการนี้ได้','Only the current player can perform this action.')}</small></div>}
 </div>;
}

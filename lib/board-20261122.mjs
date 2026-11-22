// Versioned transcription of the supplied board and 48 close-up photographs.
// Never infer this version for persisted rooms: their positions use the old route.
import {dreams as previousDreams} from './thai-pack.mjs';
export const BOARD_VERSION='thai-board-20261122';
export const hasPhotoBoard=g=>g?.boardVersion===BOARD_VERSION&&g.ruleset!=='legacy';
export const photoInner=['deal','doodad','deal','charity','deal','pay','deal','market','deal','doodad','deal','baby','deal','pay','deal','market','deal','doodad','deal','downsize','deal','pay','deal','market'];
export const innerPhotos=['180043','180053','180115','180122'].map(id=>`/board-20261122/${id}.webp`);
const corrections={
 'art-gallery':{cost:1750000,description:['ให้เยาวชนแสดงผลงานและได้รับคำแนะนำจากศิลปินที่มีชื่อเสียง','Give young artists exhibition space and guidance from established artists.']},
 'named-park':{name:['สร้างสวนสาธารณะพร้อมสกายวอล์ค','Build a public park with a skywalk'],description:['สร้างสวนสาธารณะพร้อมสกายวอล์ค','Build a public park with a skywalk.']},
 'chamber-dinner':{name:['ทานอาหารค่ำกับนักร้อง / วงบอยแบนด์วงโปรด','Dinner with your favourite singer or boy band'],description:['ทานอาหารค่ำกับนักร้องหรือวงบอยแบนด์วงโปรด','Enjoy dinner with your favourite singer or boy band.']},
 'urban-forest':{name:['สร้างสวนป่าปลอดสารพิษกลางเมือง','Create a chemical-free urban forest']},
 'football-season':{description:['คุณและเพื่อนบินไปเชียร์ฟุตบอลทีมโปรดถึงขอบสนาม','Fly with friends to support your favourite team at the stadium.']},
 'forest':{description:['หยุดการทำลายป่าด้วยการซื้อพื้นที่ป่าและบริจาคเป็นสวนสาธารณะ','Buy forest land and donate it as a public park.']},
 'private-jet':{description:['เดินทางด้วยเครื่องบินเจ็ตส่วนตัวเป็นเวลา 1 ปี','Travel by private jet for one year.']},
 'private-cabin':{description:['พักบ้านตากอากาศส่วนตัวพร้อมสิ่งอำนวยความสะดวกครบครันเป็นเวลา 6 เดือน','Stay in a fully equipped private holiday home for six months.']},
 'south-sea':{description:['พักผ่อนบนหมู่เกาะทะเลใต้เป็นเวลา 2 เดือน','Spend two months on the South Sea islands.']},
 'world-golf':{description:['เล่นกอล์ฟในสนามชั้นนำ 50 แห่งทั่วโลก เดินทางด้วยเครื่องบินชั้นหนึ่ง','Play 50 leading golf courses worldwide, travelling first class.']},
 'mediterranean':{description:['ล่องเรือยอชต์ส่วนตัวเลียบชายฝั่งอิตาลี ฝรั่งเศส และกรีซเป็นเวลา 1 เดือน','Cruise the Italian, French and Greek coasts for one month.']},
};
export const photoDreams=previousDreams.map(d=>({...d,...corrections[d.id]}));
const D=id=>({type:'dream',dream:id,...photoDreams.find(d=>d.id===id)});
const B=(th,en,cost,flow,risk)=>({type:'business',name:[th,en],cost,flow,...(risk?{risk}:{}),description:risk?
 [`จ่ายเงินลงทุนก่อนทอยลูกเต๋า 1 ลูก ได้ ${risk.min}–6 แต้ม ${risk.kind==='ipo'?'รับเงินขายหุ้นทันที 5,000,000 บาท ไม่มีรายได้รายเดือน':`เพิ่มรายได้ ${flow.toLocaleString('en-US')} บาทต่อเดือน`} หากไม่สำเร็จได้รับ 0 บาท เงินลงทุนไม่คืน`,
 `Pay the investment, then roll one die. A result of ${risk.min}–6 ${risk.kind==='ipo'?'pays 5,000,000 immediately, with no monthly income':`adds ${flow.toLocaleString('en-US')} monthly income`}. Failure returns zero; the investment is not refunded.`]:
 [`เงินดาวน์ ${cost.toLocaleString('en-US')} บาท เพิ่มกระแสเงินสด ${flow.toLocaleString('en-US')} บาทต่อเดือน`,`Down payment ${cost.toLocaleString('en-US')}; monthly cash flow +${flow.toLocaleString('en-US')}.`]});
const E=(type,th,en,descriptionTh,descriptionEn)=>({type,name:[th,en],description:[descriptionTh,descriptionEn]});
const cashday=()=>E('cashday','รับกระแสเงินสด','CASHFLOW Day','ผ่านหรือตกช่องนี้รับ CASHFLOW Day ปัจจุบันโดยอัตโนมัติ','Automatically collect your current CASHFLOW Day income when passing or landing.');
const photos=['180148','180157','180205','180208','180214','180219','180225','180230','180234','180238','180318','180325','180331','180335','180338','180347','180351','180357','180404','180411','180418','180423','180427','180433','180439','180442','180448','180452','180455','180459','180501','180513','180520','180523','180528','180533','180538','180545','180552','180556','180605','180614','180617','180621','180625','180632','180642','180646'];
export const photoSpaces=[
 E('lawsuit','ถูกฟ้อง','Lawsuit','จ่ายครึ่งหนึ่งของเงินสดที่มีอยู่','Pay half of your cash.'),D('forest'),B('สวนอาหาร','Garden restaurant',3000000,140000),D('football-season'),B('ร้านแฮมเบอร์เกอร์','Hamburger restaurant',3000000,95000),D('ancient-civilizations'),B('ศูนย์อาหารจานด่วน (3 สาขา)','Fast-food centres (3 branches)',1500000,50000),D('kids-market'),
 {...E('charity','บริจาค','Charity','บริจาค 1,000,000 บาท เลือกทอย 1–3 ลูกได้ตลอดเกม','Donate 1,000,000 to choose 1–3 dice for the rest of the game.'),cost:1000000},B('ติดตั้งและซ่อมเครื่องปรับอากาศ','Air-conditioner installation and repair',2000000,100000),D('yacht-racing'),B('ผลิตอะไหล่รถบรรทุก','Truck parts manufacturing',1500000,50000),cashday(),D('film-festival'),B('ซื้อเหมืองทอง','Gold mine',1500000,250000,{kind:'income',min:3}),D('private-cabin'),
 E('audit','ตรวจสอบภาษี','Tax audit','จ่ายภาษีย้อนหลังและค่าปรับครึ่งหนึ่งของเงินสดที่มีอยู่','Pay half of your cash in back taxes and penalties.'),D('named-park'),B('แฟรนไชส์ไก่ทอด (2 สาขา)','Fried chicken franchise (2 branches)',3000000,100000),D('senate'),B('ร้านสปา (3 สาขา)','Spas (3 branches)',2500000,100000),D('foundation'),B('ศูนย์ซ่อมรถยนต์','Auto repair centre',1500000,60000),D('alpine-ski'),
 B('ขุดน้ำมันในรัสเซีย','Russian oil drilling',3000000,700000,{kind:'income',min:4}),D('chamber-dinner'),B('ร้านขายเสื้อผ้า (5 สาขา)','Clothing shops (5 branches)',2000000,80000),D('medical-research'),cashday(),D('seven-wonders'),B('บริษัทเข้าตลาดหลักทรัพย์ · 25,000 หุ้น','IPO · 25,000 shares',250000,0,{kind:'ipo',min:6,shares:25000,price:200,payout:5000000}),D('thai-conservation'),
 E('divorce','หย่าร้าง','Divorce','เสียเงินสดทั้งหมด','Lose all your cash.'),D('private-jet'),B('อพาร์ทเมนต์ 60 ห้อง','60-unit apartment',3000000,80000),D('world-golf'),B('แฟรนไชส์พิซซ่า (2 สาขา)','Pizza franchise (2 branches)',2250000,70000),D('art-gallery'),B('ร้านมินิมาร์ต','Mini-mart',2000000,60000),D('south-sea'),B('บริษัทเข้าตลาดหลักทรัพย์ · 50,000 หุ้น','IPO · 50,000 shares',500000,0,{kind:'ipo',min:5,shares:50000,price:100,payout:5000000}),D('education-fund'),B('ร้านซักแห้ง','Dry cleaner',1000000,30000),D('mediterranean'),cashday(),D('urban-forest'),B('บริษัทผลิตเครื่องครัว','Kitchenware manufacturer',2250000,500000,{kind:'income',min:4}),D('safari'),
].map((s,index)=>({...s,spaceIndex:index,spaceId:`fast-${index}`,source:'board-photo',photo:`/board-20261122/${photos[index]}.webp`,photoFile:`20261122_${photos[index]}.jpg`}));
for(const d of photoDreams){const s=photoSpaces.find(s=>s.dream===d.id);d.photo=s.photo;d.photoFile=s.photoFile;}
export const photoOuter=photoSpaces.map(s=>s.type==='dream'?'dream:'+s.dream:s.type);
export function fastPoint(i){
 if(i>=1&&i<=14){const a=(40-(i-1)*20)*Math.PI/180;return [600+248*Math.cos(a),500+248*Math.sin(a)];}
 if(i===0)return [866,780];if(i===15)return [246,780];if(i===16)return [158,780];
 if(i<=25)return [70,780-(i-17)*90];
 if(i<=37)return [70+(i-25)*1060/12,60];
 if(i<=45)return [1130,60+(i-37)*90];
 return [1130-(i-45)*88,780];
}

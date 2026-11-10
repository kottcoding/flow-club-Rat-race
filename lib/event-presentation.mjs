export const categories={small:['โอกาสเล็ก','Small Deal','↗'],big:['โอกาสใหญ่','Big Deal','◆'],doodad:['จ่ายซะ','Doodad','−'],charity:['บริจาค','Charity','♡'],downsize:['ตกงาน','Downsized','☂'],pay:['รับเงินเดือน','Pay Day','+'],market:['ซื้อ - ขาย','Market','⇄'],cashday:['รับกระแสเงินสด','Cash Day','+'],deal:['เลือกโอกาส','Choose a Deal','↗'],fast:['ธุรกิจ','Business','◆'],dream:['ความฝัน','Dream','★'],baby:['มีลูก','Baby','♡'],audit:['ตรวจสอบภาษี','Tax Audit','!'],lawsuit:['ถูกฟ้องร้อง','Lawsuit','!'],divorce:['หย่าร้าง','Divorce','!']};
export function eventCategory(g){
 if(g.phase==='roll')return null;
 const e=g.event;
 if(e?.deck&&categories[e.deck])return e.deck;
 if(e?.type&&categories[e.type])return e.type;
 if(e?.type==='quote'||e?.type==='split')return 'market';
 return categories[g.landedTile]?g.landedTile:null;
}
export function newlyEscaped(before,g){
 if(!before||before.id!==g.id)return [];
 return g.players.filter(p=>p.track==='fast'&&before.players.some(old=>old.id===p.id&&old.track==='rat'));
}

// Explicit annual dates: lunar festivals must not repeat by Gregorian date.
export const OCCASIONS = [
 ['2026-11-24','2026-11-24','krathong','วันลอยกระทง','Loy Krathong'],
 ['2026-12-05','2026-12-05','father','วันพ่อแห่งชาติ / วันชาติ','Father’s Day / National Day'],
 ['2026-12-16','2026-12-16','memorial','น้อมรำลึกในพระมหากรุณาธิคุณ','In remembrance'],
 ['2026-12-31','2026-12-31','eve','วันสิ้นปี','New Year’s Eve'],
 ['2027-01-01','2027-01-01','newyear','สวัสดีปีใหม่ 2570','Happy New Year 2027'],
 ['2027-01-09','2027-01-09','children','วันเด็กแห่งชาติ','Children’s Day'],
 ['2027-02-06','2027-02-06','chinese','วันตรุษจีน','Chinese New Year'],
 ['2027-02-21','2027-02-21','makha','วันมาฆบูชา','Makha Bucha'],
 ['2027-04-13','2027-04-15','songkran','เทศกาลสงกรานต์','Songkran'],
 ['2027-05-20','2027-05-20','visakha','วันวิสาขบูชา','Visakha Bucha'],
 ['2027-07-18','2027-07-18','asalha','วันอาสาฬหบูชา','Asalha Bucha'],
 ['2027-07-19','2027-07-19','lent','วันเข้าพรรษา','Buddhist Lent'],
 ['2027-08-12','2027-08-12','mother','วันแม่แห่งชาติ','Mother’s Day'],
 ['2027-08-16','2027-08-16','sartchin','วันสารทจีน','Sart Chin'],
 ['2027-09-30','2027-09-30','sartthai','วันสารทไทย','Sart Thai'],
 ['2027-12-05','2027-12-05','father','วันพ่อแห่งชาติ / วันชาติ','Father’s Day / National Day'],
 ['2027-12-31','2027-12-31','eve','วันสิ้นปี','New Year’s Eve'],
];
export const THEMES = {
 original:['Flow Club','Flow Club','#dceeff','#eee3fa','#ddf4ed'],
 summer:['ฤดูร้อน','Summer','#fff0d6','#ffe8dd','#e4f3ff'],
 rainy:['ฤดูฝน','Rainy season','#e1eff7','#e6e3f6','#dff3e9'],
 cool:['ฤดูหนาว','Cool season','#e6f2ff','#eee9f8','#eaf3ee'],
 krathong:['วันลอยกระทง','Loy Krathong','#e1eafa','#eee4fb','#dceff2'],
 father:['วันพ่อแห่งชาติ / วันชาติ','Father’s Day / National Day','#fff4cf','#fff1df','#eff5e6'],
 memorial:['น้อมรำลึกในพระมหากรุณาธิคุณ','In remembrance','#f1f2f4','#e8ebf0','#f7f5ee'],
 eve:['วันสิ้นปี','New Year’s Eve','#e3e9f6','#f1e9f6','#fff3d6'],
 newyear:['สวัสดีปีใหม่ 2570','Happy New Year 2027','#fff3d6','#e8f5ef','#f7e9f2'],
 children:['วันเด็กแห่งชาติ','Children’s Day','#ffebdf','#e9e4ff','#dff4ee'],
 chinese:['วันตรุษจีน','Chinese New Year','#fbe4e3','#fff0d1','#f5e9de'],
 makha:['วันมาฆบูชา','Makha Bucha','#fff5dc','#f5ece9','#ecf2e5'],
 songkran:['เทศกาลสงกรานต์','Songkran','#dcf3fb','#e4f6ed','#fff3d6'],
 visakha:['วันวิสาขบูชา','Visakha Bucha','#fff4e1','#f8e5ed','#e9f2e3'],
 asalha:['วันอาสาฬหบูชา','Asalha Bucha','#fff1d5','#f4ede2','#eaf1e8'],
 lent:['วันเข้าพรรษา','Buddhist Lent','#fff1db','#e8f0e9','#e5eef7'],
 mother:['วันแม่แห่งชาติ','Mother’s Day','#dfedff','#edf4ff','#f5f7ef'],
 sartchin:['วันสารทจีน','Sart Chin','#fae9e4','#f7efde','#f0e9de'],
 sartthai:['วันสารทไทย','Sart Thai','#edf1d9','#fff1d8','#e6efdc'],
};
export function bangkokDate(now=new Date()) {
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=t=>p.find(x=>x.type===t).value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function seasonFor(date){const md=date.slice(5);return md>='02-15'&&md<='05-14'?'summer':md>='05-15'&&md<='10-14'?'rainy':'cool';}
export function resolveTheme(date,mode='auto'){
 if(mode==='original')return 'original';
 if(mode==='auto'){const event=OCCASIONS.find(([start,end])=>date>=start&&date<=end);if(event)return event[2];}
 return seasonFor(date);
}
export const STATIC_THEMES=new Set(['original','memorial','sartchin']);

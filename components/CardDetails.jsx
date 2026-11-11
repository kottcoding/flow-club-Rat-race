import {stories,printedROI} from '../lib/card-stories.mjs';
export function CardDetails({card:c,lang}){
 const th=lang==='th',L=(a,b)=>th?a:b,s=stories[c.id];if(!s)return null;
 const money=v=>'฿'+new Intl.NumberFormat('en-US').format(v),rows=[],add=(label,value)=>rows.push([label,value]);
 const group=c.id.split('-')[1],roi=printedROI[group]?.[c.cardNumber]??(c.type==='quote'&&c.flow===0?0:null);
 if(c.type==='quote'){add(L('ราคาซื้อขายวันนี้ / หุ้น','Today’s price / share'),money(c.price));add(L('เงินปันผลต่อเดือน / หุ้น','Monthly dividend / share'),money(c.flow));const range={HOME:[50,300],ENT:[100,300],FUND:[100,300],PHARMA:[50,400],BANK:[40000,40000]}[c.symbol];if(range)add(L('ช่วงราคาที่ระบุบนการ์ด','Printed trading range'),range.map(money).join(' – '));}
 else if(group!=='market'&&c.down!==undefined){add(L('ราคาทุน','Cost'),money(c.cost));add(L('เงินดาวน์ / เงินลงทุน','Down payment / investment'),money(c.down));add(L('หนี้ตามการ์ด','Printed debt'),money(c.debt??0));add(L('กระแสเงินสดต่อเดือน','Monthly cash flow'),money(c.flow??0));}
 if(roi!==null)add(L('ROI ที่พิมพ์บนการ์ด','ROI printed on card'),roi+'%');
 if(s.range)add(L('ช่วงราคาขายที่ระบุ','Printed resale range'),Array.isArray(s.range)?s.range.map(money).join(' – '):s.range);
 return <section className="card-transcript"><span className="transcript-label">{L('เรื่องราวและข้อมูลจากการ์ด','Card story and information')}</span><p className="card-story">{s.text[th?0:1]}</p>{rows.length>0&&<dl className="card-facts">{rows.map(([label,v])=><div key={label}><dt>{label}</dt><dd>{v}</dd></div>)}</dl>}{c.down>0&&c.flow!==undefined&&<p className="calculated-roi">{L('แอพคำนวณ ROI','App-calculated ROI')}: {money(c.flow)} × 12 ÷ {money(c.down)} × 100 = {(c.flow*1200/c.down).toFixed(2)}%</p>}</section>;
}

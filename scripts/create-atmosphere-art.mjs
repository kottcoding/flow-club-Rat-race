// Original, code-drawn SVG artwork. Transparent; no external fonts or images.
import {mkdirSync,writeFileSync} from 'node:fs';
const dir=new URL('../public/atmosphere/',import.meta.url);mkdirSync(dir,{recursive:true});
const wrap=(s)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300" fill="none"><g stroke-linecap="round" stroke-linejoin="round">${s}</g></svg>`;
const flower=(x,y,c='#fff',scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${[0,60,120,180,240,300].map(a=>`<ellipse cy="-14" rx="9" ry="17" fill="${c}" stroke="#b4c7ba" stroke-width="1.5" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#eac56d"/></g>`;
const leaf=(x,y)=>`<path d="M${x} ${y}q-45-55 0-75q45 20 0 75" fill="#a4c6a2"/>`;
const lotus=`<path d="M80 238q100-35 200 0q-100 44-200 0" fill="#91b8a4"/><path d="M180 232Q100 225 99 162Q164 157 180 232M180 232Q260 225 261 162Q196 157 180 232" fill="#e9b7c5" stroke="#bf8d9f" stroke-width="3"/><path d="M180 232Q121 177 180 118Q239 177 180 232" fill="#f6d7df" stroke="#bf8d9f" stroke-width="3"/>`;
const candle=`<rect x="161" y="113" width="38" height="92" rx="9" fill="#e8c57e" stroke="#bea268" stroke-width="3"/><path d="M180 104q-24-18 0-48q24 30 0 48" fill="#e5b95b"/><path d="M145 207h70" stroke="#baa16d" stroke-width="8"/>`;
const waves=`<path d="M20 258q40-18 80 0t80 0t80 0t80 0M5 280q40-18 80 0t80 0t80 0t80 0" stroke="#80b5c6" stroke-width="6"/>`;
const cloud=`<path d="M65 126q-30-35 9-54q12-48 51-24q43-20 51 25q46 12 15 53Z" fill="#f7fbff" stroke="#a5bfd1" stroke-width="3"/>`;
const stars=Array.from({length:6},(_,i)=>{const x=45+i*51,y=50+(i%3)*36;return `<path d="M${x} ${y-10}v20m-10-10h20" stroke="#d7b15a" stroke-width="3"/>`;}).join('');
const balloons=['#eab2c5','#b4a4db','#9bcdbc'].map((c,i)=>`<ellipse cx="${100+i*75}" cy="${100+(i%2)*35}" rx="32" ry="43" fill="${c}"/><path d="M${100+i*75} ${143+(i%2)*35}q-20 50 0 95" stroke="#9991af" stroke-width="2"/>`).join('');
const jasmine=`<path d="M90 260q30-80 180-140" stroke="#99ad9b" stroke-width="6"/>${leaf(127,225)}${flower(170,177)}${flower(222,143,'#fff',.85)}${flower(274,113,'#fff',.7)}`;
const wheat=Array.from({length:4},(_,i)=>{const x=110+i*40;return `<path d="M${x} 270l-15-130" stroke="#b9a267" stroke-width="4"/>${[0,1,2,3].map(j=>`<ellipse cx="${x-26+j*3}" cy="${153+j*22}" rx="10" ry="17" fill="#dec58a" transform="rotate(-30 ${x-26+j*3} ${153+j*22})"/>`).join('')}`;}).join('');
const lantern=`<path d="M180 35v40" stroke="#b88c60" stroke-width="4"/><rect x="126" y="80" width="108" height="110" rx="45" fill="#dc9590" stroke="#b7736b" stroke-width="4"/><path d="M158 84q-20 50 0 102m44-102q20 50 0 102" stroke="#efc583" stroke-width="3"/><path d="M153 78h54m-54 114h54m-27 0v42m-10 0v23m20-23v23" stroke="#cba05e" stroke-width="8"/>`;
const family=(mother=false)=>`<circle cx="146" cy="113" r="28" fill="#eac8aa"/><path d="M109 224v-58q37-31 74 0v58" fill="${mother?'#9dbcd9':'#e6c775'}"/><circle cx="221" cy="157" r="21" fill="#eac8aa"/><path d="M194 230v-41q27-25 54 0v41" fill="#a8c7b4"/><path d="M176 180l24 15" stroke="#eac8aa" stroke-width="15"/>`;
const scenes={
 summer:`<circle cx="229" cy="97" r="44" fill="#f4d58a"/>${stars}<path d="M10 275q100-90 190 0t170-20" fill="#efd8b7"/>${leaf(75,270)}`,
 rainy:cloud+`<path d="M83 153l-9 24m45-24-9 24m45-24-9 24M58 198l-9 24m45-24-9 24m45-24-9 24" stroke="#91b9d4" stroke-width="5"/>`+leaf(240,270)+leaf(280,260),
 cool:`<path d="M0 260l105-135 90 113 70-81 95 115" fill="#b4c8cf"/><path d="M0 283q120-45 360-5" stroke="#eef4f6" stroke-width="23"/>`+cloud,
 krathong:`<circle cx="268" cy="66" r="34" fill="#f5e4b3"/>${lotus}${candle}${waves}`,
 father:family()+flower(68,98,'#f4d475',.8)+flower(281,65,'#f4d475',.65),
 memorial:jasmine+`<path d="M73 64q-22-35-37-4q-5 13 36 68l18-16Q43 59 55 56q11-4 16 8L38 128l18 5Z" fill="#707987"/>`,
 eve:stars+`<g stroke="#cfad6a" stroke-width="4">${Array.from({length:12},(_,i)=>`<path d="M180 97v-40" transform="rotate(${i*30} 180 158)"/>`).join('')}</g>`,
 newyear:`<circle cx="180" cy="196" r="66" fill="#f2d38c"/><path d="M25 252q155-52 310 0" fill="#a8cbbb"/>`+stars,
 children:balloons,
 chinese:lantern+flower(75,98,'#edc5c5',.7)+flower(277,229,'#edc5c5',.7),
 makha:lotus+candle,
 songkran:`<path d="M95 190h170q-15 76-85 76t-85-76" fill="#a4d4df" stroke="#82b8c9" stroke-width="4"/><ellipse cx="180" cy="190" rx="85" ry="17" fill="#d6f0f6"/><path d="M120 125q-23-22 0-49q23 27 0 49m88 7q-23-22 0-49q23 27 0 49" fill="#93c9df"/>`+flower(280,201,'#fff',.65),
 visakha:lotus+leaf(88,164)+leaf(278,155),
 asalha:`<circle cx="180" cy="151" r="73" stroke="#c5a366" stroke-width="9"/><circle cx="180" cy="151" r="15" fill="#c5a366"/>${Array.from({length:8},(_,i)=>`<path d="M180 134V78" stroke="#c5a366" stroke-width="5" transform="rotate(${i*45} 180 151)"/>`).join('')}<path d="M80 261q100-40 200 0" stroke="#b6c9ad" stroke-width="9"/>`,
 lent:candle+leaf(95,254)+leaf(267,254),
 mother:family(true)+flower(68,94)+flower(282,67,'#fff',.65),
 sartchin:`<path d="M60 234h240v16H60z" fill="#b89577"/><circle cx="129" cy="204" r="25" fill="#dca46d"/><circle cx="183" cy="201" r="27" fill="#daaf6d"/><path d="M218 221q-17-69 27-61q35 35 11 61" fill="#b6c393"/><path d="M243 162v-15" stroke="#899b70" stroke-width="4"/>`,
 sartthai:wheat+`<path d="M75 258h210l-23 26H98z" fill="#91aa74"/><rect x="142" y="228" width="77" height="28" rx="7" fill="#bd9769"/>`,
};
for(const [id,svg] of Object.entries(scenes))writeFileSync(new URL(id+'.svg',dir),wrap(svg));
console.log(`Created ${Object.keys(scenes).length} original SVG illustrations.`);

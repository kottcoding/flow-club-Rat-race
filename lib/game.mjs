import {dreams,outer,engineer,doodads,markets,THAI_PACK_ID} from './thai-pack.mjs';
export {dreams,outer};
export const RULE_VERSION = 'flow-club-2.1';
export const API_VERSION = 2;
const legacyProfessions = [
  {name:['ครู','Teacher'],salary:3300,living:1200,savings:800,child:180,debts:[['Home loan',50000,500],['Car loan',6000,120],['Credit card',2000,100]]},
  {name:['วิศวกร','Engineer'],salary:5200,living:1950,savings:1400,child:250,debts:[['Home loan',90000,850],['Car loan',12000,220],['Student loan',15000,150]]},
  {name:['พยาบาล','Nurse'],salary:3900,living:1450,savings:1000,child:200,debts:[['Home loan',60000,600],['Car loan',8000,160],['Credit card',3000,150]]},
  {name:['เชฟ','Chef'],salary:3000,living:1100,savings:600,child:160,debts:[['Home loan',40000,400],['Car loan',5000,100],['Credit card',2000,100]]},
  {name:['นักออกแบบ','Designer'],salary:4200,living:1600,savings:1200,child:220,debts:[['Home loan',70000,700],['Car loan',10000,200],['Student loan',10000,100]]},
  {name:['แพทย์','Doctor'],salary:8000,living:3200,savings:2200,child:350,debts:[['Home loan',180000,1600],['Car loan',24000,400],['Student loan',50000,500]]},
];
export const legacyDreams = [
  {name:['เดินทางรอบโลก','Explore the world'],cost:200000},
  {name:['สร้างโรงเรียน','Build a school'],cost:250000},
  {name:['บ้านริมทะเล','A home by the sea'],cost:300000},
  {name:['กองทุนเพื่อชุมชน','Community foundation'],cost:225000},
];
export const inner = ['deal','charity','deal','pay','deal','market','deal','doodad','deal','pay','deal','baby','deal','market','deal','pay','deal','doodad','deal','downsize','deal','pay','deal','market'];
export const legacyOuter = ['cashday','business','dream0','business','audit','business','cashday','dream1','business','charity','business','lawsuit','cashday','business','dream2','business','divorce','business','cashday','dream3','business','business','charity','business'];
const legacySmall = [
 {name:['ห้องเช่าใกล้มหาวิทยาลัย','Campus studio'],type:'property',cost:45000,down:5000,flow:220},
 {name:['บ้านเช่าชานเมือง','Suburban rental'],type:'property',cost:70000,down:7000,flow:380},
 {name:['ตู้ขายสินค้าอัตโนมัติ','Vending corner'],type:'business',cost:4000,down:4000,flow:180},
 {name:['ที่จอดรถให้เช่า','Parking spaces'],type:'property',cost:25000,down:3000,flow:150},
 {name:['หุ้น SUN','SUN shares'],type:'stock',symbol:'SUN',cost:10,down:10,flow:0},
 {name:['หุ้น GREEN','GREEN shares'],type:'stock',symbol:'GREEN',cost:5,down:5,flow:0},
 {name:['หุ้น SUN ราคาพิเศษ','SUN value shares'],type:'stock',symbol:'SUN',cost:2,down:2,flow:0},
 {name:['ร้านซักผ้าขนาดเล็ก','Mini laundry'],type:'business',cost:5000,down:5000,flow:260},
];
const legacyBig = [
 {name:['อพาร์ตเมนต์ 6 ห้อง','Six-unit apartment'],type:'property',cost:240000,down:24000,flow:1400},
 {name:['โกดังให้เช่า','Rental warehouse'],type:'property',cost:180000,down:18000,flow:1000},
 {name:['ธุรกิจบริการรายเดือน','Subscription business'],type:'business',cost:30000,down:30000,flow:1800},
 {name:['อาคารพาณิชย์','Commercial building'],type:'property',cost:400000,down:40000,flow:2400},
 {name:['กลุ่มบ้านเช่า','Rental portfolio'],type:'property',cost:120000,down:12000,flow:750},
];
export const professions = legacyProfessions.map((j,i)=>i===1?engineer:{
 ...j,id:'sample-profession-'+i,source:'sample',salary:j.salary*10,tax:0,
 living:j.living*10,savings:j.savings*10,child:j.child*10,
 debts:j.debts.map(([name,balance,payment])=>[name,balance*10,payment*10]),
});
function sampleInvestments(cards,prefix){return cards.map((c,i)=>({...c,id:prefix+'-'+i,source:'sample',cost:c.cost*10,down:c.down*10,flow:c.flow*10}));}
export const small=sampleInvestments(legacySmall,'small');
export const big=sampleInvestments(legacyBig,'big');
export const isLegacy=g=>g?.ruleset==='legacy';
export const economyScale=g=>isLegacy(g)?1:10;
export const roomDreams=g=>isLegacy(g)?legacyDreams:dreams;
export const roomBoard=g=>isLegacy(g)?legacyOuter:outer;
export const dreamFor=(g,id)=>isLegacy(g)?legacyDreams[id]:dreams.find(d=>d.id===id);
export const tileDreamId=(g,tile)=>isLegacy(g)?Number(tile.slice(5)):tile.slice(6);
export function normalizeRoom(g){
 if(g.schemaVersion===2)return g;
 if(g.status==='lobby'){
  g.ruleset=THAI_PACK_ID;g.currency='THB';g.version=RULE_VERSION;
  for(const p of g.players){p.previousDream=legacyDreams[p.dream]?.name;p.dream=null;p.ready=false;}
  g.upgradedLobby=true;
 }else{g.ruleset='legacy';g.currency='USD';}
 g.schemaVersion=2;return g;
}
export function drawCard(g,deck,rng=random){
 const cards={small,big,doodad:doodads,market:markets}[deck];check(cards,'INVALID_DECK');
 g.decks ||= {};let pile=g.decks[deck];
 if(!pile?.length){pile=cards.map((_,i)=>i);for(let i=pile.length-1;i>0;i--){const j=rng(i+1);[pile[i],pile[j]]=[pile[j],pile[i]];}g.decks[deck]=pile;}
 return structuredClone(cards[pile.pop()]);
}
export function random(n) { const a=new Uint32Array(1); let x; const max=4294967296-4294967296%n; do {crypto.getRandomValues(a);x=a[0];} while(x>=max); return x%n; }
const pick=(a,rng)=>structuredClone(a[rng(a.length)]);
export function totals(p) {
 const interest=p.assets.filter(a=>a.type==='bond').reduce((s,a)=>s+a.flow*a.qty,0);
 const dividends=p.assets.filter(a=>a.type==='stock').reduce((s,a)=>s+a.flow*a.qty,0);
 const property=p.assets.filter(a=>a.type==='property').reduce((s,a)=>s+a.flow*a.qty,0);
 const business=p.assets.filter(a=>a.type==='business').reduce((s,a)=>s+a.flow*a.qty,0);
 const passive=p.assets.reduce((s,a)=>s+a.flow*a.qty,0);
 const debtPayments=p.debts.reduce((s,d)=>s+d.payment,0),loanPayment=p.loan*.1,childExpenses=p.children*p.child;
 const expenses=(p.tax||0)+p.living+childExpenses+debtPayments+loanPayment;
 const assets=p.assets.reduce((s,a)=>s+(a.cost||0)*a.qty,0);
 const mortgages=p.assets.reduce((s,a)=>s+((a.cost||0)-(a.down||0))*a.qty,0);
 const liabilities=p.debts.reduce((s,d)=>s+d.balance,0)+p.loan+mortgages;
 return {passive,interest,dividends,property,business,expenses,debtPayments,loanPayment,childExpenses,income:p.salary+passive,monthly:p.salary+passive-expenses,assets,mortgages,liabilities};
}
function log(g,p,title,formula='') {g.log.unshift({id:crypto.randomUUID(),player:p?.name||'',title,formula,time:Date.now()});g.log=g.log.slice(0,100);}
function check(b,msg='INVALID_ACTION'){if(!b)throw new Error(msg);}
function number(n,min=1,max=10000000){check(Number.isSafeInteger(n)&&n>=min&&n<=max,'INVALID_AMOUNT');return n;}
export function player(name,key,index=0){return {id:crypto.randomUUID(),key,name,ready:false,dream:dreams[index%dreams.length].id,position:0,track:'rat',salary:0,tax:0,living:0,child:0,children:0,debts:[],loan:0,cash:0,assets:[],skip:0,charity:0,fastIncome:0,fastGoal:0};}
export function room(id,title,p){return {id,title,version:RULE_VERSION,schemaVersion:2,ruleset:THAI_PACK_ID,currency:'THB',decks:{},creatorKey:p.key,host:p.id,status:'lobby',players:[p],turn:0,round:1,phase:'roll',event:null,dice:[],log:[],winner:null};}
function cash(g,p,amount,label){const before=p.cash;p.cash+=amount;log(g,p,label,`${before} ${amount<0?'−':'+'} ${Math.abs(amount)} = ${p.cash}`);}
function expense(g,p,amount,label){cash(g,p,-amount,label);if(p.cash<0){const step=1000*economyScale(g);const loan=Math.ceil(-p.cash/step)*step;p.loan+=loan;cash(g,p,loan,['เงินกู้ฉุกเฉินอัตโนมัติ','Automatic emergency loan']);log(g,p,['ค่าใช้จ่ายเงินกู้ต่อเดือน','Monthly bank loan expense'],`${p.loan} × 10% = ${p.loan*.1}`);if(totals(p).monthly<0)g.phase='insolvent';}}
function qualify(g,p){if(p.track==='rat'&&totals(p).passive>totals(p).expenses){const passive=totals(p).passive;p.track='fast';p.position=0;p.fastIncome=passive*100;p.fastGoal=p.fastIncome+50000*economyScale(g);p.cash=p.fastIncome;p.charity=0;log(g,p,['ออกจาก Rat Race!','Escaped the Rat Race!'],`Passive Income ${passive} > Expenses ${totals(p).expenses}; CASHFLOW Day = ${passive} × 100 = ${p.fastIncome}; Cash = ${p.fastIncome}; Goal = ${p.fastGoal}`);}if(p.track==='fast'&&p.fastIncome>=p.fastGoal)win(g,p);}
function win(g,p){g.status='finished';g.winner=p.id;log(g,p,['บรรลุอิสรภาพทางการเงินแล้ว!','Financial freedom achieved!']);}
export function apply(g,pid,a,rng=random){const p=g.players.find(x=>x.id===pid);check(p,'NOT_MEMBER');
 if(g.status==='lobby'){
  if(a.type==='ready'){check(dreamFor(g,p.dream),'CHOOSE_DREAM');p.ready=!p.ready;return;}
  if(a.type==='dream'){check(dreamFor(g,a.value),'INVALID_DREAM');p.dream=a.value;p.ready=false;delete p.previousDream;return;}
  if(a.type==='leave'){g.players=g.players.filter(x=>x.id!==pid);if(g.host===pid)g.host=g.players[0]?.id;return;}
  check(a.type==='start'&&g.host===pid,'HOST_ONLY');check(g.players.length>=2&&g.players.every(x=>x.ready&&dreamFor(g,x.dream)),'NOT_READY');
  const jobs=[...(isLegacy(g)?legacyProfessions:professions)];for(const x of g.players){const j=jobs.splice(rng(jobs.length),1)[0];Object.assign(x,{profession:j.name,professionId:j.id,professionSource:j.source||'legacy',salary:j.salary,tax:j.tax||0,living:j.living,savings:j.savings,child:j.child,debts:j.debts.map(([name,balance,payment])=>({name,balance,payment}))});x.cash=totals(x).monthly+j.savings;log(g,x,['เงินเริ่มต้น = Monthly Cash Flow + Savings','Starting cash = Monthly Cash Flow + Savings'],`${totals(x).monthly} + ${j.savings} = ${x.cash}`);}g.turn=rng(g.players.length);g.status='playing';return;
 }
 check(g.status==='playing','GAME_OVER');
 // A shared market remains open until every eligible player has responded.
 if(g.phase==='market'&&a.type==='marketDone'){check(!g.event.done.includes(pid),'ALREADY_DONE');g.event.done.push(pid);if(g.event.done.length===g.players.length)g.phase='end';return;}
 if(g.phase==='market'&&a.type==='marketBuy'){
  const e=g.event;check(!g.event.done.includes(pid),'ALREADY_DONE');check(p.track==='rat'&&e.kind==='stock'&&e.allowBuying,'NOT_ELIGIBLE');
  const q=number(a.qty,1,100000);check(p.cash>=q*e.price,'NO_CASH');
  cash(g,p,-q*e.price,['ซื้อหุ้นใน Market','Buy shares on Market']);
  p.assets.push({id:crypto.randomUUID(),type:'stock',symbol:e.symbol,name:[e.symbol+' หุ้น',e.symbol+' shares'],cost:e.price,down:e.price,flow:0,qty:q,source:e.source});
  log(g,p,['สูตรซื้อหุ้น','Share purchase calculation'],q+' × '+e.price+' = '+q*e.price);return;
 }
 if(g.phase==='market'&&a.type==='sell'){check(!g.event.done.includes(pid),'ALREADY_DONE');const asset=p.assets.find(x=>x.id===a.id);check(asset&&p.track==='rat','NO_ASSET');const q=number(a.qty,1,asset.qty);const e=g.event;check((e.kind==='stock'&&asset.symbol===e.symbol)||(e.kind==='property'&&asset.type==='property'),'NOT_ELIGIBLE');const value=e.kind==='stock'?e.price:Math.round(asset.cost*e.multiplier)-(asset.cost-asset.down);check(value>=0,'INVALID_PRICE');cash(g,p,q*value,['ขายสินทรัพย์ (หัก Mortgage แล้ว)','Asset sale (after mortgage)']);log(g,p,['สูตรขายสินทรัพย์','Sale calculation'],e.kind==='stock'?`${q} × ${e.price} = ${q*value}`:`(${asset.cost} × ${e.multiplier} − ${asset.cost-asset.down}) × ${q} = ${q*value}`);log(g,p,['กำไรจากการขาย = เงินรับสุทธิ − เงินลงทุนเดิม','Capital gain = net proceeds − original investment'],`${q*value} − ${asset.down*q} = ${q*value-asset.down*q}`);asset.qty-=q;p.assets=p.assets.filter(x=>x.qty>0);qualify(g,p);return;}
 check(g.players[g.turn].id===pid,'NOT_YOUR_TURN');
 if(a.type==='loan'){check(p.track==='rat'&&g.phase!=='market','NO_LOAN');const step=1000*economyScale(g);const n=number(a.amount,step,1000000*economyScale(g));check(n%step===0,'LOAN_MULTIPLE');p.loan+=n;cash(g,p,n,['รับเงินกู้','Bank loan received']);log(g,p,['ค่าใช้จ่ายเงินกู้','Bank loan expense'],`${p.loan} × 10% = ${p.loan*.1} / month`);return;}
 if(a.type==='repay'){check(p.track==='rat'&&g.phase!=='market','NO_LOAN');const n=a.id==='bank'?number(a.amount,1000*economyScale(g),p.loan):p.debts.find(x=>x.name===a.id)?.balance;check(n&&p.cash>=n,'NO_CASH');if(a.id==='bank'){check(n%(1000*economyScale(g))===0,'LOAN_MULTIPLE');p.loan-=n;}else p.debts=p.debts.filter(x=>x.name!==a.id);cash(g,p,-n,['ชำระหนี้','Debt repayment']);if(g.phase==='insolvent'&&totals(p).monthly>=0)g.phase='end';if(isLegacy(g)||['end','roll'].includes(g.phase))qualify(g,p);return;}
 if(a.type==='payExpense'){
  check(g.phase==='payExpense'&&g.event?.type==='doodad','INVALID_ACTION');
  g.phase='end';expense(g,p,g.event.cost,g.event.name);g.event.paid=true;return;
 }
 if(a.type==='bankrupt'){check(g.phase==='insolvent','INVALID_ACTION');p.assets=[];p.loan=0;p.cash=0;p.skip=3;g.phase='end';log(g,p,['ปรับโครงสร้าง: ล้างสินทรัพย์และเงินกู้ธนาคาร พัก 3 ตา','Restructuring: assets and bank loans cleared; skip 3 turns']);return;}
 if(a.type==='end'){check(g.phase==='end','FINISH_ACTION');qualify(g,p);if(g.status==='finished')return;g.turn=(g.turn+1)%g.players.length;if(!g.turn)g.round++;g.phase='roll';g.event=null;g.dice=[];return;}
 if(a.type==='roll'){
  check(g.phase==='roll','ALREADY_ROLLED');if(p.skip){p.skip--;g.phase='end';log(g,p,['พักตา','Skipped turn'],`${p.skip} remaining`);return;}
  const count=p.track==='fast'?(p.charity?number(a.count||2,1,3):2):(p.charity?number(a.count||1,1,2):1);g.dice=Array.from({length:count},()=>rng(6)+1);if(p.track==='rat'&&p.charity)p.charity--;
  const board=p.track==='rat'?inner:roomBoard(g);let n=g.dice.reduce((x,y)=>x+y,0);log(g,p,['ทอยลูกเต๋า','Rolled dice'],g.dice.join(' + ')+` = ${n}`);g.phase='end';
  for(let i=0;i<n;i++){p.position=(p.position+1)%board.length;const tile=board[p.position];if(tile==='pay'){const t=totals(p);log(g,p,['สูตร Pay Day','Pay Day calculation'],`(${p.salary} + ${t.passive}) − ${t.expenses} = ${t.monthly}`);expense(g,p,-t.monthly,['Pay Day: รายได้ − ค่าใช้จ่าย','Pay Day: income − expenses']);}if(tile==='cashday')cash(g,p,p.fastIncome,['CASHFLOW Day','CASHFLOW Day']);}
  if(g.phase==='insolvent')return;const tile=board[p.position];
  if(tile==='deal'){g.phase='choose';g.event={type:'deal'};}
  if(tile==='charity'){g.phase='decision';g.event={type:'charity',cost:p.track==='rat'?Math.ceil(totals(p).income*.1):100000*economyScale(g)};}
  if(tile==='baby'&&p.children<3){p.children++;log(g,p,['มีสมาชิกใหม่ในครอบครัว','A new baby'],`${p.children} × ${p.child} = ${p.children*p.child} / month`);}
  if(tile==='downsize'){expense(g,p,totals(p).expenses,['Downsized: จ่ายค่าใช้จ่าย 1 เดือน','Downsized: one month of expenses']);p.skip=2;}
  if(tile==='doodad'){if(isLegacy(g)){const cost=[300,500,800,1200][rng(4)];expense(g,p,cost,['Doodad: ค่าใช้จ่ายไม่คาดคิด','Doodad: unexpected expense']);}else{g.event=drawCard(g,'doodad',rng);g.phase='payExpense';}}
  if(tile==='market'){g.phase='market';g.event=!isLegacy(g)?{...drawCard(g,'market',rng),done:[]}:rng(2)?{type:'market',kind:'stock',symbol:rng(2)?'SUN':'GREEN',price:[5,15,30,50][rng(4)],done:[]}:{type:'market',kind:'property',multiplier:[1.2,1.5,2][rng(3)],done:[]};log(g,p,['เปิด Market ให้ทุกคน','Market opened for all players']);}
  if(tile==='business'){g.phase='decision';const cost=[60000,90000,120000][rng(3)]*economyScale(g);g.event={type:'fast',source:'sample',name:['ธุรกิจเครือข่ายบริการ','Service network'],cost,flow:Math.round(cost/6)};}
  if(tile.startsWith('dream')){const id=tileDreamId(g,tile);const d=dreamFor(g,id);check(d,'INVALID_DREAM');g.phase='decision';g.event={...d,type:'dream',dream:id};}
  if(tile==='audit'||tile==='lawsuit')cash(g,p,-Math.floor(p.cash/2),[tile==='audit'?'Tax Audit: จ่ายครึ่งหนึ่งของเงินสด':'Lawsuit: จ่ายครึ่งหนึ่งของเงินสด',`${tile}: pay half of cash`]);
  if(tile==='divorce')cash(g,p,-p.cash,['Divorce: สูญเสียเงินสด','Divorce: lose all cash']);return;
 }
 if(a.type==='draw'){check(g.phase==='choose','INVALID_ACTION');check(['small','big'].includes(a.deck));const card=isLegacy(g)?pick(a.deck==='small'?legacySmall:legacyBig,rng):drawCard(g,a.deck,rng);g.event={...card,deck:a.deck,assetType:card.type,type:'investment'};g.phase='decision';return;}
 if(a.type==='pass'){check(['decision','choose'].includes(g.phase),'INVALID_ACTION');g.phase='end';return;}
 if(a.type==='buy'){
  check(g.phase==='decision','INVALID_ACTION');const e=g.event;if(e.type==='dream'){const d=dreamFor(g,e.dream);check(d&&p.track==='fast','INVALID_DREAM');e.cost=d.cost;e.name=d.name;}
  if(e.type==='investment'){const qty=e.symbol?number(a.qty,1,100000):1;const cost=e.down*qty;check(p.cash>=cost,'NO_CASH');cash(g,p,-cost,['ลงทุน: จ่ายเงินดาวน์ / ค่าหุ้น','Invest: down payment / shares']);p.assets.push({...e,type:e.assetType,id:crypto.randomUUID(),qty});log(g,p,['Cash Flow สุทธิ (ไม่หัก Mortgage ซ้ำ)','Net Cash Flow (mortgage already included)'],`${e.flow} × ${qty} = ${e.flow*qty} / month; ROI = ${e.down?Math.round(e.flow*12/e.down*100):0}%`);}
  else{check(p.cash>=e.cost,'NO_CASH');cash(g,p,-e.cost,e.name||['Charity','Charity']);if(e.type==='charity')p.charity=p.track==='rat'?3:999;if(e.type==='fast'){const before=p.fastIncome;p.fastIncome+=e.flow;log(g,p,['CASHFLOW Day เพิ่มขึ้น','CASHFLOW Day increased'],`${before} + ${e.flow} = ${p.fastIncome}`);}if(e.type==='dream'&&e.dream===p.dream)win(g,p);}
  g.phase='end';qualify(g,p);return;
 }
 throw new Error('INVALID_ACTION');
}
export function publicRoom(g){const copy=structuredClone(g);delete copy.creatorKey;for(const p of copy.players)delete p.key;return copy;}


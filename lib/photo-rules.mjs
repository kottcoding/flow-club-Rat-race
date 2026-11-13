import {PHOTO_PACK_ID} from './photo-pack.mjs';
export const isPhoto=g=>g?.ruleset===PHOTO_PACK_ID;
export const assetDebt=a=>a.debt??((a.cost||0)-(a.down||0));
export function matches(a,target){
 if(a.contract)return false;
 if(target==='shops')return ['singleShop','duplex','fourplex'].includes(a.category);
 if(target==='partnership')return ['pizza','sandwich','clinic','usedCars'].includes(a.category);
 if(target==='business')return a.type==='business';
 if(target==='rental')return a.type==='property';
 return a.category===target;
}
export function expenseCost(e,p){
 if(e.condition==='children'&&!p.children)return 0;
 if(['rental','fourplex'].includes(e.condition)&&!p.assets.some(a=>
  a.type==='property'&&a.qty>0&&(e.condition==='fourplex'?a.category==='fourplex':
   ['house','condo','singleShop','duplex','fourplex','apartment'].includes(a.category))))return 0;
 return e.cost*(e.perChild?p.children:1);
}
export function canSell(g,p,a){const e=g.event;if(!e||p.track!=='rat'||e.done?.includes(p.id)||a.contract)return false;
 if(e.source!=='card-photo')return (e.kind==='stock'&&a.symbol===e.symbol)||(e.kind==='property'&&a.type==='property');
 if(e.scope==='drawer'&&e.drawer!==p.id)return false;
 if(e.type==='quote')return a.symbol===e.symbol&&a.type===e.assetType;
 return ['sale','deferredHouse'].includes(e.kind)&&!a.noResale&&matches(a,e.target)&&!(e.kind==='deferredHouse'&&e.accepted?.includes(p.id));
}
export function saleValue(e,a){
 if(e.kind==='stock')return e.price;
 if(e.source!=='card-photo')return Math.round(a.cost*e.multiplier)-assetDebt(a);
 const gross=e.priceBasis==='down'?a.down*e.price:e.priceBasis==='costPlus'?a.cost+e.price:e.price*(e.perUnit?a.units:e.perWeight?a.weight:1);
 return gross-assetDebt(a);
}
const ensure=(ok,msg='INVALID_ACTION')=>{if(!ok)throw new Error(msg);};
const amount=(n,min=0,max=1e9)=>{ensure(Number.isSafeInteger(n)&&n>=min&&n<=max,'INVALID_AMOUNT');return n;};
function addDebt(p,name,balance,payment){let d=p.debts.find(d=>d.name===name);if(!d){d={name,balance:0,payment:0};p.debts.push(d);}d.balance+=balance;d.payment+=payment;}
function acquire(p,e){p.assets.push({...e,id:crypto.randomUUID(),type:e.assetType||e.type,qty:1});}
export function openPhotoCard(g,p,card,deck,ctx){const {cash,log,qualify}=ctx;
 const e={...card,deck,drawer:p.id};g.event=e;
 log(g,p,["เปิดการ์ด: "+(card.name?.[0]||card.id),"Drew card: "+(card.name?.[1]||card.id)]);
 if(e.type==='split'){
  e.splitResults=[];
  for(const x of g.players){
   const holdings=x.assets.filter(a=>a.type==='stock'&&a.symbol===e.symbol&&a.qty>0);
   if(!holdings.length)continue;
   const before=holdings.reduce((sum,a)=>sum+a.qty,0);
   for(const a of holdings){a.qty*=e.factor;a.cost/=e.factor;a.down/=e.factor;}
   const after=holdings.reduce((sum,a)=>sum+a.qty,0);
   e.splitResults.push({playerId:x.id,name:x.name,before,after});
   log(g,x,e.name,`${before} × ${e.factor} = ${after}; cost basis / share ÷ ${e.factor}; cash unchanged`);
  }g.phase='end';e.resolved=true;return;
 }
 if(e.type==='doodad'){g.phase='payExpense';e.amountDue=expenseCost(e,p);return;}
 if(e.type==='quote'){g.phase='market';e.done=g.players.filter(x=>x.track!=='rat').map(x=>x.id);return;}
 if(e.type==='market'){
  if(e.kind==='returnHouses'){
   for(const a of p.assets.filter(a=>a.category==='house'))cash(g,p,a.down*a.qty,e.name);
   p.assets=p.assets.filter(a=>a.category!=='house');g.phase='end';e.resolved=true;log(g,p,e.name,'Remove rental houses, associated debt and monthly income.');return;
  }
  if(e.kind==='flow'){
   for(const x of g.players.filter(x=>x.track==='rat')){for(const a of x.assets.filter(a=>matches(a,'business'))){const before=a.flow;a.flow+=e.price;log(g,x,e.name,`${before} + ${e.price} = ${a.flow} / month`);}qualify(g,x);}
   g.phase='end';e.resolved=true;return;
  }
  g.phase='market';e.done=g.players.filter(x=>x.track!=='rat'||e.scope==='drawer'&&x.id!==p.id).map(x=>x.id);e.accepted=[];return;
 }
 e.assetType=e.type;e.type='investment';g.phase='decision';
}
export function settleDeferred(g,p,ctx){
 for(const a of [...p.assets].filter(a=>a.contract)){
  a.contract.remaining--;ctx.log(g,p,['สัญญาซื้อบ้าน: นับรับเงินเดือน','House contract: Pay Day counted'],`${a.contract.remaining} / 48 remaining`);
  if(a.contract.remaining<=0){const net=a.contract.price-assetDebt(a);if(net<0)ctx.expense(g,p,-net,['ชำระส่วนต่างหนี้บ้านเมื่อครบสัญญา','House contract debt shortfall']);else ctx.cash(g,p,net,['รับเงินขายบ้านครบสัญญา','Deferred house sale settled']);p.assets=p.assets.filter(x=>x.id!==a.id);ctx.log(g,p,['สูตรขายบ้านครบสัญญา','Deferred sale calculation'],`${a.contract.price} − ${assetDebt(a)} = ${net}; remove monthly income ${a.flow}`);}
 }
}
export function applyPhotoAction(g,p,a,ctx){
 const e=g.event;if(!isPhoto(g)||e?.source!=='card-photo')return false;
 const {cash,expense,log,qualify}=ctx;
 if(g.phase==='market'){
  if(!['marketDone','marketBuy','sell'].includes(a.type))return false;
  ensure(!e.done.includes(p.id),'ALREADY_DONE');
  if(a.type==='marketDone'){e.done.push(p.id);if(e.done.length===g.players.length){g.phase='end';for(const x of g.players)qualify(g,x);}return true;}
  if(a.type==='marketBuy'){
   ensure(e.type==='quote'&&p.id===e.drawer&&p.track==='rat','NOT_ELIGIBLE');const q=amount(a.qty,1,100000),cost=q*e.price;ensure(p.cash>=cost,'NO_CASH');
   cash(g,p,-cost,['ซื้อหุ้น / หุ้นกู้ตามการ์ด','Buy shares / bonds']);p.assets.push({...e,type:e.assetType,id:crypto.randomUUID(),qty:q});log(g,p,e.name,`${q} × ${e.price} = ${cost}; income ${q} × ${e.flow} = ${q*e.flow}`);return true;
  }
  const asset=p.assets.find(x=>x.id===a.id);ensure(asset&&canSell(g,p,asset),'NOT_ELIGIBLE');
  const q=a.qty;ensure(Number.isFinite(q)&&q>0&&q<=asset.qty&&(asset.symbol||q===1),'INVALID_AMOUNT');
  if(e.kind==='deferredHouse'){
   ensure(q===1,'INVALID_AMOUNT');asset.contract={price:e.price,remaining:48};asset.flow+=e.flowChange;e.accepted.push(p.id);
   log(g,p,e.name,`Cash today = 0; monthly flow ${asset.flow-e.flowChange} − 5000 = ${asset.flow}; after 48 Pay Days: ${e.price} − ${assetDebt(asset)}`);return true;
  }
  const value=saleValue(e,asset),net=q*value;
  // Debt may exceed the offered sale price. The shortfall must be paid, never clamped to zero.
  asset.qty-=q;p.assets=p.assets.filter(x=>x.qty>0);
  if(net<0)expense(g,p,-net,['ส่วนต่างหนี้จากขายสินทรัพย์','Asset sale debt shortfall']);else cash(g,p,net,['ขายสินทรัพย์หลังหักหนี้','Asset sale after debt']);
  // Emergency insolvency is recorded per player; settle the shared market first.
  if(g.phase==='insolvent'){p.needsRestructure=true;g.phase='market';}
  log(g,p,e.name,`Gross/unit ${value+assetDebt(asset)} − debt/unit ${assetDebt(asset)} = ${value}; × ${q} = ${net}; capital gain ${net} − ${asset.down*q} = ${net-asset.down*q}`);return true;
 }
 const current=g.players[g.turn];
 if(g.phase==='decision'&&e.type==='investment'&&['offerDeal','acceptDeal','declineDeal','cancelDeal'].includes(a.type)){
  if(a.type==='offerDeal'){
   ensure(current.id===p.id&&e.transferable&&!e.offer,'NOT_ELIGIBLE');const buyer=g.players.find(x=>x.id===a.buyer);
   ensure(buyer&&buyer.id!==p.id&&buyer.track==='rat','NOT_ELIGIBLE');e.offer={id:crypto.randomUUID(),seller:p.id,buyer:buyer.id,price:amount(a.price)};return true;
  }
  const offer=e.offer;ensure(offer&&a.offerId===offer.id,'OFFER_EXPIRED');
  if(a.type==='cancelDeal'){ensure(p.id===offer.seller,'NOT_ELIGIBLE');delete e.offer;return true;}
  ensure(p.id===offer.buyer&&p.track==='rat','NOT_ELIGIBLE');
  if(a.type==='declineDeal'){delete e.offer;return true;}
  const total=offer.price+e.down;ensure(p.cash>=total,'NO_CASH');const seller=g.players.find(x=>x.id===offer.seller);
  cash(g,p,-total,['ซื้อสิทธิ์พร้อมลงทุน','Accept deal and invest']);cash(g,seller,offer.price,['รับค่าขายสิทธิ์','Deal-right fee received']);acquire(p,e);delete p.assets.at(-1).offer;
  log(g,p,e.name,`Deal fee ${offer.price} + down payment ${e.down} = ${total}; monthly flow ${e.flow}`);delete e.offer;g.phase='end';qualify(g,p);return true;
 }
 if(a.type==='payExpense'&&g.phase==='payExpense'){
  ensure(current.id===p.id&&(!e.drawer||e.drawer===p.id),'NOT_YOUR_TURN');const due=expenseCost(e,p);g.phase='end';
  if(a.credit){ensure(e.creditPayment&&due>0,'INVALID_ACTION');addDebt(p,'Credit card',due,e.creditPayment);log(g,p,e.name,`Cash unchanged; credit card + ${due}; monthly expense + ${e.creditPayment}`);}
  else if(due>0)expense(g,p,due,e.name);
  else log(g,p,['ไม่ต้องจ่าย: ไม่มีทรัพย์สินหรือเงื่อนไขที่ตรงการ์ด','No payment: card conditions not met'],'0');
  if(e.addDebt&&due>0){addDebt(p,e.debtName,e.addDebt,e.debtPayment);log(g,p,e.name,`Debt + ${e.addDebt}; monthly expense + ${e.debtPayment}`);}
  e.paid=true;return true;
 }
 if(e.offer&&['buy','pass'].includes(a.type))throw new Error('FINISH_OFFER');
 return false;
}

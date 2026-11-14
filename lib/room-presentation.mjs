export function roomStatus(r){return r.status==='lobby'?(r.count>=6?'full':'waiting'):r.status==='playing'?'playing':r.status==='finished'?'finished':'unknown';}
export const statusLabels={waiting:['รอผู้เล่น','Waiting','♧'],full:['ห้องเต็ม','Full','♟'],playing:['กำลังเล่น','Playing','⚄'],finished:['จบเกม','Finished','⚑'],unknown:['ไม่ทราบสถานะ','Unknown','?']};
export function roomMeta(g){return {createdAt:Number.isFinite(g.createdAt)?g.createdAt:null,creatorName:g.creatorName||g.players.find(p=>p.key===g.creatorKey)?.name||null};}
export function waitingPlayers(g){const e=g.event;if(g.phase!=='market'||!Array.isArray(e?.done))return [];return g.players.filter(p=>!e.done.includes(p.id));}
export function responders(g){const e=g.event;return g.players.filter(p=>e?.source!=='card-photo'||p.track==='rat'&&(e.scope!=='drawer'||p.id===e.drawer));}
// Explicit public fields only. Never return account keys, decks or financial statements.
export function spectatorSnapshot(g){
 const e=g.event,current=g.players[g.turn];
 return {id:g.id,title:g.title,status:g.status,round:g.round,turn:g.turn,ruleset:g.ruleset,version:g.version,currency:g.currency||'USD',phase:g.phase,
  winner:g.status==='finished'?g.winner:null,endReason:g.endReason==='insufficientPlayers'?'insufficientPlayers':null,
  createdAt:g.createdAt||null,startedAt:g.startedAt||null,finishedAt:g.status==='finished'?g.finishedAt||null:null,
  landedTile:['deal','business','pay','cashday','charity','market','doodad','downsize','lawsuit','audit','divorce','baby'].includes(g.landedTile)?g.landedTile:null,
  dice:Array.isArray(g.dice)?g.dice.filter(n=>Number.isInteger(n)&&n>=1&&n<=6):[],
  event:e?{name:e.name||null,type:e.type||null,deck:e.deck||null,drawer:e.drawer||current?.id||null,cardNumber:e.cardNumber||null}:null,
  activity:(g.log||[]).filter(x=>x&&typeof x==='object'&&x.title).slice(0,30).map(x=>({id:x.id,player:x.player,title:x.title,time:x.time})),
  players:g.players.map(p=>({id:p.id,name:p.name,seatIndex:p.seatIndex,track:p.track,position:p.position,cash:Number.isFinite(p.cash)?p.cash:0,avatar:{id:p.avatar?.id||0,mode:'avatar'}}))};
}
export function recordSpectator(g,before,action,now=Date.now()){
 if(g.status==='lobby')return;
 if(before.status==='lobby')g.startedAt=now;
 if(g.status==='finished'&&before.status!=='finished')g.finishedAt=now;
 // The live viewer no longer waits for or stores delayed snapshots.
 delete g.spectator;
}
export function spectatorView(g){
 if(!['playing','finished'].includes(g.status))throw new Error('SPECTATOR_UNAVAILABLE');
 return {room:spectatorSnapshot(g),pending:false,delayTurns:0};
}

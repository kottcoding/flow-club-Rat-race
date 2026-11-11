export function roomStatus(r){return r.status==='lobby'?(r.count>=6?'full':'waiting'):r.status==='playing'?'playing':r.status==='finished'?'finished':'unknown';}
export const statusLabels={waiting:['รอผู้เล่น','Waiting','♧'],full:['ห้องเต็ม','Full','♟'],playing:['กำลังเล่น','Playing','⚄'],finished:['จบเกม','Finished','⚑'],unknown:['ไม่ทราบสถานะ','Unknown','?']};
export function roomMeta(g){return {createdAt:Number.isFinite(g.createdAt)?g.createdAt:null,creatorName:g.creatorName||g.players.find(p=>p.key===g.creatorKey)?.name||null};}
export function waitingPlayers(g){const e=g.event;if(g.phase!=='market'||!Array.isArray(e?.done))return [];return g.players.filter(p=>!e.done.includes(p.id));}
export function responders(g){const e=g.event;return g.players.filter(p=>e?.source!=='card-photo'||p.track==='rat'&&(e.scope!=='drawer'||p.id===e.drawer));}
// Strict allowlist: never spread a game/player object into a spectator response.
export function spectatorSnapshot(g){return {id:g.id,title:g.title,status:g.status,round:g.round,turn:g.turn,ruleset:g.ruleset,version:g.version,winner:g.status==='finished'?g.winner:null,createdAt:g.createdAt||null,startedAt:g.startedAt||null,finishedAt:g.status==='finished'?g.finishedAt||null:null,players:g.players.map(p=>({id:p.id,name:p.name,track:p.track,position:p.position,avatar:{id:p.avatar?.id||0,mode:'avatar'}}))};}
export function recordSpectator(g,before,action,now=Date.now()){
 if(g.status==='lobby')return;
 if(before.status==='lobby'){g.startedAt=now;g.spectator={queue:[spectatorSnapshot(g)],published:null};}
 else if(g.status==='playing'&&action?.type==='end'&&before.phase==='end'){
  const state=g.spectator||{queue:[],published:null};state.queue.push(spectatorSnapshot(g));
  if(state.queue.length>g.players.length)state.published=state.queue.shift();g.spectator=state;
 }
 if(g.status==='finished'&&before.status!=='finished')g.finishedAt=now;
}
export function spectatorView(g){
 if(!['playing','finished'].includes(g.status))throw new Error('SPECTATOR_UNAVAILABLE');
 if(g.status==='finished')return {room:spectatorSnapshot(g),pending:false,delayTurns:0};
 // No current positions/names/turn/round leak while the buffer warms up.
 return {room:g.spectator?.published?spectatorSnapshot(g.spectator.published):{id:g.id,title:g.title,status:'playing',players:[]},pending:!g.spectator?.published,delayTurns:g.players.length};
}

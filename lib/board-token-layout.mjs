import {displayFastPoint} from './board-display.mjs';
// Stable slots keep players in place when the active turn changes.
export function boardTokenLayout(players){
 const groups=new Map();
 players.forEach((p,index)=>{const key=p.track+':'+p.position; if(!groups.has(key))groups.set(key,[]);groups.get(key).push({p,index});});
 const result=[];
 for(const group of groups.values()){
  group.sort((a,b)=>(a.p.seatIndex??a.index)-(b.p.seatIndex??b.index));
  const first=group[0].p,n=group.length,rat=first.track!=='fast',arc=rat||(first.position>=1&&first.position<=14);
  const angle=(rat?142.5+first.position*15:40-(first.position-1)*20)*Math.PI/180;
  const centre=rat?[600+169*Math.cos(angle),500+169*Math.sin(angle)]:displayFastPoint(first.position);
  const tight=first.track==='fast'&&first.position===0&&n>1;
  const size=tight?18:n===1?32:n<=3?30:24;
  const step=n===1?0:Math.min(18,60/(n-1));
  const ux=arc?Math.cos(angle):1,uy=arc?Math.sin(angle):0;
  group.forEach(({p,index},slot)=>{
   const offset=(slot-(n-1)/2)*step,x=tight?879+(slot%2)*20:centre[0]+ux*offset,y=tight?755+Math.floor(slot/2)*20:centre[1]+uy*offset;
   result.push({player:p,index,x,y,size,badgeX:x-uy*(size/2-3),badgeY:y+ux*(size/2-3),count:n});
  });
 }
 return result;
}

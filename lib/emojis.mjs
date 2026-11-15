export const EMOJIS=[['fire','ไฟลุก','Fire'],['rocket','พุ่งเลย','Rocket'],['party','ฉลอง','Celebrate'],['heart','หัวใจ','Heart'],['angry','หงุดหงิด','Angry'],['money','เงินบิน','Flying money'],['cry','ร้องไห้','Crying'],['cool','เท่','Cool'],['sweat','เหงื่อตก','Sweating'],['laugh','ขำ','Laughing'],['think','คิด','Thinking'],['rich','รวยแล้ว','Rich']];
export const validEmoji=id=>EMOJIS.some(e=>e[0]===id);
export const emojiSrc=id=>'/emojis/'+id+'-v1.png';
export function createReactionTracker(){
 let since=null;const seen=new Set();
 return {reset(){since=null;seen.clear();},receive(events,serverNow){
  if(since===null){since=serverNow;events.forEach(e=>seen.add(e.id));return [];}
  const fresh=events.filter(e=>validEmoji(e.emoji)&&e.sentAt>=since&&e.sentAt>=serverNow-10000&&!seen.has(e.id));
  for(const e of fresh)seen.add(e.id);
  if(seen.size>200){const recent=[...seen].slice(-100);seen.clear();recent.forEach(id=>seen.add(id));}
  return fresh;
 },mark(id){seen.add(id);}};
}

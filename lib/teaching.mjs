export const WATCH_TTL=15000;
export const SCREEN_TTL=20000;
export function teacherIds(g){return g.players.filter(p=>p.key===g.creatorKey||(g.teaching?.masterIds||[]).includes(p.id)).map(p=>p.id);}
export function canTeach(g,p){return !!p&&!!g.teaching?.enabled&&teacherIds(g).includes(p.id);}
export function configureTeaching(g,p,a){
 if(p.key!==g.creatorKey)throw Error('CREATOR_ONLY');
 const old=g.teaching||{enabled:false,masterIds:[]};
 if(a.type==='teachingToggle')g.teaching={...old,enabled:a.enabled===true,epoch:crypto.randomUUID()};
 else {
  const target=g.players.find(x=>x.id===a.playerId);if(!target)throw Error('PLAYER_NOT_FOUND');
  if(target.key===g.creatorKey)throw Error('CREATOR_ONLY');
  const ids=new Set(old.masterIds);a.granted===true?ids.add(target.id):ids.delete(target.id);
  g.teaching={...old,masterIds:[...ids].filter(id=>g.players.some(x=>x.id===id)),epoch:crypto.randomUUID()};
 }
}
const tags=new Set('div header dl dt dd section article aside h2 h3 h4 h5 small strong span p b em label input select option details summary code img br ul ol li button'.split(' '));
const classes=new Set('card card-transcript transcript-label card-facts calculated-roi action-panel event-frame event-heading event-symbol event-body event-explanation dice photo-event formula market-holding row btn secondary finance account eyebrow cash-balance account-sub progress-caption progress positive negative statement tabs active history log stat monthly statement-note asset-detail asset-row bank dream-note card-reference card-warning card-details card-story card-story-label card-stats card-stat source-badge verified sample waiting-responses data-library library-tabs library-grid catalogue-card catalogue-top catalogue-price catalogue-note'.split(' '));
// Untrusted client snapshots are structured text only: no HTML, URLs, handlers or styles.
export function sanitizeScreen(raw){
 let budget=0;
 function node(n,depth=0){
  if(++budget>1800||depth>22)return null;
  if(typeof n==='string')return n.slice(0,1600);
  if(!n||!tags.has(n.tag))return null;
  const out={tag:n.tag,cls:String(n.cls||'').split(' ').filter(c=>classes.has(c)||/^event-(deal|small|big|market|pay|charity|neutral|doodad|baby|downsize)$/.test(c)).join(' ')};
  if(n.tag==='input'){out.value=String(n.value||'').slice(0,50).replace(/[^0-9,.+\- ]/g,'');}
  if(n.tag==='select')out.value=String(n.value||'').slice(0,100);
  if(n.tag==='option')out.value=String(n.value||'').slice(0,100);
  if(n.tag==='details')out.open=n.open===true;
  if(n.tag==='img'&&/^\/(?:cards|card-photos|asset-icons)\/[a-zA-Z0-9_./%-]+\.(png|jpg|jpeg|webp|svg)$/.test(n.src||'')&&!n.src.includes('..'))out.src=n.src;
  if(n.focus===true)out.focus=true;
  out.children=Array.isArray(n.children)?n.children.map(x=>node(x,depth+1)).filter(x=>x!==null):[];
  return out;
 }
 const section=['action','bank','statement','dream','library','private'].includes(raw?.section)?raw.section:'action';
 return {section,width:Math.max(320,Math.min(2560,Number(raw?.width)||1024)),scale:Math.max(0,Math.min(24,Number(raw?.scale)||0)),lang:raw?.lang==='en'?'en':'th',private:raw?.private===true,
  panels:raw?.private?{}:Object.fromEntries(['action','finance','library'].map(k=>[k,node(raw?.panels?.[k])]))};
}

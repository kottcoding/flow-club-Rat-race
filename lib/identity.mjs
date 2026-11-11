import {avatarId,safePhoto} from './avatars.mjs';
const PROVIDERS=['google.com','microsoft.com','apple.com'];
const KEY_URL='https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let keyCache={until:0,keys:[]};
export function authConfig(env){const enabled=Boolean(env.FIREBASE_PROJECT_ID&&env.FIREBASE_API_KEY&&env.FIREBASE_AUTH_DOMAIN);return {enabled,providers:enabled?(env.AUTH_PROVIDERS||'google.com,microsoft.com,apple.com').split(',').map(x=>x.trim()).filter(x=>PROVIDERS.includes(x)):[],firebase:enabled?{projectId:env.FIREBASE_PROJECT_ID,apiKey:env.FIREBASE_API_KEY,authDomain:env.FIREBASE_AUTH_DOMAIN}:null};}
export async function hashGuest(token){if(typeof token!=='string'||!/^[-a-zA-Z0-9]{32,100}$/.test(token))throw new Error('SESSION_REQUIRED');return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
function decode(s){return Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),x=>x.charCodeAt(0));}
export async function verifyFirebase(token,project,{fetcher=fetch,now=Date.now(),keys=null}={}){
 try{
  if(!project||typeof token!=='string'||token.length>16000)throw 0;
  const pieces=token.split('.');if(pieces.length!==3)throw 0;
  const header=JSON.parse(new TextDecoder().decode(decode(pieces[0]))),payload=JSON.parse(new TextDecoder().decode(decode(pieces[1])));
  const seconds=now/1000;
  if(header.alg!=='RS256'||typeof header.kid!=='string'||payload.aud!==project||payload.iss!==`https://securetoken.google.com/${project}`||typeof payload.sub!=='string'||!payload.sub||payload.sub.length>128||!Number.isFinite(payload.exp)||payload.exp<=seconds||!Number.isFinite(payload.iat)||payload.iat>seconds+30||!Number.isFinite(payload.auth_time)||payload.auth_time>seconds+30||!PROVIDERS.includes(payload.firebase?.sign_in_provider))throw 0;
  if(!keys){if(keyCache.until<now){const r=await fetcher(KEY_URL);if(!r.ok)throw 0;const d=await r.json();keyCache={keys:d.keys||[],until:now+300000};}keys=keyCache.keys;}
  const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)throw 0;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(pieces[2]),new TextEncoder().encode(pieces[0]+'.'+pieces[1])))throw 0;
  return payload;
 }catch{throw new Error('SIGN_IN_REQUIRED');}
}
export function requireSameOrigin(req){const origin=req.headers.get('Origin');if(origin&&origin!==new URL(req.url).origin)throw new Error('BAD_ORIGIN');}
export async function identity(req,env){
 const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');
 if(token?.includes('.')){
  if(!authConfig(env).enabled)throw new Error('AUTH_NOT_CONFIGURED');
  const claims=await verifyFirebase(token,env.FIREBASE_PROJECT_ID),key='account:'+claims.sub;
  const rows=await env.DB.prepare('SELECT guest_key FROM guest_claims WHERE account_key=?').bind(key).all();
  return {key,keys:[key,...rows.results.map(r=>r.guest_key)],claims,account:true};
 }
 const key=await hashGuest(token);
 try{if(await env.DB.prepare('SELECT guest_key FROM guest_claims WHERE guest_key=?').bind(key).first())throw new Error('GUEST_UPGRADED');}catch(e){if(authConfig(env).enabled||!String(e.message).includes('no such table: guest_claims'))throw e;}
 return {key,keys:[key],account:false};
}
export function adoptRoom(g,who){for(const p of g.players)if(who.keys.includes(p.key))p.key=who.key;if(who.keys.includes(g.creatorKey))g.creatorKey=who.key;return g;}
export async function ensureProfile(env,who){
 const c=who.claims;let profile=await env.DB.prepare('SELECT * FROM player_profiles WHERE account_key=?').bind(who.key).first();
 if(!profile){await env.DB.prepare('INSERT OR IGNORE INTO player_profiles(account_key,display_name,photo_url,avatar_id,avatar_mode,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').bind(who.key,String(c.name||'Player').trim().slice(0,24)||'Player',safePhoto(c.picture),0,safePhoto(c.picture)?'photo':'avatar',Date.now(),Date.now()).run();profile=await env.DB.prepare('SELECT * FROM player_profiles WHERE account_key=?').bind(who.key).first();}
 return profile;
}
export function publicProfile(p){return {name:p.display_name,avatar:{id:p.avatar_id,mode:p.avatar_mode,photo:p.photo_url}};}
export async function appearance(env,who,body){if(who.account)return publicProfile(await ensureProfile(env,who)).avatar;return {id:avatarId(body.avatarId),mode:'avatar'};}
export async function claimGuest(env,who,token){
 const key=await hashGuest(token),existing=await env.DB.prepare('SELECT account_key FROM guest_claims WHERE guest_key=?').bind(key).first();
 if(existing){if(existing.account_key!==who.key)throw new Error('GUEST_ALREADY_LINKED');return;}
 // A single SQL statement checks and claims atomically, including prior aliases.
 const result=await env.DB.prepare(`INSERT OR IGNORE INTO guest_claims(guest_key,account_key,created_at)
 SELECT ?,?,? WHERE NOT EXISTS (
 SELECT r.id FROM rooms r,json_each(r.state,'$.players') p
 WHERE json_extract(p.value,'$.key') IN (?,?) OR json_extract(p.value,'$.key') IN (SELECT guest_key FROM guest_claims WHERE account_key=?)
 GROUP BY r.id HAVING COUNT(*)>1)` ).bind(key,who.key,Date.now(),key,who.key,who.key).run();
 if(!result.meta.changes){const row=await env.DB.prepare('SELECT account_key FROM guest_claims WHERE guest_key=?').bind(key).first();if(row?.account_key===who.key)return;throw new Error(row?'GUEST_ALREADY_LINKED':'SEAT_CONFLICT');}
}

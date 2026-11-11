import {env} from 'cloudflare:workers';
import {authConfig,identity,ensureProfile,publicProfile,claimGuest,requireSameOrigin} from '../../../lib/identity.mjs';
import {avatarId,safePhoto} from '../../../lib/avatars.mjs';
export const dynamic='force-dynamic';
const json=(d,status=200)=>Response.json(d,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req){try{
 if(new URL(req.url).searchParams.has('config'))return json(authConfig(env));
 const who=await identity(req,env);if(!who.account)return json({profile:null});
 const p=await ensureProfile(env,who);
 const stats=await env.DB.prepare(`SELECT COUNT(*) AS played,COALESCE(SUM(won),0) AS wins,COALESCE(SUM(fast_track),0) AS escaped FROM game_results WHERE owner_key=? OR owner_key IN (SELECT guest_key FROM guest_claims WHERE account_key=?)`).bind(who.key,who.key).first();
 return json({profile:publicProfile(p),stats});
 }catch(e){return json({error:e.message},401);}}
export async function POST(req){try{
 requireSameOrigin(req);if(Number(req.headers.get('content-length'))>10000)throw new Error('TOO_LARGE');
 const who=await identity(req,env);if(!who.account)throw new Error('SIGN_IN_REQUIRED');
 const b=await req.json();const p=await ensureProfile(env,who);
 if(b.type==='claim'){await claimGuest(env,who,req.headers.get('X-Guest-Session'));return json({profile:publicProfile(p),claimed:true});}
 if(b.type!=='profile')throw new Error('INVALID_ACTION');
 const name=typeof b.name==='string'?b.name.trim().slice(0,24):'';if(!name)throw new Error('NAME_REQUIRED');
 // Only verified provider claims may introduce a remote profile image.
 const photo=safePhoto(who.claims.picture)||p.photo_url,mode=b.mode==='photo'&&photo?'photo':'avatar';
 await env.DB.prepare('UPDATE player_profiles SET display_name=?,avatar_id=?,avatar_mode=?,photo_url=?,updated_at=? WHERE account_key=?').bind(name,avatarId(b.avatarId),mode,photo,Date.now(),who.key).run();
 return json({profile:publicProfile(await ensureProfile(env,who))});
 }catch(e){return json({error:e.message},400);}}

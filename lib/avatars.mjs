export const AVATAR_COUNT=12;
export function avatarId(value,fallback=0){return Number.isInteger(value)&&value>=0&&value<AVATAR_COUNT?value:Math.abs(fallback)%AVATAR_COUNT;}
export function avatarPath(value){return '/avatars/person-'+avatarId(value)+'.svg?v=2';}
export function safePhoto(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&value.length<2048?u.href:null;}catch{return null;}}
export function playerPhoto(p,index=0){return p?.avatar?.mode==='photo'&&safePhoto(p.avatar.photo)?safePhoto(p.avatar.photo):avatarPath(avatarId(p?.avatar?.id,index));}

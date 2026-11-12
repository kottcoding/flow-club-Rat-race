'use client';
import {useState} from 'react';
import {avatarId,avatarPath,playerPhoto,AVATAR_COUNT} from '../lib/avatars.mjs';
export function PlayerAvatar({player,index=0,active=false,number=true,lang='th'}){
 index=player?.seatIndex??index;
 const [failed,setFailed]=useState(''),src=playerPhoto(player,index),fallback=avatarPath(avatarId(player?.avatar?.id,index));
 return <span className={'player-face '+(active?'is-turn':'')} style={{'--seat-color':['#8751d4','#c57b08','#148573','#c44364','#277bb7','#a5449a'][index%6]}}>
  <span className="face-crop"><img src={failed===src?fallback:src} alt="" referrerPolicy="no-referrer" onError={()=>setFailed(src)}/></span>
  {number&&<span className="face-number">{index+1}</span>}
  {active&&<span className="sr-only">{lang==='th'?'กำลังเล่น':'Current turn'}</span>}
 </span>;
}
export function AvatarPicker({value,onChange,lang}){return <div className="avatar-picker" role="group" aria-label={lang==='th'?'เลือกรูปผู้เล่น':'Choose an avatar'}>{Array.from({length:AVATAR_COUNT},(_,id)=><button type="button" key={id} className={value===id?'chosen':''} aria-pressed={value===id} aria-label={(lang==='th'?'รูปผู้เล่น ':'Avatar ')+(id+1)} onClick={()=>onChange(id)}><img src={avatarPath(id)} alt=""/></button>)}</div>;}

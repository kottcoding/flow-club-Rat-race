const digest=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),b=>b.toString(16).padStart(2,'0')).join('');
export async function setRoomLock(g,key,locked,pin){
 if(!g.creatorKey||g.creatorKey!==key)throw Error('CREATOR_ONLY');
 if(g.status!=='lobby')throw Error('LOBBY_ONLY');
 if(typeof locked!=='boolean')throw Error('INVALID_PIN');
 if(!locked){delete g.roomLock;return;}
 if(typeof pin!=='string'||!/^\d{4}$/.test(pin))throw Error('INVALID_PIN');
 const salt=crypto.randomUUID();g.roomLock={salt,hash:await digest(salt+':'+pin),failures:{}};
}
export async function checkRoomPin(g,key,pin,now=Date.now()){
 if(!g.roomLock)return null;
 const lock=g.roomLock,id=await digest(key),attempt=lock.failures?.[id];
 if(attempt?.until>now)return 'PIN_RATE_LIMIT';
 if(typeof pin!=='string'||!/^\d{4}$/.test(pin))return 'PIN_REQUIRED';
 if(await digest(lock.salt+':'+pin)===lock.hash)return null;
 lock.failures=Object.fromEntries(Object.entries(lock.failures||{}).filter(([,v])=>v.time>now-300000).slice(-99));
 const count=attempt?.time>now-300000&&!(attempt.until&&attempt.until<=now)?attempt.count+1:1;
 lock.failures[id]={count,time:now,until:count>=5?now+60000:0};
 return count>=5?'PIN_RATE_LIMIT':'PIN_INCORRECT';
}

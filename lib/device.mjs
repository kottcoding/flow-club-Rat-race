export const DEVICE_TYPES=['mobile','mobile-ios','mobile-android','tablet','pc','unknown'];
export const cleanDevice=value=>DEVICE_TYPES.includes(value)?value:'unknown';
// Best-effort label only. Never used for authorization or responsive layout.
export function detectDevice(nav={}){
 const ua=nav.userAgent||'',platform=nav.platform||'';
 if(/iPad/i.test(ua)||(/Mac/i.test(platform)&&Number(nav.maxTouchPoints)>1))return 'tablet';
 if(/iPhone|iPod/i.test(ua))return 'mobile';
 if(/Android/i.test(ua))return /Mobile/i.test(ua)?'mobile':'tablet';
 if(/Tablet|PlayBook|Silk/i.test(ua))return 'tablet';
 if(nav.userAgentData?.mobile===true||/Mobile|Windows Phone/i.test(ua))return 'mobile';
 if(/Windows|Macintosh|X11|CrOS|Linux/i.test(ua))return 'pc';
 return 'unknown';
}
// Enrich the reported label while keeping detectDevice's Master-device checks unchanged.
export function detectDeviceReport(nav={}){
 const type=detectDevice(nav),ua=nav.userAgent||'';
 if(type!=='mobile')return type;
 if(/iPhone|iPod/i.test(ua))return 'mobile-ios';
 if(/Android/i.test(ua)||nav.userAgentData?.platform==='Android')return 'mobile-android';
 return 'mobile';
}
export function deviceLabel(value,lang='th'){
 const labels={mobile:['มือถือ','Mobile'],'mobile-ios':['มือถือ · iOS','Mobile · iOS'],'mobile-android':['มือถือ · Android','Mobile · Android'],tablet:['แท็บเล็ต/iPad','Tablet/iPad'],pc:['PC / Notebook','PC / Notebook'],unknown:['ไม่ทราบอุปกรณ์','Unknown device']};
 return labels[cleanDevice(value)][lang==='en'?1:0];
}

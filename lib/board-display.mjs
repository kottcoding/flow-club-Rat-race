// Display labels only; the complete names, prices and rules remain in board data.
export const boardShortLabels=[
 ['ถูกฟ้อง','Lawsuit'],['อนุรักษ์|ป่า','Protect a|forest'],['สวนอาหาร','Garden|restaurant'],['เชียร์บอล|ทีมโปรด','Football|heroes'],
 ['ร้าน|เบอร์เกอร์','Burger|shop'],['อารยธรรม|โบราณ','Ancient|civilizations'],['อาหาร|จานด่วน','Fast-food|centres'],['ตลาดหุ้น|สำหรับเด็ก','Kids’ stock|market'],
 ['บริจาค','Charity'],['ซ่อมแอร์','Air-con|service'],['แข่งเรือ|ยอชต์','Yacht|racing'],['อะไหล่|รถบรรทุก','Truck|parts'],
 ['รับกระแส|เงินสด','CASHFLOW|Day'],['เทศกาล|ภาพยนตร์','Film|festival'],['เหมืองทอง','Gold mine'],['บ้านพัก|ตากอากาศ','Holiday|home'],
 ['ตรวจสอบ|ภาษี','Tax audit'],['สวนและ|สกายวอล์ค','Park &|skywalk'],['แฟรนไชส์|ไก่ทอด','Fried chicken|franchise'],['สมัคร|วุฒิสภา','Run for|Senate'],
 ['ร้านสปา','Spas'],['จัดตั้ง|มูลนิธิ','Create a|foundation'],['ศูนย์ซ่อม|รถยนต์','Auto repair|centre'],['สกี|แอลป์','Alpine|skiing'],
 ['ขุดน้ำมัน|รัสเซีย','Russian|oil drilling'],['มื้อค่ำกับ|ศิลปินโปรด','Dinner with|your idol'],['ร้านเสื้อผ้า','Clothing|shops'],['ศูนย์วิจัย|โรค','Medical|research'],
 ['รับกระแส|เงินสด','CASHFLOW|Day'],['7 สิ่ง|มหัศจรรย์','7 wonders'],['IPO|25,000 หุ้น','IPO|25,000 shares'],['อนุรักษ์|ทะเลไทย','Protect|Thai seas'],
 ['หย่าร้าง','Divorce'],['เจ็ตส่วนตัว','Private jet'],['อพาร์ทเมนต์|60 ห้อง','60-unit|apartment'],['กอล์ฟ|รอบโลก','World golf'],
 ['แฟรนไชส์|พิซซ่า','Pizza|franchise'],['สร้างหอศิลป์','Art gallery'],['มินิมาร์ต','Mini-mart'],['หมู่เกาะ|ทะเลใต้','South Sea|islands'],
 ['IPO|50,000 หุ้น','IPO|50,000 shares'],['กองทุน|การศึกษา','Education|fund'],['ร้านซักแห้ง','Dry cleaner'],['ล่องเรือ|เมดิเตอร์|เรเนียน','Mediterranean|cruise'],
 ['รับกระแส|เงินสด','CASHFLOW|Day'],['สวนป่า|กลางเมือง','Urban|forest'],['ผลิต|เครื่องครัว','Kitchenware|factory'],['แอฟริกัน|ซาฟารี','African|safari'],
];
const point=(r,d)=>[600+r*Math.cos(d*Math.PI/180),500+r*Math.sin(d*Math.PI/180)];
// The two transition spaces are a single continuous shape each, joining the
// exact arc boundary to the perimeter. They are not extra game spaces.
export function boardTransitionPath(index){
 if(index===0)return `M 910 735 L 822 735 Q 805 745 ${point(290,50)} L ${point(205,50)} Q 775 825 822 825 L 910 825 Z`;
 if(index===15)return `M 202 735 L 290 735 Q 370 745 ${point(290,130)} L ${point(205,130)} Q 370 825 290 825 L 202 825 Z`;
 return null;
}

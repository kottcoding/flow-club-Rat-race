// Transcribed from the user's board photograph 20261108_171728.jpg.
// English names and short descriptions are translations, not official edition text.
export const THAI_PACK_ID = 'thai-photo-20261108-v1';
export const dreams = [
  ['kids-market','ตลาดหุ้นจำลองสำหรับเด็ก','Stock market for children',1250000,'สนับสนุนการเรียนรู้เรื่องหุ้นและการลงทุนของเด็ก','Support children learning about investing.'],
  ['ancient-civilizations','เที่ยวชมอารยธรรมโบราณ','Explore ancient civilizations',1250000,'ออกเดินทางไปเรียนรู้มรดกจากอารยธรรมโบราณ','Travel to discover ancient civilizations.'],
  ['football-season','กระทบไหล่นักฟุตบอลคนโปรด','Meet your football heroes',2000000,'ติดตามทีมและนักฟุตบอลคนโปรดตลอดฤดูกาล','Enjoy a season with your favourite team.'],
  ['forest','อนุรักษ์ป่า','Protect a forest',3500000,'ร่วมปกป้องผืนป่าและเปิดพื้นที่เรียนรู้ธรรมชาติ','Protect woodland and create a place to learn about nature.'],
  ['safari','African Photo Safari','African Photo Safari',1000000,'เดินทางกับเพื่อนเพื่อถ่ายภาพสัตว์ป่าในแอฟริกา','Photograph African wildlife with friends.'],
  ['urban-forest','สร้างสวนป่ากลางเมือง','Create an urban forest',1500000,'เพิ่มพื้นที่สีเขียวให้คนในเมืองได้พักผ่อน','Create a green retreat for the city.'],
  ['mediterranean','ท่องทะเลเมดิเตอร์เรเนียนด้วยเรือยอชต์ส่วนตัว','Private yacht on the Mediterranean',1000000,'ล่องเรือส่วนตัวไปตามเมืองริมทะเลเมดิเตอร์เรเนียน','Cruise the Mediterranean on a private yacht.'],
  ['education-fund','กองทุนเพื่อการศึกษา','Education fund',2000000,'สนับสนุนโอกาสทางการศึกษา','Support opportunities to learn.'],
  ['south-sea','หมู่เกาะทะเลใต้','South Sea islands',1000000,'พักผ่อนบนหมู่เกาะและชายหาดในฝัน','Unwind on the islands and beaches of your dreams.'],
  ['art-gallery','สร้างหอศิลป์','Build an art gallery',1250000,'สร้างพื้นที่ให้ศิลปะและความคิดสร้างสรรค์','Create a home for art and creativity.'],
  ['world-golf','เล่นกอล์ฟรอบโลก','Golf around the world',1500000,'เดินทางไปเล่นกอล์ฟในสนามชั้นนำทั่วโลก','Play outstanding golf courses around the world.'],
  ['private-jet','เครื่องบินเจ็ตส่วนตัว','Private jet',1000000,'เดินทางด้วยเครื่องบินเจ็ตส่วนตัว','Travel with a private jet.'],
  ['thai-conservation','ร่วมอนุรักษ์ท้องทะเลไทย','Protect Thailand’s seas',1250000,'ร่วมดูแลสัตว์ทะเลและระบบนิเวศทางทะเลของไทย','Help protect Thailand’s marine wildlife and ecosystems.'],
  ['seven-wonders','สิ่งมหัศจรรย์ของโลกทั้ง 7','Seven wonders of the world',2000000,'ออกเดินทางไปชมสิ่งมหัศจรรย์ของโลก','Visit the wonders of the world.'],
  ['medical-research','ศูนย์วิจัยโรคมะเร็งและเอดส์','Cancer and AIDS research centre',2250000,'สนับสนุนสถานที่และทรัพยากรสำหรับงานวิจัย','Fund facilities and resources for medical research.'],
  ['chamber-dinner','ทานอาหารค่ำกับประธานหอการค้าจังหวัด','Dinner with the chamber of commerce chair',1000000,'ร่วมงานเลี้ยงอาหารค่ำกับประธานหอการค้าจังหวัด','Attend dinner with the provincial chamber of commerce chair.'],
  ['alpine-ski','เล่นสกีที่เทือกเขาแอลป์','Ski in the Alps',1500000,'ใช้เวลาพักผ่อนและเล่นสกีบนเทือกเขาแอลป์','Enjoy a skiing holiday in the Alps.'],
  ['foundation','จัดตั้งมูลนิธิ','Establish a foundation',1750000,'ก่อตั้งมูลนิธิเพื่อสนับสนุนสิ่งที่คุณให้ความสำคัญ','Establish a foundation for a cause you care about.'],
  ['senate','สมัครสมาชิกวุฒิสภา','Run for the Senate',1250000,'ก้าวสู่เส้นทางการเมืองตามความฝันบนกระดาน','Pursue the public-service dream on the board.'],
  ['named-park','สร้างสวนสาธารณะพร้อมสถานีตำรวจ','Build a park with a police station',3000000,'สร้างสวนสาธารณะพร้อมพื้นที่ดูแลความปลอดภัย','Create a public park with a safety station.'],
  ['private-cabin','บ้านพักตากอากาศส่วนตัว','Private holiday cabin',1500000,'พักผ่อนในบ้านตากอากาศส่วนตัว','Retreat to your own holiday cabin.'],
  ['film-festival','เที่ยวงานเทศกาลภาพยนตร์','Visit a film festival',1500000,'ท่องเที่ยวและร่วมงานเทศกาลภาพยนตร์','Travel and enjoy a film festival.'],
  ['yacht-racing','แข่งเรือยอชต์','Yacht racing',1500000,'ร่วมทีมแข่งขันเรือยอชต์','Join a yacht-racing crew.'],
].map(([id,th,en,cost,descriptionTh,descriptionEn],index)=>({
  id,name:[th,en],cost,description:[descriptionTh,descriptionEn],
  number:index+1,currency:'THB',source:'board-photo',
}));

// 23 Dream spaces, each reachable exactly once. Web layout, not a reproduction
// of the physical board's route. Four Cash Days are spaced around the route.
export const outer = Array.from({length:48},(_,i)=>i%2?'dream:'+dreams[(i-1)/2]?.id:'business');
for(const [i,tile] of [[0,'cashday'],[12,'cashday'],[24,'cashday'],[36,'cashday'],[6,'charity'],[18,'audit'],[30,'lawsuit'],[42,'divorce'],[47,'business']])outer[i]=tile;

export const engineer = {
  id:'engineer-photo',name:['วิศวกร','Engineer'],source:'profession-photo',
  salary:49000,tax:10500,living:10900,savings:4000,child:2500,
  debts:[['Home loan',750000,7000],['Student loan',120000,600],['Car loan',70000,1400],['Credit card',40000,1200],['Other loan',10000,500]],
};
export const debtNames={
  'Home loan':['เงินกู้ซื้อบ้าน','Home loan'], 'Student loan':['เงินกู้เพื่อการศึกษา','Student loan'],
  'Car loan':['เงินกู้ซื้อรถ','Car loan'], 'Credit card':['หนี้บัตรเครดิต','Credit card'], 'Other loan':['เงินกู้อื่น ๆ','Other loan'],
};

// Sample cards: the supplied photos show deck backs, not their face values.
// Replace these records only after checking card-face references.
export const doodads = [
  ['car-repair','ซ่อมรถฉุกเฉิน','Emergency car repair',8000],
  ['home-appliance','เปลี่ยนเครื่องใช้ไฟฟ้า','Replace a home appliance',5000],
  ['family-trip','ทริปพักผ่อนของครอบครัว','Family getaway',12000],
  ['phone-repair','ซ่อมโทรศัพท์','Phone repair',3000],
  ['roof-repair','ซ่อมหลังคาบ้าน','Roof repairs',15000],
  ['celebration','ค่าใช้จ่ายงานครอบครัว','Family celebration',6000],
  ['sports-equipment','ซื้ออุปกรณ์กีฬา','Sports equipment',4000],
  ['computer-repair','ซ่อมคอมพิวเตอร์','Computer repair',7000],
].map(([id,th,en,cost])=>({id,name:[th,en],cost,source:'sample',type:'doodad',mandatory:true}));
export const markets = [
  {id:'sun-150',kind:'stock',symbol:'SUN',price:150,allowBuying:true,name:['ตลาดหุ้น SUN เปิดซื้อขาย','SUN trading session']},
  {id:'sun-500',kind:'stock',symbol:'SUN',price:500,allowBuying:false,name:['ผู้ซื้อเสนอราคาหุ้น SUN','Buyer offers for SUN']},
  {id:'green-50',kind:'stock',symbol:'GREEN',price:50,allowBuying:true,name:['ตลาดหุ้น GREEN เปิดซื้อขาย','GREEN trading session']},
  {id:'green-300',kind:'stock',symbol:'GREEN',price:300,allowBuying:false,name:['ผู้ซื้อเสนอราคาหุ้น GREEN','Buyer offers for GREEN']},
  {id:'property-120',kind:'property',multiplier:1.2,name:['ผู้ซื้ออสังหาริมทรัพย์: 120% ของราคาทุน','Property buyer: 120% of original cost']},
  {id:'property-150',kind:'property',multiplier:1.5,name:['ผู้ซื้ออสังหาริมทรัพย์: 150% ของราคาทุน','Property buyer: 150% of original cost']},
  {id:'property-200',kind:'property',multiplier:2,name:['ผู้ซื้ออสังหาริมทรัพย์: 200% ของราคาทุน','Property buyer: 200% of original cost']},
].map(c=>({...c,type:'market',source:'sample'}));

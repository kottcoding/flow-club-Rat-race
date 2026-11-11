# คู่มือติดตั้ง Flow Club — บัญชีผู้เล่น, Avatar และวงสีรุ้ง

แพตช์นี้ใช้กับ Flow Club บน Cloudflare Workers + D1 ของคุณ
ยังไม่ได้เปิด Login บนเว็บไซต์จริง: ต้องตั้งค่าผู้ให้บริการตามส่วน B ก่อน

## A. อัปเดตโค้ดและฐานข้อมูล

1. สำรองโฟลเดอร์ repository และ Commit/Pull งานเดิมใน GitHub Desktop ให้เรียบร้อย หากมี Merge conflict ให้แก้ก่อนวางแพตช์
2. แตก flow-club-accounts-avatars-update.zip คัดลอกโฟลเดอร์ app, components, lib, public, db และ tests ลงใน repository ระดับเดียวกับ package.json ให้แทนที่ไฟล์เดิม
   ห้ามนำไฟล์ด้านในไปวางรวมที่ root เช่น route.js ต้องอยู่ app/api/game/route.js และ app/api/account/route.js ตามโฟลเดอร์เดิม
   อย่าคัดลอกทับ .git, node_modules หรือไฟล์ตั้งค่าบัญชีส่วนตัว
3. Cloudflare → Storage & databases → D1 → flow-club-db → Console
   เปิด db/002-player-accounts.sql จากแพตช์ คัดลอก SQL ทั้งหมดลง Console แล้ว Execute
   SQL เพิ่ม 3 ตาราง player_profiles, guest_claims, game_results และดัชนี ไม่มี DROP/DELETE ห้องเดิม รันซ้ำได้
   ทางเลือก Terminal (จาก root repository):
   npx wrangler d1 execute flow-club-db --remote --file=db/002-player-accounts.sql
4. ตรวจรายการ Changes, Commit เช่น “Add player accounts, avatars and rainbow turns” และ Push origin
5. รอ Cloudflare build/deploy ของ commit นี้ผ่าน แล้ว Ctrl+F5

ในขั้นนี้ Guest เลือก Avatar 12 แบบ ใช้หมายเลขและวงสีรุ้งได้ทันที แม้ยังไม่ได้ตั้งค่า Firebase ปุ่ม Social Sign-in จะแสดงเป็นปิดใช้งานพร้อมคำอธิบาย
ห้ามเปิด Firebase configuration ก่อนสร้างตารางสำเร็จ

## B. เปิด Firebase Authentication

1. เข้า https://console.firebase.google.com/ ด้วยบัญชีเจ้าของโปรเจกต์ สร้าง Firebase Project สำหรับ Flow Club (ไม่จำเป็นต้องเปิด Analytics)
2. Project settings → General → Your apps → เพิ่ม Web app
3. จดค่า projectId, apiKey, authDomain จาก Web configuration อย่าสับสน apiKey นี้กับ Client Secret ของ OAuth
4. Authentication → Get started → Sign-in method ตั้งค่าผู้ให้บริการที่ต้องการ
5. Authentication → Settings → Authorized domains เพิ่ม:
   flow-club-rat-race.zicxnals.workers.dev
   และโดเมนจริงอื่นที่ใช้เปิดเกม (ไม่ใส่ https:// หรือ /path)
   สำหรับทดสอบในเครื่องให้เพิ่ม localhost/127.0.0.1 ตามโดเมนที่ใช้ ไม่ต้องเพิ่มถ้าไม่ได้ทดสอบในเครื่อง

### Google
เปิด Google ใน Firebase Authentication และเลือก Support email แล้ว Save
ตั้งค่า OAuth consent screen / ชื่อแอป / โดเมนตามที่ Google Console ขอ หากแอปอยู่ Testing ให้เพิ่มบัญชีผู้ทดสอบหรือปรับสถานะให้เหมาะสมก่อนเปิดให้ทุกคน

### Microsoft
1. Microsoft Entra admin center → App registrations → New registration
2. หากต้องการรองรับทั้งบัญชีบริษัท/โรงเรียนและบัญชีส่วนตัว ให้เลือกประเภทที่รองรับทั้ง organizational directories และ personal Microsoft accounts
3. เพิ่ม Web redirect URI: https://YOUR_AUTH_DOMAIN/__/auth/handler
   โดย YOUR_AUTH_DOMAIN คือค่า authDomain จริง เช่น your-project.firebaseapp.com
4. จด Application (client) ID และสร้าง Client Secret บันทึกค่า secret ไว้ในที่ปลอดภัย พร้อมวันหมดอายุ
5. Firebase Authentication → Microsoft → กรอก Client ID และ Client Secret → Enable/Save
บางองค์กรอาจต้องอนุมัติแอปโดยผู้ดูแล Microsoft ขององค์กร

### Apple
ต้องมี Apple Developer Program ที่ตั้งค่า Sign in with Apple ได้ก่อน
1. ตั้งค่า App ID ที่เปิด Sign in with Apple และ Services ID สำหรับเว็บไซต์ ตามขั้นตอนของ Apple/Firebase
2. กำหนด domain และ Return URL: https://YOUR_AUTH_DOMAIN/__/auth/handler
3. สร้าง Sign in with Apple Key และเตรียม Team ID, Key ID, Private Key (.p8)
4. Firebase Authentication → Apple → กรอก Services ID และ OAuth configuration เหล่านี้ → Enable/Save
Apple อาจให้ชื่อเฉพาะการอนุญาตครั้งแรก และอาจไม่ส่งรูปโปรไฟล์มา แอปจึงใช้ Avatar แทนได้
ไม่ต้องขอสิทธิ์ Microsoft Graph หรือ Apple เพิ่มเพื่อเอารูป หากผู้ให้บริการไม่ส่งรูป ให้ใช้ Avatar

OAuth Client Secret / Apple Private Key ต้องกรอกใน Firebase Console เท่านั้น ห้ามใส่ใน GitHub, ZIP หรือส่งในแชต

## C. เชื่อม Cloudflare กับ Firebase

แก้ไฟล์ wrangler.jsonc เดิมใน repository โดยเพิ่ม property vars ตามตัวอย่างด้านล่าง เปลี่ยนค่าตัวอย่างทั้งหมดให้ตรง Firebase ของคุณ
เก็บ main, d1_databases, database_id, triggers และ configuration เดิมไว้ ห้ามแทนที่ไฟล์ทั้งไฟล์ด้วยตัวอย่างนี้

"vars": {
  "FIREBASE_PROJECT_ID": "your-project-id",
  "FIREBASE_API_KEY": "your-firebase-web-api-key",
  "FIREBASE_AUTH_DOMAIN": "your-project-id.firebaseapp.com",
  "AUTH_PROVIDERS": "google.com,microsoft.com,apple.com"
}

ใส่ comma ให้ JSON ถูกต้อง เช่นเพิ่ม comma หลัง property ก่อน vars
ถ้ายังตั้งค่าเฉพาะ Google ให้ใช้ AUTH_PROVIDERS เป็น google.com ก่อน แล้วค่อยเพิ่ม ,microsoft.com หรือ ,apple.com เมื่อพร้อม ปุ่มที่ยังไม่เปิดจะกดไม่ได้
ค่า Firebase Web configuration เหล่านี้เป็นค่าฝั่งเว็บที่ผู้เล่นเห็นได้ ไม่ใช่ OAuth Client Secret
หากเลือกตั้งผ่าน Cloudflare Dashboard แทน ต้องเป็น runtime Variables ของ Worker และตั้ง keep_vars: true ใน Wrangler เพื่อรักษาค่าขณะ deploy ครั้งถัดไป วิธีใช้ vars ในไฟล์ช่วยให้การ deploy ต่อเนื่องชัดเจนกว่า
Commit และ Push อีกครั้ง รอ Deploy สำเร็จและ Ctrl+F5

## D. วิธีใช้งาน

- กด “โปรไฟล์ / เข้าสู่ระบบ” ด้านบน
- Guest: ตั้งชื่อ เลือกรูปคน แล้วกดบันทึกโปรไฟล์ เก็บตัวเลือกไว้ในเบราว์เซอร์เดิม
- Login: กด Google, Microsoft หรือ Apple ชื่อและรูปที่ผู้ให้บริการส่งมาจะใช้เป็นค่าเริ่มต้น หากไม่มีรูปให้ใช้ Avatar
- ชื่อที่ผู้เล่นแก้ไขแล้วจะไม่ถูกเขียนทับด้วยชื่อบัญชีทุกครั้งที่ Login
- เปลี่ยนรูปได้ระหว่างเกม ชื่อในห้องรอเปลี่ยนได้ ส่วนเกมที่เริ่มแล้วคงชื่อเดิมจนจบ ชื่อโปรไฟล์ใหม่ใช้กับห้องใหม่
- หากต้องการนำที่นั่งและสิทธิ์เจ้าของห้อง Guest เดิมไปด้วย ให้เลือก checkbox ก่อน Login หรือใช้ “นำเข้า Guest ของเครื่องนี้” หลัง Login
- การนำเข้า Guest ผูกกับบัญชีที่ยืนยันแล้วเท่านั้น ไม่รวมจากชื่อ/อีเมลเหมือนกัน
- ถ้า Guest กับบัญชีมีที่นั่งในห้องเดียวกัน ระบบจะไม่รวมให้อัตโนมัติ ให้จัดการที่นั่งในห้องรอให้เหลือหนึ่ง หรือรอห้องที่กำลังเล่นจบ/ลบก่อน
- เชื่อมหลายผู้ให้บริการ: Login บัญชีหลัก → โปรไฟล์ → เชื่อมบัญชีเพิ่มเติม → ยืนยันบัญชีที่จะเชื่อม หาก provider นั้นเป็นอีกบัญชีหนึ่งอยู่แล้ว ระบบจะแจ้งว่ายังรวมอัตโนมัติไม่ได้
- เปลี่ยนเครื่อง: Login บัญชีเดิม → เลือกกลับเข้าห้อง จะเป็นที่นั่งเดิมและสิทธิ์เจ้าของห้องเดิม
- Logout จะเปลี่ยนเป็น Guest ใหม่ ไม่ทำให้ Guest ได้สิทธิ์ของบัญชีที่ออกจากระบบ
- ห้องยังหมดอายุหลังสร้าง 7 วัน โปรไฟล์และผลเกมที่จบแล้วอยู่คนละตาราง จึงไม่ถูกลบตามห้อง
- สถิติเริ่มบันทึกจากเกมที่จบหลังเปิดระบบบัญชี ไม่สร้างสถิติย้อนหลังจากห้องที่ถูกลบแล้ว และไม่นับเกมค้าง/หมดอายุเป็นการแพ้

## E. ตรวจรับหลังตั้งค่า

1. Guest สร้างห้อง เลือก Avatar และรีเฟรช รูปเดิมและที่นั่งเดิมต้องอยู่
2. ผู้เล่น 2–6 คนเริ่มเกม เห็นรูป+หมายเลข วงสีรุ้งอยู่ที่คนที่ถึงตาทั้งกรอบชื่อและบนกระดาน
3. Login Google ตั้งชื่อเล่นใหม่ ปิด/เปิดเว็บต้องเป็นชื่อที่บันทึกไว้
4. เปิดอีกเครื่อง Login บัญชีเดิม ตรวจรูป ชื่อ และกลับเข้าห้องเดิม
5. ทดสอบ Microsoft และ Apple แยกกันด้วยบัญชีจริง โดยเฉพาะบัญชีที่ไม่มีรูป/ซ่อนอีเมล
6. นำเข้า Guest แล้วใช้เบราว์เซอร์เดิมหลัง Logout ต้องไม่สามารถใช้งานที่นั่งบัญชีโดยไม่ Login
7. ตรวจสิทธิ์เจ้าของห้อง: เจ้าของลบ/เตะได้ตามกติกา คนอื่นทำไม่ได้
8. เล่นจบหนึ่งเกม เปิดโปรไฟล์ดูสถิติ รีเฟรชหลายครั้งไม่เพิ่มซ้ำ
9. เปิด Reduce motion ในอุปกรณ์ วงสีรุ้งต้องหยุดหมุน แต่ยังบอกตาปัจจุบันชัดเจน

## F. แก้ปัญหาที่พบบ่อย

- ปุ่ม Login ยังเป็นสีจาง: ตรวจว่า Worker ได้ค่า FIREBASE_* ครบ และ AUTH_PROVIDERS มี provider นั้น
- auth/unauthorized-domain: เพิ่มโดเมนเว็บใน Firebase Authorized domains
- auth/operation-not-allowed: ยังไม่ได้ Enable provider ใน Firebase
- auth/popup-blocked: อนุญาต Popup หรือเปิดเว็บผ่าน Chrome/Safari โดยตรง
- auth/account-exists-with-different-credential: Login ด้วยผู้ให้บริการเดิมก่อน จากนั้นเชื่อม provider เพิ่มในโปรไฟล์
- no such table: ตรวจว่า Execute db/002-player-accounts.sql ใน D1 ที่ผูกกับ Worker จริงแล้ว
- SIGN_IN_REQUIRED: ตรวจ projectId ให้ตรงโครงการที่ออก Token, เวลาเครื่อง และ Login ใหม่
- รูปบัญชีไม่ปรากฏ: ผู้ให้บริการอาจไม่ส่งรูปมา หรือรูปโหลดไม่ได้ แอปจะใช้ Avatar แทน
- โลโก้/หน้าเว็บยังเก่า: ตรวจ commit ที่ Deploy สำเร็จล่าสุดและตำแหน่งโฟลเดอร์ไฟล์ แล้ว Ctrl+F5

## ขอบเขตและการทดสอบ

แพตช์รวม Avatar 12 แบบ วงสีรุ้งหมุน 5 วินาที/รอบ รองรับ Reduce motion และคงกรอบทอง Fast Track/กรอบการ์ดสีจากอัปเดตก่อน
ทดสอบ build, กติกาเดิม, API Guest, สิทธิ์ห้อง, ตรวจ JWT ด้วยกุญแจทดสอบ, SQLite migration, นำเข้า Guest, ข้ามอุปกรณ์, ชื่อ/รูป fallback, และสถิติไม่ซ้ำ
การทดสอบบัญชีใช้ Token ที่ลงลายเซ็นด้วยกุญแจชั่วคราวใน test เท่านั้น ไม่ได้ใส่ bypass หรือ test key ไว้ในระบบจริง
ยังไม่ได้ทดสอบ OAuth จริงของบัญชีคุณ เนื่องจากยังไม่มี Firebase/OAuth configuration ต้องทำ checklist ส่วน E หลังตั้งค่า
Firebase SDK ใช้เวอร์ชัน 13.2.0 จาก official Google CDN โหลดเมื่อเปิดระบบบัญชีเท่านั้น Guest ที่ยังไม่ตั้งค่าไม่ต้องโหลด SDK นี้
Server ตรวจลายเซ็น/issuer/audience/เวลาหมดอายุของ Firebase ID Token ส่วนการ revoke ผ่าน Firebase Console อาจมีช่วงเวลาที่ ID Token เดิมยังไม่หมดอายุ รุ่นนี้ยังไม่มีหน้าลบบัญชีหรือระบบบังคับออกจากทุกอุปกรณ์

เอกสารทางการ:
https://firebase.google.com/docs/auth/web/google-signin
https://firebase.google.com/docs/auth/web/microsoft-oauth
https://firebase.google.com/docs/auth/web/apple
https://firebase.google.com/docs/auth/admin/verify-id-tokens
https://firebase.google.com/docs/web/alt-setup

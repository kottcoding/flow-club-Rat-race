# อัปเดต Flow Club 3.0

## ไฟล์ที่ส่ง
flow-club-source-v3.zip คือ source ครบชุด รวมภาพการ์ด 169 ใบ ไม่รวม node_modules, build output, ฐานข้อมูลทดสอบ หรือ credentials

## วิธีแนะนำ: GitHub Desktop
1. สำรอง repository เดิมหรือสร้าง branch ก่อนอัปเดต
2. เปิด checkout ของ kottcoding/flow-club-Rat-race ใน GitHub Desktop
3. แตก ZIP แล้วคัดลอกไฟล์และโฟลเดอร์ข้างในทับที่ root ของ checkout (ระดับเดียวกับ package.json) อย่าสร้างโฟลเดอร์ซ้อน อย่าลบ .git
4. ตรวจ diff แล้ว Commit และ Push origin
5. Cloudflare ที่เชื่อม GitHub จะ build ตามการตั้งค่าเดิม ตรวจผลใน Workers & Pages → flow-club-rat-race → Deployments
6. เมื่อสำเร็จ เปิดเว็บแล้ว Ctrl+F5 สร้างห้องใหม่เพื่อใช้ชุด 169 ใบ ห้องเดิมคงชุดการ์ดเดิม

หากอัปโหลดผ่านหน้าเว็บ GitHub ให้แบ่งครั้งละไม่เกิน 100 ไฟล์และรักษาโครงสร้างโฟลเดอร์ ZIP ไม่ใช่ไฟล์ที่เว็บจะรันโดยตรง จึงต้องแตกไฟล์ก่อน หรือใช้ GitHub Desktop เพื่อส่งทั้งชุดในครั้งเดียว

## การตั้งค่าที่ชุดนี้เตรียมไว้
Worker: flow-club-rat-race
D1 binding: DB → flow-club-db
Build: pnpm build
Deploy: pnpm exec wrangler deploy --config dist/server/wrangler.json
ไฟล์ wrangler.jsonc ใช้ database_id ของฐานข้อมูลเดิม และ cron ทุกชั่วโมงสำหรับลบห้องเกิน 7 วัน
.npmrc ใช้ .pnpm-store ภายในโปรเจกต์ ไม่อ้าง /opt/work

ไม่ต้องสร้าง D1 ใหม่ ไม่ต้อง Execute SQL ซ้ำ และไม่ต้องล้างข้อมูลห้อง

## ตรวจหลัง deploy
- TH/EN และภาพการ์ดเปิดได้
- สร้างห้องใหม่ เห็นข้อความ 169 ใบ
- ใช้อีกเครื่องหรืออีก browser profile เข้าร่วม ทดสอบกดพร้อมและเริ่มเกม
- ในงบการเงินเห็นอาชีพจากภาพและสูตรรวมรายจ่าย
- ตรวจ Cloudflare logs หากพบข้อผิดพลาด

## ผลทดสอบก่อนส่ง
67 unit tests ผ่าน, integration การเล่น 6 คน/สิทธิ์/คำสั่งซ้ำผ่าน, creator-delete 3 tests ผ่าน, production build ผ่าน และเปิดหน้าห้องใหม่/ห้องสมุด/ภาพอาชีพบน local preview แล้ว
การตรวจ UI เป็น smoke test ไม่ใช่การเล่นครบทุกเหตุการณ์ผ่านเบราว์เซอร์ เงื่อนไขการ์ดตรวจด้วย unit tests

ชุดนี้เตรียมไฟล์แล้ว ยังไม่ได้ Push GitHub หรือ deploy ไปยังเว็บจริงจากเซสชันนี้

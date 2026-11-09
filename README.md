# Flow Club 3.0

เกมการเงิน TH / EN สำหรับ 2–6 คนต่อห้อง ไม่ต้องสมัครบัญชี ใช้ React + Vinext + Cloudflare Workers + D1

## ชุดข้อมูล
ห้องใหม่ใช้ `thai-cards-20261109-v1`: ภาพ 169 ใบ (อาชีพ 12, โอกาสเล็ก 49, โอกาสใหญ่ 36, จ่ายซะ 41, ซื้อขาย 31) พร้อม Dream 23 รายการจากภาพกระดานเดิม ดูข้อคลาดเคลื่อนและการตีความใน DATA-REFERENCE.md

- ซื้อขายหุ้น/พันธบัตร, stock split, หนี้และรายได้ตามการ์ด, ค่าใช้จ่ายตามจำนวนลูกและทรัพย์สิน
- ขายสิทธิ์ดีลโดยผู้รับต้องยอมรับ และซื้อขายเฉพาะสินทรัพย์ที่เข้าเงื่อนไข
- สัญญาน้องเขยครบกำหนดเมื่อรับเงินเดือน 48 ครั้ง ตามกติกาที่ผู้ใช้กำหนดเพิ่ม
- งบการเงินและสูตรคำนวณ พร้อมเปิดภาพต้นฉบับได้
- ห้องเดิมที่มี ruleset เดิมคงชุดข้อมูลเดิม สร้างห้องใหม่เพื่อใช้ชุดภาพนี้
- ผู้สร้างห้องเท่านั้นลบห้องได้; ห้องหมดอายุ 7 วันนับจากสร้าง; cron ตรวจทุกชั่วโมง

API mutation ใช้ `clientVersion: 3` หน้าเว็บเก่าต้องรีเฟรชหลังอัปเดต

## พัฒนาและทดสอบ
ต้องใช้ Node.js 22.13+ และ pnpm 10.28.2

```sh
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_aspiring_dragon_man.sql
pnpm start
```

คำสั่ง migration ข้างต้นใช้กับฐานข้อมูลทดสอบใหม่เท่านั้น การอัปเดตรุ่นนี้ไม่ต้องแก้ schema หรือล้างฐานข้อมูลเดิม

```sh
node --test tests/photo-pack.test.mjs tests/game.test.mjs tests/thai-pack.test.mjs tests/room-retention.test.mjs
```

เมื่อเปิด local server แล้ว ตั้ง TEST_URL เป็น URL ของ server ก่อนรัน `node tests/api.test.mjs` และ `node --test tests/delete-room.test.mjs` การทดสอบ API สร้างห้องทดสอบ จึงควรใช้ฐานข้อมูล local

## โครงสร้าง
- lib/photo-pack.mjs: ข้อมูลการ์ดและอาชีพ
- lib/photo-manifest.json: จับคู่ ID กับชื่อไฟล์ภาพเดิม
- lib/photo-rules.mjs: เงื่อนไขการ์ด
- lib/game.mjs: engine และความเข้ากันได้กับห้องเดิม
- components/PhotoEvent.jsx: การตัดสินใจบนการ์ด
- components/GameData.jsx: ห้องสมุดการ์ดและงบการเงิน
- public/cards/: ภาพอ้างอิง WebP 169 ภาพ
- app/api/game/route.js: D1, สิทธิ์ผู้เล่น, revision ป้องกันคำสั่งซ้ำ
- worker/index.ts: Worker และ scheduled cleanup

## ขอบเขต
เป็นเกมเพื่อการเรียนรู้ ไม่ใช่ผลิตภัณฑ์ทางการของ Rich Dad และไม่อ้างว่าครบทุกกติกาของ CASHFLOW ต้นฉบับ ลำดับกระดาน, ธุรกิจ Fast Track และระบบ restructure บางส่วนยังเป็นการออกแบบของ Flow Club

ใช้เบราว์เซอร์เดิมกลับเข้าที่นั่งเดิม การล้าง storage ทำให้เสียสิทธิ์ที่นั่ง ไม่มีระบบข้ามผู้เล่นที่หายไปหรือ moderation สำหรับเว็บขนาดใหญ่ เงินทั้งหมดเป็นเงินจำลอง

วิธีอัปเดต GitHub / Cloudflare อยู่ใน UPDATE-APP.md

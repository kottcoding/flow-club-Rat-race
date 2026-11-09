# Flow Garden — อัปเดตธีมเว็บไซต์

ธีมสดใสด้านการเงิน: กระดานน้ำเงินกรอบทอง กระปุกออมสิน บ้าน เหรียญ ต้นอ่อน กราฟและเครื่องคิดเลข วาดด้วย SVG พื้นเว็บฟ้า/ม่วง/มิ้นต์พาสเทล ส่วนการ์ดและงบการเงินพื้นขาวเพื่ออ่านง่าย

## สำหรับแอปเวอร์ชัน 3 ที่มีการ์ด 169 ใบแล้ว
ใช้ flow-club-theme-update.zip (มีโค้ดเปลี่ยน 4 ไฟล์และคู่มือนี้)
1. เปิด GitHub Desktop repository flow-club-Rat-race
2. ถ้ามี Changes ค้างอยู่ ให้ Commit งานเดิมก่อน จากนั้น Fetch/Pull origin ให้เรียบร้อยก่อนคัดลอกชุดใหม่ หากมี conflict ให้แก้ก่อน ไม่ Commit ไฟล์ที่มี <<<<<<< HEAD ค้าง
3. แตก ZIP แล้วคัดลอกโฟลเดอร์ app, components, public ทับใน repository ระดับเดียวกับ package.json (ไม่ใช่โฟลเดอร์ .git)
4. ตรวจ Changes 4 ไฟล์ แล้ว Commit ด้วยข้อความ Update Flow Garden visual theme
5. Push origin แล้วรอ Cloudflare build และ deploy ผ่าน
6. เปิดเว็บกด Ctrl+F5 หรือ reload บนมือถือ ธีมใช้กับทั้งห้องเดิมและห้องใหม่ทันที

ไฟล์ที่เปลี่ยน:
- app/page.jsx — พื้นกระดานและเส้นขอบช่อง
- app/layout.tsx — โหลด CSS ธีม
- components/flow-garden.css — สีและพื้นหลังทั้งเว็บ + responsive
- public/flow-garden-board-v1.svg — ภาพตกแต่งกระดาน

ไม่ต้องเปลี่ยนฐานข้อมูล, Execute SQL, สร้างห้องใหม่ หรือแก้ Cloudflare settings สำหรับการเปลี่ยนธีมนี้ กติกาและการ์ด 169 ใบคงเดิม

หากยังไม่มี source เวอร์ชัน 3 ใช้ flow-club-source-v3-garden.zip ซึ่งรวมโค้ดครบและการ์ดแทน อย่าใช้ patch ธีมกับรุ่น 2

## ตรวจสอบแล้ว
- production build ผ่าน
- หน้าแรก/ห้องรอ/หน้าเล่นและงบการเงิน เปิดได้ใน local preview
- ตรวจ desktop 1440px และมือถือ 390px ไม่มี horizontal overflow บนหน้ามือถือที่ตรวจ
- สลับไทย/อังกฤษได้ ช่อง Dream และตำแหน่งผู้เล่นยังเป็น SVG เดิมที่ทำงานได้
- เคารพ prefers-reduced-motion ไม่มี animation วนซ้ำหรือไฟกระพริบ

จัดเตรียมไฟล์อัปเดตแล้ว ยังไม่ได้ Push หรือ deploy เว็บจริงจากงานนี้

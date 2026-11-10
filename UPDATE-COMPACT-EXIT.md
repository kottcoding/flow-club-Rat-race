# ปรับปุ่มออกจากห้องให้เท่าปุ่มฉันพร้อมแล้ว

ปุ่มทั้งสองขนาด 136 × 48 px ทั้งบนคอมและมือถือ ปุ่มออกจากห้องยังเป็นสีแดง และไม่ขยายเต็มแถวบนมือถือ

อัปเดตเพียงไฟล์เดียว: components/flow-garden.css
1. Pull origin ก่อน
2. แตก ZIP แล้วคัดลอกโฟลเดอร์ components ทับใน repository ระดับเดียวกับ package.json
3. Commit และ Push origin
4. รอ Cloudflare deploy สำเร็จ แล้ว Ctrl+F5

อย่าอัปโหลด flow-garden.css ไว้ที่ root ต้องอยู่ใน components เท่านั้น
แพตช์นี้สำหรับ Flow Garden + Lobby v3.2 ไม่เปลี่ยนกติกาหรือระบบเตะ/ออกจากห้อง
ยังไม่ได้ Commit/Push/deploy เว็บจริงจากงานนี้

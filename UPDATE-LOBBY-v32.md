# Lobby v3.2 — ปุ่มเตะและออกจากห้องสีแดง

สาเหตุเดิม: อัปโหลด page.jsx, route.js, game.mjs และ CSS ไว้ที่ root แต่แอปอ่านจาก app/page.jsx, app/api/game/route.js, lib/game.mjs และ components/flow-garden.css

ตอนนี้จัดไฟล์ใน repository เครื่องนี้ให้แล้ว:
C:\Users\KOTT\OneDrive\Documents\GitHub\flow-club-Rat-race
เปิด GitHub Desktop → เลือก Changes ทั้งหมด → Commit ชื่อ Fix lobby controls and file locations → Push origin → รอ Cloudflare deploy ผ่าน → Ctrl+F5
ไม่ต้องแตก ZIP ทับซ้ำสำหรับเครื่องนี้ การลบไฟล์ซ้ำที่ root เป็นสิ่งที่ตั้งใจให้เกิดขึ้น

หากใช้ ZIP กับ checkout อื่น: Pull ก่อน แล้วแตก ZIP และคัดลอกโฟลเดอร์ app/components/lib/tests ไปที่ระดับเดียวกับ package.json รักษาโครงสร้างโฟลเดอร์ อย่านำไฟล์ข้างในมารวมที่ root

จุดตรวจหลัง deploy: เห็น Lobby v3.2 ข้างข้อความแนะนำ, ชื่อเพื่อนมีพื้นม่วงกับลูกศร, ปุ่มออกจากห้องสีแดงด้านบนและปุ่มใหญ่ด้านล่าง
ผู้สร้างห้องกดชื่อเพื่อนแล้วกดเตะออกจากห้องได้เฉพาะตอนรอผู้เล่น ผู้ถูกเตะสามารถ Join ใหม่ได้ ไม่ใช่การแบน

ไม่มี migration ฐานข้อมูล ไม่ต้องสร้างห้องใหม่ ตรวจ 71 unit tests ผ่าน, build ผ่าน และกดเตะใน local UI แล้ว จำนวนลดจาก 2 เป็น 1
ยังไม่ได้ Commit/Push/deploy เว็บจริงจากงานนี้

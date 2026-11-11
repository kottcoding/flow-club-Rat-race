// Narrative transcriptions from the owner's photographs; English translations.
export const stories={};
function add(group,rows){for(const [ids,th,en,range] of rows)for(const id of String(ids).split(','))stories[`photo-${group}-${id}`]={text:[th,en],range};}
add('small',[
['1','ธุรกิจเติบโตขึ้นอย่างมาก และบริษัทดำเนินธุรกิจได้เป็นอย่างดี จนมีการแตกหุ้น','Strong business growth and performance lead to a stock split.'],
['2,8','ตลาดมีกำลังซื้อสูง ทำให้หุ้นพุ่งทะยาน','Strong market demand sends share prices soaring.'],
['3','คุณมีไอเดียที่น่าสนใจสำหรับโปรแกรมซอฟต์แวร์ตัวใหม่ บริษัทยังไม่มีกำไรในช่วงแรก คุณจะเลือกสร้างบริษัทใหม่นี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น ยังไม่รู้ว่าจะกำไรหรือขายได้หรือไม่','You have an interesting idea for new software. The startup has no initial profit. Start it or sell the opportunity to another player; future profit and resale are uncertain.'],
['4','หุ้นปรับโครงสร้าง! เกิดการขาดทุนมโหฬารเนื่องจากการขยายตัวเกินความต้องการ และเกิดการซบเซา ผู้ถือหุ้นทุกคนสูญเสียหุ้นครึ่งหนึ่ง','Restructuring after overexpansion and a downturn causes huge losses. All holders lose half their shares.'],
['5','การดำเนินงานของบริษัทประสบความสำเร็จเป็นอย่างดี บริษัทได้ทำการแตกหุ้น','Successful operations lead the company to split its shares.'],
['6','ผู้เช่าค้างชำระค่าเช่า 2 เดือน และย้ายหนี ออกจากที่พักอาศัยก่อนไปได้ทำลายทรัพย์สินด้วย บริษัทประกันจ่ายค่าซ่อมแซมความเสียหายที่เกิดขึ้น แต่คุณก็ยังคงต้องเสียเงินเพิ่มเติมอีก 5,000 บาท\nจ่าย 5,000 บาท ถ้าคุณเป็นเจ้าของที่พักอาศัยทุกชนิด (ถ้าคุณไม่มีเงินจ่าย กู้เงินจากธนาคารได้) เฉพาะผู้ที่เปิดการ์ดใบนี้เท่านั้นที่ต้องจ่ายเงิน','A tenant leaves after missing two months of rent and damages the property. Insurance covers repairs but you must pay another 5,000. Only the drawer who owns rental housing pays; a bank loan is allowed if needed.'],
['7,36','มีเพลงออกมาในท้องตลาดจำนวนมาก แย่งส่วนแบ่งจากการฉายภาพยนตร์ ทำให้ราคาหุ้นตก','Many music releases take market share from movies, lowering the share price.'],
['9','สวนสนุกแห่งใหม่ขาดทุนมหาศาล ส่งผลให้ราคาหุ้นตกต่ำที่สุดในประวัติศาสตร์','A new amusement park suffers huge losses, taking shares to a record low.'],
['10','บ้านสวยว่างอยู่ เนื่องจากเศรษฐกิจตกต่ำ เจ้าของบ้านถูกเลิกจ้าง เหมาะที่จะซื้อไว้ลงทุน คุณมีสิทธิ์ที่จะซื้อบ้านหลังนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','A beautiful house is vacant after an economic downturn and its owner losing their job. Buy it as an investment or sell the opportunity.','650,000–1,350,000'],
['11','บริษัทประกาศขายบ้านเช่า ปัจจุบันไม่มีผู้เช่า ประกาศขายมาแล้ว 6 เดือน ราคาปรับลดลงมาจากราคาเดิม โอกาสดีแบบนี้ไม่มีบ่อยนะ','A company offers a vacant rental house after six months on the market at a reduced price.','650,000–1,350,000'],
['12','เพลงสำหรับเด็กกำลังฮิตติดอันดับ ส่งผลให้ราคาหุ้นสูงเป็นประวัติการณ์','A hit children’s song takes the share price to a record high.'],
['13','บ้านเช่าเงินดาวน์ต่ำ เจ้าของต้องย้ายไปต่างประเทศ ประกาศขายด่วน สำหรับผู้ที่เห็นโอกาสควรรีบคว้าไว้ คุณมีสิทธิ์ที่จะซื้อบ้านหลังนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','The owner is moving abroad and urgently sells a rental house with a low down payment. Buy it or sell the opportunity.','650,000–1,350,000'],
['14','ดอกเบี้ยลดลง ทำให้ผู้คนเปลี่ยนมาลงทุนมากขึ้น','Lower interest rates attract more investors.'],
['15','อัตราดอกเบี้ยต่ำ ส่งผลให้ราคาหุ้นของกิจการโฮมอิเล็กโทรนิกสูงขึ้น','Low interest rates lift Home Electronics shares.'],
['16','ผู้จัดการกองทุนหนุ่มผู้ชาญฉลาด บริหารกองทุนมีผลกำไรมาก จนทุกคนเชื่อว่าเขาเป็นเทพเจ้าแห่งโชคลาภ','A clever young fund manager earns substantial profits and gains a reputation for extraordinary luck.'],
['17','มีผู้เสนอขายเหรียญทองโบราณหายากสภาพดีมาก ขายเหรียญนี้ให้คุณในราคา 5,000 บาท คุณมีสิทธิ์จะซื้อเหรียญทองนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','Someone offers a rare antique gold coin in excellent condition for 5,000. Buy it or sell the opportunity.','0–40,000'],
['18','เพลงสำหรับผู้ใหญ่ฮิตติดอันดับ ส่งผลให้ราคาหุ้นสูงขึ้นมาก','A hit song for adults significantly raises the share price.'],
['19,32','อัตราดอกเบี้ยที่สูงส่งผลให้ราคาหุ้นของกิจการโฮมอิเล็กโทรนิกต่ำกว่ามาตรฐาน','High interest rates depress Home Electronics shares.'],
['20','พี่เขยติดหนี้พนันบอล เขาจำเป็นต้องใช้เงิน 50,000 บาท เพื่อไปใช้หนี้ เขาสัญญาว่าจะคืนเงินให้คุณ 100,000 บาท เมื่อเขาหางานใหม่ที่ได้เงินเดือนมากขึ้น ให้พี่เขยยืมเงินหรือขายสิทธิ์นี้ให้ผู้เล่นคนอื่น','Your brother-in-law needs 50,000 to repay football gambling debt. He promises 100,000 when he finds a better-paid job. Lend the money or sell the opportunity.'],
['21','ผลประกอบการของบริษัทในตลาดหลักทรัพย์ลดลง ส่งผลให้ราคาหุ้นกองทุนรวมลดลงด้วย','Lower listed-company earnings reduce mutual fund prices.'],
['22','ผู้ซื้อภาพยนตร์ถูกไล่ออก หลังจากที่ตลาดธุรกิจบันเทิงตกต่ำอย่างรุนแรง งดโบนัสสำหรับประธานบริษัท','A movie buyer is fired after a severe entertainment downturn. The company president receives no bonus.'],
['23','ความเข้มแข็งของตลาด ส่งผลให้ราคาหุ้นของผู้ผลิตยาพุ่งสูงขึ้น','A strong market lifts pharmaceutical shares.'],
['24','ธนาคารขายบ้านเช่าที่ถูกยึด ไม่มีผู้อยู่อาศัยกว่า 6 เดือน ธนาคารยินดีให้วงเงินกู้และประเมินราคาค่าซ่อมให้แล้ว คุณมีสิทธิ์ที่จะซื้อบ้านหลังนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','The bank sells a foreclosed house vacant for over six months, with financing and repair estimates arranged. Buy it or sell the opportunity.','650,000–1,350,000'],
['25','พ่อต้องการขายห้องพักคอนโดมิเนียมใกล้มหาวิทยาลัย ลูกพักอาศัยในช่วงเรียนหนังสือ คุณมีสิทธิ์ที่จะซื้อ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','A father sells a condo near the university where his child lived while studying. Buy it or sell the opportunity.','450,000–650,000'],
['26,31','ดอกเบี้ยลดลง ส่งผลให้โฮมอิเล็กโทรนิกขายดีขึ้น ราคาหุ้นของบริษัทปรับตัวสูงขึ้น','Lower interest rates improve Home Electronics sales and share prices.'],
['27','การทางพิเศษเสนอขายบ้านเช่าเก่า ตลาดซื้อขายบ้านซบเซา จึงไม่มีการเปิดประมูล คุณมีสิทธิ์ที่จะซื้อบ้านหลังนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','The expressway authority sells an old rental house without auction in a slow market. Buy it or sell the opportunity.','650,000–1,350,000'],
['28','การควบรวมกิจการได้สร้างความเข้มแข็งให้กับส่วนแบ่งการตลาดของบริษัทชั้นนำที่มีชื่อเสียง','A merger strengthens a leading company’s market share.'],
['29','เพื่อนมีความจำเป็นต้องใช้เงิน เขาขายทองคำแท่งน้ำหนัก 10 บาท ในราคาทองบาทละ 3,000 บาท คุณจะซื้อทองคำไว้เอง หรือขายสิทธิ์ให้ผู้เล่นคนอื่น ไม่รู้ว่าอนาคตจะขายได้ราคาเท่าใด','A friend urgently sells 10 baht-weight of gold for 3,000 per baht-weight. Buy it or sell the opportunity. Its future sale price is unknown.'],
['30,47','ธนาคารชั้นนำเสนอขายหุ้นกู้ให้กับลูกค้าของธนาคาร รับประกันดอกเบี้ย และไถ่ถอนคืนได้เมื่อครบกำหนด','A leading bank offers bonds to customers with guaranteed interest and redemption at maturity.'],
['33','บริษัทอยู่ในสถานะที่ไม่มั่นคง เกิดการขาดทุนเนื่องจากข่าวฉาวโฉ่ที่ทำให้วงการยามีมลทิน ผู้ถือหุ้นทุกคนสูญเสียการถือครองหุ้นครึ่งหนึ่ง','A scandal damages the pharmaceutical sector and causes losses. All holders lose half their shares.'],
['34','บริษัทคู่แข่งเปิดสงครามทางการค้าอย่างรุนแรง ส่งผลให้ราคาหุ้นในกลุ่มโฮมอิเล็กโทรนิกตกต่ำมาก','An aggressive competitive price war sharply lowers Home Electronics shares.'],
['35','ตลาดตื่นตระหนกจนทำให้ราคาหุ้นของผู้ผลิตยาตกต่ำลงอย่างมาก','Market panic sharply lowers pharmaceutical shares.'],
['37','ผู้อำนวยการฝ่ายจัดซื้อภาพยนตร์คนใหม่ ช่วยทำให้อนาคตราคาหุ้นของบริษัทสดใสขึ้น','A new film purchasing director improves the company’s share-price outlook.'],
['38,42','บ้านสวย ประกาศขายด่วน เนื่องจากการตกต่ำของอสังหาริมทรัพย์ บ้านได้รับการดูแลอย่างดีจากผู้ที่เช่าอยู่ คุณมีสิทธิ์ที่จะซื้อบ้านหลังนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','A beautiful, well-maintained occupied rental house is urgently sold during a property downturn. Buy it or sell the opportunity.','650,000–1,350,000'],
['39','ห้องพักคอนโดมิเนียมสวยมาก ไม่มีผู้พักอาศัย ทำเลไม่ดี และต้องตกแต่งเพิ่มเติม ก่อนที่จะให้เช่า คุณมีสิทธิ์ที่จะซื้อ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น','A beautiful vacant condo has a poor location and needs decoration before rental. Buy it or sell the opportunity.','450,000–650,000'],
['40','ตลาดอ่อนกำลังซื้อ ส่งผลให้ยอดขายเครื่องใช้ไฟฟ้าภายในบ้านลดลง','Weak demand reduces household appliance sales.'],
['41','คุณได้ประดิษฐ์คิดค้นตัวนำไฟฟ้าชนิดใหม่ ซึ่งยังไม่เคยมีใครทำได้ บริษัทยังไม่มีกำไร คุณจะเลือกสร้างบริษัทใหม่นี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น ยังไม่รู้ว่าจะกำไรหรือขายได้หรือไม่','You invent a new electrical conductor. The startup has no profit yet. Start it or sell the opportunity; future profit and resale are uncertain.'],
['43','ดอกเบี้ยสูงส่งผลให้ราคาหุ้นต่ำลงมาก','High interest rates sharply lower the share price.'],
['44','บ้านเช่าเก่า ถูกยึดเป็นสมบัติของหน่วยงานราชการ ขายพร้อมเงื่อนไขการจำนองที่น่าสนใจ มีผู้เช่าอยู่แล้ว ถ้าคุณไม่มีเงินดาวน์ กู้ธนาคารได้ ซื้อเถอะ','An old government-repossessed rental house with tenants is offered on attractive mortgage terms. The card permits a bank loan for the down payment.','650,000–1,350,000'],
['45','ธุรกิจขยายตัวขึ้น โดยเฉพาะยาสำหรับผู้สูงอายุ','Business expands, especially medicines for older people.'],
['46','ที่ดินสวยอยู่ต่างจังหวัด เหมาะสำหรับสร้างสวนสาธารณะ มีลำธารไหลผ่าน อยู่ในบริเวณที่ยังไม่ได้พัฒนา คุณมีสิทธิ์ที่จะซื้อที่ดินแปลงนี้ หรือขายสิทธิ์ให้ผู้เล่นคนอื่น อาจจะขายได้ราคา ??? บาท','Attractive undeveloped rural land with a stream could become a park. Buy it or sell the opportunity. The future sale price is unknown.'],
['48','ห้องพักคอนโดมิเนียมหลุดจำนองธนาคาร ทำเลดี เพื่อนบ้านน่ารัก ใกล้แหล่งงานและร้านค้า แค่มีเงินดาวน์ก็ผ่อนต่อกับธนาคารได้ทันที คุณมีสิทธิ์ที่จะซื้อหรือขายสิทธิ์ให้ผู้เล่นคนอื่น','A foreclosed condo has a good location, friendly neighbours, nearby jobs and shops. With a down payment, bank instalments can start immediately. Buy it or sell the opportunity.','450,000–650,000'],
['49','ตลาดกำลังบูมมาก ส่งผลให้ราคาหุ้นพุ่งสูงขึ้น','A booming market sends share prices soaring.']
]);
add('big',[
['1','เจ้าของเดิมถูกบังคับขายเนื่องจากมีปัญหาด้านกฎหมาย จดจำนองกับธนาคารได้ทันที','Legal problems force the owner to sell. Bank mortgage financing is immediately available.','2,000,000–3,200,000'],
['2','ต้องการขายกิจการตู้ขายเครื่องดื่มหยอดเหรียญ 30 ตู้ พร้อมสัญญาเช่าพื้นที่ระยะยาว ที่สามารถต่อสัญญาได้ เจ้าของร้อนเงิน ขายด่วน','Thirty drink vending machines with renewable long-term location leases. The owner urgently needs cash.'],
['3','เจ้าของต้องการเงินไปจ่ายค่ารักษาพยาบาล มีผู้เช่าเดิมอยู่แล้ว ชำระค่าเช่าตรงเวลา น่าลงทุนมาก','The owner needs money for medical bills. Existing tenants pay rent on time.','500,000–800,000'],
['4','บ้านสวย เจ้าของเดิมตกแต่งไว้น่าอยู่มาก อยู่ต่างจังหวัด ใกล้สถานศึกษา','An attractively decorated house outside the capital, close to educational institutions.','650,000–1,350,000'],
['5','จำนวน 24 ห้องชุด ในย่านสถานศึกษา มีผู้เช่าเต็มทุกห้อง จึงมีรายได้ต่อเดือนสูง','Twenty-four fully occupied apartments near schools generate high monthly income.','6,000,000–9,600,000'],
['6','บ้านเช่าน่าลงทุนมาก ถ้าคุณมีความอดทนเพียงพอ เพราะรายได้จากค่าเช่าดีมาก','An attractive rental investment for a patient investor, with very good rental income.','650,000–1,350,000'],
['7','เจ้าของบริษัทต้องการขายบ้านเพื่อนำเงินไปลงทุนเพิ่มในธุรกิจของเขาที่กำลังเติบโต ปัจจุบันมีผู้เช่านิสัยดี','A business owner sells the house to fund a growing business. It has good tenants.','650,000–1,350,000'],
['8','2 ตึก จำนวน 24 ห้องชุด เจ้าของบริหารเอง โดยมีผู้ช่วยอยู่ประจำสถานที่ ขณะนี้ต้องการวางมือ ประกาศขายด่วน','Two buildings with 24 apartments, managed by the owner with an on-site assistant. The owner wants to retire and sell urgently.','6,000,000–9,600,000'],
['9','ร้านพิซซ่าชื่อดัง มีสาขามาก เพิ่มพิซซ่าแช่แข็งขายในร้านสะดวกซื้อ เจ้าของร้านต้องการเงินลงทุนเพิ่ม','A well-known pizza chain expands into frozen pizza at convenience stores and needs investment.','400,000–600,000'],
['10','ได้รับการบำรุงรักษาอย่างดี และอยู่ในทำเลทอง เป็นโอกาสทองของนักลงทุนที่เล็งเห็นโอกาสนี้','A well-maintained shophouse in a prime location offers an investment opportunity.','500,000–800,000'],
['11','เจ้าของเสียชีวิตในขณะที่กิจการตู้เกมหยอดเหรียญกำลังไปได้ดี พร้อมด้วยสัญญาเช่าตั้งตู้เกมระยะยาว','The owner died while the arcade business was thriving. Long-term machine location leases are included.'],
['12','ตึกแถว 2 คูหาสภาพเยี่ยม ทำเลดี ผู้เช่าย้ายออกน้อยมาก รายได้ดี ปัญหาน้อย','Two excellent shophouses in a good location, with low tenant turnover, good income and few problems.','1,000,000–1,600,000'],
['13','เยี่ยมที่สุดในละแวกนี้ เจ้าของรักตึกนี้มาก แต่ต้องการเกษียณและย้ายไปเลี้ยงหลานที่ต่างจังหวัด','The owner loves this excellent neighbourhood property but wants to retire and care for grandchildren elsewhere.','500,000–800,000'],
['14','จำนวน 12 ห้องชุด ทายาทของเจ้าของอยู่ต่างจังหวัด เป็นผู้ประกาศขาย มีผู้สนใจรอเช่าจำนวนมาก','Twelve apartments are sold by an out-of-town heir. Many prospective tenants are waiting.','3,000,000–4,800,000'],
['15','อยู่ในทำเลที่กำลังปรับปรุง มีผู้เช่าเต็มแล้ว คุณเพียงแค่วางเงินดาวน์และอดทนรอเท่านั้น','Fully occupied shophouses in an improving area. Put down the deposit and wait patiently.','1,000,000–1,600,000'],
['16,30','ร้านขายแซนด์วิชต้องการเพิ่มสาขา เจ้าของร้านต้องการหุ้นส่วนเพื่อช่วยลงทุนเพิ่ม','A sandwich shop wants to expand and seeks an investment partner.','600,000–900,000'],
['17','เจ้าของเกษียณ ต้องการขายกิจการเกสต์เฮ้าส์ 5 ห้องนอน 3 ห้องน้ำ','A retiring owner sells a guesthouse with five bedrooms and three bathrooms.','1,000,000–3,000,000'],
['18','ท่อน้ำทิ้งในตึกแถว 4 คูหาแตกต้องรีบซ่อมแซมด่วน ถ้าคุณเป็นเจ้าของตึกแถว 4 คูหา จ่าย 20,000 บาทเพื่อซ่อมท่อน้ำทิ้ง (คุณสามารถกู้เงินจากธนาคารได้ ถ้าไม่มีเงินพอจ่าย) ถ้าคุณเป็นเจ้าของตึกแถว 4 คูหามากกว่า 1 แห่ง จ่ายค่าซ่อมเพียงแห่งเดียว','A drain breaks in a four-shophouse property. Owners pay 20,000 for urgent repairs, borrowing if necessary. Pay for only one property even if you own several.'],
['19','เจ้าของเสนอขายในราคายุติธรรม โครงการได้รับสนับสนุนทางการเงินเรียบร้อยแล้ว คุณเพียงแค่วางเงินดาวน์ก็เป็นเจ้าของได้','A fairly priced property has financing arranged. Ownership requires only the down payment.','2,000,000–3,200,000'],
['20','ขายกิจการล้างรถหยอดเหรียญ 4 ช่องล้าง ทำเลดี ใกล้แหล่งธุรกิจ','A four-bay coin-operated car wash in a good location near businesses.'],
['21','เจ้าของอยู่ต่างจังหวัด มีฐานะการเงินไม่ดี ถูกบังคับขายเพราะถูกเรียกภาษีย้อนหลัง มีผู้เช่าอยู่บ้างบางส่วน','An out-of-town owner in financial difficulty is forced to sell for back taxes. The property is partly occupied.','1,000,000–1,600,000'],
['22','ผู้เช่าไม่จ่ายเงินหลังจากตกงาน คุณจึงเชิญให้ผู้เช่าย้ายออก แต่ผู้เช่าได้ทำลายทรัพย์สินของคุณ บริษัทประกันจ่ายค่าเสียหายให้เกือบทั้งหมด แต่คุณยังคงต้องจ่ายค่าซ่อมแซมเพิ่มอีก 4,000 บาท จ่าย 4,000 บาท ถ้าคุณเป็นเจ้าของอสังหาริมทรัพย์ให้เช่าทุกชนิด (คุณสามารถกู้เงินจากธนาคารได้ ถ้าไม่มีเงินพอจ่าย) เฉพาะผู้ที่เปิดการ์ดใบนี้เท่านั้นที่ต้องจ่ายเงิน','An unemployed tenant stops paying and damages your property when asked to leave. Insurance covers most damage. Only the drawer with rental property pays the remaining 4,000; borrowing is allowed if needed.'],
['23','ในทำเลที่กำลังฟื้นฟู ถูกอายัดไว้บังคับขายเพื่อนำเงินไปจ่ายภาษี','Property in a recovering neighbourhood is seized and sold to pay taxes.','1,000,000–1,600,000'],
['24','ตัวแทนขายรถยนต์ต้องการเปิดเต็นท์ขายรถยนต์มือ 2 ต้องการหุ้นส่วนร่วมลงทุน เพราะธนาคารไม่อนุมัติเงินกู้สำหรับกิจการขายรถยนต์มือสอง','A car dealer seeks a partner for a used-car lot after the bank refuses financing.','600,000–900,000'],
['25','เจ้าของเดิมร้อนเงิน ประกาศขายกิจการล้างรถอัตโนมัติ ใกล้ทางด่วน มีผู้ใช้บริการมาก','An owner urgently sells a busy automatic car wash near an expressway.'],
['26','น่าลงทุนเพราะมีผู้เช่าอยู่แล้ว เจ้าของกำลังมีปัญหาด้านภาษีรายได้ ต้องการขายด่วน','An occupied investment property is urgently sold because of the owner’s income-tax problems.','500,000–800,000'],
['27','พ่อค้าร้านขายของชำย้ายบ้านไปจังหวัดอื่น ต้องการขายบ้านในสภาพเยี่ยม พร้อมให้เช่าในราคาแพง','A grocer moves away and sells a house in excellent condition, ready for high-rent letting.','650,000–1,350,000'],
['28','กองทุนบำนาญต้องการขายกิจการอพาร์ตเมนต์ จำนวน 60 ห้องชุด พร้อมทีมบริการประจำสถานที่ครบทีม','A pension fund sells a 60-unit apartment business with a full on-site service team.','15,000,000–27,000,000'],
['29','เจ้าของบ้านหย่าขาดจากกัน จึงประกาศขายบ้านนี้ ในบริเวณที่มีผู้พักอาศัยในละแวกใกล้เคียงทุกหลัง ประกาศขายมาแล้ว 5 เดือน','Divorcing owners sell a house in a fully occupied neighbourhood. It has been listed for five months.','650,000–1,350,000'],
['31','ขายบ้านในสนามกอล์ฟวิวสวย มีโอกาสที่จะทำกำไรจากการขายและโอกาสในการเก็บค่าเช่าที่ดี','A scenic golf-course house offers resale profit potential and good rental prospects.','650,000–1,350,000'],
['32','แพทย์ชื่อดังต้องการเพิ่มพื้นที่เพื่อรองรับผู้มาใช้บริการที่เพิ่มมากขึ้น ต้องการหุ้นส่วนร่วมลงทุนค่าก่อสร้างและตกแต่งคลินิก','A popular doctor seeks a partner to fund construction and decoration of an expanded clinic.','500,000–750,000'],
['33','ต้องการขายกิจการล้างรถของครอบครัว เนื่องจากมีเรื่องทะเลาะวิวาท อยู่ในทำเลทองที่มีอัตราการขยายตัวสูง อาจจะขายได้ 12–25 เท่าของรายได้จากทรัพย์สิน','A family dispute forces the sale of a car wash in a prime, rapidly growing location. The card mentions resale at 12–25 times asset income.'],
['34','ที่ดินไม่มีสิ่งปลูกสร้างบริเวณชานเมือง ปัจจุบันอยู่ในโซนที่พักอาศัย แต่มีโอกาสมากที่จะถูกเปลี่ยนเป็นโซนการค้า เหมาะสำหรับสร้างตึกแถว อาจจะขายได้ราคา ??? บาท','Vacant suburban land is residentially zoned but may become commercial, suitable for shophouses. Future sale price is unknown.'],
['35','ผู้จัดการถูกลดเงินเดือน ต้องการขายบ้านทำเลดี เพราะเงินเดือนใหม่ของเขาไม่พอที่จะผ่อนบ้านได้','A manager’s pay cut makes the mortgage unaffordable, forcing sale of a well-located house.','650,000–1,350,000'],
['36','ตึกแถว 2 คูหาเก่า ใกล้ทางด่วน เจ้าของต้องการย้ายไปอยู่ที่ที่การจราจรไม่พลุกพล่าน ราคานี้ขายต่อได้กำไรดี','Two old shophouses near an expressway. The owner wants less traffic; the price offers resale potential.','1,000,000–1,600,000']
]);
add('market',[
['1','บริษัทก่อสร้างต้องการที่ดิน 100 ตารางวา บริเวณชานเมืองเพื่อนำไปจัดโซนใหม่เป็นเมืองธุรกิจ ทุกคนที่มีที่ดิน 100 ตารางวาในบริเวณชานเมืองสามารถขายได้ในราคา 2,000,000 บาท ถ้าคุณขายรับเงินสด 2,000,000 บาท','A developer wants 100 square wa of suburban land for a new business district. Every owner of this land may sell for 2,000,000 cash.'],
['2','ต้องการซื้อตึกแถว 1, 2, 4 คูหา คูหาละ 600,000 บาท ทุกคนสามารถขายได้ที่ราคานี้','A buyer offers 600,000 per shophouse unit for 1-, 2- or 4-unit properties. All owners may sell.'],
['3','มีผู้ขอซื้อในราคา 650,000 บาท ทุกคนที่มีบ้านเช่าสามารถขายได้ที่ราคานี้','A buyer offers 650,000 for a rental house. All owners may sell.'],
['4','มีผู้ขอซื้อในราคา 650,000 บาท ทุกคนที่มีห้องพักสามารถขายได้ที่ราคานี้','A buyer offers 650,000 for a condominium. All owners may sell.'],
['5','อัตราเงินเฟ้อเพิ่มขึ้นส่งผลให้ดอกเบี้ยเงินกู้บ้านพุ่งขึ้นไป 20% บ้านเช่าทุกหลังที่คุณเป็นเจ้าของ (เฉพาะคุณคนเดียว) ถูกสถาบันการเงินปรับอัตราดอกเบี้ยจดจำนองใหม่ คุณจะต้องคืนบ้านเช่าทุกหลังให้ธนาคาร รับเงินดาวน์คืนและหักรายได้ออกทั้งหมดจากบัญชีของคุณ','Inflation pushes home-loan interest to 20%. Only the drawer must return every rental house to the bank, recover the down payments and remove all associated income.'],
['6','ธุรกิจที่คุณเป็นเจ้าของเพิ่มช่องทางการจัดจำหน่าย ยอดขายเพิ่มขึ้น 150% ทุกคนที่เป็นเจ้าของธุรกิจทุกชนิดรับรายได้เพิ่มขึ้นธุรกิจละ 4,000 บาท','New distribution channels increase sales by 150%. All business owners increase income by 4,000 per business.'],
['7','การ์ดใบนี้มีผลกับห้างหุ้นส่วนจำกัด (เต็นท์รถยนต์มือสอง, พิซซ่าแช่แข็ง, คลินิก, ร้านแซนด์วิช) คุณได้รับค่าตอบแทน 2 เท่าของเงินลงทุน ทุกคนที่ร่วมลงทุนได้รับเงินสดจากการขายห้างหุ้นส่วนจำกัดและลบรายได้ออกจากบัญชีคุณ','This applies to used-car, frozen pizza, clinic and sandwich partnerships. All investors may sell for twice their investment and remove the income.'],
['8','มีผู้ขอซื้อในราคา 450,000 บาท ทุกคนที่มีห้องพักสามารถขายได้ที่ราคานี้','A buyer offers 450,000 for a condominium. All owners may sell.'],
['9','นักลงทุนมองหากิจการล้างรถ 1,000,000 บาท ทุกคนสามารถขายได้ที่ราคานี้','An investor offers 1,000,000 for a car-wash business. All eligible owners may sell.'],
['10','ธุรกิจขนาดย่อมที่คุณเป็นเจ้าของได้รับรางวัล ทำให้ยอดขายเพิ่มขึ้น 2 เท่า ทุกคนที่เป็นเจ้าของธุรกิจทุกชนิดรับรายได้เพิ่มขึ้นธุรกิจละ 2,500 บาท','An award doubles business sales. All business owners increase income by 2,500 per business.'],
['11','มีผู้ขอซื้อในราคา 900,000 บาท ทุกคนที่มีบ้านเช่าสามารถขายได้ที่ราคานี้','A buyer offers 900,000 for a rental house. All owners may sell.'],
['12','ต้องการซื้อตึกแถว 1, 2, 4 คูหา คูหาละ 500,000 บาท ทุกคนสามารถขายได้ที่ราคานี้','A buyer offers 500,000 per shophouse unit for 1-, 2- or 4-unit properties. All owners may sell.'],
['13','นักสะสมควานหาเหรียญทองโบราณ ขอซื้อ 50,000 บาท สำหรับผู้ที่มีเหรียญทองเหรียญนี้','A collector offers 50,000 to the owner of the rare antique gold coin.'],
['14','ทุกคนที่มีกิจการเกสต์เฮ้าส์ สามารถขายได้ในราคา 2,500,000 บาท','All guesthouse owners may sell for 2,500,000.'],
['15','ดอกเบี้ยเงินกู้ซื้อบ้านลด 5% ถ้าคุณ (เฉพาะคุณคนเดียว) เป็นเจ้าของบ้านเช่า สามารถขายได้กำไร 500,000 บาท จากราคาเดิมที่ซื้อมา','Mortgage interest falls by 5%. Only the drawer may sell rental houses for 500,000 above the original purchase price.'],
['16','มีผู้ขอซื้อในราคา 550,000 บาท ทุกคนที่มีห้องพักสามารถขายได้ที่ราคานี้','A buyer offers 550,000 for a condominium. All owners may sell.'],
['17','มีผู้ขอซื้อในราคา 1,000,000 บาท ทุกคนที่มีบ้านเช่าสามารถขายได้ที่ราคานี้','A buyer offers 1,000,000 for a rental house. All owners may sell.'],
['18','ต้องการซื้อห้างขนาดเล็กในราคา 1,000,000 บาท ทุกคนที่เป็นเจ้าของสามารถขายได้ที่ราคานี้ ถ้าคุณขายรับเงินสดและหักรายได้ออกจากบัญชีคุณ','A buyer offers 1,000,000 for a small mall. All owners may sell and remove its income.'],
['19','ต้องการซื้อตึกแถว 1, 2, 4 คูหา คูหาละ 700,000 บาท ทุกคนสามารถขายได้ที่ราคานี้','A buyer offers 700,000 per shophouse unit. All owners may sell.'],
['20','ต้องการซื้อในราคาห้องละ 250,000 บาท ทุกคนที่มีอพาร์ตเมนต์สามารถขายได้ที่ราคานี้','A buyer offers 250,000 per apartment unit. All owners may sell.'],
['21','สำนักผังเมืองต้องการให้บริษัทก่อสร้างจัดสรรที่ดินเป็นสวนสาธารณะ ทุกคนที่มีที่ดิน 10 ไร่ในต่างจังหวัดสามารถขายได้ในราคา 1,500,000 บาท ถ้าคุณขายที่ดินผืนนี้รับเงินสด 1,500,000 บาท','City planners want a developer to create a park. Every owner of the 10-rai rural land may sell for 1,500,000 cash.'],
['22','วิศวกรนักประดิษฐ์เสนอซื้อเทคโนโลยีตัวนำไฟฟ้านวัตกรรมของคุณด้วยเงิน 500,000 บาท ผู้ที่เป็นเจ้าของสามารถขายได้ในราคานี้ ถ้าคุณขายรับเงินสดและหักรายได้ออกจากบัญชีคุณ','An inventor offers 500,000 for your electrical conductor technology. Owners may sell and remove its income.'],
['23','ต้องการซื้อในราคาห้องละ 450,000 บาท ทุกคนที่มีอพาร์ตเมนต์สามารถขายได้ที่ราคานี้','A buyer offers 450,000 per apartment unit. All owners may sell.'],
['24','มีผู้ขอซื้อในราคา 1,350,000 บาท ทุกคนที่มีบ้านเช่าสามารถขายได้ที่ราคานี้','A buyer offers 1,350,000 for a rental house. All owners may sell.'],
['25','ต้องการซื้อตึกแถว 1, 2, 4 คูหา คูหาละ 800,000 บาท ทุกคนสามารถขายได้ที่ราคานี้','A buyer offers 800,000 per shophouse unit. All owners may sell.'],
['26','ต้องการซื้อในราคาห้องละ 300,000 บาท ทุกคนที่มีอพาร์ตเมนต์สามารถขายได้ที่ราคานี้','A buyer offers 300,000 per apartment unit. All owners may sell.'],
['27','การ์ดใบนี้มีผลกับห้างหุ้นส่วนจำกัด (เต็นท์รถยนต์มือสอง, พิซซ่าแช่แข็ง, คลินิก, ร้านแซนด์วิช) คุณได้รับค่าตอบแทน 3 เท่าของเงินลงทุน ทุกคนที่ร่วมลงทุนได้รับเงินสดจากการขายห้างหุ้นส่วนจำกัดและลบรายได้ออกจากบัญชีคุณ','This applies to used-car, frozen pizza, clinic and sandwich partnerships. All investors may sell for three times their investment and remove the income.'],
['28','น้องเขยตกงานสัญญาว่าจะซื้อบ้านในราคา 1,000,000 บาทในอีก 4 ปี ถ้าคุณขายให้น้องเขยรายได้จากบ้านหลังนี้จะลดลง 5,000 บาทต่อเดือน','Your unemployed brother-in-law promises to buy a house for 1,000,000 in four years. Accepting reduces that house’s monthly income by 5,000.'],
['29','เกิดสงครามในตะวันออกกลาง ราคาปรับตัวเป็นบาทละ 6,000 บาท ทุกคนที่มีทองคำแท่งสามารถขายได้ที่ราคานี้','War in the Middle East raises gold to 6,000 per baht-weight. All bullion owners may sell.'],
['30','มีผู้ขอซื้อในราคา 1,100,000 บาท ทุกคนที่มีบ้านเช่าสามารถขายได้ที่ราคานี้','A buyer offers 1,100,000 for a rental house. All owners may sell.'],
['31','บริษัทซอฟต์แวร์ยักษ์ใหญ่เสนอราคา 1,000,000 บาท ผู้ที่เป็นเจ้าของขายได้ที่ราคานี้ ถ้าคุณขายรับเงินสดและหักรายได้ออกจากบัญชีคุณ','A software giant offers 1,000,000 for the software company. Owners may sell and remove its income.']
]);

add('doodad',[
 [
  1,
  "ค่าทำฟัน 1,000 บาท",
  "Dental treatment costs 1,000 baht."
 ],
 [
  2,
  "จ่าย 15,000 บาท (ถ้าคุณมีลูก)",
  "Pay 15,000 baht if you have children."
 ],
 [
  3,
  "ค่าจ้าง 5,000 บาท",
  "Decorator fee: 5,000 baht."
 ],
 [
  4,
  "ค่าใช้จ่าย 20,000 บาท",
  "Family holiday costs 20,000 baht."
 ],
 [
  5,
  "จ่าย 2,000 บาท",
  "Pay 2,000 baht."
 ],
 [
  6,
  "จ่าย 4,000 บาท",
  "Pay 4,000 baht."
 ],
 [
  7,
  "ค่าสนามกอล์ฟและแคดดี้ 2,000 บาท",
  "Green fee and caddie: 2,000 baht."
 ],
 [
  8,
  "จ่าย 6,000 บาท",
  "Pay 6,000 baht."
 ],
 [
  9,
  "จ่าย 40,000 บาท ใช้บัตรเครดิตซื้อได้ ถ้าซื้อด้วยบัตรเครดิต เพิ่มหนี้จากบัตรเครดิตอีก 40,000 บาท และเพิ่มรายจ่ายต่อเดือนที่เกิดจากบัตรเครดิตอีกเดือนละ 1,200 บาท",
  "Pay 40,000 baht. You may use a credit card: add 40,000 baht to credit-card debt and 1,200 baht to monthly credit-card payments."
 ],
 [
  10,
  "จ่าย 800 บาท",
  "Pay 800 baht."
 ],
 [
  11,
  "จ่าย 500 บาท ต่อลูก 1 คน",
  "Pay 500 baht per child."
 ],
 [
  12,
  "จ่าย 2,000 บาท",
  "Pay 2,000 baht."
 ],
 [
  13,
  "ค่าบัตร 500 บาท",
  "Ticket: 500 baht."
 ],
 [
  14,
  "ซื้อเพชรเทียม 3,500 บาท",
  "Buy imitation diamonds for 3,500 baht."
 ],
 [
  15,
  "จ่าย 7,000 บาท",
  "Pay 7,000 baht."
 ],
 [
  16,
  "ไปศึกษาหาความรู้เพิ่มเติม จ่าย 2,200 บาท ค่าหนังสือและเรียนพิเศษ",
  "Study to improve your skills. Pay 2,200 baht for books and extra classes."
 ],
 [
  17,
  "จ่าย 3,500 บาท",
  "Pay 3,500 baht."
 ],
 [
  18,
  "จ่าย 1,200 บาท",
  "Pay 1,200 baht."
 ],
 [
  19,
  "ซื้อนาฬิกาข้อมือใหม่ ทั้งๆ ที่มีอยู่แล้ว 3 เรือน จ่าย 3,500 บาท",
  "Buy another wristwatch even though you already own three. Pay 3,500 baht."
 ],
 [
  20,
  "จ่าย 1,500 บาท",
  "Pay 1,500 baht."
 ],
 [
  21,
  "พาลูกไปเที่ยวสวนสนุก จ่าย 1,000 บาท (ถ้าคุณมีลูก)",
  "Take your children to an amusement park. Pay 1,000 baht if you have children."
 ],
 [
  22,
  "จ่าย 2,500 บาท",
  "Pay 2,500 baht."
 ],
 [
  23,
  "ค่าใช้จ่าย 20,000 บาท (ถ้าคุณมีลูก)",
  "Wedding expenses: 20,000 baht if you have children."
 ],
 [
  24,
  "จ่าย 2,500 บาท",
  "Pay 2,500 baht."
 ],
 [
  25,
  "จ่ายค่าปรับ 1,000 บาท",
  "Pay a 1,000-baht parking fine."
 ],
 [
  26,
  "จ่าย 2,000 บาท",
  "Pay 2,000 baht."
 ],
 [
  27,
  "จ่าย 1,000 บาท",
  "Pay 1,000 baht."
 ],
 [
  28,
  "จ่าย 1,000 บาท",
  "Pay 1,000 baht."
 ],
 [
  29,
  "จ่าย 200 บาท",
  "Pay 200 baht."
 ],
 [
  30,
  "ค่าอาหาร 400 บาท",
  "Lunch costs 400 baht."
 ],
 [
  31,
  "ค่าแว่น 700 บาท",
  "Sunglasses cost 700 baht."
 ],
 [
  32,
  "ราคา 1,500 บาท",
  "Price: 1,500 baht."
 ],
 [
  33,
  "จ่ายเงินดาวน์ 10,000 บาท ค้างชำระอีก 170,000 บาท เพิ่มหนี้เงินกู้จากการซื้อรถคันนี้ 170,000 บาท และเพิ่มรายจ่ายต่อเดือนที่เกิดจากการผ่อนชำระอีกเดือนละ 3,400 บาท",
  "Pay 10,000 baht down, with 170,000 baht outstanding. Add 170,000 baht to car-loan debt and 3,400 baht to monthly loan payments."
 ],
 [
  34,
  "เล็งเก้าอี้ตัวใหม่มานานแล้ว จ่าย 3,000 บาท",
  "You have wanted this new chair for a long time. Pay 3,000 baht."
 ],
 [
  35,
  "ค่ากาแฟ 300 บาท",
  "Coffee costs 300 baht."
 ],
 [
  36,
  "จ่าย 9,000 บาท",
  "Pay 9,000 baht."
 ],
 [
  37,
  "ค่าอาหาร 800 บาท",
  "Dinner costs 800 baht."
 ],
 [
  38,
  "ค่าบัตร อาหารค่ำและเครื่องดื่ม 1,800 บาท",
  "Tickets, dinner and drinks: 1,800 baht."
 ],
 [
  39,
  "จ่าย 2,000 บาท",
  "Pay 2,000 baht."
 ],
 [
  40,
  "ทั้งๆ ที่เครื่องเดิมยังใช้ได้อยู่ จ่าย 6,000 บาท",
  "Your old phone still works, but you buy a new one. Pay 6,000 baht."
 ],
 [
  41,
  "จ่าย 20,000 บาท (ถ้าคุณมีลูก)",
  "Pay 20,000 baht if you have children."
 ]
]);

export const printedROI={small:{10:60,11:150,13:40,17:0,20:0,24:'??',25:42,27:'??',29:0,30:48,38:38,39:24,41:0,42:38,44:132,46:0,47:6,48:53},big:Object.fromEntries([48,96,40,-6,67,45,26,54,48,60,81,48,24,58,75,60,40,null,51,86,24,null,56,40,100,48,40,66,30,60,51,48,36,24,40,40].map((v,i)=>[i+1,v]))};

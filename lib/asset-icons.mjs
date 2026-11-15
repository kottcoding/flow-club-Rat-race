// Presentation only: never modify the asset's financial type or values.
export function assetIconKind(asset={}){
 const category=asset.category||'',type=asset.assetType||asset.type||'';
 const name=(Array.isArray(asset.name)?asset.name.join(' '):asset.name||'').toLowerCase();
 if(asset.symbol==='FUND'||/กองทุน|mutual fund|\betf\b/.test(name))return 'fund';
 if(type==='stock'||type==='bond')return 'stock';
 if(category==='house')return 'house';
 if(['condo','apartment'].includes(category))return 'condo';
 if(['singleShop','duplex','fourplex'].includes(category))return 'shophouse';
 if(['gold','coin'].includes(category))return 'gold';
 if(category.startsWith('land'))return 'land';
 if(['software','conductor'].includes(category))return 'company';
 if(/บริษัท|company|corporation|startup/.test(name))return 'company';
 if(type==='business')return 'business';
 if(/ตึกแถว|shophouse|duplex|fourplex/.test(name))return 'shophouse';
 if(/คอนโด|อพาร์ตเมนต์|condo|apartment/.test(name))return 'condo';
 if(/บ้าน|\bhouse\b/.test(name))return 'house';
 if(/ทองคำ|เหรียญทอง|\bgold\b/.test(name))return 'gold';
 if(/ที่ดิน|\bland\b/.test(name))return 'land';
 if(/หุ้น(?!ส่วน)|\bstock\b|\bbond\b/.test(name))return 'stock';
 return 'other';
}
export const assetIconSrc=asset=>{const kind=assetIconKind(asset);return '/asset-icons/'+kind+(kind==='business'?'-v2.png':'-v1.png');};

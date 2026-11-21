import test from 'node:test';
import assert from 'node:assert/strict';
import {detectDevice,cleanDevice} from '../lib/device.mjs';
test('device hints distinguish phones, tablets including desktop iPad, and touch PCs',()=>{
 for(const [nav,want] of [
 [{userAgent:'Mozilla iPhone Mobile'},'mobile'],
 [{userAgent:'Mozilla Android 16 Mobile'},'mobile'],
 [{userAgent:'Mozilla Android 16 Chrome'},'tablet'],
 [{userAgent:'Mozilla iPad'},'tablet'],
 [{userAgent:'Mozilla Macintosh',platform:'MacIntel',maxTouchPoints:5},'tablet'],
 [{userAgent:'Mozilla Macintosh',platform:'MacIntel',maxTouchPoints:0},'pc'],
 [{userAgent:'Mozilla Windows NT 10.0',maxTouchPoints:10},'pc'],
 [{userAgent:'Mozilla X11 Linux x86_64'},'pc'],
 [{userAgentData:{mobile:true}},'mobile'],[{},'unknown']])assert.equal(detectDevice(nav),want);
 assert.equal(cleanDevice('<script>'),'unknown');
});

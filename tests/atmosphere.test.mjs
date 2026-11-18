import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {bangkokDate,resolveTheme,seasonFor,OCCASIONS,THEMES,STATIC_THEMES} from '../lib/atmosphere.mjs';
test('Bangkok changes date at 17:00 UTC',()=>{
 assert.equal(bangkokDate(new Date('2026-12-15T16:59:59Z')),'2026-12-15');
 assert.equal(bangkokDate(new Date('2026-12-15T17:00:00Z')),'2026-12-16');
});
test('Every scheduled date resolves to its occasion and has local vector art',()=>{
 for(const [start,end,id] of OCCASIONS){assert.equal(resolveTheme(start),id);assert.equal(resolveTheme(end),id);assert.ok(THEMES[id]);assert.ok(existsSync(new URL('../public/atmosphere/'+id+'.svg',import.meta.url)));}
});
test('Songkran lasts three days, then returns to the season',()=>{
 for(const day of [13,14,15])assert.equal(resolveTheme('2027-04-'+day),'songkran');
 assert.equal(resolveTheme('2027-04-12'),'summer');assert.equal(resolveTheme('2027-04-16'),'summer');
});
test('Season boundaries and manual modes',()=>{
 for(const [date,id] of [['2027-02-14','cool'],['2027-02-15','summer'],['2027-05-14','summer'],['2027-05-15','rainy'],['2027-10-14','rainy'],['2027-10-15','cool']])assert.equal(seasonFor(date),id);
 assert.equal(resolveTheme('2026-12-16','original'),'original');assert.equal(resolveTheme('2026-12-16','season'),'cool');
});
test('Memorial is static and lunar dates do not repeat in later years',()=>{
 assert.ok(STATIC_THEMES.has('memorial'));assert.equal(resolveTheme('2026-12-17'),'cool');
 assert.equal(resolveTheme('2028-02-06'),'cool');assert.equal(resolveTheme('2028-09-30'),'rainy');
});
test('Every theme artwork is self contained and has a transparent canvas',()=>{
 for(const id of Object.keys(THEMES).filter(x=>x!=='original')){
 const s=readFileSync(new URL('../public/atmosphere/'+id+'.svg',import.meta.url),'utf8');assert.match(s,/viewBox="0 0 360 300"/);assert.doesNotMatch(s,/<script|<image|<foreignObject/);
 }
});

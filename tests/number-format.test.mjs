import test from 'node:test';
import assert from 'node:assert/strict';
import {groupDigits,formatCalculation,parseNumberInput,formatNumber} from '../lib/number-format.mjs';
test('historical calculations group every operand without rounding',()=>{
 assert.equal(formatCalculation('385600 + 19700 = 405300'),'385,600 + 19,700 = 405,300');
 assert.equal(formatCalculation('Gross/unit 700000 - debt/unit 540000 = 160000; × 1 = 160000; capital gain 160000 - 60000 = 100000'),'Gross/unit 700,000 - debt/unit 540,000 = 160,000; × 1 = 160,000; capital gain 160,000 - 60,000 = 100,000');
 assert.equal(formatCalculation('-1234567.000001 × 10% = -123456.7000001'),'-1,234,567.000001 × 10% = -123,456.7000001');
 assert.equal(formatCalculation('1,000 + 2000 = 3,000'),'1,000 + 2,000 = 3,000');
});
test('input supports editing, pasted amounts and fractional shares',()=>{
 assert.deepEqual(parseNumberInput('1,234,567.25'),{raw:'1234567.25',number:1234567.25});
 assert.deepEqual(parseNumberInput(''),{raw:'',number:0});
 assert.deepEqual(parseNumberInput('0.000001'),{raw:'0.000001',number:0.000001});
 assert.equal(groupDigits('1234.'),'1,234.');
 assert.equal(groupDigits('1234.00'),'1,234.00');
 assert.equal(formatNumber(1234.000001),'1,234.000001');
 for(const value of ['-500','1e6','100abc','1.2.3','Infinity','9007199254740992'])assert.equal(parseNumberInput(value),null);
});

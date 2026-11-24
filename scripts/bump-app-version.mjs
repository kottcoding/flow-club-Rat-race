import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../lib/app-version.mjs',import.meta.url);
const text=await readFile(file,'utf8');
const match=text.match(/APP_VERSION_UNITS = (\d+);/);
if(!match)throw new Error('APP_VERSION_UNITS not found');
const next=Number(match[1])+1;
await writeFile(file,text.replace(/APP_VERSION_UNITS = \d+;/,'APP_VERSION_UNITS = '+next+';'));
console.log('Release version: Ver '+(next/100).toFixed(2));

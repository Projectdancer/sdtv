import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const output=process.env.LANDING_OUTPUT_DIR;
assert.ok(output,'Set LANDING_OUTPUT_DIR');
const base=(process.env.LANDING_SMOKE_URL || 'https://go.danzuni.com').replace(/\/$/,'');
const target=new URL(base);
assert.equal(target.protocol,'https:');
assert.ok(target.hostname==='go.danzuni.com' || target.hostname.endsWith('.vercel.app'),'Unexpected smoke host');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const response=await fetch(base);
assert.equal(response.status,200);
assert.equal(response.url,base+'/');
const body=Buffer.from(await response.arrayBuffer());
assert.equal(hash(body),hash(await readFile(join(output,'index.html'))));
assert.match(response.headers.get('content-security-policy'),/connect-src 'none'/);
assert.match(response.headers.get('content-security-policy'),/form-action 'none'/);
assert.equal(response.headers.get('x-content-type-options'),'nosniff');
console.log('PASS custom-domain HTTPS 200, exact HTML hash, isolation headers');
for (const path of ['js/main.js','js/quality.js','css/quality.css']) {
 const asset=await fetch(base+'/'+path);assert.equal(asset.status,200,path);
 assert.equal(hash(Buffer.from(await asset.arrayBuffer())),hash(await readFile(join(output,path))),path);
}
console.log('PASS exact deployed runtime and refinement CSS bytes');
const files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){
 if(e.name.startsWith('.'))continue;
 const p=join(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name!=='vercel.json')files.push(p);
}}await walk(output);
let cursor=0;
await Promise.all(Array.from({length:5},async()=>{
 while(cursor<files.length){const p=files[cursor++];const url=base+'/'+relative(output,p).split('\\').map(encodeURIComponent).join('/');
  const r=await fetch(url,{method:'HEAD'});assert.equal(r.status,200,url);
 }
}));
console.log(`PASS ${files.length} deployed static resources return 200`);
for(const path of ['/.git/config','/scripts/build.mjs','/CNAME','/no-such-page-danzuni-smoke']){
 const r=await fetch(base+path);assert.equal(r.status,404,path);
}
console.log('PASS source/Git/build/CNAME not exposed; unknown route 404');
const original=await fetch('https://go.socialdancetv.com/');
assert.equal(original.status,200);
assert.equal(hash(Buffer.from(await original.arrayBuffer())),'d5ac354b242a538ef412e791b02c360b7a8acc9370acd1e13abed5184d505652');
console.log('PASS old landing remains live and byte-identical');
console.log(JSON.stringify({checkedAt:new Date().toISOString(),domain:base,htmlSha256:hash(body),files:files.length},null,2));

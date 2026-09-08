import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { hash } from './build-v1.mjs';
const output=process.env.LANDING_RELEASE_DIR;
assert.ok(output,'Set LANDING_RELEASE_DIR');
const base=(process.env.LANDING_SMOKE_URL||'https://go.danzuni.com').replace(/\/$/,'');
const target=new URL(base);
assert.equal(target.protocol,'https:');
assert.ok(target.hostname==='go.danzuni.com'||target.hostname.endsWith('.vercel.app'));
assert.equal(target.pathname,'/');
const before=process.env.LANDING_SMOKE_PHASE==='before';
const manifest=JSON.parse(await readFile(output+'.manifest.json','utf8'));
const request=async(path,options={})=>fetch(base+path,{...options,signal:AbortSignal.timeout(30000)});
const exact=async(path,local)=>{
 const response=await request(path);assert.equal(response.status,200,path);
 assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(await readFile(join(output,local))),path);
 return response;
};
const root=await exact('/','index.html');
assert.match(root.headers.get('content-security-policy'),/connect-src 'none'/);
assert.equal(root.headers.get('x-content-type-options'),'nosniff');
assert.equal(root.headers.get('x-robots-tag'),null,'Root must not acquire v1 noindex header');
for(const path of ['css/style.css','css/danzuni.css','css/quality.css','css/fonts.css','js/main.js','js/quality.js','icons.svg','robots.txt'])await exact('/'+path,path);
console.log('PASS unchanged production root HTML, CSS, JS, icons, robots and security boundary');
if(!before){
 const variant=await exact('/v1','v1/index.html');
 await exact('/v1/','v1/index.html');
 assert.match(variant.headers.get('x-robots-tag'),/noindex/);
 assert.match(variant.headers.get('content-security-policy'),/form-action 'none'/);
 for(const path of ['css/clarity.css','css/style.css','css/danzuni.css','js/main.js','js/quality.js','js/clarity.js','icons.svg'])await exact('/v1/'+path,'v1/'+path);
 console.log('PASS /v1 and /v1/ exact candidate, isolated assets and noindex');
}else{
 const oldV1=await request('/v1');assert.equal(oldV1.status,404,'Do not overwrite an existing v1 silently');
}
const paths=Object.keys({...manifest.rootFiles,...(before?{}:manifest.v1Files)});
let cursor=0;
await Promise.all(Array.from({length:5},async()=>{
 while(cursor<paths.length){
  const path=paths[cursor++];
  const response=await request('/'+path.split('/').map(encodeURIComponent).join('/'));
  assert.equal(response.status,200,path);
  const expected=manifest.rootFiles[path]||manifest.v1Files[path];
  assert.equal(hash(Buffer.from(await response.arrayBuffer())),expected,path);
 }
}));
for(const prefix of ['',...(before?[]:['/v1'])])for(const path of ['/.git/config','/scripts/build.mjs','/CNAME','/docs/handoff.md','/not-a-danzuni-page']){
 const response=await request(prefix+path);assert.equal(response.status,404,prefix+path);
}
if(!before)assert.equal((await request('/v1/vercel.json')).status,404);
const original=await fetch('https://go.socialdancetv.com/',{signal:AbortSignal.timeout(30000)});
assert.equal(original.status,200);
assert.equal(hash(Buffer.from(await original.arrayBuffer())),'d5ac354b242a538ef412e791b02c360b7a8acc9370acd1e13abed5184d505652');
console.log(JSON.stringify({status:'PASS',phase:before?'before':'after',checkedAt:new Date().toISOString(),base,resources:paths.length,rootHtml:manifest.rootFiles['index.html'],v1Html:before?null:manifest.v1Files['v1/index.html']},null,2));

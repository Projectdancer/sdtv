import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pinned,hash,oldRootImage,rootImage,rootDeviceHtml} from './build-device-release.mjs';
import {refineProductDevices,productAssets,productDeviceImageHash} from './landing-product-devices.mjs';
const base=process.env.LANDING_DEVICE_BASE,output=process.env.LANDING_DEVICE_OUTPUT;
assert.ok(base&&output,'Both device release paths required');
const oldRoot=await readFile(join(base,'index.html'),'utf8'),root=await readFile(join(output,'index.html'),'utf8');
const oldV1=await readFile(join(base,'v1/index.html'),'utf8'),v1=await readFile(join(output,'v1/index.html'),'utf8');
const manifest=JSON.parse(await readFile(output+'.manifest.json','utf8'));
test('root changes only the approved illustration, truthful alt/dimensions and contour stylesheet',()=>{
  assert.equal(root,rootDeviceHtml(oldRoot));
  assert.equal(root.replace(rootImage,oldRootImage).replace('<link rel="stylesheet" href="/css/product-devices.css">',''),oldRoot);
  assert.throws(()=>rootDeviceHtml(oldRoot+' '));assert.throws(()=>rootDeviceHtml(root));
});
test('V1 gets only the same isolated image; CTA, footer, offers and scripts stay unchanged',()=>{
  assert.equal(v1,refineProductDevices(oldV1));
  for(const [before,after] of [[oldRoot,root],[oldV1,v1]]) {
    for(const regexp of [/<script\b[\s\S]*?<\/script>/g,/<a\b[\s\S]*?<\/a>/g,/<footer\b[\s\S]*?<\/footer>/g]) assert.deepEqual(after.match(regexp),before.match(regexp));
    assert.equal(after.replace(/<[^>]*>/g,''),before.replace(/<[^>]*>/g,''));
    assert.doesNotMatch(after,/access-motion|Your next move|danzuni-logo-c3740474|footer\.css/);
  }
});
test('every old image, script and CSS byte is preserved; no config mutation',async()=>{
  for(const [path,digest] of Object.entries({...pinned.rootFiles,...pinned.v1Files})) {
    if(['index.html','v1/index.html'].includes(path))continue;
    assert.equal(hash(await readFile(join(output,path))),digest,path);
  }
  assert.deepEqual(await readFile(join(output,'vercel.json')),await readFile(join(base,'vercel.json')));
});
test('only two new resources per surface and only public manifest files are packaged',async()=>{
  assert.deepEqual(Object.keys(manifest.rootFiles).filter(p=>!pinned.rootFiles[p]).sort(),Object.keys(productAssets).sort());
  assert.deepEqual(Object.keys(manifest.v1Files).filter(p=>!pinned.v1Files[p]).sort(),Object.keys(productAssets).map(p=>'v1/'+p).sort());
  async function list(dir,prefix='') {const result=[];for(const item of await readdir(join(dir,prefix),{withFileTypes:true})){assert.ok(!item.isSymbolicLink());const path=prefix?prefix+'/'+item.name:item.name;if(item.isDirectory())result.push(...await list(dir,path));else result.push(path);}return result.sort();}
  assert.deepEqual(await list(output),[...Object.keys(manifest.rootFiles),...Object.keys(manifest.v1Files),'vercel.json'].sort());
  for(const [path,digest] of Object.entries({...manifest.rootFiles,...manifest.v1Files})) assert.equal(hash(await readFile(join(output,path))),digest,path);
});
test('actual PNG alpha and every source RGB pixel are independently verified',()=>{
  const original=fileURLToPath(new URL('../deployment/v1/danzuni-devices-642dba75.png',import.meta.url));
  const cutout=join(output,'img/danzuni-devices-isolated.png');
  const check=spawnSync('python',['-c',"import sys; from PIL import Image; a=Image.open(sys.argv[1]); b=Image.open(sys.argv[2]); assert b.mode=='RGBA' and b.size==(1474,1067); assert b.convert('RGB').tobytes()==a.convert('RGB').tobytes(); c=b.getchannel('A'); assert c.getextrema()==(0,255); assert all(c.getpixel(p)==0 for p in [(0,0),(1473,0),(0,1066),(1473,1066)]); assert all(c.crop(r).getextrema()==(255,255) for r in [(100,100,1295,435),(403,505,1054,980),(1166,499,1418,980)]); print('RGBA and original RGB PASS')",original,cutout],{encoding:'utf8'});
  assert.equal(check.status,0,check.stderr||check.error?.message);assert.match(check.stdout,/PASS/);
});
test('asset hash, dimensions and static shadow match the reviewed candidate',async()=>{
  assert.equal(hash(await readFile(join(output,'img/danzuni-devices-isolated.png'))),productDeviceImageHash);
  assert.deepEqual(await readFile(join(output,'img/danzuni-devices-isolated.png')),await readFile(join(output,'v1/img/danzuni-devices-isolated.png')));
  const css=await readFile(join(output,'css/product-devices.css'),'utf8');
  assert.match(css,/drop-shadow\(0 8px 12px rgb\(36 36 40 \/ 0.10\)\)/);assert.doesNotMatch(css,/animation|transform|mix-blend|will-change/);
});
test('all page assets resolve and no commercial or index-policy expansion occurs',async()=>{
  for(const [html,prefix] of [[root,''],[v1,'v1']]) {
    for(const [,ref] of html.matchAll(/\b(?:data-src|src|href|xlink:href)="([^"]+)"/g)) {
      if(/^(?:https?:|mailto:|#)/.test(ref)||ref==='/'||ref==='/v1/')continue;
      const path=decodeURI(ref.split('#')[0].replaceAll('&amp;','&'));const target=path.startsWith('/')?join(output,path.slice(1)):join(output,prefix,path);
      assert.ok((await stat(target)).isFile(),ref);
    }
    assert.doesNotMatch(html,/<form\b|<input\b|gr=1/);assert.match(html,/New subscription purchases are not available on this page\./);
  }
  assert.doesNotMatch(root,/name="robots" content="noindex/);assert.match(v1,/name="robots" content="noindex, nofollow"/);
});

import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,cp} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {refineProductDevices,productDeviceImageHash,productAssets,productDeviceImagePath} from './landing-product-devices.mjs';

export const hash = value=>createHash('sha256').update(value).digest('hex');
export const pinned = JSON.parse(await readFile(new URL('../docs/v1-device-image-20260908/release-manifest.json',import.meta.url),'utf8'));
export const oldRootImage='<img loading="lazy" decoding="async" class="join__image" src="img/screens.png" alt="Our  product" width="288" height="197">';
export const rootImage='<img loading="lazy" decoding="async" class="join__image join__image--transparent" src="/img/danzuni-devices-isolated.png" alt="Danzuni class library illustrated on desktop, tablet and phone" width="1474" height="1067">';
export function rootDeviceHtml(html) {
  assert.equal(hash(Buffer.from(html)),pinned.rootFiles['index.html'],'Review changed live root');
  assert.equal(html.split(oldRootImage).length,2,'Expected one archived product image');
  assert.equal(html.split('</head>').length,2);
  return html.replace(oldRootImage,rootImage).replace('</head>','<link rel="stylesheet" href="/css/product-devices.css"></head>');
}
export async function buildDeviceRelease(source,output) {
  assert.ok(source && output,'Set LANDING_DEVICE_BASE and LANDING_DEVICE_OUTPUT');
  const a=resolve(source).toLowerCase(),b=resolve(output).toLowerCase();
  assert.ok(a.startsWith('d:\\codex-runs\\')&&b.startsWith('d:\\codex-runs\\'),'Use named D run directories');
  assert.ok(a!==b&&!a.startsWith(b+'\\')&&!b.startsWith(a+'\\'),'Separate inputs/output');
  const manifest=JSON.parse(await readFile(source+'.manifest.json','utf8'));
  assert.deepEqual(manifest,pinned,'Input must be the verified published release');
  const config=await readFile(join(source,'vercel.json'));
  assert.equal(hash(config),'822b9c60790ca195969976aaedfe17b6e876fe0bf558249d4a730ba4630f8c1a','No config changes');
  const existing={...pinned.rootFiles,...pinned.v1Files};
  for(const [path,expected] of Object.entries(existing)) assert.equal(hash(await readFile(join(source,path))),expected,path);
  const root=rootDeviceHtml(await readFile(join(source,'index.html'),'utf8'));
  const variant=refineProductDevices(await readFile(join(source,'v1/index.html'),'utf8'));
  const assets={};
  for(const [path,file] of Object.entries(productAssets)) {
    assert.match(path,/^(img|css)\/[a-z0-9.-]+$/);
    assert.ok(!existing[path]&&!existing['v1/'+path],'No existing asset overwrite');
    assets[path]=await readFile(new URL('../deployment/v1/'+file,import.meta.url));
  }
  assert.equal(hash(assets[productDeviceImagePath]),productDeviceImageHash);
  await mkdir(output,{recursive:true});
  assert.equal((await readdir(output)).length,0,'Output must be empty');
  for(const path of Object.keys(existing)) {
    await mkdir(dirname(join(output,path)),{recursive:true});
    await cp(join(source,path),join(output,path));
  }
  await writeFile(join(output,'vercel.json'),config);
  await writeFile(join(output,'index.html'),root);
  await writeFile(join(output,'v1/index.html'),variant);
  const result={baselineSha:pinned.baselineSha,rootFiles:{...pinned.rootFiles},v1Files:{...pinned.v1Files}};
  result.rootFiles['index.html']=hash(Buffer.from(root));
  result.v1Files['v1/index.html']=hash(Buffer.from(variant));
  for(const [path,bytes] of Object.entries(assets)) {
    await writeFile(join(output,path),bytes); await writeFile(join(output,'v1',path),bytes);
    result.rootFiles[path]=hash(bytes); result.v1Files['v1/'+path]=hash(bytes);
  }
  for(const [path,expected] of Object.entries({...result.rootFiles,...result.v1Files})) assert.equal(hash(await readFile(join(output,path))),expected,path);
  await writeFile(output+'.manifest.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({status:'BUILT_NOT_DEPLOYED',scope:'device image and static shadow on root and V1 only',root:result.rootFiles['index.html'],v1:result.v1Files['v1/index.html'],publicResources:Object.keys(result.rootFiles).length+Object.keys(result.v1Files).length},null,2));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) await buildDeviceRelease(process.env.LANDING_DEVICE_BASE,process.env.LANDING_DEVICE_OUTPUT);

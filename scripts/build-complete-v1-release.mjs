import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,cp} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {refineAccessMotion,accessAssets} from './landing-access-motion.mjs';
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const pinned=JSON.parse(await readFile(new URL('../docs/footer-publication-20260909/release-manifest.json',import.meta.url),'utf8'));
export async function build(source,output){
 assert.ok(source&&output);const a=resolve(source).toLowerCase(),b=resolve(output).toLowerCase();
 assert.ok(a.startsWith('d:\\codex-runs\\')&&b.startsWith('d:\\codex-runs\\'));
 assert.ok(a!==b&&!a.startsWith(b+'\\')&&!b.startsWith(a+'\\'));
 assert.deepEqual(JSON.parse(await readFile(source+'.manifest.json','utf8')),pinned);
 const files={...pinned.rootFiles,...pinned.v1Files};
 for(const [p,h] of Object.entries(files))assert.equal(hash(await readFile(join(source,p))),h,p);
 const config=await readFile(join(source,'vercel.json'));
 assert.equal(hash(config),'822b9c60790ca195969976aaedfe17b6e876fe0bf558249d4a730ba4630f8c1a');
 const html=refineAccessMotion(await readFile(join(source,'v1/index.html'),'utf8'));
 await mkdir(output,{recursive:true});assert.equal((await readdir(output)).length,0);
 for(const p of Object.keys(files)){await mkdir(dirname(join(output,p)),{recursive:true});await cp(join(source,p),join(output,p));}
 await writeFile(join(output,'vercel.json'),config);await writeFile(join(output,'v1/index.html'),html);
 const manifest=structuredClone(pinned);manifest.v1Files['v1/index.html']=hash(Buffer.from(html));
 for(const [p,file] of Object.entries(accessAssets)){
  assert.match(p,/^(css|js|img)\/[a-zA-Z0-9.-]+$/);assert.ok(!files['v1/'+p]);
  const bytes=await readFile(new URL('../deployment/v1/'+file,import.meta.url));
  await writeFile(join(output,'v1',p),bytes);manifest.v1Files['v1/'+p]=hash(bytes);
 }
 await writeFile(output+'.manifest.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:'BUILT_NOT_DEPLOYED',root:manifest.rootFiles['index.html'],v1:manifest.v1Files['v1/index.html'],resources:Object.keys({...manifest.rootFiles,...manifest.v1Files}).length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build(process.env.LANDING_COMPLETE_BASE,process.env.LANDING_RELEASE_DIR);

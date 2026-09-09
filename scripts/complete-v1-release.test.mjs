import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {hash,pinned} from './build-complete-v1-release.mjs';
import {refineAccessMotion,oldAccess,accessMarkup,accessAssets} from './landing-access-motion.mjs';
const base=process.env.LANDING_COMPLETE_BASE,out=process.env.LANDING_RELEASE_DIR;assert.ok(base&&out);
const before=await readFile(join(base,'v1/index.html'),'utf8'),after=await readFile(join(out,'v1/index.html'),'utf8');
const manifest=JSON.parse(await readFile(out+'.manifest.json','utf8'));
test('complete V1 preserves root, footer copyright and all old assets',async()=>{
 assert.deepEqual(manifest.rootFiles,pinned.rootFiles);
 for(const [p,h] of Object.entries({...pinned.rootFiles,...pinned.v1Files}))if(p!=='v1/index.html')assert.equal(hash(await readFile(join(out,p))),h,p);
 assert.deepEqual(await readFile(join(base,'vercel.json')),await readFile(join(out,'vercel.json')));
 assert.equal(after.match(/<footer\b[\s\S]*?<\/footer>/)[0],before.match(/<footer\b[\s\S]*?<\/footer>/)[0]);
 assert.match(after,/&copy; 2026 Danzuni by Social Dance TV/);
});
test('only approved access markup and its resources change',()=>{
 assert.equal(after,refineAccessMotion(before));
 assert.equal(after.replace(accessMarkup,oldAccess).replace('<link rel="stylesheet" href="/v1/css/access-motion.css">','').replace('<script src="/v1/js/access-motion.js" defer></script>',''),before);
 assert.throws(()=>refineAccessMotion(after));
 assert.doesNotMatch(after,/Your classes, in the app\./);
 assert.match(after,/Sign in to access your classes\./);assert.match(after,/New subscription purchases are not available on this page\./);
 assert.match(accessMarkup,/href="https:\/\/app.danzuni.com\/classes"/);
 assert.match(accessMarkup,/href="mailto:info@socialdancetv.com"/);
 assert.doesNotMatch(accessMarkup,/<form|checkout|free trial|onclick/i);
 const ids=[...after.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
});
test('four additions only and full actual public hash allowlist',async()=>{
 const old={...pinned.rootFiles,...pinned.v1Files},now={...manifest.rootFiles,...manifest.v1Files};
 assert.deepEqual(Object.keys(now).filter(p=>!old[p]).sort(),Object.keys(accessAssets).map(p=>'v1/'+p).sort());
 for(const [p,h] of Object.entries(now))assert.equal(hash(await readFile(join(out,p))),h,p);
 const walk=async(d,p='')=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(join(d,e.name),p+e.name+'/'):p+e.name))).flat();
 assert.deepEqual((await walk(out)).sort(),[...Object.keys(now),'vercel.json'].sort());
});
test('static fallback, scoped CSS and reduced motion stay intact',async()=>{
 const css=await readFile(join(out,'v1/css/access-motion.css'),'utf8');
 assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
 assert.match(css,/min-height: 56px/);assert.match(css,/a:focus-visible/);
 assert.doesNotMatch(css,/animation:.*infinite|will-change|backdrop-filter/);
 assert.match(accessMarkup,/aria-describedby="next-signin access-note"/);
});

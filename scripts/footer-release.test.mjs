import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {hash,pinned,footerHtml} from './build-footer-release.mjs';
const base=process.env.LANDING_FOOTER_BASE,out=process.env.LANDING_RELEASE_DIR;
assert.ok(base&&out,'Set both release paths; do not silently skip');
const before=await readFile(join(base,'v1/index.html'),'utf8'),after=await readFile(join(out,'v1/index.html'),'utf8');
const manifest=JSON.parse(await readFile(out+'.manifest.json','utf8'));
test('all root bytes and every prior V1 asset including isolated devices stay exact',async()=>{
 assert.deepEqual(manifest.rootFiles,pinned.rootFiles);
 for(const [p,h] of Object.entries({...pinned.rootFiles,...pinned.v1Files}))if(p!=='v1/index.html')assert.equal(hash(await readFile(join(out,p))),h,p);
 assert.deepEqual(await readFile(join(base,'vercel.json')),await readFile(join(out,'vercel.json')));
});
test('only footer, retired tagline and stylesheet change in V1',()=>{
 const strip=h=>h.replace(/<footer\b[\s\S]*?<\/footer>/,'').replace(/<article class="cta-section"[^>]*><div class="cta-section__wrapper container"><h2 class="cta-section__title cta-section__title--big">Made By Dancers, For Everyone<\/h2><\/div><\/article>/,'').replace('<link rel="stylesheet" href="/v1/css/footer.css">','');
 assert.equal(strip(after),strip(before));assert.equal(after,footerHtml(before));assert.throws(()=>footerHtml(after));
});
test('one accessible footer, exact approved links, no new offer or forms',()=>{
 const f=after.match(/<footer\b[\s\S]*?<\/footer>/g);assert.equal(f.length,1);
 assert.match(f[0],/class="danzuni-footer" id="footer"/);
 assert.deepEqual([...f[0].matchAll(/href="([^"]+)"/g)].map(m=>m[1]).sort(),['/v1/','https://socialdancetv.com/','https://app.danzuni.com/classes','mailto:info@socialdancetv.com','https://app.danzuni.com/terms','https://app.danzuni.com/privacy'].sort());
 assert.match(f[0],/aria-describedby="footer-access-note"/);assert.match(f[0],/id="footer-access-note">Sign in to access classes\./);
 assert.doesNotMatch(f[0],/<form|<script|checkout|trial|payment/i);
 const ids=[...after.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
});
test('exact public allowlist and actual hashes, only two added resources',async()=>{
 const old={...pinned.rootFiles,...pinned.v1Files},now={...manifest.rootFiles,...manifest.v1Files};
 assert.deepEqual(Object.keys(now).filter(p=>!old[p]).sort(),['v1/css/footer.css','v1/img/danzuni-logo-c3740474.png']);
 for(const [p,h] of Object.entries(now))assert.equal(hash(await readFile(join(out,p))),h,p);
 const walk=async(d,p='')=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(join(d,e.name),p+e.name+'/'):p+e.name))).flat();
 assert.deepEqual((await walk(out)).sort(),[...Object.keys(now),'vercel.json'].sort());
});

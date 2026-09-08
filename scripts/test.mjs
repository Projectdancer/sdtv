import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { adaptHtml, adaptLegacyHtml } from './build.mjs';
import { improveLegacyJs } from './landing-quality.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = process.env.LANDING_OUTPUT_DIR;
assert.ok(output, 'Set LANDING_OUTPUT_DIR to the built, isolated site');
const source = await readFile(join(root, 'index.html'), 'utf8');
const html = await readFile(join(output, 'index.html'), 'utf8');
const js = await readFile(join(output, 'js/main.js'), 'utf8');
test('published HTML is exactly the reviewed adapter output',()=>assert.equal(html,adaptHtml(source)));
test('archived logo-only baseline remains unchanged',()=>{
 const html=adaptLegacyHtml(source);
 const marks=/<span class="(?:danzuni-header-logo|page-footer__logo danzuni-footer-logo)">[\s\S]*?<\/span><\/span>/g;
 assert.equal([...html.matchAll(marks)].length,2);
 const normalized=html.replace(marks,'__BRAND_MARK__');
 assert.equal(createHash('sha256').update(normalized).digest('hex'),'232ec058389df3230ae5b3c23d30fc68fa8f188b25e388dd2985d6bbe4f208f4');
});
test('header and footer use the accessible application wordmark',()=>{
 assert.equal([...html.matchAll(/class="danzuni-wordmark" role="img" aria-label="Danzuni">Danzuni<\/span>/g)].length,2);
 assert.doesNotMatch(html,/icons\.svg#logo-(?:horizontal|square)/);
});
test('changed upstream is refused',()=>assert.throws(()=>adaptHtml(source+' '),/Legacy HTML changed/));
test('no card, email or subscription forms',()=>assert.doesNotMatch(html,/<form\b|<input\b|payment-form|cc-number|cc-csc/));
test('no historical prices, discounts or trial offers',()=>assert.doesNotMatch(html,/\$\s?\d|\d+\s?€|750|90\s?\+|Try it out for 7 days/i));
test('no legacy signup, Groupon flag or payment path',()=>assert.doesNotMatch(html,/app\.socialdancetv\.com|gr=1|href="[^\"]*(?:signup|checkout|payment)/));
test('new canonical and primary destinations',()=>{
 assert.match(html,/rel="canonical" href="https:\/\/go\.danzuni\.com\/"/);
 assert.match(html,/href="https:\/\/app\.danzuni\.com\/classes"/);
 assert.match(html,/href="https:\/\/app\.danzuni\.com\/login"/);
});
test('purchase unavailability is explicitly stated',()=>assert.match(html,/New subscription purchases are not available on this page/));
test('no dead links or missing section targets',()=>{
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const [,href] of html.matchAll(/\bhref="#([^"]*)"/g)){assert.ok(href);assert.ok(ids.has(href),href);}
});
test('local HTML assets resolve, including responsive image variants',async()=>{
 const paths=[...html.matchAll(/(?:src|href|xlink:href)="([^"#]+)(?:#[^"]*)?"/g)].map(m=>m[1]);
 paths.push(...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap(m=>m[1].split(',').map(p=>p.trim().replace(/\s+\d+w$/,''))));
 for(const p of paths.filter(p=>!/^https?:|^mailto:|^\/$/.test(p))){
  assert.ok((await stat(join(output,decodeURI(p.replace(/&amp;/g,'&')).replace(/^\//,'')))).isFile(),p);
 }
});
test('CSS dependencies are local and resolve',async()=>{
 for(const name of ['style.css','aos.css','fonts.css','danzuni.css','quality.css']){
  const css=await readFile(join(output,'css',name),'utf8');
  for(const [,raw] of css.matchAll(/url\(([^)]+)\)/g)){
   const p=raw.replace(/["']/g,'').trim(); if(p.startsWith('data:'))continue;
   assert.doesNotMatch(p,/^https?:/);assert.ok((await stat(resolve(output,'css',p))).isFile(),p);
  }
 }
});
test('original design stylesheet is byte-identical',async()=>assert.deepEqual(await readFile(join(root,'css/style.css')),await readFile(join(output,'css/style.css'))));
test('all original image and video assets are byte-identical',async()=>{
 async function check(dir){for(const entry of await readdir(join(root,dir),{withFileTypes:true})){
  const name=join(dir,entry.name);if(entry.isDirectory())await check(name);else assert.deepEqual(createHash('sha256').update(await readFile(join(root,name))).digest(),createHash('sha256').update(await readFile(join(output,name))).digest(),name);
 }} await check('img');await check('video');
});
test('obsolete payment click hook removed without disabling real links',()=>{assert.doesNotMatch(js,/payment__side/);assert.match(js,/aria-selected/);});
test('technical refinement preserves visible copy and navigation',()=>{
 const baseline=adaptLegacyHtml(source);
 const visible=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
 const links=s=>[...s.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map(m=>m[1]);
 assert.equal(visible(html),visible(baseline));
 assert.deepEqual(links(html),links(baseline));
});
test('nine previews have no eager MP4 source and preserve source identity',()=>{
 assert.equal([...html.matchAll(/<video\b/g)].length,9);
 assert.equal([...html.matchAll(/preload="none" playsinline aria-hidden="true"/g)].length,9);
 assert.doesNotMatch(html,/<source src="[^\"]*\.mp4/);
 assert.deepEqual([...html.matchAll(/data-src="([^\"]+\.mp4)"/g)].map(m=>m[1]),[...adaptLegacyHtml(source).matchAll(/src="([^\"]+\.mp4)"/g)].map(m=>m[1]));
});
test('below-fold images are lazy and reveal durations are bounded',()=>{
 assert.equal([...html.matchAll(/<img loading="lazy" decoding="async"/g)].length,60);
 assert.doesNotMatch(html,/data-aos-duration="2000"/);
 assert.match(html,/data-aos-duration="450" data-aos-once="true"/);
});
test('legacy scroll and hover handlers removed with a fail-closed adapter',()=>{
 assert.doesNotMatch(js,/t\.style\.left|t\.load\(\)|"mouseover"|"mouseout"/);
 assert.throws(()=>improveLegacyJs('unknown runtime'),/Legacy interaction changed/);
});
test('quality runtime is local and implements reduced-motion, keyboard and lifecycle guards',async()=>{
 const runtime=await readFile(join(output,'js/quality.js'),'utf8');
 assert.match(html,/<script src="js\/quality.js" defer>/);
 for(const value of ['prefers-reduced-motion','ArrowRight','ArrowLeft','Home','End','Escape','visibilitychange','IntersectionObserver','video.pause()','panel.inert']) assert.ok(runtime.includes(value),value);
});
test('runtime has no provider or analytics network primitives',async()=>assert.doesNotMatch(js+await readFile(join(output,'js/quality.js'),'utf8'),/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie/));
test('strict deployment boundary forbids connect/form/frame/object',async()=>{
 const config=JSON.parse(await readFile(join(output,'vercel.json'),'utf8'));
 assert.equal(config.framework,null);assert.equal(config.buildCommand,null);
 const csp=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
 for(const directive of ["connect-src 'none'","form-action 'none'","frame-ancestors 'none'","object-src 'none'"])assert.ok(csp.includes(directive));
});
test('source CNAME, scripts, Git and docs are excluded from deployment',async()=>{
 const files=await readdir(output);for(const p of ['CNAME','.git','scripts','deployment','README.md'])assert.ok(!files.includes(p),p);
});

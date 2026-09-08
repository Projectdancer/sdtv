import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { adaptHtml, adaptLegacyHtml } from './build.mjs';
import { improveHtml, improveLegacyJs } from './landing-quality.mjs';
import { clarifyHtml } from './landing-clarity.mjs';
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
 for(const name of ['style.css','aos.css','fonts.css','danzuni.css','quality.css','clarity.css']){
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
 const technical=improveHtml(baseline);
 const visible=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
 const links=s=>[...s.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map(m=>m[1]);
 assert.equal(visible(technical),visible(baseline));
 assert.deepEqual(links(technical),links(baseline));
});
test('nine previews have no eager MP4 source and preserve source identity',()=>{
 assert.equal([...html.matchAll(/<video\b/g)].length,9);
 assert.equal([...html.matchAll(/preload="none" playsinline aria-hidden="true"/g)].length,9);
 assert.doesNotMatch(html,/<source src="[^\"]*\.mp4/);
 assert.deepEqual([...html.matchAll(/data-src="([^\"]+\.mp4)"/g)].map(m=>m[1]),[...adaptLegacyHtml(source).matchAll(/src="([^\"]+\.mp4)"/g)].map(m=>m[1]));
});
test('below-fold images are lazy and reveal durations are bounded',()=>{
 assert.equal([...html.matchAll(/<img loading="lazy" decoding="async"/g)].length,34);
 assert.equal([...html.matchAll(/<img\b/g)].length,34);
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
test('runtime has no provider or analytics network primitives',async()=>assert.doesNotMatch(js+await readFile(join(output,'js/quality.js'),'utf8')+await readFile(join(output,'js/clarity.js'),'utf8'),/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie/));
test('strict deployment boundary forbids connect/form/frame/object',async()=>{
 const config=JSON.parse(await readFile(join(output,'vercel.json'),'utf8'));
 assert.equal(config.framework,null);assert.equal(config.buildCommand,null);
 const csp=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
 for(const directive of ["connect-src 'none'","form-action 'none'","frame-ancestors 'none'","object-src 'none'"])assert.ok(csp.includes(directive));
});
test('source CNAME, scripts, Git and docs are excluded from deployment',async()=>{
 const files=await readdir(output);for(const p of ['CNAME','.git','scripts','deployment','docs','README.md'])assert.ok(!files.includes(p),p);
});
test('clarity adapter is explicit and fails closed on changed markup',()=>{
 assert.throws(()=>clarifyHtml('<html></html>'),/Clarity source changed/);
 assert.throws(()=>clarifyHtml(improveHtml(adaptLegacyHtml(source)).replace('class="intro__title"','class="changed-title"')),/Clarity source changed/);
});
test('hero keeps the original scene and makes the destination explicit',()=>{
 assert.match(html,/<h1 class="intro__title">Your dance studio\.<br>Wherever you are\.<\/h1>/);
 assert.match(html,/Online salsa, bachata and more — at your pace/);
 assert.match(html,/aria-describedby="intro-access-note">Explore classes<\/a>/);
 assert.match(html,/id="intro-access-note">Sign in to access classes\./);
 assert.equal([...html.matchAll(/From the team behind /g)].length,1);
 assert.doesNotMatch(html,/>SDTV<|>Membership<|>Take class<|The Only Studio|danz\.uni|intro__origin/);
 assert.match(html,/class="page-footer__origin"/);
});
test('unverified catalog and testimonial examples are not rendered',()=>{
 assert.doesNotMatch(html,/class="reviews"|class="classes"|Jane Smith|Oye Como Va/);
 assert.match(source,/Jane Smith/); // Archive retained, not rewritten as new evidence.
 assert.match(source,/Oye Como Va/);
 assert.doesNotMatch(html,/&quot;item&quot;/);
 assert.match(html,/class="instructors__cta-block"/);
 assert.match(html,/aria-describedby="instructors-access-note">Explore classes<\/a>/);
 assert.equal([...html.matchAll(/class="instructors__name"/g)].length,21);
});
test('mobile art direction keeps a strong hero and the original photographic gateway',async()=>{
 const css=await readFile(join(output,'css/clarity.css'),'utf8');
 assert.match(css,/font-size: clamp\(28px, 9\.1vw, 36px\)/);
 assert.doesNotMatch(css,/\.instructors__list\s*\{|\.instructors__name\s*\{|\.instructors__list::before/);
 const runtime=await readFile(join(output,'js/clarity.js'),'utf8');
 assert.match(runtime,/querySelectorAll\('\.danzuni-access__cta, \.instructors__cta-btn'\)/);
});
test('only source-backed player controls are described, with device limitation',()=>{
 for(const id of ['mirror-video','loop-moves','control-speed'])assert.match(html,new RegExp(`id="${id}"`));
 assert.doesNotMatch(html,/switch-views|different angles|cast directly|image\/wepb/);
 assert.match(html,/Controls vary by device/);
 assert.match(html,/Repeat a section while you practise/);
 assert.equal([...html.matchAll(/srcset="\.\/img\/main\/mob-program.webp"/g)].length,3);
});
test('one compact access action, preserved support and legal destinations',()=>{
 assert.equal([...html.matchAll(/class="button danzuni-access__cta"/g)].length,1);
 assert.doesNotMatch(html,/<li class="tariff">/);
 for(const path of ['terms','privacy'])assert.match(html,new RegExp(`href="https://app.danzuni.com/${path}"`));
 assert.match(html,/href="mailto:info@socialdancetv.com"/);
 assert.match(html,/&copy; 2026 Social Dance TV. Danzuni. All Rights Reserved/);
 assert.match(html,/class="banner" id="banner" hidden/);
 assert.match(html,/<script src="js\/clarity.js" defer>/);
});

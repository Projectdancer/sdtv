import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { v1Html, filesIn, hash, baselineHtmlHash } from './build-v1.mjs';
const output=process.env.LANDING_RELEASE_DIR;
assert.ok(output, 'Set LANDING_RELEASE_DIR');
const html=await readFile(join(output,'v1/index.html'),'utf8');
const manifest=JSON.parse(await readFile(output+'.manifest.json','utf8'));

test('root is preserved byte-for-byte, including every asset in the pinned manifest',async()=>{
 assert.equal(hash(await readFile(join(output,'index.html'))),baselineHtmlHash);
 for(const [path,digest] of Object.entries(manifest.rootFiles)) assert.equal(hash(await readFile(join(output,path))),digest,path);
});
test('candidate bytes match the scoped release manifest',async()=>{
 for(const [path,digest] of Object.entries(manifest.v1Files)) assert.equal(hash(await readFile(join(output,path))),digest,path);
});
test('v1 scopes assets but preserves fragment and external destinations',()=>{
 const input='<head></head><a href="/">Home</a><a href="#mirror-video">Mirror</a><a href="https://app.danzuni.com/classes">Classes</a><a href="mailto:info@socialdancetv.com">Support</a><use xlink:href="icons.svg#book"></use><img src="./img/Antonio &amp; Jasmina.jpg" srcset="img/a.jpg 1x, img/b.jpg 2x"><source data-src="./video/salsa.mp4"><link href="/favicon.ico">';
 const result=v1Html(input);
 for(const reference of ['href="#mirror-video"','href="https://app.danzuni.com/classes"','href="mailto:info@socialdancetv.com"','href="/v1/"','xlink:href="/v1/icons.svg#book"','src="/v1/img/Antonio%20&amp;%20Jasmina.jpg"','srcset="/v1/img/a.jpg 1x, /v1/img/b.jpg 2x"','data-src="/v1/video/salsa.mp4"','href="/v1/favicon.ico"'])assert.ok(result.includes(reference),reference);
 assert.throws(()=>v1Html('<head></head><a href="/unknown">Unknown</a>'),/Unexpected local path/);
 assert.throws(()=>v1Html('<head></head><img src="../secret">'),/Unexpected local path/);
});
test('real v1 HTML references resolve within v1, including responsive and deferred media',async()=>{
 const refs=[...html.matchAll(/\b(?:xlink:href|data-src|src|href)="([^"]+)"/g)].map(m=>m[1]);
 refs.push(...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap(m=>m[1].split(',').map(p=>p.trim().split(/\s+/)[0])));
 for(const ref of refs){
  if(/^(?:https?:|mailto:|#)/.test(ref))continue;
  assert.ok(ref.startsWith('/v1/'),ref);
  if(ref==='/v1/')continue;
  const decoded=decodeURI(ref.split('#')[0].replaceAll('&amp;','&'));
  assert.ok((await stat(join(output,decoded.slice(1)))).isFile(),ref);
 }
 for(const cssPath of ['style.css','aos.css','fonts.css','danzuni.css','quality.css','clarity.css']){
  const css=await readFile(join(output,'v1/css',cssPath),'utf8');
  for(const [,raw] of css.matchAll(/url\(([^)]+)\)/g)){
   const path=raw.replace(/["']/g,'').trim();if(path.startsWith('data:'))continue;
   assert.ok((await stat(resolve(output,'v1/css',path))).isFile(),path);
  }
 }
});
test('only exact v1 route is added, existing root security headers stay intact',async()=>{
 const config=JSON.parse(await readFile(join(output,'vercel.json'),'utf8'));
 const baseline=JSON.parse(await readFile(new URL('../deployment/vercel.json',import.meta.url),'utf8'));
 assert.deepEqual(config.headers[0],baseline.headers[0]);
 assert.deepEqual(config.rewrites,[{source:'/v1',destination:'/v1/index.html'}]);
 assert.equal(config.redirects,undefined);
 assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 assert.match(html,/rel="canonical" href="https:\/\/go\.danzuni\.com\/"/);
 assert.deepEqual(config.headers[1],{source:'/v1/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]});
});
test('no source, nested config, or release evidence is published',async()=>{
 const files=await filesIn(output);
 for(const path of files)assert.doesNotMatch(path,/(?:^|\/)(?:scripts|docs|\.git|\.vercel|deployment)\/|manifest\.json$|^v1\/vercel\.json$|^v1\/robots\.txt$/);
 assert.equal(files.filter(path=>path==='vercel.json').length,1);
 assert.doesNotMatch(html,/<form\b|<input\b|gr=1|danz\.uni/);
});

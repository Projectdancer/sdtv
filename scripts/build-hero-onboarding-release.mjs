import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,cp} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const pinned=JSON.parse(await readFile(new URL('../docs/complete-v1-publication-20260909/release-manifest.json',import.meta.url),'utf8'));
export const note='Start with a few questions about your dancing.';
export const newDestination='https://app.danzuni.com/signup/1';
export const acquisitionClasses={root:['main-nav__btn','intro__cta','banner__link','instructors__cta-btn'],v1:['intro__cta','instructors__cta-btn']};
export function heroHtml(html,variant){
 assert.ok(['root','v1'].includes(variant));const isV1=variant==='v1',prefix=isV1?'/v1/':'/';
 assert.equal(hash(Buffer.from(html)),isV1?pinned.v1Files['v1/index.html']:pinned.rootFiles['index.html'],'Review changed baseline');
 const counts=Object.fromEntries(acquisitionClasses[variant].map(k=>[k,0]));
 html=html.replace(/<a\b[^>]*>/g,tag=>{
  const classes=tag.match(/class="([^"]*)"/)?.[1].split(/\s+/)||[];
  if(classes.includes('main-nav__btn')&&classes.includes('button--white'))return tag;
  const matches=Object.keys(counts).filter(c=>classes.includes(c));if(!matches.length)return tag;
  assert.equal(matches.length,1);counts[matches[0]]++;
  assert.ok(tag.includes('href="https://app.danzuni.com/classes"'));
  return tag.replace('href="https://app.danzuni.com/classes"',`href="${newDestination}"`);
 });
 for(const [k,count] of Object.entries(counts))assert.equal(count,1,k);
 const hero=/<section class="intro" id="intro"><div class="intro__wrapper container">([\s\S]*?)<\/div><\/section>/g;
 assert.equal([...html.matchAll(hero)].length,1);
 html=html.replace(hero,(_,content)=>{
  if(isV1){
   assert.ok(content.includes('Online salsa, bachata and more — at your pace.'));
   content=content.replace('Online salsa, bachata and more — at your pace.','On-demand salsa, bachata and more. Learn at your own pace.');
   assert.ok(content.includes('id="intro-access-note">Sign in to access classes.'));
   content=content.replace('id="intro-access-note">Sign in to access classes.',`id="intro-access-note">${note}`);
  }else{
   content=content.replace(`href="${newDestination}">`,`href="${newDestination}" aria-describedby="intro-access-note">`);
   content+=`<p class="intro__note" id="intro-access-note">${note}</p>`;
  }
  return `<section class="intro intro--onboarding" id="intro"><div class="intro__wrapper container"><div class="intro__copy">${content}</div><img class="intro__visual" src="${prefix}img/intro-desc.jpg" alt="" width="814" height="727" fetchpriority="high" decoding="async"></div></section>`;
 });
 if(isV1){const old='id="instructors-access-note">Sign in to access classes.';assert.equal(html.split(old).length,2);html=html.replace(old,`id="instructors-access-note">${note}`);}
 assert.equal(html.split('</head>').length,2);
 return html.replace('</head>',`<link rel="stylesheet" href="${prefix}css/hero-onboarding.css"></head>`);
}
export async function build(source,output){
 assert.ok(source&&output);const a=resolve(source).toLowerCase(),b=resolve(output).toLowerCase();
 assert.ok(a.startsWith('d:\\codex-runs\\')&&b.startsWith('d:\\codex-runs\\'));assert.ok(a!==b&&!a.startsWith(b+'\\')&&!b.startsWith(a+'\\'));
 assert.deepEqual(JSON.parse(await readFile(source+'.manifest.json','utf8')),pinned);
 const files={...pinned.rootFiles,...pinned.v1Files};for(const [p,h] of Object.entries(files))assert.equal(hash(await readFile(join(source,p))),h,p);
 const config=await readFile(join(source,'vercel.json'));assert.equal(hash(config),'822b9c60790ca195969976aaedfe17b6e876fe0bf558249d4a730ba4630f8c1a');
 const root=heroHtml(await readFile(join(source,'index.html'),'utf8'),'root'),v1=heroHtml(await readFile(join(source,'v1/index.html'),'utf8'),'v1');
 const css=await readFile(new URL('../deployment/hero-onboarding.css',import.meta.url));
 await mkdir(output,{recursive:true});assert.equal((await readdir(output)).length,0);
 for(const p of Object.keys(files)){await mkdir(dirname(join(output,p)),{recursive:true});await cp(join(source,p),join(output,p));}
 await writeFile(join(output,'vercel.json'),config);await writeFile(join(output,'index.html'),root);await writeFile(join(output,'v1/index.html'),v1);
 const manifest=structuredClone(pinned);manifest.rootFiles['index.html']=hash(Buffer.from(root));manifest.v1Files['v1/index.html']=hash(Buffer.from(v1));
 for(const p of ['css/hero-onboarding.css','v1/css/hero-onboarding.css']){assert.ok(!files[p]);await writeFile(join(output,p),css);(p.startsWith('v1/')?manifest.v1Files:manifest.rootFiles)[p]=hash(css);}
 await writeFile(output+'.manifest.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:'BUILT_NOT_DEPLOYED',root:manifest.rootFiles['index.html'],v1:manifest.v1Files['v1/index.html'],resources:Object.keys({...manifest.rootFiles,...manifest.v1Files}).length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build(process.env.LANDING_HERO_BASE,process.env.LANDING_RELEASE_DIR);

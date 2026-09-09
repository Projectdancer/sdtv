import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,cp} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export const baseline=JSON.parse(await readFile(new URL('../docs/hero-onboarding-publication-20260909/release-manifest.json',import.meta.url),'utf8'));
export const canonical='https://go.danzuni.com/';
export const title='Online Salsa & Bachata Dance Classes | Danzuni';
export const description='Online salsa, bachata and more with Danzuni by Social Dance TV. Learn at your own pace and start with a few questions about your dancing.';
const imageUrl=canonical+'img/intro-desc.jpg';
const imageAlt='Dancer practising at home beside a television showing a dance lesson';
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const structuredData={
  '@context':'https://schema.org',
  '@graph':[
    {'@type':'WebSite','@id':canonical+'#website',url:canonical,name:'Danzuni',description,inLanguage:'en'},
    {'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'en',isPartOf:{'@id':canonical+'#website'},primaryImageOfPage:{'@type':'ImageObject',url:imageUrl,width:814,height:727,caption:imageAlt}}
  ]
};
export const robots='User-agent: *\nAllow: /\n\nSitemap: '+canonical+'sitemap.xml\n';
export const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+canonical+'</loc></url></urlset>\n';

export function seoHtml(html){
  assert.equal(hash(Buffer.from(html)),baseline.rootFiles['index.html'],'Review changed SEO baseline');
  const originalTitle='<title>Danzuni | Social Dance TV</title>';
  const originalDescription='<meta name="description" content="Dance classes at your own pace, on your own time, and on any device. Explore Danzuni by Social Dance TV.">';
  for(const exact of [originalTitle,originalDescription,'</head>'])assert.equal(html.split(exact).length,2);
  assert.ok(html.includes('<link rel="canonical" href="'+canonical+'">'));
  const meta=(key,value,attribute='name')=>'<meta '+attribute+'="'+key+'" content="'+escape(value)+'">';
  const addition=[
    meta('robots','index, follow, max-image-preview:large'),
    ...Object.entries({'og:type':'website','og:site_name':'Danzuni','og:title':title,'og:description':description,'og:url':canonical,'og:image':imageUrl,'og:image:width':'814','og:image:height':'727','og:image:alt':imageAlt}).map(([key,value])=>meta(key,value,'property')),
    ...Object.entries({'twitter:card':'summary','twitter:title':title,'twitter:description':description,'twitter:image':imageUrl,'twitter:image:alt':imageAlt}).map(([key,value])=>meta(key,value)),
    '<script type="application/ld+json">'+JSON.stringify(structuredData).replaceAll('<','\\u003c')+'</script>'
  ].join('');
  return html.replace(originalTitle,'<title>'+escape(title)+'</title>').replace(originalDescription,meta('description',description)).replace('</head>',addition+'</head>');
}

export async function build(source,output){
  assert.ok(source&&output);const a=resolve(source).toLowerCase(),b=resolve(output).toLowerCase();
  assert.ok(a.startsWith('d:\\codex-runs\\')&&b.startsWith('d:\\codex-runs\\'));
  assert.ok(a!==b&&!a.startsWith(b+'\\')&&!b.startsWith(a+'\\'));
  assert.deepEqual(JSON.parse(await readFile(source+'.manifest.json','utf8')),baseline);
  const files={...baseline.rootFiles,...baseline.v1Files};
  for(const [path,expected] of Object.entries(files))assert.equal(hash(await readFile(join(source,path))),expected,path);
  assert.ok(!Object.hasOwn(files,'sitemap.xml'));
  const config=await readFile(join(source,'vercel.json'));assert.equal(hash(config),'822b9c60790ca195969976aaedfe17b6e876fe0bf558249d4a730ba4630f8c1a');
  assert.equal(await readFile(join(source,'robots.txt'),'utf8'),'User-agent: *\nAllow: /\n');
  const html=seoHtml(await readFile(join(source,'index.html'),'utf8'));
  await mkdir(output,{recursive:true});assert.equal((await readdir(output)).length,0,'Output must be empty');
  for(const path of Object.keys(files)){await mkdir(dirname(join(output,path)),{recursive:true});await cp(join(source,path),join(output,path));}
  await writeFile(join(output,'vercel.json'),config);
  const manifest=structuredClone(baseline);
  for(const [path,body] of Object.entries({'index.html':html,'robots.txt':robots,'sitemap.xml':sitemap})){
    await writeFile(join(output,path),body);manifest.rootFiles[path]=hash(Buffer.from(body));
  }
  await writeFile(output+'.manifest.json',JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({status:'BUILT_NOT_DEPLOYED',root:manifest.rootFiles['index.html'],v1:manifest.v1Files['v1/index.html'],resources:Object.keys({...manifest.rootFiles,...manifest.v1Files}).length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build(process.env.LANDING_SEO_BASE,process.env.LANDING_RELEASE_DIR);

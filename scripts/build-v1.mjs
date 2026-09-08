import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

export const baselineSha = 'f79115d531419cf85cce9f29abaad361f76a13d4';
export const baselineHtmlHash = '2185e5fb4cf7348f7be928fdaa003959afdbbc76152b69e81ccb3ff1065a161c';
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const productImagePath = 'img/danzuni-devices-642dba75.png';
export const productImageHash = '642dba7579308024cf07e22a6ad4b710e4f139eb34b9eb57eef1dad62b637990';

// Owner-approved test illustration, scoped to /v1 only. Never rewrite the
// archived source or the pinned root artifact. Fail closed if that slot changes.
export function v1ProductHtml(html) {
  const images = [...html.matchAll(/<img\b[^>]*class="join__image"[^>]*>/g)];
  assert.equal(images.length, 1, 'Expected one product illustration');
  const original = '<img loading="lazy" decoding="async" class="join__image" src="img/screens.png" alt="Our  product" width="288" height="197">';
  assert.equal(images[0][0], original, 'Review changed product illustration markup');
  return html.replace(original, `<img loading="lazy" decoding="async" class="join__image" src="${productImagePath}" alt="Danzuni class library illustrated on desktop, tablet and phone" width="1474" height="1067">`);
}

// Hash links must stay literal: the legacy tabs use getAttribute('href').slice(1).
// Absolute /v1 asset paths work both at /v1 and /v1/, without changing the root.
export function v1Html(html) {
  assert.doesNotMatch(html, /<base\b|name="robots"/i);
  const prefix = value => {
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(value)) return value;
    if (value === '/') return '/v1/';
    if (['/favicon.ico','/icon.svg','/apple-touch-icon.png'].includes(value)) return '/v1'+value;
    assert.ok(!value.startsWith('/') && !value.includes('..'), `Unexpected local path: ${value}`);
    return '/v1/' + value.replace(/^\.\//, '').replaceAll(' ', '%20');
  };
  html = html.replace(/\b(xlink:href|data-src|srcset|src|href)="([^"]*)"/g, (_, key, value) => {
    const scoped = key === 'srcset'
      ? value.split(',').map(part => {
        const [,url,descriptor=''] = part.trim().match(/^(.*?)(\s+\d+(?:\.\d+)?[wx])?$/);
        return prefix(url)+descriptor;
      }).join(', ')
      : prefix(value);
    return `${key}="${scoped}"`;
  });
  assert.equal(html.split('</head>').length, 2);
  return html.replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>');
}

export async function filesIn(dir, prefix = '') {
  const files = [];
  for (const item of await readdir(join(dir, prefix), {withFileTypes: true})) {
    assert.ok(!item.isSymbolicLink(), `No symlinks in deployment: ${item.name}`);
    if (item.name.startsWith('.')) continue;
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.isDirectory()) files.push(...await filesIn(dir, path));
    else files.push(path);
  }
  return files.sort();
}

export async function assembleV1(baseline, candidate, destination) {
  for (const path of [baseline, candidate, destination]) {
    assert.ok(path && resolve(path).toLowerCase().startsWith('d:\\codex-runs\\'), 'Use isolated D:\\codex-runs paths');
  }
  const paths = [baseline, candidate, destination].map(path => resolve(path).toLowerCase());
  assert.equal(new Set(paths).size, 3, 'Inputs and output must differ');
  for (const a of paths) for (const b of paths) if(a !== b) assert.ok(!a.startsWith(b+'\\'), 'No nested input/output directories');
  const oldHtml = await readFile(join(baseline, 'index.html'));
  assert.equal(hash(oldHtml), baselineHtmlHash, 'Pinned production HTML must match');
  const productImage = await readFile(new URL('../deployment/v1/danzuni-devices-642dba75.png', import.meta.url));
  assert.equal(hash(productImage), productImageHash, 'Approved product illustration bytes must match');
  const candidateHtml = v1ProductHtml(await readFile(join(candidate, 'index.html'), 'utf8'));
  const baselineFiles = await filesIn(baseline);
  assert.ok(!baselineFiles.some(file => file.startsWith('v1/')), 'Baseline cannot already contain v1');
  await mkdir(destination, {recursive:true});
  assert.equal((await readdir(destination)).length, 0, 'Release directory must be empty');
  const oldConfig = JSON.parse(await readFile(join(baseline, 'vercel.json'), 'utf8'));
  assert.ok(!oldConfig.rewrites && !oldConfig.redirects, 'Review changed baseline routing');
  for (const path of baselineFiles) {
    await mkdir(resolve(destination, path, '..'), {recursive:true});
    await cp(join(baseline, path), join(destination, path));
  }
  const candidateFiles = (await filesIn(candidate)).filter(path => !['vercel.json','robots.txt','404.html'].includes(path));
  for (const path of candidateFiles) {
    await mkdir(resolve(destination, 'v1', path, '..'), {recursive:true});
    await cp(join(candidate, path), join(destination, 'v1', path));
  }
  assert.ok(!candidateFiles.includes(productImagePath), 'Do not overwrite an existing candidate asset');
  await writeFile(join(destination, 'v1', productImagePath), productImage);
  candidateFiles.push(productImagePath);
  await writeFile(join(destination, 'v1/index.html'), v1Html(candidateHtml));
  await writeFile(join(destination, 'vercel.json'), JSON.stringify({...oldConfig,
    rewrites: [{source:'/v1', destination:'/v1/index.html'}],
    headers: [...oldConfig.headers, {source:'/v1/:path*', headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]
  }, null, 2)+'\n');
  const manifest = {baselineSha, rootFiles:{}, v1Files:{}};
  for (const path of baselineFiles.filter(path => path !== 'vercel.json')) {
    const originalHash = hash(await readFile(join(baseline, path)));
    assert.equal(hash(await readFile(join(destination, path))), originalHash, `Root changed: ${path}`);
    manifest.rootFiles[path] = originalHash;
  }
  for (const path of candidateFiles) manifest.v1Files[`v1/${path}`] = hash(await readFile(join(destination,'v1',path)));
  // Evidence is deliberately outside the public artifact.
  await writeFile(destination+'.manifest.json', JSON.stringify(manifest,null,2)+'\n');
  console.log(`Built isolated /v1; preserved ${Object.keys(manifest.rootFiles).length} root files byte-for-byte`);
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await assembleV1(process.env.LANDING_BASELINE_DIR, process.env.LANDING_CANDIDATE_DIR, process.env.LANDING_OUTPUT_DIR);
}

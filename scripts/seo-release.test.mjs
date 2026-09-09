import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {build, seoHtml} from './build-seo-release.mjs';

const base = process.env.LANDING_SEO_BASE;
const out = process.env.LANDING_RELEASE_DIR;
assert.ok(base && out, 'Set LANDING_SEO_BASE and LANDING_RELEASE_DIR; do not silently skip');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const [before, after, oldV1, newV1, oldRobots, newRobots, sitemap, baseline, manifest, baselinePin] = await Promise.all([
  readFile(join(base, 'index.html'), 'utf8'), readFile(join(out, 'index.html'), 'utf8'),
  readFile(join(base, 'v1/index.html'), 'utf8'), readFile(join(out, 'v1/index.html'), 'utf8'),
  readFile(join(base, 'robots.txt'), 'utf8'), readFile(join(out, 'robots.txt'), 'utf8'),
  readFile(join(out, 'sitemap.xml'), 'utf8'), readJson(base + '.manifest.json'),
  readJson(out + '.manifest.json'),
  readJson(new URL('../docs/hero-onboarding-publication-20260909/release-manifest.json', import.meta.url))
]);
const oldFiles = {...baseline.rootFiles, ...baseline.v1Files};
const newFiles = {...manifest.rootFiles, ...manifest.v1Files};
// Independent review expectations, not imported from the builder.
const canonical = 'https://go.danzuni.com/';
const expectedTitle = 'Online Salsa & Bachata Dance Classes | Danzuni';
const expectedDescription = 'Online salsa, bachata and more with Danzuni by Social Dance TV. Learn at your own pace and start with a few questions about your dancing.';
const imageUrl = canonical + 'img/intro-desc.jpg';
const imageAlt = 'Dancer practising at home beside a television showing a dance lesson';
const decode = value => value.replace(/&(?:amp|quot|lt|gt);/g, entity => ({'&amp;': '&', '&quot;': '"', '&lt;': '<', '&gt;': '>'})[entity]);
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
const exactlyOne = (html, pattern) => {
  const matches = [...html.matchAll(pattern)];
  assert.equal(matches.length, 1, pattern.source);
  return matches[0];
};
const head = html => exactlyOne(html, /<head>[\s\S]*?<\/head>/g)[0];
const metaTags = [...head(after).matchAll(/<meta\b[^>]*>/g)].map(match => ({raw: match[0], ...attributes(match[0])}));
const meta = key => {
  const matches = metaTags.filter(tag => tag.name === key || tag.property === key);
  assert.equal(matches.length, 1, `Exactly one ${key}`);
  return matches[0].content;
};
const jsonScript = exactlyOne(head(after), /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
const graph = JSON.parse(jsonScript[1]);
const expectedMeta = {
  description: expectedDescription,
  robots: 'index, follow, max-image-preview:large',
  'og:type': 'website', 'og:site_name': 'Danzuni', 'og:title': expectedTitle,
  'og:description': expectedDescription, 'og:url': canonical, 'og:image': imageUrl,
  'og:image:width': '814', 'og:image:height': '727', 'og:image:alt': imageAlt,
  'twitter:card': 'summary', 'twitter:title': expectedTitle,
  'twitter:description': expectedDescription, 'twitter:image': imageUrl,
  'twitter:image:alt': imageAlt
};

test('baseline is the reviewed 317-resource hero release with exact provenance', () => {
  assert.deepEqual(baseline, baselinePin);
  assert.equal(Object.keys(oldFiles).length, 317);
  assert.equal(digest(before), 'e500674459f00833ee84afbe1dc2717ac1bd92a044c44ac9d1b9e06d1d8d86e8');
  assert.equal(digest(oldV1), '3d8b08e1e6ebf4ee8464119740a65e233e899c9e4e461a9c178e7a9445316da5');
  assert.equal(digest(oldRobots), '16ceb5ee3e0dc13aa9adf31a3ebbe45a1d965b8c2b9f72eaf84e5911e140ed95');
  const provenance = ({rootFiles, v1Files, ...rest}) => rest;
  assert.deepEqual(provenance(manifest), provenance(baseline));
});

test('root body and all existing head content remain byte-exact outside approved SEO fields', () => {
  assert.equal(exactlyOne(after, /<body\b[\s\S]*?<\/body>/g)[0], exactlyOne(before, /<body\b[\s\S]*?<\/body>/g)[0]);
  const originalTitle = exactlyOne(head(before), /<title>[\s\S]*?<\/title>/g)[0];
  const originalDescription = exactlyOne(head(before), /<meta name="description"[^>]*>/g)[0];
  let restored = after.replace(jsonScript[0], '');
  restored = restored.replace(/<title>[\s\S]*?<\/title>/, originalTitle);
  restored = restored.replace(/<meta\b[^>]*>/g, tag => {
    const fields = attributes(tag), key = fields.name || fields.property;
    if (key === 'description') return originalDescription;
    return Object.hasOwn(expectedMeta, key) ? '' : tag;
  });
  assert.equal(restored, before, 'Only reviewed head fields may change');
  assert.equal(seoHtml(before), after, 'Built artifact matches the reviewed transform');
});

test('title, canonical and SEO metadata are unique, accurate and consistently escaped', () => {
  const title = exactlyOne(head(after), /<title>([\s\S]*?)<\/title>/g)[1];
  assert.equal(decode(title), expectedTitle);
  assert.ok(title.includes('&amp;'), 'Escape the visible HTML title');
  const keys = metaTags.map(tag => tag.name || tag.property || (tag.charset ? 'charset' : tag['http-equiv']));
  assert.equal(new Set(keys).size, keys.length, 'No duplicate metadata keys');
  const originalKeys = [...head(before).matchAll(/<meta\b[^>]*>/g)].map(match => {
    const fields = attributes(match[0]);
    return fields.name || fields.property || (fields.charset ? 'charset' : fields['http-equiv']);
  });
  assert.deepEqual(keys.slice().sort(), [...new Set([...originalKeys, ...Object.keys(expectedMeta)])].sort());
  for (const [key, expected] of Object.entries(expectedMeta)) assert.equal(meta(key), expected, key);
  const canonicalTags = [...head(after).matchAll(/<link\b[^>]*>/g)].filter(match => attributes(match[0]).rel === 'canonical');
  assert.equal(canonicalTags.length, 1);
  assert.equal(attributes(canonicalTags[0][0]).href, canonical);
  assert.equal(metaTags.find(tag => tag.property === 'og:title').raw.includes('&amp;'), true);
  assert.equal(metaTags.find(tag => tag.name === 'twitter:title').raw.includes('&amp;'), true);
});

test('JSON-LD parses and describes only the real website, page and existing image with resolved graph IDs', () => {
  assert.equal(graph['@context'], 'https://schema.org');
  assert.deepEqual(Object.keys(graph).sort(), ['@context', '@graph']);
  assert.equal(graph['@graph'].length, 2);
  const nodes = graph['@graph'];
  assert.deepEqual(nodes.map(node => node['@type']).sort(), ['WebPage', 'WebSite']);
  const ids = nodes.map(node => node['@id']);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids.slice().sort(), [canonical + '#webpage', canonical + '#website']);
  const site = nodes.find(node => node['@type'] === 'WebSite');
  const page = nodes.find(node => node['@type'] === 'WebPage');
  assert.deepEqual(Object.keys(site).sort(), ['@id', '@type', 'description', 'inLanguage', 'name', 'url']);
  assert.deepEqual(Object.keys(page).sort(), ['@id', '@type', 'description', 'inLanguage', 'isPartOf', 'name', 'primaryImageOfPage', 'url']);
  for (const node of nodes) {
    assert.equal(node.url, canonical);
    assert.equal(node.description, expectedDescription);
    assert.equal(node.inLanguage, 'en');
  }
  assert.equal(site.name, 'Danzuni');
  assert.equal(page.name, expectedTitle);
  assert.deepEqual(page.isPartOf, {'@id': site['@id']});
  assert.ok(ids.includes(page.isPartOf['@id']));
  assert.deepEqual(page.primaryImageOfPage, {'@type': 'ImageObject', url: imageUrl, width: 814, height: 727, caption: imageAlt});
  const types = [];
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    if (value['@type']) types.push(value['@type']);
    for (const child of Object.values(value)) visit(child);
  };
  visit(graph);
  assert.deepEqual(types.sort(), ['ImageObject', 'WebPage', 'WebSite']);
});

test('added metadata has no invented commercial or catalog evidence, identities or language variants', () => {
  const addedText = [expectedTitle, ...Object.values(expectedMeta), jsonScript[1]].join('\n');
  assert.doesNotMatch(addedText, /free trial|\bprice\b|\bcurrency\b|aggregateRating|reviewCount|ratingCount|ratingValue|\boffers?\b|SearchAction|\bCourse\b|\bProduct\b|\bOrganization\b|sameAs|legalName|foundingDate|\b\d+[+]?\s+(?:lessons|classes|teachers|instructors|reviews)\b/i);
  assert.doesNotMatch(head(after), /\bhreflang=|application\/ld\+json[^>]*src=|llms(?:-full)?\.txt/i);
  assert.doesNotMatch(Object.keys(newFiles).join('\n'), /(?:^|\/)llms(?:-full)?\.txt(?:\n|$)/i);
  assert.equal(exactlyOne(after, /<html\b[^>]*>/g)[0], exactlyOne(before, /<html\b[^>]*>/g)[0]);
});

test('social metadata points to the unchanged JPEG and dimensions match the binary image', async () => {
  const bytes = await readFile(join(out, 'img/intro-desc.jpg'));
  assert.equal(digest(bytes), 'ae61c327cb3732d96b3a26d3ec8d621c63c9b8677acf2f9c64642db72217a8ef');
  assert.equal(bytes.length, 90992);
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'JPEG signature');
  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2, dimensions;
  while (offset < bytes.length) {
    assert.equal(bytes[offset++], 0xff, 'JPEG marker boundary');
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    const length = bytes.readUInt16BE(offset);
    assert.ok(length >= 2 && offset + length <= bytes.length, 'Valid JPEG segment');
    if (frameMarkers.has(marker)) {
      dimensions = {width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3)};
      break;
    }
    offset += length;
  }
  assert.deepEqual(dimensions, {width: 814, height: 727});
  assert.equal(Number(meta('og:image:width')), dimensions.width);
  assert.equal(Number(meta('og:image:height')), dimensions.height);
  assert.equal(meta('og:image'), meta('twitter:image'));
  assert.equal(new URL(meta('og:image')).pathname, '/img/intro-desc.jpg');
});

test('robots retains its wildcard allow policy and adds only the canonical sitemap reference', () => {
  assert.equal(oldRobots, 'User-agent: *\nAllow: /\n');
  const lines = value => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  assert.deepEqual(lines(newRobots), [...lines(oldRobots), `Sitemap: ${canonical}sitemap.xml`]);
  assert.equal(newRobots.replace(`\nSitemap: ${canonical}sitemap.xml\n`, ''), oldRobots);
  assert.doesNotMatch(newRobots, /Disallow|GPTBot|Google-Extended|OAI-SearchBot|ChatGPT-User|Claude|anthropic|noai|noimageai/i);
});

test('sitemap is a single valid canonical homepage entry without invented dates or V1/app URLs', () => {
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\s*<url>\s*<loc>https:\/\/go\.danzuni\.com\/<\/loc>\s*<\/url>\s*<\/urlset>\s*$/);
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]), [canonical]);
  assert.doesNotMatch(sitemap, /<lastmod>|<changefreq>|<priority>|\/v1|app\.danzuni|<!DOCTYPE|<!ENTITY/i);
});

test('all of V1, existing assets and routing/security configuration retain their exact baseline hashes', async () => {
  assert.equal(newV1, oldV1);
  assert.deepEqual(manifest.v1Files, baseline.v1Files);
  assert.match(newV1, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(newV1, /<link rel="canonical" href="https:\/\/go\.danzuni\.com\/">/);
  for (const [path, expectedHash] of Object.entries(oldFiles)) {
    assert.equal(digest(await readFile(join(base, path))), expectedHash, `baseline ${path}`);
    if (['index.html', 'robots.txt'].includes(path)) continue;
    assert.equal(newFiles[path], expectedHash, `manifest ${path}`);
    assert.equal(digest(await readFile(join(out, path))), expectedHash, `output ${path}`);
  }
  const config = await readFile(join(base, 'vercel.json'));
  assert.equal(digest(config), '822b9c60790ca195969976aaedfe17b6e876fe0bf558249d4a730ba4630f8c1a');
  assert.deepEqual(await readFile(join(out, 'vercel.json')), config);
  assert.ok(JSON.parse(config).headers.some(rule => rule.source === '/v1/:path*' && rule.headers.some(header => header.key === 'X-Robots-Tag' && header.value === 'noindex, nofollow')));
});

test('exactly two existing paths change and one sitemap is added, yielding 318 verified manifest resources', async () => {
  assert.deepEqual(Object.keys(oldFiles).filter(path => newFiles[path] !== oldFiles[path]).sort(), ['index.html', 'robots.txt']);
  assert.deepEqual(Object.keys(newFiles).filter(path => !Object.hasOwn(oldFiles, path)), ['sitemap.xml']);
  assert.deepEqual(Object.keys(oldFiles).filter(path => !Object.hasOwn(newFiles, path)), []);
  assert.deepEqual(Object.keys(manifest.rootFiles).sort(), [...Object.keys(baseline.rootFiles), 'sitemap.xml'].sort());
  assert.equal(Object.keys(newFiles).length, 318);
  for (const [path, expectedHash] of Object.entries(newFiles)) assert.equal(digest(await readFile(join(out, path))), expectedHash, path);
  const walk = async (directory, prefix = '') => (await Promise.all((await readdir(directory, {withFileTypes: true})).map(entry => entry.isDirectory() ? walk(join(directory, entry.name), prefix + entry.name + '/') : prefix + entry.name))).flat();
  assert.deepEqual((await walk(out)).sort(), [...Object.keys(newFiles), 'vercel.json'].sort());
});

test('transform and builder fail closed on baseline drift, wrong source, invalid paths and repeated output', async () => {
  assert.throws(() => seoHtml(before + '\n'), /Review changed SEO baseline/);
  assert.throws(() => seoHtml(oldV1), /Review changed SEO baseline/);
  assert.throws(() => seoHtml(after), /Review changed SEO baseline/);
  assert.throws(() => seoHtml(''), /Review changed SEO baseline/);
  await assert.rejects(build(undefined, out));
  await assert.rejects(build(base, undefined));
  await assert.rejects(build(base, base));
  await assert.rejects(build(base, join(base, 'nested')));
  await assert.rejects(build(join(base, 'nested'), base));
  await assert.rejects(build(base, 'C:\\not-an-output-location'));
  // The actual SEO output has a different manifest and cannot be reused as baseline.
  await assert.rejects(build(out, base));
  const priorManifest = await readFile(out + '.manifest.json');
  await assert.rejects(build(base, out), /Output must be empty/);
  assert.equal(await readFile(join(out, 'index.html'), 'utf8'), after);
  assert.equal(await readFile(join(out, 'v1/index.html'), 'utf8'), newV1);
  assert.equal(await readFile(join(out, 'robots.txt'), 'utf8'), newRobots);
  assert.equal(await readFile(join(out, 'sitemap.xml'), 'utf8'), sitemap);
  assert.deepEqual(await readFile(out + '.manifest.json'), priorManifest);
  assert.equal(await readFile(join(base, 'index.html'), 'utf8'), before);
});

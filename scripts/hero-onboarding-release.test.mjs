import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {build, heroHtml} from './build-hero-onboarding-release.mjs';

const base = process.env.LANDING_HERO_BASE;
const out = process.env.LANDING_RELEASE_DIR;
assert.ok(base && out, 'Set LANDING_HERO_BASE and LANDING_RELEASE_DIR; do not silently skip');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const baseline = await readJson(base + '.manifest.json');
const manifest = await readJson(out + '.manifest.json');
const baselinePin = await readJson(new URL('../docs/complete-v1-publication-20260909/release-manifest.json', import.meta.url));
const variants = ['root', 'v1'];
const paths = {root: 'index.html', v1: 'v1/index.html'};
const before = {}, after = {};
for (const variant of variants) {
  [before[variant], after[variant]] = await Promise.all([
    readFile(join(base, paths[variant]), 'utf8'),
    readFile(join(out, paths[variant]), 'utf8')
  ]);
}
const catalog = 'https://app.danzuni.com/classes';
const onboarding = 'https://app.danzuni.com/signup/1';
const login = 'https://app.danzuni.com/login';
const expectedNote = 'Start with a few questions about your dancing.';
// Review-owned scope: do not import the implementation's acquisition selectors.
const intended = {
  root: [
    ['main-nav__btn', 'Explore'],
    ['intro__cta', 'Explore classes'],
    ['banner__link', 'Explore classes'],
    ['instructors__cta-btn', 'Find class for you']
  ],
  v1: [
    ['intro__cta', 'Explore classes'],
    ['instructors__cta-btn', 'Explore classes']
  ]
};
const anchors = html => [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match => {
  const raw = match[0];
  return {
    raw,
    classes: raw.match(/^<a\b[^>]*\bclass="([^"]*)"/)?.[1].split(/\s+/) || [],
    href: raw.match(/^<a\b[^>]*\bhref="([^"]*)"/)?.[1],
    text: raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  };
});
const target = (anchor, variant) => intended[variant].some(([className, text]) => anchor.classes.includes(className) && anchor.text === text);
const hero = html => {
  const sections = [...html.matchAll(/<section\b[^>]*\bid="intro"[^>]*>[\s\S]*?<\/section>/g)];
  assert.equal(sections.length, 1, 'One hero section');
  return sections[0][0];
};
const stylesheet = variant => `<link rel="stylesheet" href="/${variant === 'v1' ? 'v1/' : ''}css/hero-onboarding.css">`;
const hrefs = html => [...html.matchAll(/\bhref="([^"]*)"/g)].map(match => match[1]);

test('input is the reviewed complete-V1 release and output manifest retains its provenance', () => {
  assert.deepEqual(baseline, baselinePin);
  assert.equal(digest(before.root), '5800809ca0fa9e73c79d4981dc937cc856ce222fe64281b5e903e5b24a864924');
  assert.equal(digest(before.v1), 'f030737238eae4a560569c0367bdc798c33c38075310920045ee815cb7007835');
  const metadata = ({rootFiles, v1Files, ...rest}) => rest;
  assert.deepEqual(metadata(manifest), metadata(baseline));
});

test('exactly six acquisition anchors change; all other anchors and all other hrefs remain exact', () => {
  let changedCount = 0;
  for (const variant of variants) {
    const oldAnchors = anchors(before[variant]), newAnchors = anchors(after[variant]);
    assert.equal(newAnchors.length, oldAnchors.length, variant);
    for (const [className, text] of intended[variant]) {
      assert.equal(oldAnchors.filter(anchor => anchor.classes.includes(className) && anchor.text === text).length, 1, `${variant}: ${className}`);
    }
    for (let index = 0; index < oldAnchors.length; index++) {
      const oldAnchor = oldAnchors[index], newAnchor = newAnchors[index];
      if (!target(oldAnchor, variant)) {
        assert.equal(newAnchor.raw, oldAnchor.raw, `${variant}: unchanged ${oldAnchor.text}`);
        continue;
      }
      changedCount++;
      assert.equal(oldAnchor.href, catalog);
      assert.equal(newAnchor.href, onboarding);
      let expected = oldAnchor.raw.replace(`href="${catalog}"`, `href="${onboarding}"`);
      if (variant === 'root' && oldAnchor.classes.includes('intro__cta')) {
        expected = expected.replace(`href="${onboarding}"`, `href="${onboarding}" aria-describedby="intro-access-note"`);
      }
      assert.equal(newAnchor.raw, expected, `${variant}: only approved CTA attributes`);
    }
    const expectedHtml = before[variant].replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, raw => target(anchors(raw)[0], variant) ? raw.replace(`href="${catalog}"`, `href="${onboarding}"`) : raw);
    assert.equal(after[variant].split(stylesheet(variant)).length, 2, 'Exactly one new stylesheet link per page');
    assert.deepEqual(hrefs(after[variant].replace(stylesheet(variant), '')), hrefs(expectedHtml), `${variant}: every href`);
  }
  assert.equal(changedCount, 6);
});

test('existing-user login and Open Danzuni journeys, root account cards and both footers are preserved', () => {
  for (const variant of variants) {
    const oldAnchors = anchors(before[variant]), newAnchors = anchors(after[variant]);
    const loginAnchors = oldAnchors.filter(anchor => anchor.href === login);
    assert.equal(loginAnchors.length, variant === 'root' ? 2 : 1);
    assert.deepEqual(newAnchors.filter(anchor => anchor.href === login), loginAnchors);
    const oldFooter = before[variant].match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(oldFooter);
    assert.equal(after[variant].match(/<footer\b[\s\S]*?<\/footer>/)?.[0], oldFooter);
  }
  const oldOpenLinks = anchors(before.v1).filter(anchor => anchor.text === 'Open Danzuni');
  assert.equal(oldOpenLinks.length, 7);
  assert.deepEqual(anchors(after.v1).filter(anchor => anchor.text === 'Open Danzuni'), oldOpenLinks);
  const oldAccounts = before.root.match(/<section class="tariffs"[\s\S]*?<\/section>/)?.[0];
  assert.ok(oldAccounts);
  assert.equal(after.root.match(/<section class="tariffs"[\s\S]*?<\/section>/)?.[0], oldAccounts);
});

test('everything outside the hero is byte-preserved except named CTA hrefs, V1 instructor note and stylesheet link', () => {
  for (const variant of variants) {
    let restored = after[variant].replace(hero(after[variant]), '<!-- hero -->').replace(stylesheet(variant), '');
    restored = restored.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, raw => target(anchors(raw)[0], variant) ? raw.replace(`href="${onboarding}"`, `href="${catalog}"`) : raw);
    if (variant === 'v1') {
      const changedNote = `id="instructors-access-note">${expectedNote}`;
      assert.equal(restored.split(changedNote).length, 2);
      restored = restored.replace(changedNote, 'id="instructors-access-note">Sign in to access classes.');
    }
    assert.equal(restored, before[variant].replace(hero(before[variant]), '<!-- hero -->'), variant);
  }
});

test('hero copy, decorative original image and accessible onboarding descriptions are explicit', () => {
  for (const variant of variants) {
    const oldHero = hero(before[variant]), newHero = hero(after[variant]);
    assert.match(newHero, /<section class="intro intro--onboarding" id="intro">/);
    assert.match(newHero, /<div class="intro__copy">/);
    assert.equal(newHero.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0], oldHero.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0]);
    const subtitle = newHero.match(/<p class="intro__subtitle">([\s\S]*?)<\/p>/)?.[1];
    assert.equal(subtitle, variant === 'v1' ? 'On-demand salsa, bachata and more. Learn at your own pace.' : 'Take classes at your own pace, on your own time, and on any device');
    assert.ok(newHero.includes(`aria-describedby="intro-access-note"`));
    assert.ok(newHero.includes(`<p class="intro__note" id="intro-access-note">${expectedNote}</p>`));
    const visual = newHero.match(/<img\b[^>]*class="intro__visual"[^>]*>/g);
    assert.equal(visual?.length, 1);
    assert.ok(visual[0].includes(`src="/${variant === 'v1' ? 'v1/' : ''}img/intro-desc.jpg"`));
    for (const attribute of ['alt=""', 'width="814"', 'height="727"', 'fetchpriority="high"', 'decoding="async"']) assert.ok(visual[0].includes(attribute), attribute);
    const ids = [...after[variant].matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${variant}: duplicate ID`);
    for (const match of after[variant].matchAll(/aria-describedby="([^"]+)"/g)) {
      for (const id of match[1].split(/\s+/)) assert.ok(ids.includes(id), `${variant}: unresolved ${id}`);
    }
  }
  assert.ok(after.v1.includes(`id="instructors-access-note">${expectedNote}`));
  assert.match(after.v1, /id="footer-access-note">Sign in to access classes\./);
  assert.match(after.v1, /id="next-signin">Sign in to access your classes\./);
});

test('every existing asset and routing/security configuration matches the exact baseline bytes', async () => {
  const oldFiles = {...baseline.rootFiles, ...baseline.v1Files};
  const newFiles = {...manifest.rootFiles, ...manifest.v1Files};
  for (const [path, expectedHash] of Object.entries(oldFiles)) {
    assert.equal(digest(await readFile(join(base, path))), expectedHash, `baseline ${path}`);
    if (Object.values(paths).includes(path)) continue;
    assert.equal(newFiles[path], expectedHash, `manifest ${path}`);
    assert.equal(digest(await readFile(join(out, path))), expectedHash, `output ${path}`);
  }
  const oldConfig = await readFile(join(base, 'vercel.json'));
  assert.equal(digest(oldConfig), '822b9c60790ca195969976aaedfe17b6e876fe0bf558249d4a730ba4630f8c1a');
  assert.deepEqual(await readFile(join(out, 'vercel.json')), oldConfig);
});

test('public artifact has exactly two CSS additions, no removals, and every manifest hash is real', async () => {
  const oldFiles = {...baseline.rootFiles, ...baseline.v1Files};
  const newFiles = {...manifest.rootFiles, ...manifest.v1Files};
  assert.deepEqual(Object.keys(manifest.rootFiles).sort(), [...Object.keys(baseline.rootFiles), 'css/hero-onboarding.css'].sort());
  assert.deepEqual(Object.keys(manifest.v1Files).sort(), [...Object.keys(baseline.v1Files), 'v1/css/hero-onboarding.css'].sort());
  assert.deepEqual(Object.keys(newFiles).filter(path => !Object.hasOwn(oldFiles, path)).sort(), ['css/hero-onboarding.css', 'v1/css/hero-onboarding.css']);
  assert.deepEqual(Object.keys(oldFiles).filter(path => !Object.hasOwn(newFiles, path)), []);
  assert.deepEqual(Object.keys(oldFiles).filter(path => oldFiles[path] !== newFiles[path]).sort(), ['index.html', 'v1/index.html']);
  for (const [path, expectedHash] of Object.entries(newFiles)) assert.equal(digest(await readFile(join(out, path))), expectedHash, path);
  const walk = async (directory, prefix = '') => (await Promise.all((await readdir(directory, {withFileTypes: true})).map(entry => entry.isDirectory() ? walk(join(directory, entry.name), prefix + entry.name + '/') : prefix + entry.name))).flat();
  assert.deepEqual((await walk(out)).sort(), [...Object.keys(newFiles), 'vercel.json'].sort());
  const sourceCss = await readFile(new URL('../deployment/hero-onboarding.css', import.meta.url));
  for (const path of ['css/hero-onboarding.css', 'v1/css/hero-onboarding.css']) assert.deepEqual(await readFile(join(out, path)), sourceCss);
});

test('shared CSS is confined to opted-in heroes and adds no external resources or motion', async () => {
  const css = (await readFile(join(out, 'css/hero-onboarding.css'), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim()).filter(selector => !selector.startsWith('@media'));
  assert.ok(selectors.length > 0);
  for (const group of selectors) for (const selector of group.split(',')) assert.match(selector.trim(), /^\.intro(?:\.intro)?--onboarding(?:::|\s|$)/, selector);
  assert.doesNotMatch(css, /@import|url\(|animation\s*:|transition\s*:/i);
});

test('transform rejects baseline drift, incorrect variants and a repeated transformation', () => {
  for (const variant of variants) {
    assert.equal(heroHtml(before[variant], variant), after[variant]);
    assert.throws(() => heroHtml(before[variant] + '\n', variant), /Review changed baseline/);
    assert.throws(() => heroHtml('', variant), /Review changed baseline/);
    assert.throws(() => heroHtml(after[variant], variant), /Review changed baseline/);
    assert.throws(() => heroHtml(before[variant], variant === 'root' ? 'v1' : 'root'), /Review changed baseline/);
  }
  for (const variant of [undefined, '', 'v2', 'ROOT', '__proto__']) assert.throws(() => heroHtml(before.root, variant));
});

test('builder rejects absent paths, self-overwrite, nested paths and output outside D runs before writes', async () => {
  await assert.rejects(build(undefined, out));
  await assert.rejects(build(base, undefined));
  await assert.rejects(build(base, base));
  await assert.rejects(build(base, join(base, 'nested')));
  await assert.rejects(build(join(base, 'nested'), base));
  await assert.rejects(build(base, 'C:\\not-an-output-location'));
});

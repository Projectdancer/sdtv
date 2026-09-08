import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { improveLegacyJs } from './landing-quality.mjs';

const runtime = await readFile(new URL('../js/clarity.js', import.meta.url), 'utf8');
const rectangle = (top, height = 48) => ({top, bottom: top + height, left: 20, right: 300, width: 280, height});

function setup({missing = '', intersection = true, mutation = true, extraAccess = false} = {}) {
  const button = {};
  const banner = Object.assign(new EventTarget(), {hidden: false, contains: element => element === button});
  const intro = {rect: rectangle(400), getBoundingClientRect() { return this.rect; }};
  const access = {rect: rectangle(1800), getBoundingClientRect() { return this.rect; }};
  const secondary = {rect: rectangle(2000), getBoundingClientRect() { return this.rect; }};
  const toggle = {expanded: 'false', getAttribute() { return this.expanded; }};
  const nav = {expanded: null, getAttribute() { return this.expanded; }};
  const elements = {'.banner': banner, '.intro__cta': intro, '.page-header__toggler': toggle, '#main-nav': nav};
  const document = {
    activeElement: null,
    querySelector: selector => selector === missing ? null : elements[selector] || null,
    querySelectorAll: selector => selector === '.danzuni-access__cta, .instructors__cta-btn' && missing !== '.danzuni-access__cta' ? [access, ...(extraAccess ? [secondary] : [])] : []
  };
  let onIntersection, onMutation;
  const observed = [], watched = [];
  const window = {innerWidth: 390, innerHeight: 844};
  if (intersection) window.IntersectionObserver = class {
    constructor(callback) { onIntersection = callback; }
    observe(element) { observed.push(element); }
  };
  if (mutation) window.MutationObserver = class {
    constructor(callback) { onMutation = callback; }
    observe(element, options) { watched.push({element, options}); }
  };
  vm.runInNewContext(runtime, {document, window, queueMicrotask});
  return {banner, intro, access, secondary, toggle, nav, document, window, observed, watched,
    intersect: () => onIntersection?.([]), mutate: () => onMutation?.([]),
    focus: () => { document.activeElement = button; },
    blur: () => { document.activeElement = null; banner.dispatchEvent(new Event('focusout')); }
  };
}

test('the banner starts hidden and only observes the existing CTA controls', () => {
  const s = setup();
  assert.equal(s.banner.hidden, true);
  assert.deepEqual(s.observed, [s.intro, s.access]);
  assert.deepEqual(s.watched.map(entry => entry.element), [s.toggle, s.nav]);
  for (const entry of s.watched) assert.equal(JSON.stringify(entry.options), '{"attributes":true,"attributeFilter":["aria-expanded"]}');
});

test('before, within and partially above the hero CTA keep the banner hidden', () => {
  const s = setup();
  for (const top of [1000, 400, 0, -47]) {
    s.intro.rect = rectangle(top); s.intersect();
    assert.equal(s.banner.hidden, true, `hero CTA top ${top}`);
  }
});

test('a completely passed hero CTA reveals the banner, and returning to it hides it', () => {
  const s = setup();
  s.intro.rect = rectangle(-48); s.intersect(); assert.equal(s.banner.hidden, false);
  s.intro.rect = rectangle(-47); s.intersect(); assert.equal(s.banner.hidden, true);
  s.intro.rect = rectangle(-100); s.intersect(); assert.equal(s.banner.hidden, false);
});

test('any visible Access or instructor CTA suppresses the repeated action, even at the viewport edge', () => {
  const s = setup({extraAccess: true});
  s.intro.rect = rectangle(-100); s.intersect(); assert.equal(s.banner.hidden, false);
  s.secondary.rect = rectangle(843); s.intersect(); assert.equal(s.banner.hidden, true);
  s.secondary.rect = rectangle(844); s.intersect(); assert.equal(s.banner.hidden, false);
  s.access.rect = rectangle(-47); s.intersect(); assert.equal(s.banner.hidden, true);
  s.access.rect = rectangle(-48); s.intersect(); assert.equal(s.banner.hidden, false);
});

test('an open navigation toggle or navigation container hides the banner', () => {
  const s = setup();
  s.intro.rect = rectangle(-100); s.intersect(); assert.equal(s.banner.hidden, false);
  s.toggle.expanded = 'true'; s.mutate(); assert.equal(s.banner.hidden, true);
  s.toggle.expanded = 'false'; s.mutate(); assert.equal(s.banner.hidden, false);
  s.nav.expanded = 'true'; s.mutate(); assert.equal(s.banner.hidden, true);
  s.nav.expanded = 'false'; s.mutate(); assert.equal(s.banner.hidden, false);
});

test('a focused banner is not removed by scrolling; it hides once focus leaves', async () => {
  const s = setup();
  s.intro.rect = rectangle(-100); s.intersect(); s.focus();
  s.access.rect = rectangle(400); s.intersect(); assert.equal(s.banner.hidden, false);
  s.blur(); await Promise.resolve(); assert.equal(s.banner.hidden, true);
});

test('focus leaving rechecks geometry instead of applying a stale pending hide', async () => {
  const s = setup();
  s.intro.rect = rectangle(-100); s.intersect(); s.focus();
  s.access.rect = rectangle(400); s.intersect();
  s.access.rect = rectangle(1800); s.blur(); await Promise.resolve();
  assert.equal(s.banner.hidden, false);
});

test('missing banner, hero or Access control is safe and does not show a banner', () => {
  for (const missing of ['.banner', '.intro__cta', '.danzuni-access__cta']) {
    const s = setup({missing});
    assert.equal(s.observed.length, 0);
    if (missing !== '.banner') assert.equal(s.banner.hidden, true);
  }
});

test('missing required observers keeps the enhancement hidden', () => {
  for (const options of [{intersection: false}, {mutation: false}, {intersection: false, mutation: false}]) {
    const s = setup(options); s.intro.rect = rectangle(-100); s.intersect(); s.mutate();
    assert.equal(s.banner.hidden, true); assert.equal(s.observed.length, 0);
  }
});

test('a collapsed hero control cannot be mistaken for having scrolled past it', () => {
  const s = setup();
  s.intro.rect = rectangle(-100, 0); s.intersect();
  assert.equal(s.banner.hidden, true);
});

test('zero-sized and horizontally offscreen Access controls do not suppress the banner', () => {
  const s = setup();
  s.intro.rect = rectangle(-100);
  s.access.rect = rectangle(400, 0); s.intersect(); assert.equal(s.banner.hidden, false);
  s.access.rect = {...rectangle(400), left: 390, right: 670}; s.intersect(); assert.equal(s.banner.hidden, false);
});

test('viewport geometry changes are applied on the next intersection observation', () => {
  const s = setup();
  s.intro.rect = rectangle(-100); s.access.rect = rectangle(900); s.intersect();
  assert.equal(s.banner.hidden, false);
  s.window.innerHeight = 1000; s.intersect(); assert.equal(s.banner.hidden, true);
});

const archivedJs = await readFile(new URL('../js/main.js', import.meta.url), 'utf8');
const adaptedJs = improveLegacyJs(archivedJs);
const sliderStart = adaptedJs.indexOf('e(".slider",');
const sliderEnd = adaptedJs.indexOf(',e(".tablist",', sliderStart);
assert.ok(sliderStart >= 0 && sliderEnd > sliderStart, 'the actual adapted slider is available for isolated execution');
const sliderRuntime = adaptedJs.slice(sliderStart, sliderEnd);

function setupSlider({tabbed = true, count = 3, width = 600, viewportWidth = width} = {}) {
  let slideWidth = width;
  const moves = [];
  let scrollLeft = 0;
  const wrapper = Object.assign(new EventTarget(), {
    style: {scrollBehavior: 'smooth'}, offsetWidth: viewportWidth,
    getBoundingClientRect: () => ({x: 32})
  });
  Object.defineProperties(wrapper, {
    scrollWidth: {get: () => slideWidth * count},
    scrollLeft: {
      get: () => scrollLeft,
      set: value => { scrollLeft = value; moves.push({left: value, behavior: wrapper.style.scrollBehavior}); }
    }
  });
  const slides = Array.from({length: count}, (_, index) => ({
    getBoundingClientRect: () => ({x: 32 + index * slideWidth - scrollLeft})
  }));
  const tabs = tabbed ? slides.map(() => {
    const attributes = new Map(), classes = new Set();
    return Object.assign(new EventTarget(), {
      focuses: 0, blurs: 0,
      classList: {add: value => classes.add(value), remove: value => classes.delete(value)},
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      getAttribute: name => attributes.get(name),
      focus() { this.focuses++; }, blur() { this.blurs++; }
    });
  }) : [];
  const buttons = ['prev', 'next'].map(direction => Object.assign(new EventTarget(), {dataset: {direction}}));
  const slider = {
    querySelector: selector => selector === '.slider__wrapper' ? wrapper : null,
    querySelectorAll: selector => ({'.slider__slide': slides, '.slider__tab': tabs, '.slider__button': buttons}[selector] || [])
  };
  const window = new EventTarget();
  vm.runInNewContext(sliderRuntime, {window, e: (selector, callback) => {
    assert.equal(selector, '.slider'); callback(slider);
  }});
  const click = control => control.dispatchEvent(new Event('click', {cancelable: true}));
  return {wrapper, tabs, moves, window,
    tab: index => click(tabs[index]), next: () => click(buttons[1]), prev: () => click(buttons[0]),
    geometry: (nextWidth, nextViewport = nextWidth) => { slideWidth = nextWidth; wrapper.offsetWidth = nextViewport; },
    resize: () => window.dispatchEvent(new Event('resize')),
    scroll: () => wrapper.dispatchEvent(new Event('scroll'))
  };
}

test('adapted slider recalculates scrolled coordinates instead of caching viewport offsets', () => {
  const s = setupSlider();
  s.tab(2); assert.equal(s.wrapper.scrollLeft, 1200);
  s.tab(1); assert.equal(s.wrapper.scrollLeft, 600);
  s.tab(2); assert.equal(s.wrapper.scrollLeft, 1200);
  assert.equal(s.tabs[2].getAttribute('aria-selected'), 'true');
});

test('resize aligns the selected slider panel instantly without changing focus or selected tab', () => {
  const s = setupSlider();
  s.tab(2);
  const beforeFocus = s.tabs.map(tab => [tab.focuses, tab.blurs]);
  s.geometry(390); s.resize(); s.scroll();
  assert.equal(s.wrapper.scrollLeft, 780);
  assert.deepEqual(s.tabs.map(tab => [tab.focuses, tab.blurs]), beforeFocus);
  assert.equal(s.tabs[2].getAttribute('aria-selected'), 'true');
  assert.deepEqual(s.moves.at(-1), {left: 780, behavior: 'auto'});
  assert.equal(s.wrapper.style.scrollBehavior, 'smooth');
  s.geometry(1440); s.resize(); s.scroll();
  assert.equal(s.wrapper.scrollLeft, 2880);
  assert.deepEqual(s.tabs.map(tab => [tab.focuses, tab.blurs]), beforeFocus);
});

test('clicks remain accurate after resize and after a geometry change without a resize event', () => {
  const s = setupSlider();
  s.tab(1); s.geometry(390); s.resize();
  s.tab(2); assert.equal(s.wrapper.scrollLeft, 780);
  s.geometry(500); s.tab(1); assert.equal(s.wrapper.scrollLeft, 500);
  s.next(); assert.equal(s.wrapper.scrollLeft, 1000);
  s.next(); assert.equal(s.wrapper.scrollLeft, 0);
  s.prev(); assert.equal(s.wrapper.scrollLeft, 1000);
});

test('non-tabbed slider buttons remain safe as the number of visible slides changes', () => {
  const s = setupSlider({tabbed: false, count: 9, width: 100, viewportWidth: 300});
  s.next(); assert.equal(s.wrapper.scrollLeft, 100);
  s.geometry(100, 500); s.resize();
  assert.equal(s.wrapper.scrollLeft, 100, 'resize does not force an unselected strip to jump');
  s.prev(); assert.equal(s.wrapper.scrollLeft, 0);
  s.next(); s.next(); s.next(); s.next(); assert.equal(s.wrapper.scrollLeft, 400);
  s.next(); assert.equal(s.wrapper.scrollLeft, 0);
  s.prev(); assert.equal(s.wrapper.scrollLeft, 400);
  s.geometry(100, 800); s.resize(); s.next();
  assert.equal(s.wrapper.scrollLeft, 100, 'a stale high index is safely clamped after narrowing the range');
});

test('a non-overflowing strip stays at zero and resize alone never focuses tabs', () => {
  const strip = setupSlider({tabbed: false, count: 2, width: 100, viewportWidth: 500});
  strip.next(); strip.prev(); strip.resize(); assert.equal(strip.wrapper.scrollLeft, 0);
  const tabs = setupSlider(); tabs.geometry(390); tabs.resize();
  assert.equal(tabs.wrapper.scrollLeft, 0);
  assert.ok(tabs.tabs.every(tab => tab.focuses === 0 && tab.blurs === 0));
});

test('responsive adapter rejects missing or repeated archived slider fragments', () => {
  const move = 'function s(e){t.scrollLeft=r[e],d(e)}';
  assert.throws(() => improveLegacyJs(archivedJs.replace(move, 'function s(e){}')), /Legacy slider changed/);
  assert.throws(() => improveLegacyJs(archivedJs + move), /Legacy slider changed/);
  assert.throws(() => improveLegacyJs(archivedJs.replace('r=function(){var e=[],o=t.getBoundingClientRect().x', 'r=function(){var e=[],o=0')), /Legacy slider changed/);
});

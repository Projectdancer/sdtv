import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const runtime = await readFile(new URL('../deployment/v1/access-motion.js', import.meta.url), 'utf8');
const settle = () => new Promise(resolve => setImmediate(resolve));
const plain = value => JSON.parse(JSON.stringify(value));

class Target extends EventTarget {
  listeners = new Map();
  addEventListener(type, listener, options) {
    this.listeners.set(type, (this.listeners.get(type) || new Set()).add(listener));
    super.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    this.listeners.get(type)?.delete(listener);
    super.removeEventListener(type, listener, options);
  }
  listenerCount() { return [...this.listeners.values()].reduce((count, listeners) => count + listeners.size, 0); }
}

function setup({reduce = false, hidden = false, missing = '', lineCount = 2, noObserver = false,
  noMatchMedia = false, noAnimation = false, noMediaChanges = false, legacyMedia = false,
  animationThrows = '', brokenAnimation = false, observerThrows = false} = {}) {
  const animations = [];
  const element = name => Object.assign(new Target(), {
    name, dataset: {}, style: {}, textContent: name,
    animate: noAnimation ? undefined : (frames, options) => {
      if (animationThrows === name) throw new Error('Animation unavailable');
      let finish, reject;
      const finished = new Promise((resolve, fail) => { finish = resolve; reject = fail; });
      const animation = {name, frames: plain(frames), options: plain(options), finished, cancelled: 0,
        finish, cancel() { this.cancelled++; reject(new Error('cancelled')); }};
      if (brokenAnimation) { finished.catch(() => {}); delete animation.finished; }
      animations.push(animation);
      return animation;
    }
  });
  const title = element('title'), cta = element('cta'), light = element('light');
  const lines = Array.from({length: lineCount}, (_, index) => element('line-' + index));
  title.querySelectorAll = selector => selector === '.danzuni-next__line' ? lines : [];
  cta.querySelector = selector => selector === '.danzuni-next__light' && missing !== 'light' ? light : null;
  cta.href = 'https://app.danzuni.com/classes';
  cta.textContent = 'Open Danzuni';
  cta.ariaDescribedBy = 'next-access-note';
  const section = {querySelector: selector => ({
    '.danzuni-next__title': missing === 'title' ? null : title,
    '.danzuni-next__cta': missing === 'cta' ? null : cta
  }[selector] || null)};
  const document = Object.assign(new Target(), {
    hidden, querySelector: selector => selector === '.danzuni-next' && missing !== 'section' ? section : null
  });
  const reduced = Object.assign(new Target(), {matches: reduce});
  if (legacyMedia) {
    reduced.addListener = listener => Target.prototype.addEventListener.call(reduced, 'change', listener);
    reduced.removeListener = listener => Target.prototype.removeEventListener.call(reduced, 'change', listener);
    reduced.addEventListener = undefined;
    reduced.removeEventListener = undefined;
  }
  if (noMediaChanges) { reduced.addEventListener = undefined; reduced.removeEventListener = undefined; }
  const observers = [];
  class IntersectionObserver {
    observed = new Set(); disconnected = false; observes = 0;
    constructor(callback, options) {
      if (observerThrows) throw new Error('Observer unavailable');
      this.callback = callback; this.options = options; observers.push(this);
    }
    observe(element) { this.observed.add(element); this.observes++; }
    unobserve(element) { this.observed.delete(element); }
    disconnect() { this.observed.clear(); this.disconnected = true; }
  }
  let now = 0, timerId = 0;
  const timers = new Map();
  const window = {
    ...(noObserver ? {} : {IntersectionObserver}),
    ...(noMatchMedia ? {} : {matchMedia: query => {
      assert.equal(query, '(prefers-reduced-motion: reduce)'); return reduced;
    }})
  };
  const globals = {window, document,
    setTimeout: (callback, delay) => { const id = ++timerId; timers.set(id, {callback, at: now + delay}); return id; },
    clearTimeout: id => timers.delete(id)
  };
  const context = vm.createContext(globals);
  const windowKeys = Object.keys(window);
  vm.runInContext(runtime, context);
  const enter = (target, ratio, isIntersecting = ratio > 0) => observers[0]?.callback([{target, intersectionRatio: ratio, isIntersecting}]);
  return {title, cta, lines, light, document, reduced, animations, timers, observers, window, windowKeys,
    enter, titleEnter: ratio => enter(title, ratio), ctaEnter: ratio => enter(cta, ratio),
    replayScript: () => vm.runInContext(runtime, context),
    tick(ms) {
      const end = now + ms;
      while (true) {
        const due = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        const [id, timer] = due; now = timer.at; timers.delete(id); timer.callback();
      }
      now = end;
    },
    reduce(value) { reduced.matches = value; reduced.dispatchEvent(new Event('change')); },
    hidden(value) { document.hidden = value; document.dispatchEvent(new Event('visibilitychange')); }
  };
}

test('initialization keeps content and link untouched, exposes pending states and schedules no work', () => {
  const s = setup();
  assert.equal(s.title.dataset.motionState, 'pending');
  assert.equal(s.cta.dataset.motionState, 'pending');
  assert.equal(s.animations.length, 0);
  assert.equal(s.timers.size, 0);
  assert.deepEqual(s.title.style, {});
  assert.deepEqual(s.cta.style, {});
  assert.equal(s.cta.href, 'https://app.danzuni.com/classes');
  assert.equal(s.cta.textContent, 'Open Danzuni');
  assert.equal(s.cta.ariaDescribedBy, 'next-access-note');
  assert.equal(s.cta.listenerCount(), 0, 'The enhancement never intercepts link activation');
  assert.deepEqual(Object.keys(s.window), s.windowKeys, 'No production replay API or other window property');
  assert.deepEqual(plain(s.observers[0].options.threshold), [0, 0.25, 0.8]);
});

test('title crosses 25 percent once and reveals only its two lines with the requested stagger', async () => {
  const s = setup();
  s.titleEnter(0.249); assert.equal(s.animations.length, 0);
  s.titleEnter(0.25); assert.equal(s.title.dataset.motionState, 'running');
  assert.deepEqual(s.animations.map(animation => animation.name), ['line-0', 'line-1']);
  assert.deepEqual(s.animations.map(animation => animation.options), [0, 80].map(delay => ({
    duration: 600, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'
  })));
  for (const animation of s.animations) assert.deepEqual(animation.frames, [
    {transform: 'translateY(14px)', opacity: 0.6}, {transform: 'translateY(0px)', opacity: 1}
  ]);
  s.titleEnter(0); s.titleEnter(1); assert.equal(s.animations.length, 2);
  s.animations[0].finish(); await settle(); assert.equal(s.title.dataset.motionState, 'running');
  s.animations[1].finish(); await settle(); assert.equal(s.title.dataset.motionState, 'complete');
  s.titleEnter(0); s.titleEnter(1); assert.equal(s.animations.length, 2);
});

test('CTA waits at least 250 ms at 80 percent visibility, then sweeps only the decorative span once', async () => {
  const s = setup();
  s.ctaEnter(0.79); s.tick(500); assert.equal(s.timers.size, 0);
  s.ctaEnter(0.8); s.tick(249); assert.equal(s.animations.length, 0);
  s.ctaEnter(0.95); assert.equal(s.timers.size, 1, 'Continuous visibility does not reset or multiply dwell');
  s.tick(1); assert.equal(s.cta.dataset.motionState, 'running');
  const [animation] = s.animations;
  assert.equal(animation.name, 'light');
  assert.deepEqual(animation.options, {duration: 650, easing: 'ease-in-out', fill: 'none'});
  assert.deepEqual(animation.frames.map(frame => frame.opacity), [0, 0.09, 0.09, 0]);
  assert.equal(animation.frames[0].transform, 'translateX(-200%)');
  assert.equal(animation.frames.at(-1).transform, 'translateX(500%)');
  animation.finish(); await settle();
  assert.equal(s.cta.dataset.motionState, 'complete');
  s.ctaEnter(0); s.ctaEnter(1); s.tick(1000);
  assert.equal(s.animations.length, 1); assert.equal(s.timers.size, 0);
  assert.equal(s.cta.href, 'https://app.danzuni.com/classes');
  assert.equal(s.cta.listenerCount(), 0);
});

test('dropping below the CTA threshold cancels dwell and reentry requires a full new dwell', () => {
  const s = setup();
  s.ctaEnter(1); s.tick(249); s.ctaEnter(0.79);
  assert.equal(s.timers.size, 0); s.tick(1000); assert.equal(s.animations.length, 0);
  assert.equal(s.cta.dataset.motionState, 'pending');
  s.ctaEnter(0.8); s.tick(249); assert.equal(s.animations.length, 0);
  s.tick(1); assert.equal(s.animations.length, 1);
});

test('initial reduced motion skips without observers, listeners, timers or animation', () => {
  const s = setup({reduce: true});
  assert.equal(s.title.dataset.motionState, 'skipped'); assert.equal(s.cta.dataset.motionState, 'skipped');
  assert.equal(s.observers.length, 0); assert.equal(s.timers.size, 0); assert.equal(s.animations.length, 0);
  assert.equal(s.reduced.listenerCount(), 0); assert.equal(s.document.listenerCount(), 0);
  s.reduce(false); assert.equal(s.animations.length, 0);
});

test('enabling reduced motion cancels pending dwell and active reveals permanently', async () => {
  const s = setup();
  s.titleEnter(1); s.ctaEnter(1); s.tick(200); s.reduce(true); await settle();
  assert.equal(s.timers.size, 0); assert.equal(s.title.dataset.motionState, 'skipped');
  assert.equal(s.cta.dataset.motionState, 'skipped');
  assert.ok(s.animations.every(animation => animation.cancelled === 1));
  assert.equal(s.observers[0].disconnected, true);
  assert.equal(s.reduced.listenerCount(), 0); assert.equal(s.document.listenerCount(), 0);
  s.reduce(false); s.titleEnter(1); s.ctaEnter(1); s.tick(1000);
  assert.equal(s.animations.length, 2);
});

test('hidden documents cancel active animations, while completed elements never restart', async () => {
  const s = setup();
  s.titleEnter(1); s.animations.forEach(animation => animation.finish()); await settle();
  s.ctaEnter(1); s.tick(250); s.hidden(true); await settle();
  assert.equal(s.title.dataset.motionState, 'complete');
  assert.equal(s.cta.dataset.motionState, 'skipped');
  assert.deepEqual(s.animations.map(animation => animation.cancelled), [0, 0, 1]);
  s.hidden(false); s.titleEnter(1); s.ctaEnter(1); s.tick(1000);
  assert.equal(s.animations.length, 3); assert.equal(s.timers.size, 0);
});

test('hiding during simultaneous title and light animations cancels all three without late completion', async () => {
  const s = setup();
  s.titleEnter(1); s.ctaEnter(1); s.tick(250); s.hidden(true);
  s.animations.forEach(animation => animation.finish()); await settle();
  assert.equal(s.title.dataset.motionState, 'skipped'); assert.equal(s.cta.dataset.motionState, 'skipped');
  assert.deepEqual(s.animations.map(animation => animation.cancelled), [1, 1, 1]);
  assert.equal(s.observers[0].disconnected, true);
  assert.equal(s.document.listenerCount(), 0); assert.equal(s.timers.size, 0);
});

test('backgrounding before CTA dwell completes cancels it and requires fresh visibility on return', () => {
  const s = setup();
  s.ctaEnter(1); s.tick(200); s.hidden(true); s.tick(500);
  assert.equal(s.animations.length, 0); assert.equal(s.timers.size, 0);
  assert.equal(s.cta.dataset.motionState, 'pending');
  s.hidden(false); s.tick(1000); assert.equal(s.animations.length, 0);
  assert.equal(s.observers[0].observes, 4, 'Both pending targets request fresh intersection evidence');
  s.ctaEnter(1); s.tick(249); assert.equal(s.animations.length, 0);
  s.tick(1); assert.equal(s.animations.length, 1);
});

test('an initially hidden document cannot start either animation from observer callbacks', () => {
  const s = setup({hidden: true});
  s.titleEnter(1); s.ctaEnter(1); s.tick(2000);
  assert.equal(s.animations.length, 0); assert.equal(s.timers.size, 0);
  s.hidden(false); s.titleEnter(1); s.ctaEnter(1); s.tick(250);
  assert.equal(s.animations.length, 3);
});

test('missing browser APIs or incomplete markup leave existing elements stable and skipped', () => {
  for (const options of [{noObserver: true}, {noMatchMedia: true}, {noAnimation: true},
    {noMediaChanges: true}, {observerThrows: true}, {missing: 'light'}, {lineCount: 1}]) {
    const s = setup(options);
    assert.equal(s.title.dataset.motionState, 'skipped', JSON.stringify(options));
    assert.equal(s.cta.dataset.motionState, 'skipped', JSON.stringify(options));
    assert.equal(s.animations.length, 0); assert.equal(s.timers.size, 0);
    assert.equal(s.document.listenerCount(), 0); assert.equal(s.reduced.listenerCount(), 0);
  }
  assert.equal(setup({missing: 'section'}).title.dataset.motionState, undefined);
  assert.equal(setup({missing: 'title'}).cta.dataset.motionState, 'skipped');
  assert.equal(setup({missing: 'cta'}).title.dataset.motionState, 'skipped');
});

test('legacy media-query change listeners also cancel running motion and are removed', async () => {
  const s = setup({legacyMedia: true});
  s.ctaEnter(1); s.tick(250); s.reduce(true); await settle();
  assert.equal(s.cta.dataset.motionState, 'skipped');
  assert.equal(s.animations[0].cancelled, 1); assert.equal(s.reduced.listenerCount(), 0);
});

test('animation errors cancel partially started work without affecting the link or other motion', async () => {
  const s = setup({animationThrows: 'line-1'});
  s.titleEnter(1); await settle();
  assert.equal(s.title.dataset.motionState, 'skipped'); assert.equal(s.animations[0].cancelled, 1);
  s.ctaEnter(1); s.tick(250); s.animations.at(-1).finish(); await settle();
  assert.equal(s.cta.dataset.motionState, 'complete'); assert.equal(s.cta.href, 'https://app.danzuni.com/classes');
  const broken = setup({brokenAnimation: true}); broken.titleEnter(1); await settle();
  assert.equal(broken.title.dataset.motionState, 'skipped'); assert.equal(broken.animations[0].cancelled, 1);
});

test('completion removes observers and listeners and leaves no idle timers or replay path', async () => {
  const s = setup();
  s.titleEnter(1); s.ctaEnter(1); s.tick(250);
  s.animations.forEach(animation => animation.finish()); await settle();
  assert.equal(s.title.dataset.motionState, 'complete'); assert.equal(s.cta.dataset.motionState, 'complete');
  assert.equal(s.timers.size, 0); assert.equal(s.observers[0].disconnected, true);
  assert.equal(s.observers[0].observed.size, 0);
  assert.equal(s.document.listenerCount(), 0); assert.equal(s.reduced.listenerCount(), 0);
  s.replayScript(); s.titleEnter(1); s.ctaEnter(1); s.tick(10000);
  assert.equal(s.animations.length, 3); assert.equal(s.observers.length, 1); assert.equal(s.timers.size, 0);
});

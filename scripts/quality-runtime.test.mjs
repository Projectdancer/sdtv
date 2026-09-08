import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const runtime = await readFile(new URL('../js/quality.js', import.meta.url), 'utf8');
function setup({reduce = false, pointer = true, reject = false, delayed = false} = {}) {
  const reduced = Object.assign(new EventTarget(), {matches: reduce});
  const hover = Object.assign(new EventTarget(), {matches: pointer});
  const source = {dataset: {src: './video/salsa.mp4'}, hasAttribute: key => key === 'src' && Boolean(source.src)};
  let resolvePlay;
  const video = Object.assign(new EventTarget(), {
    style: {}, loads: 0, plays: 0, pauses: 0,
    querySelector: () => source,
    load() { this.loads++; }, pause() { this.pauses++; },
    play() { this.plays++; return reject ? Promise.reject(new Error('blocked')) : delayed ? new Promise(resolve => {resolvePlay = resolve;}) : Promise.resolve(); }
  });
  const figure = Object.assign(new EventTarget(), {querySelector: () => video});
  const document = Object.assign(new EventTarget(), {
    hidden: false, querySelector: () => null,
    querySelectorAll: selector => selector === '.figure--video' ? [figure] : []
  });
  let intersect;
  class IntersectionObserver { constructor(callback) { intersect = callback; } observe() {} }
  vm.runInNewContext(runtime, {
    document, MutationObserver: class {}, IntersectionObserver,
    window: {matchMedia: query => query.includes('reduced-motion') ? reduced : hover, IntersectionObserver}
  });
  return {video, source, document, reduced, figure, enter: () => figure.dispatchEvent(new Event('pointerenter')),
    leave: () => figure.dispatchEvent(new Event('pointerleave')), finish: () => resolvePlay(), offscreen: () => intersect([{target:figure,isIntersecting:false}])};
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('initialization never attaches or loads a video source', () => {
  const s = setup(); assert.equal(s.source.src,undefined); assert.equal(s.video.loads,0); assert.equal(s.video.plays,0);
});
test('hover attaches once; leaving pauses without another load', async () => {
  const s = setup(); s.enter(); await settle();
  assert.equal(s.video.loads,1); assert.equal(s.video.style.opacity,'1');
  s.leave(); assert.equal(s.video.style.opacity,'0'); assert.equal(s.video.loads,1);
  s.enter(); await settle(); assert.equal(s.video.loads,1); assert.equal(s.video.plays,2);
});
test('reduced motion and coarse pointer do not request a video', () => {
  for(const options of [{reduce:true},{pointer:false}]) { const s=setup(options); s.enter(); assert.equal(s.video.loads,0); }
});
test('late play resolution after leaving does not reveal or continue preview', async () => {
  const s=setup({delayed:true}); s.enter(); s.leave(); s.finish(); await settle();
  assert.equal(s.video.style.opacity,'0'); assert.ok(s.video.pauses>=2);
});
test('rejected playback is handled and poster remains visible', async () => {
  const s=setup({reject:true}); s.enter(); await settle(); assert.equal(s.video.style.opacity,'0');
});
test('offscreen, hidden page and reduced-motion changes stop playback', async () => {
  const s=setup(); s.enter(); await settle(); s.offscreen(); assert.equal(s.video.style.opacity,'0');
  s.enter(); await settle(); s.document.hidden=true; s.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(s.video.style.opacity,'0');
  s.document.hidden=false; s.enter(); await settle(); s.reduced.matches=true; s.reduced.dispatchEvent(new Event('change'));
  assert.equal(s.video.style.opacity,'0');
});

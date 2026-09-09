(() => {
  'use strict';
  const section = document.querySelector('.danzuni-next');
  if (!section) return;
  const title = section.querySelector('.danzuni-next__title');
  const cta = section.querySelector('.danzuni-next__cta');
  // Loading this enhancement twice must not replay an already observed section.
  if (title?.dataset.motionState || cta?.dataset.motionState) return;
  const lines = title ? [...title.querySelectorAll('.danzuni-next__line')] : [];
  const light = cta?.querySelector('.danzuni-next__light');
  const motions = [title, cta].map(element => ({element, state: 'pending', animations: []}));
  const [titleMotion, ctaMotion] = motions;
  let observer, reduced, dwell = null, ctaVisible = false;
  let removeMediaListener = () => {};
  let removeVisibilityListener = () => {};

  const setState = (motion, state) => {
    motion.state = state;
    if (motion.element) motion.element.dataset.motionState = state;
  };
  motions.forEach(motion => setState(motion, 'pending'));
  const cancelDwell = () => {
    if (dwell !== null) clearTimeout(dwell);
    dwell = null;
  };
  const cleanup = () => {
    if (motions.some(motion => ['pending', 'running'].includes(motion.state))) return;
    cancelDwell();
    observer?.disconnect();
    removeMediaListener();
    removeVisibilityListener();
  };
  const settle = (motion, state, cancel = false) => {
    if (['complete', 'skipped'].includes(motion.state)) return;
    setState(motion, state);
    if (motion.element) observer?.unobserve(motion.element);
    const animations = motion.animations;
    motion.animations = [];
    if (cancel) animations.forEach(animation => {
      try { animation.cancel(); } catch { /* Default CSS is the stable fallback. */ }
    });
    cleanup();
  };
  const skipAll = () => {
    cancelDwell();
    motions.forEach(motion => settle(motion, 'skipped', true));
  };
  const run = (motion, steps) => {
    if (motion.state !== 'pending' || document.hidden || reduced.matches) return;
    setState(motion, 'running');
    observer.unobserve(motion.element);
    try {
      for (const [element, frames, options] of steps) {
        const animation = element.animate(frames, options);
        if (typeof animation?.cancel === 'function') motion.animations.push(animation);
        if (typeof animation?.cancel !== 'function' || typeof animation.finished?.then !== 'function') {
          throw new Error('Animation lifecycle unavailable');
        }
        // Cancellation may happen while a subsequent line is being initialized.
        animation.finished.catch(() => {});
      }
      Promise.all(motion.animations.map(animation => animation.finished)).then(
        () => { if (motion.state === 'running') settle(motion, 'complete'); },
        () => { if (motion.state === 'running') settle(motion, 'skipped', true); }
      );
    } catch { settle(motion, 'skipped', true); }
  };
  const revealTitle = () => run(titleMotion, lines.map((line, index) => [line, [
    {transform: 'translateY(14px)', opacity: 0.6},
    {transform: 'translateY(0px)', opacity: 1}
  ], {duration: 600, delay: index * 80, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'}]));
  const scheduleSweep = () => {
    if (ctaMotion.state !== 'pending' || dwell !== null || !ctaVisible || document.hidden || reduced.matches) return;
    dwell = setTimeout(() => {
      dwell = null;
      if (!ctaVisible || document.hidden || reduced.matches) return;
      run(ctaMotion, [[light, [
        {transform: 'translateX(-200%)', opacity: 0, offset: 0},
        {opacity: 0.09, offset: 0.2},
        {opacity: 0.09, offset: 0.8},
        {transform: 'translateX(500%)', opacity: 0, offset: 1}
      ], {duration: 650, easing: 'ease-in-out', fill: 'none'}]]);
    }, 250);
  };
  const onVisibility = () => {
    cancelDwell();
    ctaVisible = false;
    if (document.hidden) {
      motions.filter(motion => motion.state === 'running').forEach(motion => settle(motion, 'skipped', true));
    } else {
      // Refresh intersection evidence after backgrounding, even without scrolling.
      motions.filter(motion => motion.state === 'pending').forEach(motion => {
        observer.unobserve(motion.element);
        observer.observe(motion.element);
      });
    }
  };
  const onReducedMotion = () => { if (reduced.matches) skipAll(); };

  try {
    if (!title || !cta || lines.length !== 2 || !light ||
        ![...lines, light].every(element => typeof element.animate === 'function') ||
        typeof window.IntersectionObserver !== 'function' || typeof window.matchMedia !== 'function' ||
        typeof setTimeout !== 'function' || typeof clearTimeout !== 'function') {
      skipAll(); return;
    }
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) { skipAll(); return; }
    if (typeof reduced.addEventListener === 'function' && typeof reduced.removeEventListener === 'function') {
      reduced.addEventListener('change', onReducedMotion);
      removeMediaListener = () => reduced.removeEventListener('change', onReducedMotion);
    } else if (typeof reduced.addListener === 'function' && typeof reduced.removeListener === 'function') {
      reduced.addListener(onReducedMotion);
      removeMediaListener = () => reduced.removeListener(onReducedMotion);
    } else { skipAll(); return; }
    observer = new window.IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === title && entry.isIntersecting && entry.intersectionRatio >= 0.25) revealTitle();
        if (entry.target === cta && ctaMotion.state === 'pending') {
          ctaVisible = entry.isIntersecting && entry.intersectionRatio >= 0.8;
          if (ctaVisible) scheduleSweep();
          else cancelDwell();
        }
      }
    }, {threshold: [0, 0.25, 0.8]});
    document.addEventListener('visibilitychange', onVisibility);
    removeVisibilityListener = () => document.removeEventListener('visibilitychange', onVisibility);
    motions.forEach(motion => observer.observe(motion.element));
  } catch { skipAll(); }
})();

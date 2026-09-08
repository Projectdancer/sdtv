(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');

  // These decorative previews never replace the style link or its still image.
  // Touch users keep the normal catalog link; no invisible first-tap interception.
  const previews = [];
  document.querySelectorAll('.figure--video').forEach(figure => {
    const video = figure.querySelector('video');
    if (!video) return;
    let wanted = false;
    const stop = () => {
      wanted = false;
      video.pause();
      video.style.opacity = '0';
    };
    figure.addEventListener('pointerenter', async () => {
      if (reduced.matches || !hover.matches || document.hidden) return;
      wanted = true;
      const source = video.querySelector('source[data-src]');
      if (source && !source.hasAttribute('src')) {
        source.src = source.dataset.src;
        video.load();
      }
      try {
        await video.play();
        if (wanted && !reduced.matches && !document.hidden) video.style.opacity = '1';
        else stop();
      } catch { stop(); } // An unavailable preview must not break the style link.
    });
    figure.addEventListener('pointerleave', stop);
    video.addEventListener('ended', stop);
    previews.push({figure, stop});
  });
  const stopAll = () => previews.forEach(({stop}) => stop());
  reduced.addEventListener('change', stopAll);
  hover.addEventListener('change', stopAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) previews.find(p => p.figure === entry.target)?.stop();
    }));
    previews.forEach(({figure}) => observer.observe(figure));
  }

  // Enhance the existing click handlers rather than creating a second tab engine.
  document.querySelectorAll('#features [role="tablist"], #custom-player [role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const set = (el, name, value) => { if (el.getAttribute(name) !== value) el.setAttribute(name, value); };
    const sync = () => tabs.forEach((tab, index) => {
      const selected = tab.getAttribute('aria-selected') === 'true';
      set(tab, 'aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('href')?.slice(1));
      if (!panel) return;
      if (!tab.id) tab.id = `${panel.id}-tab-${index}`;
      set(tab, 'aria-controls', panel.id);
      set(panel, 'role', 'tabpanel');
      set(panel, 'aria-labelledby', tab.id);
      set(panel, 'aria-hidden', String(!selected));
      panel.inert = !selected; // Preserve slider geometry while excluding hidden links.
    });
    list.addEventListener('keydown', event => {
      const current = tabs.indexOf(event.target.closest('[role="tab"]'));
      if (current < 0) return;
      let next;
      if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (current + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (event.key === ' ') next = current;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
      sync();
    });
    const observer = new MutationObserver(sync);
    tabs.forEach(tab => observer.observe(tab, {attributes: true, attributeFilter: ['aria-selected']}));
    sync();
  });

  const toggle = document.querySelector('.page-header__toggler');
  const nav = document.querySelector('#main-nav');
  if (toggle && nav) document.addEventListener('keydown', event => {
    if (toggle.getAttribute('aria-expanded') !== 'true' || window.innerWidth >= 950) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      toggle.click();
      toggle.focus();
    }
    if (event.key === 'Tab') {
      const controls = [toggle, ...nav.querySelectorAll('a[href], button')].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
})();

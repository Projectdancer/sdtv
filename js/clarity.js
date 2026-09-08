(() => {
  'use strict';

  const banner = document.querySelector('.banner');
  if (!banner) return;
  // The HTML is hidden too: an unavailable enhancement must never cover content.
  banner.hidden = true;
  const introCta = document.querySelector('.intro__cta');
  const accessCtas = [...document.querySelectorAll('.danzuni-access__cta, .instructors__cta-btn')];
  const navControls = [
    document.querySelector('.page-header__toggler'),
    document.querySelector('#main-nav')
  ].filter(Boolean);
  if (!introCta || !accessCtas.length || typeof window.IntersectionObserver !== 'function') return;
  if (navControls.length && typeof window.MutationObserver !== 'function') return;

  const visible = element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight
      && rect.right > 0 && rect.left < window.innerWidth;
  };
  const sync = () => {
    const intro = introCta.getBoundingClientRect();
    const passedIntro = intro.width > 0 && intro.height > 0 && intro.bottom <= 0;
    const menuOpen = navControls.some(control => control.getAttribute('aria-expanded') === 'true');
    const show = passedIntro && !accessCtas.some(visible) && !menuOpen;
    // Scrolling or resizing must not remove the control a keyboard user is on.
    // Once focus leaves, the current geometry is rechecked before hiding it.
    if (!show && banner.contains(document.activeElement)) return;
    banner.hidden = !show;
  };

  const observer = new window.IntersectionObserver(sync, {threshold: [0, 1]});
  [introCta, ...accessCtas].forEach(element => observer.observe(element));
  if (navControls.length) {
    const navObserver = new window.MutationObserver(sync);
    navControls.forEach(control => navObserver.observe(control, {
      attributes: true, attributeFilter: ['aria-expanded']
    }));
  }
  banner.addEventListener('focusout', () => queueMicrotask(sync));
})();

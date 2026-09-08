import assert from 'node:assert/strict';

export const footerStylePath = 'css/footer.css';
export const footerLogoPath = 'img/danzuni-logo-c3740474.png';
export const footerLogoHash = 'c374047423e1c603f17dfd115fb3bae1950da91f85c13e3389afa1c8d6e17f29';

const oldFooter = '<footer class="page-footer" id="footer"><div class="page-footer__wrapper container"><span class="page-footer__logo danzuni-footer-logo"><span class="danzuni-wordmark" role="img" aria-label="Danzuni">Danzuni</span></span><div class="subscribe-form page-footer__form"><p class="subscribe-form__label">From the team behind <a class="page-footer__origin" href="https://socialdancetv.com/">Social Dance TV</a>.</p><a class="button" href="mailto:info@socialdancetv.com">Contact us</a></div><div class="page-footer__lists"><ul class="page-footer__list"><li><a class="page-footer__link" href="mailto:info@socialdancetv.com">Support</a></li><li><a class="page-footer__link" href="https://app.danzuni.com/terms">Terms</a></li><li><a class="page-footer__link" href="https://app.danzuni.com/privacy">Privacy</a></li></ul></div><small class="page-footer__copyright">&copy; 2026 Social Dance TV. Danzuni. All Rights Reserved</small></div></footer>';
const oldTagline = '<article class="cta-section" data-aos="fade" data-aos-duration="450" data-aos-once="true"><div class="cta-section__wrapper container"><h2 class="cta-section__title cta-section__title--big">Made By Dancers, For Everyone</h2></div></article>';

const footer = `<footer class="danzuni-footer" id="footer">
  <div class="danzuni-footer__inner container">
    <div class="danzuni-footer__main">
      <div class="danzuni-footer__brand">
        <a class="danzuni-footer__home" href="/" aria-label="Danzuni home">
          <img class="danzuni-footer__logo" src="${footerLogoPath}" alt="Danzuni" width="1802" height="460" loading="lazy" decoding="async">
          <img class="danzuni-footer__logo-ink" src="${footerLogoPath}" alt="" aria-hidden="true" width="1802" height="460" loading="lazy" decoding="async">
        </a>
        <p class="danzuni-footer__origin">From the team behind <a href="https://socialdancetv.com/">Social Dance TV</a>.</p>
      </div>
      <div class="danzuni-footer__actions">
        <a class="button danzuni-access__cta danzuni-footer__cta" href="https://app.danzuni.com/classes" aria-describedby="footer-access-note">Open Danzuni</a>
        <p class="danzuni-footer__note" id="footer-access-note">Sign in to access classes.</p>
        <a class="danzuni-footer__support" href="mailto:info@socialdancetv.com">Support</a>
      </div>
    </div>
    <div class="danzuni-footer__bottom">
      <small class="danzuni-footer__copyright">&copy; 2026 Danzuni by Social Dance TV</small>
      <nav class="danzuni-footer__legal" aria-label="Legal"><a href="https://app.danzuni.com/terms">Terms</a><a href="https://app.danzuni.com/privacy">Privacy</a></nav>
    </div>
  </div>
</footer>`;

// A V1-only, fail-closed adapter: do not change archived source, hero,
// instructors, URLs, provider behaviour or the pinned production root.
export function refineV1Footer(html) {
  assert.equal((html.match(/<footer\b/g) || []).length, 1, 'Expected one reviewed footer');
  for (const [label, value] of [['footer', oldFooter], ['tagline', oldTagline], ['head', '</head>']]) {
    assert.equal(html.split(value).length, 2, `Review changed ${label} markup`);
  }
  assert.ok(!html.includes(footerStylePath) && !html.includes('class="danzuni-footer"'), 'Footer adapter must run once');
  return html.replace(oldFooter, footer).replace(oldTagline, '')
    .replace('</head>', `<link rel="stylesheet" href="${footerStylePath}"></head>`);
}

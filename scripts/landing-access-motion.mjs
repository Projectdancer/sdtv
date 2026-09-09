import assert from 'node:assert/strict';

export const accessAssets = {
  'css/access-motion.css': 'access-motion.css',
  'js/access-motion.js': 'access-motion.js',
  'img/access-arrow-right.svg': 'access-arrow-right.svg',
  'img/access-arrow-LICENSE.txt': 'access-arrow-LICENSE.txt'
};

export const oldAccess = '<section class="tariffs danzuni-access" data-aos="fade" data-aos-duration="450" data-aos-once="true" id="pricing"><div class="tariffs__wrapper container"><h2 class="tariffs__title">Your classes, in the app.</h2><p class="danzuni-access__text">Sign in to access classes and manage your account.</p><a class="button danzuni-access__cta" href="https://app.danzuni.com/classes" aria-describedby="access-note">Open Danzuni</a><p id="access-note" class="danzuni-access__note">New subscription purchases are not available on this page.</p><a class="danzuni-access__support" href="mailto:info@socialdancetv.com">Need help with access? Contact support</a></div></section>';

export const accessMarkup = `<section class="danzuni-next" id="pricing" aria-labelledby="next-title">
  <div class="danzuni-next__inner">
    <h2 class="danzuni-next__title" id="next-title"><span class="danzuni-next__line">Your next move</span> <span class="danzuni-next__line">starts here.</span></h2>
    <div class="danzuni-next__action">
      <a class="danzuni-next__cta danzuni-access__cta" href="https://app.danzuni.com/classes" aria-describedby="next-signin access-note">
        <span class="danzuni-next__light" aria-hidden="true"></span>
        <span class="danzuni-next__label">Open Danzuni</span>
        <img class="danzuni-next__arrow" src="/v1/img/access-arrow-right.svg" alt="" aria-hidden="true" width="28" height="28">
      </a>
      <p class="danzuni-next__signin" id="next-signin">Sign in to access your classes.</p>
      <div class="danzuni-next__details">
        <p id="access-note">New subscription purchases are not available on this page.</p>
        <a class="danzuni-next__support" href="mailto:info@socialdancetv.com">Contact support</a>
      </div>
    </div>
  </div>
</section>`;

// Owner-approved V1 enhancement. Publish through the pinned complete-V1 builder;
// never rebuild the old production root or redesign adjacent sections here.
export function refineAccessMotion(html) {
  assert.equal(html.split(oldAccess).length, 2, 'Review changed access markup');
  assert.equal(html.split('</head>').length, 2, 'Expected one head');
  assert.equal(html.split('</body>').length, 2, 'Expected one body');
  assert.ok(!html.includes('access-motion.') && !html.includes('id="next-title"'), 'Access study must run once');
  return html.replace(oldAccess, accessMarkup)
    .replace('</head>', '<link rel="stylesheet" href="/v1/css/access-motion.css"></head>')
    .replace('</body>', '<script src="/v1/js/access-motion.js" defer></script></body>');
}

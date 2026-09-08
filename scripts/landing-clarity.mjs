// Owner-approved clarity pass, layered over the immutable archive and technical fixes.
// No new offers, account flows, catalog records or testimonial evidence are created here.
export function clarifyHtml(input) {
  let html = input;
  const replace = (pattern, value, expected = 1) => {
    const matches = [...html.matchAll(new RegExp(pattern.source, 'g'))];
    if (matches.length !== expected) throw new Error(`Clarity source changed (${matches.length}/${expected}): ${pattern}`);
    html = html.replace(new RegExp(pattern.source, 'g'), value);
  };
  replace(/<title>Danzuni \| Social Dance TV<\/title>/, '<title>Danzuni — Your dance studio. Wherever you are.</title>');
  replace(/<meta name="description" content="[^"]+">/, '<meta name="description" content="On-demand social dance classes. Learn at your pace and make the moves your own. Sign in to access classes in the Danzuni app.">');
  replace(/<h1 class="intro__title">[\s\S]*?<\/h1>/, '<h1 class="intro__title">Your dance studio.<br>Wherever you are.</h1>');
  replace(/<p class="intro__subtitle">[\s\S]*?<\/p>/, '<p class="intro__subtitle">Online salsa, bachata and more — at your pace.</p>');
  replace(/<a class="button intro__cta" href="https:\/\/app.danzuni.com\/classes">Explore classes<\/a>/, '<a class="button intro__cta" href="https://app.danzuni.com/classes" aria-describedby="intro-access-note">Explore classes</a><p class="intro__note" id="intro-access-note">Sign in to access classes.</p>');
  replace(/<li class="main-nav__item"><a class="main-nav__link" href="https:\/\/socialdancetv.com\/">SDTV<\/a><\/li>/, '');
  replace(/href="#pricing">Membership<\/a>/, 'href="#pricing">Access</a>');
  replace(/<a class="button main-nav__btn" href="https:\/\/app.danzuni.com\/classes">Explore<\/a>/, '<a class="button main-nav__btn" href="https://app.danzuni.com/classes" aria-label="Open Danzuni — sign in to access classes">Open Danzuni</a>');
  replace(/<article class="banner" id="banner">[\s\S]*?<\/article>/, '<article class="banner" id="banner" hidden aria-label="Open the app"><div class="banner__wrapper container"><p class="banner__text">Sign in to access classes.</p><a class="button banner__link" href="https://app.danzuni.com/classes" aria-label="Open Danzuni — sign in to access classes">Open Danzuni</a></div></article>');

  const features = [
    ['everywhere', 'Make space for dance wherever you are. On-demand lessons fit around your day, at your own pace.'],
    ['inspired', 'Explore a different rhythm or return to a favourite style. Find something to bring to your next practice.'],
    ['teachers', 'Learn from dancers who bring their own style and perspective to each lesson. Practise the details, then make them yours.'],
  ];
  for (const [id, copy] of features) replace(new RegExp(`(id="${id}">[\\s\\S]*?<p class="features__text">)[\\s\\S]*?</p>`), `$1${copy}</p>`);
  replace(/>World Class Teachers/g, '>Learn from dancers', 2);
  replace(/title="World Class Teachers"/, 'title="Learn from dancers"');
  replace(/>Take class<\/a>/, '>Open Danzuni</a>', 3);

  // Duplicate card captions and mismatched review identities are not evidence.
  // Their original HTML and assets remain in the archive for a verified future selection.
  replace(/<section class="reviews"[\s\S]*?<\/section>/, '');
  replace(/<section class="classes"[\s\S]*?<\/section>/, '');
  // Preserve the original photographic gateway, not a directory of teacher cards.
  replace(/<a class="instructors__cta-btn button button--border" href="https:\/\/app.danzuni.com\/classes">Find class for you<\/a>/, '<a class="instructors__cta-btn button button--border" href="https://app.danzuni.com/classes" aria-describedby="instructors-access-note">Explore classes</a><p class="instructors__cta-note" id="instructors-access-note">Sign in to access classes.</p>');
  replace(/alt="\{&quot;item&quot;:&quot;([^\"]+)&quot;\}"/, 'alt="$1"', 21);

  // View/camera controls were removed in the application; do not market a dormant control.
  replace(/<li class="tablist__presentation" role="presentation"><a class="tablist__tab" role="tab" href="#switch-views">Switch views<\/a><\/li>/, '');
  replace(/<figure class="custom-player__figure" role="tabpanel" hidden id="switch-views">[\s\S]*?<\/figure>/, '');
  const tools = [
    ['mirror-video', 'Mirror the video to follow the movement in the same direction.'],
    ['loop-moves', 'Repeat a section while you practise the movement.'],
    ['control-speed', 'Slow the lesson down to study the details, then practise at your own pace.'],
  ];
  for (const [id, copy] of tools) replace(new RegExp(`(id="${id}">[\\s\\S]*?<figcaption[^>]*>[\\s\\S]*?<p>)[\\s\\S]*?</p>`), `$1${copy}</p>`);
  replace(/<h2 class="custom-player__title">Custom player designed for dancers<\/h2>/, '<h2 class="custom-player__title">A player made for practice.</h2><p class="custom-player__note">Practice controls in the web player. Controls vary by device.</p>');
  replace(/<source src="\.\/img\/main\/mob-program.webp" type="image\/wepb">/, '<source srcset="./img/main/mob-program.webp" type="image/webp">', 3);

  replace(/<section class="tariffs"[\s\S]*?<\/section>/, '<section class="tariffs danzuni-access" data-aos="fade" data-aos-duration="450" data-aos-once="true" id="pricing"><div class="tariffs__wrapper container"><h2 class="tariffs__title">Your classes, in the app.</h2><p class="danzuni-access__text">Sign in to access classes and manage your account.</p><a class="button danzuni-access__cta" href="https://app.danzuni.com/classes" aria-describedby="access-note">Open Danzuni</a><p id="access-note" class="danzuni-access__note">New subscription purchases are not available on this page.</p><a class="danzuni-access__support" href="mailto:info@socialdancetv.com">Need help with access? Contact support</a></div></section>');
  replace(/Join The Only Studio That Moves With You/, 'Make room for dance.');
  replace(/Danzuni by Social Dance TV<\/p>/, 'From the team behind <a class="page-footer__origin" href="https://socialdancetv.com/">Social Dance TV</a>.</p>');
  replace(/<li><a class="page-footer__link" href="https:\/\/socialdancetv.com\/">SDTV<\/a><\/li>/, '');
  replace(/<ul class="page-footer__list"><li><a class="page-footer__link" href="https:\/\/socialdancetv.com\/">Social Dance TV<\/a><\/li><\/ul>/, '');
  replace(/<\/head>/, '<link rel="stylesheet" href="css/clarity.css"></head>');
  replace(/<\/body>/, '<script src="js/clarity.js" defer></script></body>');
  return html;
}

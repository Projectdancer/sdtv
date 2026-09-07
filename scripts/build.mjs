import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The published legacy page stays immutable. Only this adapter changes the new host.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function adaptHtml(source) {
  if (createHash('sha256').update(source).digest('hex') !== 'd5ac354b242a538ef412e791b02c360b7a8acc9370acd1e13abed5184d505652') {
    throw new Error('Legacy HTML changed: review the source before adapting it.');
  }
  let html = source;
  const once = (pattern, replacement) => {
    const matches = [...html.matchAll(new RegExp(pattern.source, 'g'))];
    if (matches.length !== 1) throw new Error(`Expected one source match: ${pattern}`);
    html = html.replace(pattern, replacement);
  };
  once(/<title>Social Dance TV<\/title>/, '<title>Danzuni | Social Dance TV</title><meta name="description" content="Dance classes at your own pace, on your own time, and on any device. Explore Danzuni by Social Dance TV."><link rel="canonical" href="https://go.danzuni.com/">');
  // Owner-approved logo-only exception to the design freeze. This is the actual
  // typographic wordmark rendered by app.danzuni.com, not the archive's artwork.
  const wordmark = '<span class="danzuni-wordmark" role="img" aria-label="Danzuni">Danzuni</span>';
  once(/<svg[^>]*aria-labelledby="logo-title"[^>]*>[\s\S]*?<\/svg>/, `<span class="danzuni-header-logo">${wordmark}</span>`);
  once(/<svg[^>]*aria-labelledby="logo-sq-title"[^>]*>[\s\S]*?<\/svg>/, `<span class="page-footer__logo danzuni-footer-logo">${wordmark}</span>`);
  once(/<link rel="preconnect" href="https:\/\/fonts.gstatic.com">/, '');
  once(/<link rel="stylesheet" href="https:\/\/fonts.googleapis.com[^>]+>/, '<link rel="stylesheet" href="css/fonts.css">');
  once(/<link href="https:\/\/unpkg.com\/aos@2.3.1\/dist\/aos.css" rel="stylesheet">/, '<link href="css/aos.css" rel="stylesheet"><link href="css/danzuni.css" rel="stylesheet">');
  // Remove both nonfunctional legacy credit-card forms, including their overlay.
  once(/<div class="overlay"[\s\S]*?<\/main>/, '</main>');
  html = html.replaceAll('https://app.socialdancetv.com/signup/1?gr=1', 'https://app.danzuni.com/classes')
    .replaceAll('https://app.socialdancetv.com/login?gr=1', 'https://app.danzuni.com/login');
  once(/>Sign up<\/a>/, '>Explore</a>');
  once(/>Join Now<\/a>/, '>Explore classes</a>');
  once(/Access to all classes for \$19.99\/month \(billed annually\)/, 'Your dance studio. Wherever you are.');
  once(/>Get started<\/a>/, '>Explore classes</a>');
  once(/<section class="tariffs"[\s\S]*?<\/section>/, `<section class="tariffs" data-aos="fade" data-aos-duration="2000" id="pricing"><div class="tariffs__wrapper container"><h2 class="tariffs__title">Find your next dance class</h2><p class="tariffs__text danzuni-membership-note">Explore the Danzuni library or sign in to your account. New subscription purchases are not available on this page.</p></div><ul class="tariffs__list"><li class="tariff"><h3 class="tariff__name">Discover Danzuni</h3><p class="tariff__price danzuni-card-title">Explore</p><p class="tariff__subtitle">Find your next class</p><a class="button button--white tariff__cta" href="https://app.danzuni.com/classes">View classes</a></li><li class="tariff"><h3 class="tariff__name">Already a member?</h3><p class="tariff__price danzuni-card-title">Welcome back</p><p class="tariff__subtitle">Continue at your own pace</p><a class="button tariff__cta" href="https://app.danzuni.com/login">Log in</a></li></ul></section>`);
  once(/>Pricing<\/a>/, '>Membership</a>');
  // Preserve the layout, not expired catalog counts or an unverified release cadence.
  once(/<table class="advantages"[\s\S]*?<\/table>/, '');
  html = html.replaceAll('New classes added every month.', 'Meet your dance teachers.')
    .replaceAll('From ballet to hip-hop and even Bollywood, we have a class just for you', 'Explore dance classes and find inspiration for your next practice')
    .replaceAll('What members are saying', 'From the Social Dance TV community');
  // Existing forms were not connected to a mailing provider. Never collect or fake success.
  once(/<form class="subscribe-form page-footer__form"[\s\S]*?<\/form>/, '<div class="subscribe-form page-footer__form"><p class="subscribe-form__label">Danzuni by Social Dance TV</p><a class="button" href="mailto:info@socialdancetv.com">Contact us</a></div>');
  html = html.replaceAll('href="/blog"', 'href="https://socialdancetv.com/"')
    .replaceAll('>Blog</a>', '>SDTV</a>')
    .replaceAll('<li><a class="page-footer__link" href="/careers">Careers</a></li>', '')
    .replaceAll('href="/support"', 'href="mailto:info@socialdancetv.com"')
    .replaceAll('href="terms"', 'href="https://app.danzuni.com/terms"')
    .replaceAll('href="privacy"', 'href="https://app.danzuni.com/privacy"')
    .replaceAll('href="#find-classes"', 'href="https://app.danzuni.com/classes"')
    .replaceAll('class="button features__cta" href="#"', 'class="button features__cta" href="https://app.danzuni.com/classes"');
  // Real destination instead of dead social links; do not invent channel URLs.
  once(/<li><a class="page-footer__link" href="#">Instagram[\s\S]*?<\/li>/, '<li><a class="page-footer__link" href="https://socialdancetv.com/">Social Dance TV</a></li>');
  for (const style of ['salsa','bachata','kizomba','mambo','cuban','swing','reggaeton','tango_argentino','zouk']) {
    html = html.replaceAll(`href="#${style}"`, 'href="https://app.danzuni.com/classes"');
  }
  // Archive the old press/partner artwork without advertising unverified Danzuni endorsements.
  once(/<aside class="join__side"><p class="join__side-text">As featured in[\s\S]*?<\/aside>/, '');
  once(/<section class="join"[^>]*><div class="join__wrapper container"><aside[\s\S]*?<\/section>/, '');
  html = html.replaceAll('&copy; 2020 Social Dance TV All Rights Reserved', '&copy; 2026 Social Dance TV. Danzuni. All Rights Reserved');
  html = html.replace('aria-controls="main-nav"', 'aria-controls="main-nav" aria-label="Toggle navigation"');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replaceAll('Already a member?', 'Your account').replaceAll('Welcome back', 'Log in');
  return html;
}

export async function build(output = process.env.LANDING_OUTPUT_DIR || join(root, 'dist')) {
  const destination = resolve(output);
  if (destination === root || !destination.toLowerCase().startsWith('d:\\')) throw new Error('Build output must be an isolated directory on D:.');
  await mkdir(destination, { recursive: true });
  for (const name of ['css','img','js','video','apple-touch-icon.png','favicon.ico','icon.svg','icons.svg']) {
    await cp(join(root, name), join(destination, name), { recursive: true });
  }
  const source = await readFile(join(root, 'index.html'), 'utf8');
  const html = adaptHtml(source);
  await writeFile(join(destination, 'index.html'), html);
  let js = await readFile(join(root, 'js/main.js'), 'utf8');
  const obsolete = 'document.querySelector(".payment__side .classes-item").innerHTML=e.innerHTML';
  if (!js.includes(obsolete)) throw new Error('Source payment hook changed');
  js = js.replace(obsolete, 'void 0');
  await writeFile(join(destination, 'js/main.js'), js);
  await cp(join(root, 'deployment/vercel.json'), join(destination, 'vercel.json'));
  await cp(join(root, 'deployment/404.html'), join(destination, '404.html'));
  await writeFile(join(destination, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  console.log(`Built static, provider-free landing: ${destination}`);
  return destination;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();

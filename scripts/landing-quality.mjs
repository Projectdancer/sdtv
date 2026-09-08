// Narrow, reversible improvements. Keep the archived page/assets untouched.
export function improveHtml(html) {
  return html
    .replace(/<video class="figure__video" muted>/g, '<video class="figure__video" muted preload="none" playsinline aria-hidden="true">')
    .replace(/<source src="(\.\/video\/[^\"]+)" type="video\/mp4">/g, '<source data-src="$1" type="video/mp4">')
    .replace(/<img\b/g, '<img loading="lazy" decoding="async"')
    .replaceAll('data-aos-duration="2000"', 'data-aos-duration="450" data-aos-once="true"')
    .replace('</head>', '<link rel="stylesheet" href="css/quality.css"></head>')
    .replace('</body>', '<script src="js/quality.js" defer></script></body>');
}

export function improveLegacyJs(js) {
  const hover = 'e(".figure--video",(function(e){var t=e.querySelector("video");e.addEventListener("mouseover",(function(){t.play(),t.style.opacity=1})),e.addEventListener("mouseout",(function(){t.load(),t.style.opacity=0}))}))';
  const scroll = 'document.addEventListener("scroll",(function(){var e=window.scrollY/10,t=document.querySelector("#classes-row-first"),n=document.querySelector("#classes-row-second");t.style.left="".concat(e-700,"px"),n.style.left="".concat(-e-700,"px")}))';
  for (const fragment of [hover, scroll]) {
    if (js.split(fragment).length !== 2) throw new Error('Legacy interaction changed: review quality adapter');
    js = js.replace(fragment, 'void 0');
  }
  return js;
}

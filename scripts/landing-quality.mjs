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
  // Keep the existing slider as the sole click/scroll owner. Its original offsets
  // were captured only at startup and became stale when the viewport changed.
  const sliderOffsets = 'r=function(){var e=[],o=t.getBoundingClientRect().x,i=t.scrollWidth-t.offsetWidth;return n.forEach((function(t){var n=t.getBoundingClientRect().x-o;n<i&&e.push(n)})),e.push(i),e}()';
  const sliderMove = 'function s(e){t.scrollLeft=r[e],d(e)}';
  // Adding scrollLeft converts viewport-relative coordinates back to positions
  // within the track, including when a later slide is already selected.
  const responsiveSliderMove = 'function h(){var e=[],o=t.getBoundingClientRect().x,i=Math.max(0,t.scrollWidth-t.offsetWidth);return n.forEach((function(n){var r=n.getBoundingClientRect().x-o+t.scrollLeft;r<i&&e.push(r)})),e.push(i),e}function s(e){r=h(),e=Math.max(0,Math.min(e,r.length-1)),t.scrollLeft=r[e],d(e)}window.addEventListener("resize",(function(){r=h();if(c){var e=t.style.scrollBehavior;t.style.scrollBehavior="auto",t.scrollLeft=r[i],t.style.scrollBehavior=e}}));';
  for (const [before, after] of [[sliderOffsets, 'r=h()'], [sliderMove, responsiveSliderMove]]) {
    if (js.split(before).length !== 2) throw new Error('Legacy slider changed: review responsive adapter');
    js = js.replace(before, after);
  }
  return js;
}

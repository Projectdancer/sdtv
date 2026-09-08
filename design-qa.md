# Landing transfer visual QA — 2026-09-07

## Target and evidence

Source visual truth: https://go.socialdancetv.com/, immutable source SHA `29d8e0a22567386ae37758192f595fe790d83ce3`.

Implementation: local static build at port 4182, then isolated Vercel checking host `https://danzuni-go.vercel.app/`. This is a frontend-only transfer, not a payment/product readiness audit.

Evidence is committed under `docs/evidence/` (captured initially under `D:/codex-runs/danzuni-go-transfer-20260907/evidence/`).

- Desktop source `source-desktop.png`, implementation `local-desktop-fixed.png`: CSS viewport 1440×900, both screenshots 1425×891 pixels as returned by the in-app capture surface. No density normalization/resizing was applied; equal-size rasters were placed together.
- Mobile source `source-mobile.png`, implementation `local-mobile.png`: CSS viewport 390×844, both screenshots 375×811 pixels. Same capture surface/density; comparison at equal raster dimensions. Device scale factor is not exposed by this browser interface; no unsupported numerical assumption was made.
- Full-view side-by-side comparisons: `comparison-desktop.png`, `comparison-mobile.png`.
- Focused typography/CTA comparison: `comparison-hero-detail.png` (same crop from each source, not independent zoom levels).
- Additional state captures: mobile menu/player/membership/instructors, tablet 1024×768.
- Desktop bottom-of-viewport AOS/sticky-banner animation timing differs between initial captures; this is not treated as a static layout mismatch. Settled captures confirm the banner.

## Findings and iteration history

1. [P2, fixed] Longer catalog CTA wrapped and increased hero-button height. `local-desktop.png` showed two lines; constrained whitespace/padding corrected it. Post-fix `local-desktop-fixed.png` and `comparison-hero-detail.png` retain original geometry.
2. [P2, fixed] Mobile account copy crowded the button. Shortened account labels and added a 16px subtitle margin. Evidence: `local-mobile-membership.png` → `local-mobile-membership-final.png`.
3. [P2, fixed] Removing stale counters changed the percentage-positioned instructor CTA, overlapping the mobile heading. Set an explicit mobile CTA offset below the heading. `local-mobile-instructors-final.png` records the defect; `local-mobile-instructors-fixed.png` records the correction. DOM check: heading bottom 189px, CTA top 260px.
4. [P2, fixed] Expanded SDTV navigation label caused wrapping at 1024px. Use the compact SDTV label. `local-tablet.png` → `local-tablet-fixed.png`; Log in is again one line and header geometry fits.
5. Final comparison found no remaining actionable P0/P1/P2 migration mismatch in tested states. Intended commercial-content exclusions are listed in README, not counted as accidental visual drift.

## Required fidelity surfaces

- Fonts/typography: original Poppins family, weights and metrics retained and served locally. Desktop H1 computed `700 65.952px / 81.7805px Poppins`; title/subtitle line breaks and focused raster comparison match.
- Spacing/layout: original stylesheet unchanged byte-for-byte; same hero/photo crop, section structure, buttons and mobile composition. Small adapters above fix newly introduced content/layout interactions.
- Colors/tokens: original CSS palette, dark/light sections, purple controls and SVG icons retained; no replacement visual system.
- Image quality: every source image and video is present byte-for-byte; no AI redraws, placeholder substitutes or hotlinked artwork. Browser: zero missing images in tested viewport states.
- Copy/content: original hero retained. Danzuni title/canonical and neutral catalog/account actions are intentional. No new price, automatic renewal offer, promise of all-language translations or invented customer evidence was added.

## Interaction checks

- PASS: mobile menu opens/closes and closes after section navigation.
- PASS: feature tab selection, player Loop moves tab selection, second review selection.
- PASS: no global horizontal overflow on 390px and 1024px; original pricing-card horizontal scroller is intentional.
- PASS: all internal section anchors and local HTML/CSS resources resolve (automated checks).
- PASS: console error/warning logs empty after local interaction checks and on the initial hosted copy.
- PASS: zero card/email forms; no provider/network primitives; CSP blocks connect/form/frame/object use.
- NOT RUN: purchases, coupon activation, email delivery, login submission, backend changes. Outside this transfer and intentionally disabled/not invoked.
- Legacy testimonial authenticity, current class inventory and full rebranding remain content-owner follow-up, not claimed as newly audited evidence.

## Live acceptance

`https://go.danzuni.com/` is live on deployed implementation `8d6ee26937dd31a980b3373486874c0964da2250`. Desktop/mobile captures are `docs/evidence/production-desktop.png` and `production-mobile.png`. Verified 150 static resources, HTML hash equality, isolation headers, working mobile navigation and intact old source site. The app CTA reaches the existing unauthenticated Log In guard, not a public catalog. See `docs/handoff.md` for exact deployment ID and smoke evidence.

## Logo-only owner exception, 2026-09-07

Scope: actual application wordmark in header/footer; no new layout/content from the dark archive. Evidence under `docs/evidence/logo-review/`.

- Source app capture: `04-app-wordmark.png`; live DOM and `/assets/Page-Bs1yIA7E.css` confirm Poppins 600 22px/22px, -0.04em (20px below 1024px). Source is typographic text, not substituted image artwork.
- Full-view comparisons: `comparison-desktop.png` and `comparison-mobile.png`. Before captures `05-before-desktop.png` / `09-before-mobile.png`; fixed implementation `07-after-desktop-fixed.png` / `10-after-mobile.png`. CSS viewports 1440x900 and 390x844; same surface returned 1425x891 and 375x811 rasters respectively. Equal-size rasters assembled without scaling; no unsupported device-scale assumption.
- Focused app/landing comparison: `comparison-wordmark.png`, equal unscaled top-left crops. Different app/landing header padding is expected; glyph metrics match.
- [P2, fixed] Initial text wordmark inherited link underline (`06-after-desktop.png`), unlike the app. Fixed only `.page-header__logo { text-decoration: none; }`; recaptured and compared. No remaining actionable P0/P1/P2 regression in tested states.
- Fonts/typography: computed desktop `600 22px / 22px Poppins`, -0.88px; mobile `600 20px / 20px Poppins`. Main typography unchanged.
- Spacing/layout: original 152x25 header and responsive footer slots preserved. Hero line breaks, photo crop, CTA, mobile menu position and surrounding sections match in combined comparisons. No global horizontal overflow at either viewport.
- Colors: app header #242428; intentional white footer variant on existing dark background. No other palette changes.
- Images/assets: original image/video bytes and original design stylesheet remain unchanged. No archive image, symbol or palette transferred.
- Copy/content: outside two wordmark wrappers, HTML normalized hash matches the previous deployment. No FAQ, lesson metadata, preview, offer or translation claim added.
- Interaction PASS: mobile menu opens and closes after Features navigation. Header remains a home link with accessible name Danzuni. Console warning/error log empty. Footer captures `08-footer-desktop.png` / `11-footer-mobile.png` confirm legibility and spacing.
- Automated PASS: build and 18/18 tests. Provider activation, payments, account submission and full accessibility audit NOT RUN (out of scope). Current review does not re-certify untouched legacy testimonial/copy claims.
- Live acceptance PASS on `07637955b9044f14563df40704d4ced049a56d32`: `12-live-mobile.png`, `13-live-desktop.png`; exact deployed HTML hash and all 150 assets checked, warning/error log empty. Full details and rollback in `docs/handoff.md`.

## Owner-selected /v1 correction — 2026-09-08

This acceptance is for the isolated candidate, not a replacement of `/`.

- Visual target: the preceding owner-approved mobile art-direction correction and restored production instructor mosaic. Sources opened together with final implementation: `docs/audits/mobile-art-direction-20260908/02-local-390.png`, `docs/audits/instructors-art-direction-20260908/01-live-mobile.png`.
- Implementation: `docs/v1-20260908/evidence/03-hero-390-revised.png` and `02-instructors-390.png`; both390×844 CSS viewport,375×811 saved pixels. Equal-surface rasters reviewed together without normalization. Header/anchor offsets are not used as exact pixel-alignment claims. Focused crops unnecessary: the relevant headline, notes, faces and button are legible in these section captures.
- Additional implementation states:375×667,320×667 and1440×900; files04–07 in the same evidence folder. Native device scale is not asserted; the in-app capture surface returns content rasters with its own framing.
- [P1, fixed] The clarity candidate turned the compact instructor mosaic into a2050px directory and removed its overlay invitation. Restored production grid, gradient and overlay; verified section741.75px at390. Retained true destinations, readable sign-in context and alt fixes. Global sticky CTA hides when the instructor CTA is visible.
- [P2, fixed] First attempted larger headline wrapped to three lines (`01-hero-390.png`); replaced with a responsive34–36px range on375/390 plus deliberate -.035em spacing and a narrow-screen fallback. Post-fix03/04/05 show two lines at390/375/320. Photo container starts301.70px at390 versus350.25px in the rejected clarity candidate; no horizontal overflow in sampled widths.
- [P2, fixed] Brand spelling in visible/ARIA labels corrected from dotted Instagram spelling to Danzuni. One marketing origin line remains in the footer; legal copyright preserved.
- Typography: original Poppins and weights retained; strengthened headline hierarchy, shorter two-line supporting sentence, readable13px access note. Color tokens and imagery are unchanged. Images are original bytes; no generated assets, placeholder drawings or new logo were introduced. Existing dark mosaic gradients intentionally restored, not a new visual style.
- Copy: retains the studio/anywhere promise, one specific subtitle, Explore classes invitation and truthful sign-in context. No new offer, inventory count, translation coverage or testimonial evidence.
- Local route interaction PASS at `http://127.0.0.1:4186/v1/`: mobile menu opened; Instructors click retained `/v1/` and closed the menu; instructor overlay visible with no repeated bottom CTA; Loop moves selected exactly its panel;0 broken loaded images and0 sampled console errors. No auth submission or payment action.
- Static/runtime PASS:53 candidate tests plus6 isolation tests. Independent review also compared all152 root public files directly with the original production artifact. Read-only pre-publication smoke verified every root resource against live SHA-256 at2026-09-08T11:11:36.310Z.
- NOT RUN: physical iOS/Android, full accessibility certification, conversion experiment. No remaining actionable P0/P1/P2 mismatch in the selected correction scope. Instructor dimming strength remains subjective polish for owner testing, not a catalog-availability claim.

final result: passed

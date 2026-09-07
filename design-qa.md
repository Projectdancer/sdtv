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

final result: passed

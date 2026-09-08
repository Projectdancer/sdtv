# Landing technical refinement — local handoff

**Status superseded by publication acceptance below:** the local-only statements document the prior checkpoint. The owner subsequently approved applying the package; implementation is now pushed and deployed.

Date: 2026-09-08. Base HEAD: `7a5f0658fb8a0ddcdcd45b2a320d97a4b4d5ba58`, branch `codex/go-danzuni-20260907`, repository Projectdancer/sdtv. All results below apply to this HEAD **plus the uncommitted working-tree changes**, not a new immutable commit or live deployment.

## Implemented

- Nine decorative videos now start without a source: `data-src`, `preload=none`, `playsinline`. Fine-pointer hover attaches the source once. Pointer leave pauses rather than reloading; late/rejected play is handled; offscreen, hidden-page and reduced-motion changes stop playback. Touch keeps still images and the original style links; this does not add an interactive lesson demo.
- All 60 HTML images are below the CSS-background hero and use lazy loading / async decoding. Image bytes and the hero background are unchanged.
- Existing two-second AOS reveals become 450ms, once. Existing reduced-motion AOS suppression remains; slider smooth scrolling now also respects that preference.
- Removed the legacy document-scroll handler that continuously changed both class-row left offsets. Rows retain their original CSS position; no new card content or layout introduced.
- Features/player tabs support Left/Right, Home/End and Space; one tab is in the Tab sequence, controls/labels are linked, inactive panels are inert and excluded from accessibility reading without collapsing slider geometry.
- Mobile menu supports Escape with focus return and keyboard focus wrapping while open.
- Original source assets and legacy `index.html`, `js/main.js`, `css/style.css` remain untouched. The adapter refuses changed legacy interaction fragments. Existing form/network/provider restrictions remain.

## Verification

PASS:

```powershell
$env:LANDING_OUTPUT_DIR='D:\codex-runs\danzuni-quality-20260908\site'
node scripts/build.mjs
node --check js/quality.js
node --test scripts/test.mjs scripts/quality-runtime.test.mjs
```

29 passing tests (23 static/integration contracts + 6 runtime unit cases), zero failures. Runtime unit cases cover no initial load, attach-once/pause, coarse pointer/reduced motion, late play resolution after leaving, rejected playback, offscreen/visibility/preference changes. These are controlled unit cases, not a physical-device playback test.

Browser checks, local Chromium:

- Initial DOM: all 9 videos have empty currentSrc and readyState 0.
- Desktop 1440×900: ArrowRight changes Features from Everywhere You Are to Stay Inspired, selection and focus agree; after slider settles the selected panel occupies the visible area. Inactive panels retain geometry and have inert attributes. ArrowRight from Loop moves selects Control speed.
- Narrow 390×844: open menu → Shift+Tab wraps to Explore; Escape closes menu and returns focus to Toggle navigation. Selecting Styles closes menu. End in player tabs selects and focuses Switch views; only that panel is marked active.
- Narrow document scrollWidth 375 at CSS innerWidth 390: no global horizontal overflow observed.
- No warnings/errors returned by local browser console during these checks.
- Visual review retained the original light hero, typography, imagery and player layout. Screenshots: [desktop player](evidence/quality-20260908/desktop-player.png), [mobile hero](evidence/quality-20260908/mobile-hero.png), [mobile player](evidence/quality-20260908/mobile-player.png).

NOT RUN: cold-network performance score, real iOS/Android, real mouse-hover playback on a physical device, OS reduced-motion browser emulation, screen reader/full accessibility conformance, hosted Preview/CSP serving test for the new delta, production deployment. The local Python server does not enforce Vercel response headers; static tests verify the unchanged CSP configuration. No measured speed/traffic savings claimed.

## Explicitly left unchanged

Logo placement, header/footer brand wording, testimonial verification, repeated class metadata, anonymous visitor destination, subscription purchases/discounts, support/email provider, sticky banner size, new player demo, image formats/fonts. Logo extraction files and the preceding audit remain preserved alongside this change but are not automatically deployed.

Next gate: review the technical diff and approve commit/push plus hosted Preview if desired. Then assess authentic catalog/review content and the primary CTA path separately. No merge or production deployment has been performed or inferred from this continuation.

## Recovery / rollback

Worktree must be kept: `D:\codex-worktrees\sdtv-landing\go-danzuni-20260907` holds uncommitted, unpushed code, audit evidence and selected-logo assets. Nothing was sent to GitHub in this turn. Rebuild with the commands above; no package installation is needed. Local test server was stopped and this turn's generated site directory is regenerable; retain evidence in this document's directory, not scratch output.

Cleanup attempt was rejected by the execution policy; no alternate deletion mechanism was attempted. Consequently `D:\codex-runs\danzuni-quality-20260908\site` remains on disk as disposable build output. No deletion was completed. It contains no unique source work; do not confuse it with the preserved worktree.

To withdraw only this refinement, revert the tracked technical delta after preserving other user work and omit the new quality adapter/runtime/style and runtime-test files. Do not reset the entire worktree: it also contains the earlier uncommitted brand/audit work. Live deployment is unchanged, so no live rollback is needed.

## Publication acceptance — 2026-09-08

Owner explicitly approved applying the technical package. Implementation `f79115d531419cf85cce9f29abaad361f76a13d4` was committed and pushed to `codex/go-danzuni-20260907`; remote SHA verified. No master/master-update merge or original Pages release.

- PASS: rebuild and all 29 tests on that implementation SHA, plus diff checks.
- Preview: `dpl_2SrukTTzbtdDhyjYJTYahip17yt8`, READY, https://danzuni-gy6wloucg-kirill-dancer-7625s-projects.vercel.app . Anonymous smoke hit Vercel SSO protection and failed the expected URL assertion, not a site assertion. Authenticated `vercel curl` verified main.js, quality.js and quality.css byte-for-byte. Preview HTML equals the build plus exactly the platform-injected feedback script; that difference is not hidden as an exact raw-HTML match.
- Access side effect: Vercel CLI automatically generated a project deployment-protection bypass token for the authenticated Preview check. Protection was not disabled; token value was not printed, copied to source, uploaded as an asset, or committed. Owner was informed. Do not claim no provider-account state changed: this tooling token is distinct from the unchanged payment/email/provider activation gates.
- Production: `dpl_BDE4R9w6grMPDrzM58X1mxaXdNC5`, READY, https://danzuni-l7xwd740a-kirill-dancer-7625s-projects.vercel.app , alias https://go.danzuni.com/ . API verified target=production, exact implementation SHA and message `fix(landing): defer media and improve keyboard navigation`.
- PASS live smoke at `2026-09-08T09:19:23.525Z`: HTTPS 200; exact HTML SHA `2185e5fb4cf7348f7be928fdaa003959afdbbc76152b69e81ccb3ff1065a161c`; exact runtime/refinement CSS bytes; all 152 static resources HTTP 200; source/Git/CNAME/unknown routes 404; unchanged isolation headers; original go.socialdancetv.com byte-identical.
- PASS live browser: nine initially empty video currentSrc values; mobile Escape closes menu and returns focus; player ArrowRight selects/focuses Loop moves and exposes only its panel. Fresh desktop load at 1440×900: Features ArrowRight selects Stay Inspired with corresponding panel visible; transition duration 0.45s. No sampled horizontal overflow and no warning/error log entries. [Live mobile](evidence/quality-20260908/live-mobile-player.png), [live desktop](evidence/quality-20260908/live-desktop-features.png).
- Scope limit: the archived slider caches measurements on initialization; changing viewport width without reload can leave positions stale. Final desktop evidence was taken after reload at the target width. Dynamic resize/orientation robustness remains follow-up, not a claimed pass.
- Cold-network metrics, real mobile devices and full screen-reader audit remain NOT RUN. Existing catalog/review/CTA/branding issues remain separate.

Rollback: republish the prior verified generated implementation `07637955b9044f14563df40704d4ced049a56d32` only to danzuni-go; prior deployment `dpl_9X9QUjnF47SFN7dwbuDT2C3A1Fjp`. Never deploy archived repository-root HTML or change the old Pages site/app/API.

Source implementation and acceptance evidence are retained on GitHub. The worktree must still be kept because earlier `docs/brand`, `docs/audits` and `scripts/extract-selected-logo.py` remain uncommitted/unpushed. Existing scratch output and Preview-check copies remain in `D:\codex-runs\danzuni-quality-20260908`; previous cleanup policy rejection was not evaded or retried through another mechanism.

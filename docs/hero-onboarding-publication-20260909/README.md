# Hero composition + correct onboarding entry — 2026-09-09

Owner GO covers both the main landing and V1 for the audited hero/onboarding corrections, plus preservation of all previously approved V1 work. This is a static landing release, not a Learn app, onboarding redesign or payment release.

## Exact scope

- Six acquisition anchors now target `https://app.danzuni.com/signup/1`: root header Explore, hero Explore classes, sticky Explore classes, instructor Find class for you; V1 hero and instructor Explore classes.
- Explicit Log in remains `/login`; all seven V1 Open Danzuni links, root account cards and catalogue/style links retain their existing destinations.
- Both heroes use an actual text/image grid and the same original `intro-desc.jpg` photograph, fonts and palette. Fixed excessive vertical padding and overlapping reserved rectangles are removed. Mobile image is contained, not cropped; the 440px mobile/tablet cap avoids excessive expansion just below the 800px breakpoint.
- Root hero headline/subtitle retained. V1 subtitle: `On-demand salsa, bachata and more. Learn at your own pace.` Both hero notes and V1 instructor note explain the next step: `Start with a few questions about your dancing.` No new trial, recommendation or access promise.
- Published V1 dark access panel, motion, instructor invitation, isolated-device artwork, footer and exact copyright `© 2026 Danzuni by Social Dance TV` preserved. All 313 pre-existing non-HTML assets remain byte-identical. Only root/V1 HTML changes; two scoped CSS paths added. Total 317 resources. Routing/security configuration unchanged.

## Reproducible build and checks

```powershell
$env:LANDING_HERO_BASE='D:\codex-runs\danzuni-complete-v1-20260909\release'
$env:LANDING_RELEASE_DIR='D:\codex-runs\danzuni-hero-onboarding-20260909\release-final'
node scripts/build-hero-onboarding-release.mjs
node --test scripts/hero-onboarding-release.test.mjs
```

Build uses the committed 315-resource baseline manifest. It refuses a changed input, unexpected CTA counts, outside-D output and overwrites. Use a new empty output directory for a new build. Do not use the unrelated dirty historical `build-v1.mjs` to publish.

PASS 10 tests, 0 failures, 0 skipped after the final CSS cap adjustment (3498.7ms). Independent tests validate exact six-link delta, every other anchor/href, all outside-hero bytes except named changes, preserved footers/account routes, all file hashes and actual public allowlist, IDs/descriptions and fail-closed transforms.

Visual checks: 390×844, 906×994, 1440×900 and 720×900; additional DOM layout probes requested at 320/390/720/721/799/800/906/1440 widths (browser rounded 721 to 722). No sampled document horizontal overflow; desktop text/image gutter 24–43px. At 906, hero 488.5px vs baseline 769px and 27.2px positive gutter. Mobile primary CTA 52px high; desktop 56px. Source/candidate were inspected together using `comparison.html`. Original photo and composition language retained. Visual checks do not prove conversion uplift or full accessibility.

The first candidate allowed a 640px image below the desktop breakpoint; QA reduced this to 440px. Early local screenshots/metrics are labelled `local-*`; final 720 screenshot/metrics document the correction. The 390/906/1440 layouts are unchanged by that cap correction.

Root HTML SHA256 `e500674459f00833ee84afbe1dc2717ac1bd92a044c44ac9d1b9e06d1d8d86e8`.
V1 HTML SHA256 `3d8b08e1e6ebf4ee8464119740a65e233e899c9e4e461a9c178e7a9445316da5`.

NOT RUN: actual account creation, email delivery, trial/access/payment outcome, physical devices, full screen-reader/keyboard audit, measured conversion. All app/provider/payment/email/database flags untouched. The separate [onboarding audit](../onboarding-audit-20260909/README.md) is a proposal and defect record, not part of this deployed application behavior.

Release sequence: push exact source → deploy without switching public alias → staged response verification → repeat previous live baseline check → promote → all-resource live smoke and browser CTA checks. Rollback target is `dpl_2V71eTmjEcDYGSkeB7AMB8YQLG8H`, `https://danzuni-qpbu6iq18-kirill-dancer-7625s-projects.vercel.app`.

## Actual release acceptance

Implementation `f3bce3a0e983c7ef8367cf5de7aec1affddf5003` committed and pushed. Combined hero + preserved access-motion runtime command passed 24 tests, 0 failures/skips (3679ms). Deployment `dpl_Gjf5EGHpZi8qK7Wtjv2KgCKiQibq`, `https://danzuni-dxjn81n8w-kirill-dancer-7625s-projects.vercel.app`, reached terminal READY. Authenticated staged exact-response checks passed for `/`, `/v1`, `/v1/`, and both new CSS paths. All315 previous live resource hashes passed again at `2026-09-09T00:52:14.434Z` before promotion. Exact deployment promoted successfully.

Post-promotion `LANDING_RELEASE_DIR=.../release-final node scripts/smoke-v1.mjs` PASS at `2026-09-09T00:52:58.889Z`: all317 resource hashes, both V1 forms, root/V1 indexing and security headers, private-path404 checks and unchanged original Social Dance TV HTML. Root is intentionally changed only within the documented scope; the reused smoke script's “unchanged production root” line means equal to this candidate, not equal to the prior release. Live V1 mobile390 and root desktop1440 captures show the corrected composition. Root acquisition button navigates to `/signup/1`; no account submission was made.

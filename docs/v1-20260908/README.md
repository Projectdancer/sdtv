# Danzuni /v1 — isolated owner test

Owner approval: publish the corrected candidate at `https://go.danzuni.com/v1`, after restoring the mobile hero and instructor gateway. Main `/` must remain unchanged. Brand Danzuni has no dot; `@danz.uni` is only the Instagram handle.

## Implementation

- Mobile hero: same scene and studio/anywhere promise, stronger two-line headline, short subtitle, Explore classes CTA, concise sign-in note. One marketing SDTV attribution moved to footer; legal copyright preserved.
- Instructor gateway: original cropped mosaic, gradient and overlaid CTA restored. Global sticky CTA is suppressed while the instructor CTA is visible.
- Earlier approved clarity and technical fixes remain only in the candidate. No new logo asset, provider, signup, checkout, offer, email or database activation.
- Release is a compound static artifact: original production at `/`, candidate and its independently scoped assets under `/v1/`. Exact `/v1` rewrite, no wildcard fallback; all hash-only tab links remain literal. `/v1` carries noindex metadata/headers and canonical root. No domain/DNS/account-app changes.

## Root preservation and reproducibility

Baseline implementation: `f79115d531419cf85cce9f29abaad361f76a13d4`, live deployment `dpl_BDE4R9w6grMPDrzM58X1mxaXdNC5` verified before work. Original deployment artifact `D:\codex-runs\danzuni-quality-20260908\site` was compared against every live public resource,152 files, by SHA-256 before publication. Baseline HTML hash: `2185e5fb4cf7348f7be928fdaa003959afdbbc76152b69e81ccb3ff1065a161c`.

Git export initially reproduced uniform Windows/LF line endings, whereas the actual deployment contained mixed original/new text-file line endings. This caused a deliberate parity failure. No mismatch was ignored. Final root uses the actual verified artifact. `release-manifest.json` records all root and candidate resource hashes. For reconstruction from the pinned Git build, `scripts/restore-baseline.mjs` permits only line-ending changes that exactly reach those verified root hashes; all other differences fail.

Artifact: `D:\codex-runs\danzuni-v1-20260908\release-r3`. Manifest sidecar is outside the deployed tree. The generated root alone is deployable, never the repository root or ordinary candidate build.

Commands (existing candidate output under D):

```powershell
$env:LANDING_OUTPUT_DIR='D:\codex-runs\danzuni-clarity-20260908\site'
node scripts/build.mjs
node --test scripts/test.mjs scripts/quality-runtime.test.mjs scripts/clarity-runtime.test.mjs
$env:LANDING_BASELINE_DIR='D:\codex-runs\danzuni-quality-20260908\site'
$env:LANDING_CANDIDATE_DIR=$env:LANDING_OUTPUT_DIR
$env:LANDING_OUTPUT_DIR='D:\codex-runs\danzuni-v1-20260908\release-NEW-EMPTY'
node scripts/build-v1.mjs
$env:LANDING_RELEASE_DIR=$env:LANDING_OUTPUT_DIR
node --test scripts/v1.test.mjs
$env:LANDING_SMOKE_PHASE='before'
node scripts/smoke-v1.mjs
```

The before smoke refuses to overwrite an existing `/v1`; for subsequent changes, explicitly review the currently deployed version first. After authorized publication, unset `LANDING_SMOKE_PHASE` to verify both pages and every deployed resource.

## Verification at implementation checkpoint

- PASS:53 candidate tests;6 packaging tests; independent152-file baseline comparison; local mobile and desktop visual QA (see root `design-qa.md`).
- PASS: full152-file live preflight at2026-09-08T11:11:36.310Z; old Social Dance TV source remains byte-identical.
- Hosted routing and final publication: pending at this checkpoint; append actual evidence after deployment.
- NOT RUN: payments, account submissions, support delivery, actual iOS/Android and conversion testing; deliberately separate.

## Rollback

Promote the prior deployment `dpl_BDE4R9w6grMPDrzM58X1mxaXdNC5` within this isolated project to remove `/v1` while retaining the original landing. Never deploy archived source HTML or change app/API/DNS/payment settings.

Unrelated local logo assets, extraction helper and other historical audit work remain outside this implementation commit; retain the worktree. Earlier cleanup policy rejections are not to be evaded. Scratch artifacts from failed parity iterations are not live or unique source work.

## Published acceptance — 2026-09-08

- Implementation `dd5c2027afafa83532cdf9a480be36b6db964f8b` committed and pushed to `codex/go-danzuni-20260907`; remote SHA verified. No merge into master/master-update, no old Pages release.
- PASS on that SHA: `node --test scripts/test.mjs scripts/quality-runtime.test.mjs scripts/clarity-runtime.test.mjs scripts/v1.test.mjs` —59/59 tests, with the candidate/release environment paths above.
- Deployment `dpl_7UVVgagncodAJ1w8PEUPjn7aNsEB`, READY. Immutable URL: https://danzuni-9ixjcxgv7-kirill-dancer-7625s-projects.vercel.app . API verified exact implementation SHA and descriptive metadata `feat(landing): isolated v1 mobile hero and instructor gateway`.
- Uploaded with production target and `--skip-domain`, then authenticated checks verified `/` and `/v1` as HTTP200 and exact HTML bytes before promotion. Existing Vercel deployment-protection automation access was used; protection was not disabled. No authentication value is stored in this package.
- Final root preflight at2026-09-08T11:17:39.386Z verified all152 root resources by full GET/SHA-256 and confirmed `/v1` did not exist before promotion.
- Promoted only the existing isolated `danzuni-go` project. Immediate first custom-domain `/v1` request returned404 during propagation; no code change or weakened assertion was used. The subsequent browser check and full smoke passed.
- PASS final read-only smoke at2026-09-08T11:18:17.733Z: `/v1`, `/v1/`, and its actual index/assets return expected bytes; all304 public resources checked by full GET/SHA-256; all152 root files unchanged; v1 noindex header present and root not marked noindex; isolation headers retained; source/Git/docs/unknown paths remain404; original Social Dance TV landing unchanged.
- Root HTML SHA-256 remains `2185e5fb4cf7348f7be928fdaa003959afdbbc76152b69e81ccb3ff1065a161c`. V1 HTML SHA-256: `209c7999ec4c9bc22e272bfc376481aaff40ca50c054fb67e9772177654ddebc`.
- PASS live browser390×844: two-line headline, original scene, mobile menu closes after Instructors link, restored instructor overlay, no repeated sticky CTA while the overlay button is visible, no sampled overflow or broken loaded images, no sampled console errors. Live captures08/09 are in `evidence/` and were opened and inspected.
- PASS actual instructor CTA navigation reaches the existing app Log In screen. No login submitted, user record created, payment attempted or email sent. This remains an account-gated destination, not a newly public catalog.

Public owner-test URL: https://go.danzuni.com/v1 . The main https://go.danzuni.com/ retains its prior content, assets and behavior. Owner visual approval of v1 is still pending; publication for testing is not approval to replace root.

Cleanup: deletion of this turn's own scratch `D:\codex-runs\danzuni-v1-20260908` was rejected by the execution policy before execution. No alternate deletion method was attempted. The directory retains reproducible baseline exports, failed packaging iterations, final release artifact and staged-response checks; all unique implementation/acceptance evidence is pushed. The worktree also remains necessary for earlier unrelated uncommitted assets/audits. No claim of a fully clean workspace is made.

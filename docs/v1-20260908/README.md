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

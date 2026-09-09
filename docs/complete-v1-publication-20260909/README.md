# Complete approved V1 — 2026-09-09

Owner requested all completed approved landing work on V1 after noticing the old access panel. This release adds the existing approved dark Your next move starts here panel and restrained one-shot button animation to the already published footer/copyright and transparent device illustration. Root homepage stays byte-identical. No unselected designs, new promises, purchase flows, provider/payment/email/DB changes or app changes.

Base is the corrected-footer live release from `../footer-publication-20260909/release-manifest.json` (311 resources, V1 c0bac2c3...). Final adds four V1 assets: scoped CSS, enhancement JS, arrow SVG and license. No previous asset bytes change. Exact approved copyright and entire footer preserved. Full actual-file allowlist excludes local studies, docs, source, credentials and build metadata.

```powershell
$env:LANDING_COMPLETE_BASE='D:\codex-runs\danzuni-footer-production-20260909\release-copy'
$env:LANDING_RELEASE_DIR='D:\codex-runs\danzuni-complete-v1-20260909\release'
node scripts/build-complete-v1-release.mjs
node --test scripts/complete-v1-release.test.mjs scripts/access-motion-runtime.test.mjs
```

PASS 18 tests, 0 failures, 0 skips. Tests cover exact delta, root/all old asset bytes, copyright, real links and honest access limitation, no forms, reduced-motion, once-only animation, visibility dwell, cancellation on background/reduced-motion, unavailable APIs and cleanup of observers/timers. Final root SHA256 `5800809ca0fa9e73c79d4981dc937cc856ce222fe64281b5e903e5b24a864924`; V1 `f030737238eae4a560569c0367bdc798c33c38075310920045ee815cb7007835`; 315 resources.

Compared full candidate HTML against owner-approved local study at `http://127.0.0.1:4198/v1/`: after exact requested copyright substitution, all HTML excluding stylesheet tags is identical; sorted stylesheet tags are identical. Only stylesheet order differs due preservation-first incremental assembly. Scoped selectors and visual checks are required; this is not an assertion of literal full-byte identity with the study.

The unrelated dirty historical `scripts/build-v1.mjs` must not be used to publish this release; it pins a superseded root. Use the complete-V1 builder and recorded manifests. No merge to main/master is implied by landing publication. Existing local motion/audit studies remain retained until separately reconciled.

Release gate: local mobile/desktop check, push exact source, staged verification, promotion under owner GO, live all-resource smoke and visual verification. Rollback to corrected-footer deployment `dpl_G9bmNe1oBUpJaA53aqqxcRhuhwzp`. NOT RUN: physical mobile devices, full accessibility certification, actual credentials/email/payment submission, measured conversion.

## Actual release acceptance

Implementation `3f658664932089a9fbbdf7a74a7cd703a0e7739d` pushed to `codex/go-danzuni-20260907`. Deployment `dpl_2V71eTmjEcDYGSkeB7AMB8YQLG8H`, `https://danzuni-qpbu6iq18-kirill-dancer-7625s-projects.vercel.app`, reached READY. Before promotion, authenticated exact-response SHA checks PASS for root/V1 HTML, motion CSS/JS and arrow SVG. Previous live 311-resource check repeated PASS at `2026-09-09T00:05:01.540Z`. Exact deployment promoted successfully.

`LANDING_RELEASE_DIR=D:\codex-runs\danzuni-complete-v1-20260909\release node scripts/smoke-v1.mjs`: PASS at `2026-09-09T00:06:09.309Z`, all 315 public resource hashes, both V1 URL forms, unchanged root bytes, isolated-device bytes, V1 noindex/security boundaries, private-path 404s and original Social Dance TV HTML. Hashes match the manifest above.

Local and live browser checks at 1440×900 and 390×844. Desktop live confirms old panel absent, both motion states complete, unchanged exact footer copyright, and sticky banner hidden with primary CTA visible. Mobile CTA minimum height 56px; sampled document width 375 within 390. No timing/performance or conversion claim. Screenshots retained here. No navigation/login/email submission is represented by these visual checks.

The footer-only intermediate release and complete-V1 release are distinct historical deployments. This complete-V1 manifest supersedes earlier staging artifacts; do not publish an earlier study or footer-only artifact expecting it to contain access motion.

Final mobile live capture verifies both motion states complete, no old panel, footer `© 2026 Danzuni by Social Dance TV`, loaded isolate and hidden sticky banner at footer. Browser viewport override reset; user tab left on live V1, not localhost. Local servers 4201/4202 stopped. Cleanup of the exact validated non-reparse task directories was rejected by execution policy; no bypass attempted. Regenerable outputs retained at `D:\codex-runs\danzuni-footer-production-20260909` and `D:\codex-runs\danzuni-complete-v1-20260909`. Existing unrelated uncommitted/unpushed studies remain in `D:\codex-worktrees\sdtv-landing\go-danzuni-20260907`; do not remove the worktree. Published implementation and this acceptance record are separately pushed.

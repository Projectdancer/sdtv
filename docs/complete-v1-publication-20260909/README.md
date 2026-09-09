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

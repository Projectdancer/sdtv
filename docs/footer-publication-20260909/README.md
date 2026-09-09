# V1 footer publication — 2026-09-09

Owner explicitly approved publishing the previously prepared footer only to V1, preserving the main page and published isolated devices.

Baseline: live deployment `dpl_334Sf5hyx3rXGV65sFtzxmu1yR4U`; full 309-resource live check PASS at `2026-09-08T23:49:29.777Z`. Pinned manifest: `../device-publication-20260909/release-manifest.json`.

Scope: existing approved footer adapter, exact approved logo PNG, scoped footer CSS. Retire the adjacent Made By Dancers gradient band as in the selected footer composition. No access/pricing redesign or animation, no hero/instructor/product changes, no app/API/provider/payment/email/DB/config changes. Existing legal/support/class destinations retained. Footer home link stays within V1. Existing sticky observer recognises the footer action without JS changes.

Independent publication builder does not import the dirty general V1 builder. Verifies every baseline file, copies only the public manifest allowlist and unchanged Vercel config, transforms V1 only and adds two V1 assets. All root bytes and all prior V1 assets stay exact.

```powershell
$env:LANDING_FOOTER_BASE='D:\codex-runs\danzuni-device-production-20260909\release'
$env:LANDING_RELEASE_DIR='D:\codex-runs\danzuni-footer-production-20260909\release'
node scripts/build-footer-release.mjs
node --test scripts/footer-release.test.mjs
```

PASS: 4 tests, 0 failures, 0 skips. Includes byte-preservation, independent outside-footer comparison, exact approved link/accessible-note contract, public allowlist and every actual file hash. Prior historical footer suite is not represented as a new run; it targets an older root. Output is 311 public resources. Root SHA256 `5800809ca0fa9e73c79d4981dc937cc856ce222fe64281b5e903e5b24a864924`; V1 SHA256 `f4e8ba3694f68c715f29a7192fa35416ce9e4a6c543a526ac53f5b0a2234f4b0`.

Publication gate: local desktop/mobile check, commit/push exact scope, staged production-target deploy with skip-domain, staged response verification, promote exact deployment, full live smoke and browser check. Rollback: promote previous deployment above. Physical devices, full accessibility certification, actual authentication or mail delivery and conversion measurement are NOT RUN.

Preserve unrelated dirty work in `D:\codex-worktrees\sdtv-landing\go-danzuni-20260907`. Old polish artifacts must not be promoted because they contain superseded root/V1 bytes.

## Actual publication and owner copy correction

Footer implementation `9d9b5efb8344a0be050b18e2135c85db394cc451` was pushed. Staged root/V1/logo/CSS exact-response checks passed; deployment `dpl_Ccz6PGRrAddYBfsFYTf5VsBiwWWS` was promoted. Full live 311-resource smoke PASS at `2026-09-08T23:54:46.400Z`.

Owner then requested exactly `© 2026 Danzuni by Social Dance TV`, without All Rights Reserved. Commit `af78ba2954fdca44acd262e8346eb2d24219d6f2`, pushed, changes only that text in assembled V1 (independent exact string delta assertion PASS). Four release tests rerun PASS. Corrected V1 SHA256 `c0bac2c3501d0015a79c9b5665130f07c9dda0604cacc1a6071969ca8d9f423b`; manifest beside this document now records this corrected release.

Deployment `dpl_G9bmNe1oBUpJaA53aqqxcRhuhwzp`, `https://danzuni-dg16kn9bt-kirill-dancer-7625s-projects.vercel.app`, reached READY; staged root/V1 hash checks passed and exact deployment was promoted. Full live 311-resource smoke PASS at `2026-09-08T23:57:22.267Z`. Live DOM confirmed exact copyright, loaded 1802px original logo, device-isolate URL and hidden sticky banner while footer CTA is visible. Local checks: 1440×900, 390×844 and 320×640; mobile document widths 375/305 within 390/320. Live desktop screenshot shows corrected footer. Scope remains footer-only; subsequent complete-V1 release records the owner's additional request to publish the access-motion block too.

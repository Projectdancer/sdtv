# Device isolation publication — 2026-09-09

Owner approved the local isolated asset and explicitly authorized placing it on the main `go.danzuni.com/` page as well. Release scope is the isolated illustration and its static contour shadow on root and V1. The new access CTA and revised footer are NOT included. App/API, providers, payments, retention, email, DB, DNS, original Social Dance TV site and main/master branches are out of scope.

## Immutable inputs and exact delta

Previous live deployment verified Ready: `dpl_EezJxWqz1FvGZUHPYZoVP8AyNrmw`, `https://danzuni-hi5qoufqu-kirill-dancer-7625s-projects.vercel.app`, project `danzuni-go`, `prj_IBbNGxjv1tEndfjXhg7N9vdZPoYw`.

Read-only live preflight at2026-09-08T23:28:56.937Z: all305 public resource hashes, root/V1 HTML and security/noindex boundaries PASS; old `go.socialdancetv.com` byte-identical. Root input SHA2185e5fb…; V1 input SHAc9fec1db…; full manifest remains in `../v1-device-image-20260908/release-manifest.json`.

New PNG `deployment/v1/danzuni-devices-isolated.png`:1474×1067RGBA, SHA256`0c15f054217a4d5d598d622b36a34456dae102cd93f9e1cac7beea5ef3ca4368`. Exact original RGB across entire canvas; only alpha added. It remains the previously reviewed illustrative UI, not a newly verified app screenshot. Original source PNG SHA642dba75… and original `img/screens.png` remain unchanged.

- Root HTML: only image src/class/alt/dimensions and one stylesheet link change.
- V1 HTML: only image src/class and one stylesheet link change.
- Add PNG+CSS under root and V1. Static shadow only; no new scripts, dependencies, animation, controls or claims.
- Every old public asset and `vercel.json` remains byte-identical. Updated HTML SHA256: root`5800809ca0fa9e73c79d4981dc937cc856ce222fe64281b5e903e5b24a864924`, V1`23e7fa46f45a725bb66ff89ae7ae754d4ff296c0a4483550776c1d6e1bce24bd`.
-309 final public resource entries; public artifact is allowlisted, no local study/source/evidence/credentials.

## Checks before publication

```powershell
$env:LANDING_DEVICE_BASE='D:\codex-runs\danzuni-v1-device-image-20260908\release'
$env:LANDING_DEVICE_OUTPUT='D:\codex-runs\danzuni-device-production-20260909\release'
node scripts/build-device-release.mjs
node --test scripts/device-release.test.mjs
git diff --check
```

PASS7/7,0fail,0skip. Tests independently decode image with Python/Pillow to verify actual alpha, opaque screen regions and exact RGB, verify all old bytes, allowlisted additions, unchanged text/links/scripts, no new commercial/index behavior. No install required. Output must be new and empty.

Local browser: main root1440×1000 and390×844 inspected; correct natural image1474×1067, contour shadow and no sampled overflow. Mobile document width375≤390, image343.2×248.43. Screenshots `local-root-desktop.jpg`, `local-root-mobile.jpg`. New image preserves approved original arrangement, palette and all typography within screens; outer white canvas is intentionally removed. Surrounding root text/layout remains the previous live version. The first-screen copy, footer, old player marketing and other broader audit concerns are not silently changed by this asset update.

NOT RUN at this checkpoint: staged-host checks, production publish, post-deploy smoke, physical devices, measured performance, full accessibility/zoom, actual sign-in or mail delivery. These statements are superseded only by appended actual acceptance below. Prior review-shell browser MutationObserver error was unattributed; no globally clean-console claim.

## Release workflow and recovery

Commit/push only this device implementation/evidence to existing branch `codex/go-danzuni-20260907`. Preserve unrelated dirty footer/motion/audit work. Deploy exact generated allowlist to the existing Vercel project with descriptive Git SHA/ref/subject metadata, production target with skip-domain. Verify staged root/V1/PNG/CSS hashes, recheck current live baseline, then promote under owner authorization and run full post-deploy smoke.

Rollback is promotion of the verified previous deployment above; no DNS removal or archived-root publishing. Runtime flags/config are unchanged.

Important: earlier prepared V1-only polish artifact assumes the old root. After this device publication it MUST NOT be promoted as-is, because it would revert the newly approved root illustration. Rebase any future CTA/footer release on this309-resource manifest and re-verify preservation. Local previews4198/4199 are not proof of hosted state.

## Actual production acceptance

Implementation commit `1a7afb1cfbf5916f0666cc585fb62e40225f0fa9` was pushed and the remote SHA verified on `codex/go-danzuni-20260907`. Deployment `dpl_334Sf5hyx3rXGV65sFtzxmu1yR4U`, `https://danzuni-k3wlvnvxq-kirill-dancer-7625s-projects.vercel.app`, reached READY. Descriptive SHA/ref/commit-message metadata was supplied at deploy time; inspect output does not independently expose that metadata.

Before promotion, authenticated `vercel curl` GET responses matched SHA256 for root HTML, V1 HTML and both PNG/CSS paths (6 checks). Initial curl invocation lacked project environment IDs and stopped at project-link confirmation; rerun with the existing project/org IDs passed without changing protection settings. The previous live 305-resource manifest passed again at `2026-09-08T23:37:15.322Z`.

`vercel promote` of this exact deployment succeeded under the owner's explicit image publication approval. Post-deploy command:

```powershell
$env:LANDING_RELEASE_DIR='D:\codex-runs\danzuni-device-production-20260909\release'
node scripts/smoke-v1.mjs
```

PASS at `2026-09-08T23:38:39.471Z`: all 309 live resource hashes, root and both V1 URL forms, security/noindex headers, private-path 404 boundaries and unchanged original Social Dance TV page. Root and V1 hashes match the exact candidate above. This is image-only production acceptance, not sign-in, payment, accessibility or conversion certification.

Live browser root/V1 inspected at desktop 1440×1000 and mobile 390×844. Natural image 1474×1067 and computed contour shadow verified. Screenshots accompany this record. On mobile root, document width 375 is within viewport 390; image width 343.2, no sampled horizontal overflow. All surrounding legacy copy and footer remain intentionally unchanged.

Unpublished motion/footer/audit work remains in `D:\codex-worktrees\sdtv-landing\go-danzuni-20260907`; preserve this dirty worktree. The current production image implementation and acceptance evidence are separately committed/pushed. Future V1 CTA publication requires a fresh candidate based on the new manifest, not the earlier old-root artifact.

# V1 approved Danzuni device illustration

Owner approval on 2026-09-08: add the reviewed image to the existing V1 work and publish it at go.danzuni.com/v1 for testing today. Root / is not approved for replacement.

## Scope

- Existing branch: codex/go-danzuni-20260907. No merge into master/master-update or release of the old GitHub Pages site.
- New source asset: deployment/v1/danzuni-devices-642dba75.png; SHA-256 642dba7579308024cf07e22a6ad4b710e4f139eb34b9eb57eef1dad62b637990. This is the exact owner-reviewed output, not another generation.
- 1474 x 1067 RGB PNG, 1,478,888 bytes. Opaque white background, intentionally retained in the existing pale section. Historical UI illustration with AI-rendered small details, not a current application screenshot or product-function evidence.
- Only build-v1.mjs replaces the single expected join__image element and adds the pinned image under /v1/img/. The ordinary candidate and archived source are unchanged. The build rejects changed source markup, binary hash or a colliding asset path.
- Natural aspect ratio, descriptive illustration alt text, lazy loading and asynchronous decoding. No JavaScript, CSS, navigation, layout or other copy changes.
- No payment, retention, provider, email, database, permissions, DNS or application changes.

## Validation and deployment

- PASS preflight at 2026-09-08T12:10:59.196Z: existing release-r3 full smoke, 304 public resource hashes and root isolation checks match the live domain.
- Live rollback verified by Vercel inspect: dpl_7UVVgagncodAJ1w8PEUPjn7aNsEB, https://danzuni-9ixjcxgv7-kirill-dancer-7625s-projects.vercel.app, Ready. Promoting this deployment restores the previous V1 without removing V1 entirely.
- Local candidate + runtime + packaging checks: 61/61 PASS on the working-tree implementation; exact committed SHA check and publication result are appended below after execution.
- Local browser PASS at 1440x900 and 390x844: all three devices visible, image loaded at natural dimensions, correct aspect ratio, no sampled horizontal overflow. The approved opaque white background remains visible against the original pale section.
- NOT RUN: physical iOS/Android, current authenticated catalog comparison, conversion measurement; not required for this isolated approved image placement.

Reproduction uses isolated D: output; no dependency installation:

```powershell
$env:LANDING_OUTPUT_DIR='D:\codex-runs\danzuni-v1-device-image-20260908\candidate'
node scripts/build.mjs
$env:LANDING_BASELINE_DIR='D:\codex-runs\danzuni-quality-20260908\site'
$env:LANDING_CANDIDATE_DIR=$env:LANDING_OUTPUT_DIR
$env:LANDING_OUTPUT_DIR='D:\codex-runs\danzuni-v1-device-image-20260908\release'
node scripts/build-v1.mjs
$env:LANDING_RELEASE_DIR=$env:LANDING_OUTPUT_DIR
$env:LANDING_OUTPUT_DIR=$env:LANDING_CANDIDATE_DIR
node --test scripts/test.mjs scripts/quality-runtime.test.mjs scripts/clarity-runtime.test.mjs scripts/v1.test.mjs
node scripts/smoke-v1.mjs
```

Release output must start empty. The final smoke is for the published new artifact; before publication, use the previous release artifact for live preflight. Do not use LANDING_SMOKE_PHASE=before on an existing V1.

Only deploy the compound generated release directory, never repository root. Include exact Git SHA and descriptive commit subject in deployment metadata. Stage with production target and skip-domain, verify the hosted artifact, then promote within the existing danzuni-go project. The public root must retain all 152 original resource bytes.

## Published acceptance

- Implementation SHA: 08e84e505f1fe1a7fcdcd740d26f4ee66ea86d4e. Committed and pushed; remote branch SHA confirmed. Exact-SHA rerun of the four test suites: 61 PASS, 0 FAIL, 0 skipped.
- Deployment: dpl_EezJxWqz1FvGZUHPYZoVP8AyNrmw, READY; immutable URL https://danzuni-hi5qoufqu-kirill-dancer-7625s-projects.vercel.app . Exact implementation SHA, branch and descriptive commit message verified in deployment metadata.
- PASS staged authenticated checks: /, /v1 and the new PNG all returned HTTP 200 and exact expected SHA-256. Existing Vercel automation access used; no protection disabled. The PowerShell wrapper initially consumed the curl argument separator, so the same installed CLI was invoked directly through Node. No unsuccessful check was treated as a pass.
- PASS final previous-release preflight at 2026-09-08T12:16:10.587Z, then promotion of this deployment within the existing danzuni-go project.
- PASS full live smoke at 2026-09-08T12:16:40.272Z: 305 public resources verified by full GET and SHA-256, /v1 and /v1/ exact bytes, noindex only on V1, security headers intact, source/docs/unknown routes closed, old Social Dance TV source unchanged.
- Main root HTML remains 2185e5fb4cf7348f7be928fdaa003959afdbbc76152b69e81ccb3ff1065a161c. New V1 HTML is c9fec1db1587e3f920f4706803cf966df744643e9242fd4bbfbf326916125d08. All 152 root files unchanged.
- PASS live visual checks: 390x844 and 1440x900; updated image loaded at 1474x1067 natural dimensions, no clipping in its section, correct aspect ratio, no sampled horizontal overflow or captured console errors. Screenshots in evidence/live-mobile.png and evidence/live-desktop.png were opened and reviewed. Temporary browser viewport override reset.
- Public test URL: https://go.danzuni.com/v1#join . No authorization to replace root is inferred.

## Cleanup state

This task's attempted cleanup of D:\codex-runs\danzuni-v1-device-image-20260908 was rejected by execution policy before it ran. No alternative deletion route was attempted. The directory still holds reproducible candidate/release output and staged verification downloads; there is no unique unpushed implementation there. The local port4190 preview process was stopped. The existing worktree remains necessary for earlier unrelated untracked audits and logo/extraction work, which were not staged or removed. This task's asset, implementation and live acceptance screenshots are pushed.

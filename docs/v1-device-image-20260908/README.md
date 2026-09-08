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

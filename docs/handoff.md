# Danzuni go landing handoff — 2026-09-07

## Request and scope

Use the old `go.socialdancetv.com` landing as the base and first publish its safe copy to `go.danzuni.com`. Latest explicit owner request authorizes this new-host transfer. No main merge, application/API release, old-site redirect or commercial activation is bundled.

## Source / branch / infrastructure

- Repository: `https://github.com/Projectdancer/sdtv` (the **landing**, not `SocialDanceTV/sdtv-learn`, marketplace Growth or the similarly named `sdtv-online` repository).
- Branch: `codex/go-danzuni-20260907`; original `master-update` source SHA `29d8e0a22567386ae37758192f595fe790d83ce3`.
- Working clone: `D:\codex-worktrees\sdtv-landing\go-danzuni-20260907`.
- Scratch: `D:\codex-runs\danzuni-go-transfer-20260907`.
- Existing domain: Vercel registrar/nameservers, verified in owner team. Before work `app.danzuni.com` belonged to `sdtv-learn-web`; `go` had no assigned project. No manual DNS record replacement is required because the existing Vercel wildcard is present.
- New isolated Vercel project: `danzuni-go`, team `kirill-dancer-7625s-projects`.
- Initial checking deployment: `dpl_AAGwKk7zxnvssZnTFwLFAU67mqVJ`, `https://danzuni-inpb5hdkb-kirill-dancer-7625s-projects.vercel.app`, READY. Vercel automatically classified the **first project deploy as Production**, even though no custom domain was attached. This is not evidence that go.danzuni.com was already live then.

## Gates / evidence

- Exact original live HTML SHA-256 matches tracked source; original Pages branch/CNAME were not changed.
- PASS: `node scripts/build.mjs`; zero dependency install.
- PASS: `node --test scripts/test.mjs` — 16/16.
- PASS: browser desktop/mobile/tablet and core interaction QA; see `design-qa.md` and committed screenshots.
- No Learn-wide pre-push gate claimed: this is a different static source repository with no such gate/hook. No Learn work was merged or deployed.
- Provider/payment/email/database/retention activation: NOT RUN, intentionally out of scope.
- Final custom-domain acceptance is recorded below after deployment, rather than inferred from these local gates.

## What remains intentionally separate

Original imagery and historical community testimonials remain because the owner requested the old landing first. The subsequent logo-only exception replaces the two visible SDTV logos with the actual app wordmark; other branding/copy and curated current classes remain subject to owner review. Do not treat sample class cards or old testimonials as proof of current catalog size or new-user outcomes.

Membership sales, Groupon exact offer/ordinary full-price renewal terms, discount-on-cancel eligibility, translation coverage, monitored support inbox, transactional email, dispute evidence and cancellation backend are separate gates. This landing neither implements nor activates them.

## Rollback / recovery

The original `go.socialdancetv.com` is untouched and remains available. To withdraw the new host, remove only `go.danzuni.com` from the isolated `danzuni-go` project; never remove the parent domain, wildcard DNS or app/API records. To roll back code, redeploy a verified prior static artifact from this branch with exact SHA metadata. Do not deploy the archived root HTML: it contains old prices and nonfunctional payment forms.

Keep branch/evidence on GitHub before deleting the disposable clone. Build output is regenerable; do not retain credentials or `.vercel` state in Git. There are no environment variables or external integrations needed for the landing itself.

## Final publication acceptance

Completed on 2026-09-07. The deployed implementation is commit `8d6ee26937dd31a980b3373486874c0964da2250`.

- Production deployment: `dpl_A6q45RJ4zXoYnJNNP3dVcLSSeKyH`, READY, project `danzuni-go`.
- Immutable URL: `https://danzuni-7bnev7tah-kirill-dancer-7625s-projects.vercel.app`.
- Public host: `https://go.danzuni.com/` (assigned only to this new project).
- PASS: `node scripts/smoke.mjs`, read-only production check at `2026-09-07T17:12:41.971Z`.
- HTTPS status 200 and deployed HTML exactly matches reviewed build: SHA-256 `35391184d28acb60a51cd65bd867cd86eb35599973f43eefd7281d9533b2dd5a`.
- All 150 deployed static resources return HTTP 200; source scripts, Git, original CNAME and unknown routes return 404; CSP and nosniff headers are present.
- Old `go.socialdancetv.com` returns 200 and its original HTML hash is unchanged after the new-domain assignment.
- Browser desktop/mobile on the actual custom domain: no missing images or forms; mobile menu opens and closes after navigation; original hero/layout preserved. Evidence: `docs/evidence/production-desktop.png`, `production-mobile.png`.
- Primary CTA tested: it reaches the Danzuni application, whose existing auth guard shows Log In for this unauthenticated session. This is NOT an anonymous/public catalog launch or proof of paid account access.
- Existing `app.danzuni.com` remains assigned to `sdtv-learn-web`. No app/API/DNS record changes or new backend credentials were made.
- Production deployment command included exact SHA, branch and descriptive GitHub commit message metadata; the CLI's compact inspect output does not expose metadata, so no claim is made about a separately verified dashboard display label.

Implementation and this acceptance/evidence update are saved to the dedicated GitHub branch. No PR or merge into `master`/`master-update` was created. The disposable clone and generated site may be removed after the final branch SHA is verified on GitHub; everything needed to reproduce it is committed.

## Logo-only live acceptance (supersedes the deployment above)

Owner approved only replacing the two visible SDTV marks with the actual app wordmark, keeping all other design/content frozen pending discussion. Archive recommendations are recorded in `docs/landing-elements-review-2026-09-07.md`, not implemented.

- Implementation SHA: `07637955b9044f14563df40704d4ced049a56d32`, pushed to the same dedicated branch.
- Production deployment: `dpl_9X9QUjnF47SFN7dwbuDT2C3A1Fjp`, READY; immutable URL `https://danzuni-cfn16ovhi-kirill-dancer-7625s-projects.vercel.app`; public alias `https://go.danzuni.com/`.
- Vercel API GET `/v13/deployments/dpl_9X9QUjnF47SFN7dwbuDT2C3A1Fjp` verified exact SHA/ref and descriptive `githubCommitMessage`: `fix(brand): use application Danzuni wordmark on landing`. This verifies metadata, not an unobserved dashboard row's presentation.
- PASS on implementation tree: `node scripts/build.mjs`, `node --test scripts/test.mjs` (18/18), `git diff --check`.
- PASS: `node scripts/smoke.mjs` at `2026-09-07T17:37:50.884Z`: HTTPS 200, 150 static resources 200, source/Git/CNAME/unknown routes 404, isolation headers, original source site remains byte-identical.
- Deployed HTML SHA-256: `769a0fb096ac4d1142b9e6ffd4b55e554f072f3ba023ce89afb6bd96eafaa932`, equal to the reviewed local build.
- PASS browser: live desktop/mobile wordmarks, exact mobile 600 20px/20px Poppins and -0.8px spacing; no underline, no broken images or horizontal overflow, empty warning/error log. Live captures: `docs/evidence/logo-review/12-live-mobile.png`, `13-live-desktop.png`.
- The old HTML, ZIP and extracted concept hashes remain unchanged. No app/API deployment, DNS changes, provider or commercial activation, PR or main merge.
- Immediate code rollback: redeploy the prior verified implementation `8d6ee26937dd31a980b3373486874c0964da2250` to this isolated project; never deploy archived root HTML.

Review artifacts and screenshots are retained in GitHub; local checking servers are stopped at handoff. The previously retained clone/build directory is not silently removed or cleaned through an alternate mechanism after the earlier cleanup restriction. It is reproducible, pushed work, not the sole remaining copy.

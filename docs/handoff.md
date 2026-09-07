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

Original SDTV logo/imagery and historical community testimonials remain because the owner requested the old landing first. Update to Danzuni branding and curated current classes in a subsequent owner-reviewed pass. Do not treat sample class cards or old testimonials as proof of current catalog size or new-user outcomes.

Membership sales, Groupon exact offer/ordinary full-price renewal terms, discount-on-cancel eligibility, translation coverage, monitored support inbox, transactional email, dispute evidence and cancellation backend are separate gates. This landing neither implements nor activates them.

## Rollback / recovery

The original `go.socialdancetv.com` is untouched and remains available. To withdraw the new host, remove only `go.danzuni.com` from the isolated `danzuni-go` project; never remove the parent domain, wildcard DNS or app/API records. To roll back code, redeploy a verified prior static artifact from this branch with exact SHA metadata. Do not deploy the archived root HTML: it contains old prices and nonfunctional payment forms.

Keep branch/evidence on GitHub before deleting the disposable clone. Build output is regenerable; do not retain credentials or `.vercel` state in Git. There are no environment variables or external integrations needed for the landing itself.

## Final publication acceptance

Pending final exact-SHA deployment and go.danzuni.com HTTP/browser smoke check at the time of this initial handoff commit. Do not interpret this paragraph as completed publication; append verified results before final user handoff.

# Danzuni landing: original-site transfer

Owner request, 2026-09-07: use the existing `go.socialdancetv.com` landing as the base and first transfer it to `go.danzuni.com`. This is a preservation-first host transfer, not a new design or subscription launch.

## Provenance and boundaries

- Source: `Projectdancer/sdtv`, published branch `master-update`, SHA `29d8e0a22567386ae37758192f595fe790d83ce3`.
- Source GitHub Pages configuration confirmed `go.socialdancetv.com`; live HTML matched the repository byte-for-byte (SHA-256 `d5ac354b242a538ef412e791b02c360b7a8acc9370acd1e13abed5184d505652`).
- Original `index.html`, `css/style.css`, `js/main.js`, images, videos, icons and CNAME are untouched. Do not deploy repository root directly: it is the archived source.
- The adapter in `scripts/build.mjs` produces the Danzuni-specific static site. It refuses a changed upstream HTML hash.
- Destination: a separate Vercel project `danzuni-go` in `kirill-dancer-7625s-projects`; only `go.danzuni.com` is in scope. The apex, www, app, API, original Pages site and Learn repository are not modified.
- Payments, retention offers, Groupon activation, providers, email delivery and databases are not enabled. There is no backend, form, analytics or credential in this deployment. CSP additionally blocks network connections and form submissions.

## What changes in the copy

- Original photos, videos, typography, palette, layout, tabs, mobile menu and carousels retained. Assets including Poppins/AOS dependencies are local, with font/CSS licenses.
- Page title/canonical identify Danzuni. In the separately owner-approved logo-only update, header/footer now reuse the application's actual typographic Danzuni wordmark. Other branding/copy and the archived dark concept are unchanged; see `docs/landing-elements-review-2026-09-07.md`.
- Primary links go to `app.danzuni.com/classes` or `/login`, without the old `gr=1` Groupon flag.
- Old prices, trial comments, mock card forms and disconnected newsletter form are removed. Former pricing cards become catalog/account links and explicitly state that new subscription purchases are unavailable on this page.
- Expired catalog counters and release-cadence copy, unverified press/partner endorsement blocks and dead links are retired from the new rendering, not erased from the archive.
- Existing testimonials are labelled as coming from the Social Dance TV community, not new Danzuni customer evidence. The repeated legacy class-card artwork remains illustrative and links to the catalog rather than claiming an exact active class/price.
- Contact is an ordinary `mailto:info@socialdancetv.com` link. Mailbox monitoring/delivery was NOT tested; this is not a new support backend.
- Small migration-specific responsive fixes: keep hero CTA on one line, shorten tablet navigation text, separate instructor heading/CTA after retired counters are removed, leave space before account-card buttons.

## Reproduce on Windows / D:

No package install or node_modules is required. Node 24 was used.

```powershell
$env:LANDING_OUTPUT_DIR = 'D:\codex-runs\danzuni-go-transfer\site'
node scripts/build.mjs
node --test scripts/test.mjs
python -m http.server 4182 --bind 127.0.0.1 --directory $env:LANDING_OUTPUT_DIR
```

`scripts/vendor-assets.mjs` is a manual source-dependency refresh, not part of normal builds; the checked-in fonts/CSS make normal builds network-free. `scripts/compare-screenshots.py` uses Pillow only to assemble QA comparison sheets, never to alter website images.

Link only the **generated site directory** to Vercel, never repository root. Deploy to a checking URL, inspect it, then assign the approved domain. Include the exact implementation SHA and descriptive commit message in deployment metadata. There is no Git-triggered integration into the old Pages production branch.

## Validation and follow-up

See `design-qa.md` for visual evidence and `docs/handoff.md` for deployment state, rollback and remaining owner decisions. Automated static validation covers 18 tests, including a hash proving that the logo-only update changes no other HTML, accessible wordmarks, asset byte parity, internal links, local fonts, no card/email forms, no old prices/Groupon links, adapter provenance, and CSP isolation.

Next stage: owner-approved Danzuni branding/copy and real catalog selection, then separately approved membership/offer terms. Do not infer commercial approval from this landing deployment.

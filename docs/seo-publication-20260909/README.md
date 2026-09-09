# Danzuni search discovery foundation — 2026-09-09

Owner requested stronger SEO and discoverability in AI recommendations. Scope is the landing, not the Learn application. This release adds technical discovery metadata while preserving every visible page/body, V1 and security/routing configuration. It does not promise rankings, indexing, recommendations or measurable conversion gains.

## Grounding and decisions

- [Google's current generative AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), checked 2026-09-09, recommends standard SEO, useful original content, crawlability and Search Console verification. Special AI markup/llms.txt is not required; markup and indexing do not guarantee inclusion. No fabricated FAQ/reviews/keyword pages are added here.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) (official Markdown version fetched directly after web parser returned navigation only): OAI-SearchBot controls automatic search crawling; GPTBot is a separate training control. Existing wildcard allow already covers OAI-SearchBot. Preserve the existing training/crawler policy; add only the sitemap reference. No claim of verified requests from actual crawler IPs.
- [Bing AI Performance announcement](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) provides a measurement route once owner-authenticated Webmaster Tools access is available. No Search Console/Bing property, DNS, permission, analytics or IndexNow token was created or changed.

## What changes

Only root `index.html` head and `robots.txt` change; `sitemap.xml` is the only new public file. Total318 resources. V1 remains byte-identical, with both its existing noindex metadata/header and root canonical retained. Crawlers can retrieve V1's noindex instruction; it is not listed in the sitemap.

- Title: `Online Salsa & Bachata Dance Classes | Danzuni`.
- Description: `Online salsa, bachata and more with Danzuni by Social Dance TV. Learn at your own pace and start with a few questions about your dancing.`
- Existing canonical `https://go.danzuni.com/` preserved.
- Root robots meta explicitly allows indexing/following and large image previews.
- Open Graph and Twitter title, description, canonical URL and existing image metadata. Twitter uses `summary` for the near-square814×727 source photo, avoiding an implied wide crop. No new image generated or existing image modified.
- JSON-LD describes only WebSite and WebPage, connected by stable canonical IDs, language and real ImageObject dimensions. No invented legal company, address, rating, offer, course count, price, trial, SearchAction, alternate locale or social profile.
- Sitemap contains only the canonical root; no artificial lastmod/priority, V1, application, account or fragment URLs.

## Build / validation

```powershell
$env:LANDING_SEO_BASE='D:\codex-runs\danzuni-hero-onboarding-20260909\release-final'
$env:LANDING_RELEASE_DIR='D:\codex-runs\danzuni-seo-20260909\release'
node scripts/build-seo-release.mjs
node --test scripts/seo-release.test.mjs
```

Builder pins the317-resource manifest and checks all baseline files/config, rejects changed inputs and unsafe/nonempty output. First invocation stopped before output creation because an assertion expected two ending newlines in robots.txt; direct byte inspection confirmed one, and the expectation was corrected without weakening baseline hash checks. Final build produced root SHA256 `77e81732145200619a4535abac6bf8ff7c6d7df7caec95a1e830a0e36694463a`; V1 unchanged `3d8b08e1e6ebf4ee8464119740a65e233e899c9e4e461a9c178e7a9445316da5`.

Independent `node --test scripts/seo-release.test.mjs`: PASS11/11,0fail,0skip,exit0,63.33s. Actual baseline/output files hash-checked, body/head allowlist checked, real JPEG dimensions parsed, JSON graph/metadata/sitemap/crawler-policy contracts checked, and repeated build was verified to refuse nonempty output without modifying files or manifest. This is not an external search-engine indexing/rich-results acceptance test.

No visible design change means no new visual direction is proposed. The published hero screenshots remain valid for body layout; tests verify exact body bytes and all style/script/media bytes. Search engines' chosen titles, thumbnails and snippets cannot be asserted from source metadata alone.

## Important remaining content / owner gates

Root still carries historical testimonial/class-card content preserved from the approved old landing. Audit found repeated testimonial text under different names, all testimonial portrait alt strings `Jane Smith`, repeated class-card labels and unverified casting/switch-view/uniqueness claims. These are NOT evidence for new ratings or Course/Offer schema. They are deliberately not amplified in metadata. This needs content verification/correction before any claim of comprehensive search-quality readiness; V1 has already removed those testimonial and repeated-class sections. Do not silently promote V1 to root or remove old approved sections in a metadata-only release.

Next owner-authenticated gate: check/verify the exact domain in Google Search Console and Bing Webmaster Tools, submit this sitemap, inspect canonical indexing and current Google generative-AI inclusion settings, then use actual search/citation data. No automated “AI recommendation score” or SEO100/100 is claimed. Missing translation routes are why no hreflang is invented. Broader authoritative lesson/instructor content and validated product availability remain separate from these metadata corrections.

Rollback target: hero release `dpl_Gjf5EGHpZi8qK7Wtjv2KgCKiQibq`, `https://danzuni-dxjn81n8w-kirill-dancer-7625s-projects.vercel.app`. Application, payments, email, providers, database and their flags are untouched. Record actual test/deployment acceptance below after completion.

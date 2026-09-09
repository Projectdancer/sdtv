# Danzuni onboarding: read-only source review

Date: 2026-09-09. Scope: existing four-question onboarding, its circular recap,
and the account-creation handoff. No implementation or account submission.

## 1. Files and evidence inspected

Source worktree:
`D:\codex-worktrees\sdtv-learn\localization-unified-20260909`

Clean branch `codex/localization-unified-20260909`, inspected HEAD
`6f6ffe9a1b4fb67d9f1f4e3f2eb783bac21f6735`.

The inspected Signup, SurveyRadio, SurveyCheckbox and signupStore files have no
differences against cached `origin/main`
`861f6d57fe258a48466d5738243baad253368273` (2026-09-08). No fetch was performed;
this is not a claim about the latest remote head or deployed commit.

Read repository `AGENTS.md`, `docs/governance/owner-directive.md` and
`docs/governance/decisions/2026-08-21-danzuni-domain-migration.md`. Inspected
Signup components, questionnaire controls, shared Button, signupStore,
registration API mapping and bounded backend registration/recommended routes.

Live public assets were fetched into memory only. Matching implementation
snippets confirm the timer, reset, category identity, copy and hidden-input
findings below on the served application, without establishing full source to
deployment equivalence.

| Public asset | SHA-256 |
| --- | --- |
| `https://app.danzuni.com/assets/Signup-BxJ7H-Z1.js` | `875fec76f05cd15bbe4a261d97b1a841b240deab8bfe63307da9fcbc32d5f623` |
| `https://app.danzuni.com/assets/Signup-CtnoU6s2.css` | `27c465f665f85840186ce880dbe5b68ac026a308ab7da17df3380f71152ff988` |
| `https://app.danzuni.com/assets/Carousel-Cwf_rkDX.js` | `c8809483745a8ebade4e4bea96661cdf657a630b638764776e97613bd89ee36d` |

Frontend paths below are relative to
`D:\codex-worktrees\sdtv-learn\localization-unified-20260909\project-edu-dance-school-frontend-2a0ea2c4bcb2\src\app`.
Backend paths are relative to the inspected worktree root.

## 2. Confirmed stack

React SPA, React Router, MobX store, SCSS modules and
`react-circular-progressbar`. Existing Fastify/CommonJS backend and PostgreSQL
models. No framework or provider replacement is needed for the proposed repair.

## 3. Confirmed applications and repository boundaries

The landing and Learn application are independently deployed surfaces.
Onboarding belongs to `app.danzuni.com`, not `go.danzuni.com/v1`.
Publishing landing CTA corrections is not evidence of an onboarding release.

## 4. Current functionality

Actual source sequence:

1. `/signup/1`: experience.
2. `/signup/2`: goal.
3. `/signup/3`: interests, with a skip option.
4. `/signup/4`: lesson duration.
5. `/signup/5`: timed answer recap.
6. `/signup/6`: email/password registration.

Route selection: `containers/Signup/index.tsx:24-29`; router:
`index.tsx:65`.

### Confirmed source findings with corresponding live implementation

Severity expresses remediation priority, not a measured conversion impact.

| Priority | Finding | Source evidence |
| --- | --- | --- |
| P1 | Returning to question 1 resets all answers. The mount effect calls `resetForm()` rather than initializing only a new journey. | `containers/Signup/steps/Step1/index.tsx:16-19`; `stores/signupStore.ts:122-131` |
| P1 | Every interests card receives whether category ID **1** is selected, rather than whether its own category is selected. Component-local checked state masks the problem until remount/back. | `containers/Signup/steps/Step3/index.tsx:21-29`; `components/SurveyCheckbox/Checkbox/index.tsx:20-25` |
| P1 | Native radio and checkbox inputs use `display:none`, removing them from normal keyboard focus and the accessibility tree. Clickable labels are not keyboard substitutes. | `components/SurveyRadio/Radio/style.module.scss:65-67`; `components/SurveyCheckbox/Checkbox/style.module.scss:104-106` |
| P1: product truth | The recap claims “Generating Your Personal Schedule & Recommendations”, but performs no generation request. It increments by 25 every 1,000 ms, then waits another interval tick and timeout before redirecting, approximately six seconds total. | `containers/Signup/steps/Step5/index.tsx:18-41,54-55,71-73` |
| P1: verify access contract | The account form promises “start your free trial” unless a Groupon cookie exists. The claim is not conditioned on actual registration, access or payment availability. | `containers/Signup/steps/Step6/Form/index.tsx:46-48` |
| P2 | Refresh loses the questionnaire's in-memory state; later question routes return to question 1 when `isSignupStarted` is false. | `stores/signupStore.ts:58-80`; for example `containers/Signup/steps/Step3/index.tsx:18` |
| P2 | The account form resets `isSignupStarted` on mount, so returning to review answers can restart the flow. Back uses browser history, not explicit step navigation. | `containers/Signup/steps/Step6/Form/index.tsx:19-22`; `containers/Signup/Step/index.tsx:19,29,36` |
| P2 | No overall four-question progress indicator is exposed. `stepNumber` selects decoration rather than “Step x of 4”. | `containers/Signup/Step/index.tsx:16-48` |
| P2 | “Select one option” is hardcoded even for multi-select interests. | `containers/Signup/Step/index.tsx:42` |
| P2 | The recap labels duration as “Your Experience”. The 15-45-minute option says “I want to learn how to freestyle”, which describes a goal, not duration. | `containers/Signup/steps/Step5/index.tsx:114-115`; `containers/Signup/steps/Step4/index.tsx:22` |

### Additional source accessibility and layout findings

- Each answer title is an `h1`: `components/SurveyRadio/Radio/index.tsx:24`
  and `components/SurveyCheckbox/Checkbox/index.tsx:33`.
- No local question-route focus management or progress live-region was found
  in the inspected onboarding components. Mobile Back has no explicit
  accessible name in its invocation or shared Button contract:
  `containers/Signup/Step/index.tsx:29`, `components/Button/index.tsx:9-23,51-55`.
  Actual screen-reader behavior has not been tested.
- No reduced-motion rule exists in the served onboarding stylesheet.
  The circular progress uses `pathTransitionDuration: 0.5`; Step5 offers no
  animation skip or manual Continue action.
- Probable tablet layout issue: Step5 uses fixed width 882px above the 768px
  breakpoint, creating a possible overflow zone at 769-881px. Source:
  `containers/Signup/steps/Step5/style.module.scss:3-16`.
  This requires visual confirmation and is not reported as a proven live
  overflow.

## 5. Current database and providers

The actual registration submission occurs in Step6:
`stores/signupStore.ts:157-175` and `api/index.ts:153`, using `POST /register`.

The existing payload contains email, password, normalized experience level,
goals, preferred duration, categories and invite code.

Backend source `dance-api-master/app/routes/authRoutes.js:143-162` creates the
user and selected category/goal relationships transactionally. Verification
email is separately gated at line 165. No live registration or provider state
was probed by this review.

Source-only corroboration: the `/recommended` route in
`dance-api-master/app/routes/classRoutes.js:987-1005` reads browsable classes
without preference filtering in the inspected implementation. This further
limits the evidence for the personalized-generation claim. No live backend
equivalence was established, and no absence across all recommendation paths is
claimed.

## 6. Preserved components

Preserve the four questions and their field/ID mappings, radio versus
multi-select behavior, “I don't know any styles” skip path, account/login/terms
destinations, auth/API contracts and provider gates. Retain the existing
application rather than introducing another onboarding engine.

## 7. Required minimal repairs

Repair answer preservation/back behavior, category selection identity, keyboard
controls and misleading wording before adding decorative motion. These issues
affect the journey itself and are not solved by a more elaborate loader.

## 8. Proposed changes

These are proposed interactions, not implemented or validated conversion
results.

- Add a four-segment progress header, for example “Step 2 of 4 · Your goal”.
  Advance it when a real answer is completed, not on a timer.
- Use a consistent question shell, stable Next action and selected state that
  does not move the layout.
- Retain native inputs, visually hiding them without `display:none` where
  appropriate. Provide focus-visible feedback and properly labelled groups.
- Keep answers on Back. If refresh persistence is added, use versioned
  session-scoped storage for non-sensitive questionnaire fields only; never
  persist email, password or JWT as part of a questionnaire draft.
- Replace the six-second simulated generation with an honest review of the
  four choices. A short staged reveal may last approximately 0.6-1 second,
  but Continue should be available without waiting for it.
- Possible honest title: “Your dance preferences, together.” Keep all four
  actual answers readable and individually editable.
- If a circular composition remains, let its four segments represent the
  four completed answers, not a simulated computational percentage.
- Use “Create my account” for the handoff to the existing Step6 form, keeping
  Log in available for existing users.
- Reduced-motion mode should display the final state immediately, with the
  same functionality and without orbit, scale or pulse effects.
- During actual registration network work, use a truthful pending state,
  prevent duplicate submissions and preserve error recovery. Do not substitute
  another fixed promotional timer.
- Use neutral account-creation wording until the trial/access promise is
  verified against the current commercial contract.

## 9. Percentage of preservation

Not measured. This audit changes no implementation.

## 10. Files changed

This report only. No Learn source file was changed. The inspected Learn
worktree remained clean.

## 11. Tests run

- PASS: read-only source inspection and comparison of inspected files against
  cached `origin/main`.
- PASS: in-memory public bundle/hash inspection confirming the listed live
  timer, reset, selection, copy and hidden-input implementations.
- NOT RUN: build, unit suites, browser suites or registration tests; this is a
  bounded read-only audit. Visual journey evidence is recorded separately by
  the main audit.

Existing tests found cover route/chunk existence rather than questionnaire
behavior: `browser-parity/specs/route-chunk-coverage.spec.js:51` and frontend
`test/routeContract.test.js:51`. This is a bounded discovery result, not proof
that no other test exists anywhere in the repository.

## 12. Data impact

None. This source-review subtask submitted no answers or forms, accessed no
database and created no account.

## 13. Security impact

None. No secrets were inspected. Any proposed questionnaire draft persistence
must exclude sensitive authentication fields.

## 14. Payment impact

None. No provider flags, pricing or payment behavior changed. The free-trial
wording requires separate product-truth verification.

## 15. Rollback

No runtime rollback applies to this audit. A future onboarding frontend change
must have a release and rollback independent of landing and backend work.

## 16. Unknowns

The live deployed SHA, registration permissions/access outcome, email delivery,
genuine end-to-end personalization, screen-reader behavior, real-device
behavior and potential tablet overflow were not established by this subtask.
Matching public snippets confirm specific implementation findings, not full
application parity or readiness.

## 17. Owner gates

The current request asks for modernization analysis. Onboarding implementation
and production release are separate from landing CTA corrections. Registration
tests, database/provider writes, trial changes, email and production
application release were not executed or inferred as authorized by this
read-only review.

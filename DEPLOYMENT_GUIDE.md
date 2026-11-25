# ClerFit R3 — Deployment and production verification

## Current release baseline

- Repository: https://github.com/clerfit/Clerfit
- Existing public URL: https://clerfit.github.io/Clerfit/
- Current calculator registry: **164 routes**.
- Latest automated candidate checked: `64541b272527255d8a9a62c063a8c4397808912c`.
- Automated Phase 1/2, formula-regression and Phase 6 package workflows passed on that candidate.
- Production has **not** been intentionally deployed or modified by this verification work.

## What the repository workflows do

- `.github/workflows/phase-one-ci.yml` runs source, formula, browser, responsive and accessibility verification. It builds a staging copy; it does not publish that copy.
- `.github/workflows/verify-production.yml` checks the already-published GitHub Pages site after qualifying changes reach `main`. It is a verifier, not a deployment workflow.
- `.github/workflows/clerfit-r3-full-release.yml` is explicitly disabled with a fail-closed job condition. It reconstructs an old 118-calculator transfer archive and must not be re-enabled for the current 164-calculator release.
- There is no active GitHub Pages publishing workflow in `.github/workflows/` on the current main branch. The actual Pages source setting is an account/repository setting and was not inspected or changed here.

Do not assume that merging a pull request publishes the website. Confirm the repository's Pages source setting and the approved release procedure before any production action.

## Hosting and security headers

- Root `_headers` and `netlify.toml` define headers for hosts that support those configuration formats, including Netlify. GitHub Pages does not apply the Netlify configuration or the root `_headers` file as custom response headers.
- If the production host remains GitHub Pages, do not claim that the configured CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy or cache rules are active without capturing the actual live HTTP response headers.
- If those headers are a release requirement, use an approved host or proxy that can emit them (for example, Netlify or Cloudflare Pages/Worker), validate the response headers there, and only migrate production with explicit owner approval.

## Build and staging verification

Run from the repository root:

```bash
node scripts/build-site.js
node scripts/verify-staging.js
node scripts/verify-production.js https://clerfit.github.io/Clerfit/
```

The first two commands build and verify a local production staging directory. The last command checks the currently published site; it does not deploy changes. The verifier's route inventory must remain aligned with all 164 registered calculator routes.

## Contact form

The automated suite verifies successful and failed Formspree responses using mocks. That proves local handling behavior, not that the live Formspree endpoint is authorized or that a real message reaches the intended inbox. Record any owner-confirmed delivery separately; do not represent a mocked test as a live delivery test.

## Release controls

1. Review the exact commit and the attached Phase 1/2 browser, responsive and accessibility artifacts.
2. Confirm the 164-route registry, formula/method register and field-boundary inventory are aligned.
3. Keep empirical estimates and site-defined ratios clearly distinguished from clinical measurements or validated diagnoses. The YMCA body-fat method remains identified as a rough estimate; retain a brief practical caution rather than presenting it as a definitive result.
4. Obtain any required independent subject-matter review and record the exact SHA reviewed. No external clinician/subject-matter-expert certification is implied by the automated tests.
5. Complete any required manual keyboard, screen-reader, zoom/reflow, physical-device and live contact-delivery acceptance.
6. Obtain explicit owner approval before changing hosting, Pages settings, domain, or production content.
7. After an approved deployment, run the production verifier against the exact public URL and capture actual response headers and deployed SHA.


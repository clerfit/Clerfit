# ClerFit — Deployment and final verification

## Included deployment paths

### GitHub Pages (existing project URL)

The repository has previously been published at `https://clerfit.github.io/Clerfit/`. The workflow at `.github/workflows/pages.yml` is configured to:

1. Run JavaScript syntax checks, the regression suite, route registry checks, the sitemap path test and contact-form mocked success/failure tests.
2. Stage the production website into `dist/`, generate canonical URLs and `sitemap.xml`, and preserve the `/Clerfit` project-site path.
3. Deploy the project through GitHub Pages when changes are pushed to `main` or `master`, or when the workflow is manually dispatched.

For the workflow to run, the files must be pushed to the repository and GitHub repository settings must have **Pages → Build and deployment → Source: GitHub Actions**. This archive cannot change repository settings or push commits because no repository write credential is available in this environment.

### Netlify

`netlify.toml` runs `node scripts/build-site.js` and publishes `dist/`, so audit reports and test source files are not part of the public website. Netlify provides the configured `_headers` rules. On Netlify, the `URL` environment variable is used automatically; for another host set `SITE_URL` to the exact canonical site base URL.

## After the first deployment

Run:

```bash
node scripts/verify-production.js https://clerfit.github.io/Clerfit/
```

Replace the URL if using another host. The script checks the homepage, contact page, sitemap, robots file, 404 page and all 118 registered calculator routes, and writes `PRODUCTION_SMOKE_REPORT.json`.

The live contact form should be tested with a consented message. The local suite mocks successful and failed Formspree responses, but cannot establish that Formspree has authorized the endpoint or that the message reaches the intended inbox.

## Why production is not marked verified inside this archive

This environment has no repository write credential, no configured hosting account credential and no ability to resolve the public host from the local shell. Therefore it cannot publish the files or honestly report the new production version as live. The GitHub Pages workflow automates deployment after the archive is integrated into the repository and the Pages source is enabled.

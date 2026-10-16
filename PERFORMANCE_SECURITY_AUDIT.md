# ClerFit R3 — Local Performance, Privacy and Security Audit

Audit date: 2026-10-16. Scope: source package and generated `dist/` build; not live-host measurements.

## Results

- Registered calculator routes: 118.
- Static HTML source documents scanned: 127.
- Source pages missing meta description or theme-color: 0.
- Emoji matches in user-facing page source: 0.
- Embedded analytics/tag-manager script matches: 0.
- Browser storage/cookie APIs in user-facing page source: 0.
- External script tags in user-facing pages: 0.
- Generated production files: 158; aggregate uncompressed size: 1,741,058 bytes (1.66 MiB).
- No third-party JavaScript script URLs were found in user-facing page source. The contact form sends submitted messages to Formspree after the required acknowledgement; that is a third-party data transfer and is disclosed in the privacy notice.

## Largest generated files (uncompressed)

- `logo.png` — 181,736 bytes
- `css/style.css` — 75,861 bytes
- `logo resized.png` — 63,479 bytes
- `logo.jpeg` — 31,324 bytes
- `js/navigation.js` — 30,244 bytes
- `allmorph.jpg` — 23,473 bytes
- `html/relative-strength.txt` — 19,334 bytes
- `js/advanced-calculators.js` — 19,173 bytes
- `js/engine.js` — 17,829 bytes
- `sitemap.xml` — 16,796 bytes


## Privacy posture

- Calculator fields/results are processed in the browser by the shipped page code; the source does not intentionally save them to localStorage, sessionStorage, IndexedDB, cookies, or sendBeacon.
- Google Analytics and Google Tag Manager script references are absent from the user-facing source scan.
- Contact form data is intentionally sent to Formspree only on submission. Hosting providers may still process access logs, IP addresses, request metadata and security telemetry; therefore ClerFit does not claim “no data of any kind is processed.”
- No consent cookie/storage is required for calculator use because no analytics opt-in is implemented in this release. The contact form requires acknowledgement before submission.

## Security configuration

- HTML pages include a restrictive baseline CSP meta policy, `object-src 'none'`, `base-uri 'self'`, `form-action` constrained to the site and Formspree, and `upgrade-insecure-requests`.
- `_headers` and `netlify.toml` configure CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and X-Frame-Options for hosts that support these configuration files.
- **Hosting caveat:** GitHub Pages does not apply Netlify `_headers` or `netlify.toml` header rules. If deployment remains on GitHub Pages, server response headers such as HSTS and X-Frame-Options cannot be confirmed or enforced from this repository alone; a CDN/proxy or host with custom-header support is needed. CSP meta tags do not replace all response headers, and `frame-ancestors` is not enforced from a meta CSP.
- Inline scripts remain in legacy calculator pages, so CSP still permits `'unsafe-inline'`. A stronger nonce/hash CSP would require refactoring inline scripts or generating hashes for the exact deployed HTML. This is recorded as a hardening opportunity, not represented as complete.

## Performance conclusions

The generated build size is a static asset inventory, not a real-world performance score. Actual first-contentful paint, largest-contentful paint, interaction latency, compression, caching, weak-network behavior and server response time depend on the deployed host and browser. No production network throttling measurement is claimed in this report. Previously recorded browser QA reports in the package are retained as historical evidence; they are not presented as a fresh run against the current final edits.

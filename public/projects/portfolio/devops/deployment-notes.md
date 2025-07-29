# Deployment Notes

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

## Production Environment

**Platform:** Netlify
**Live URL:** https://festus-olaleye-ayomikun.netlify.app
**Deployment method:** Continuous deployment from the `main` branch of the GitHub repository.

---

## Netlify Configuration

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 (set via `NODE_VERSION` environment variable in Netlify UI) |
| Deploy triggers | Every push to `main` |

**No `netlify.toml` is required.** All configuration is managed in the Netlify UI. A `_redirects` file is not needed because the portfolio uses scroll-based navigation (no client-side routing; all requests serve `index.html` directly).

---

## Environment Variables

The following variables must be set in the Netlify UI under **Site settings → Environment variables**. They must also be added to GitHub Actions Secrets for CI builds.

| Variable | Purpose |
|----------|---------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS email template identifier |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public API key |

**Security:** These keys are client-side and will be bundled into the JS output (this is expected for EmailJS). They are not server-side secrets. Never commit them to source control.

---

## Rollback Procedure

1. In the Netlify dashboard, navigate to **Deploys**.
2. Locate the last known good deployment.
3. Click **Publish deploy** to instantly revert production to that build.

Rollback is instant. No re-build is required because Netlify retains all previous build artefacts.

---

## Preview Deployments

Netlify automatically creates a preview URL for every pull request when the GitHub integration is enabled. Each preview is independent and uses the same environment variables as production. This allows UI review before merging to `main`.

**To enable:** Connect the GitHub repository in Netlify UI → Build & deploy → Continuous deployment → GitHub integration.

---

## DNS and CDN

Netlify provides global CDN distribution automatically. The `dist/` assets (`index.html`, JS, CSS, images) are served from edge nodes closest to the visitor. No additional CDN configuration is required.

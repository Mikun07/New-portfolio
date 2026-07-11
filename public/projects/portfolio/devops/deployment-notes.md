# Deployment Notes

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11

## Production Environment

| Item | Value |
|------|-------|
| Platform | Netlify |
| Live URL | https://festus-olaleye-ayomikun.netlify.app |
| Deployment method | Continuous deployment from `main` |
| Config file | `netlify.toml` |

## Netlify Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22.12.0"
```

## Environment Variables

Set these values in Netlify site environment variables and in GitHub Actions secrets:

| Variable | Purpose |
|----------|---------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS email template identifier |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

These identifiers are bundled into the client application by Vite. They are not server-side secrets, but they should still be managed through environment configuration rather than hardcoded source values.

## Rollback Procedure

1. Open the Netlify dashboard.
2. Navigate to the site deploy history.
3. Select the last known good deploy.
4. Publish that deploy.

Netlify keeps previous deploy artifacts, so rollback does not require rebuilding the site.

## Preview Deployments

When GitHub integration is enabled, Netlify can create deploy previews for pull requests. Preview deployments should use the same EmailJS environment variables as production unless a separate test EmailJS service is configured.

## Deployment Verification

After deployment, verify:

- The live URL loads.
- Navigation reaches all six sections.
- Theme toggle works.
- Language picker works.
- Project links open expected targets.
- Contact form shows success or failure feedback.
- Browser console contains no production errors.

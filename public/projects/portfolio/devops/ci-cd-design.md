# CI/CD Design

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11

## Pipeline Overview

The GitHub Actions workflow runs on every push and pull request to `main`.

```text
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

**Workflow file:** `.github/workflows/ci.yml`

## Runtime

| Setting | Value |
|---------|-------|
| Runner | `ubuntu-latest` |
| Node.js | `22.12.0` |
| Package manager | npm |
| Install command | `npm ci` |

Node `22.12.0` is used because the current Vite React plugin requires Node `^20.19.0` or `>=22.12.0`. CI and Netlify use the same runtime to reduce environment drift.

## Quality Gates

| Gate | Command | Purpose |
|------|---------|---------|
| Type check | `npm run typecheck` | Validate TypeScript contracts |
| Lint | `npm run lint` | Enforce code quality with zero warnings |
| Test | `npm test` | Validate reducer behavior |
| Build | `npm run build` | Confirm production bundle generation |

## Environment Variables

The build step receives EmailJS values through GitHub Actions secrets:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

The tests do not require these variables because the current automated coverage tests pure reducer logic.

## Deployment Flow

Netlify deploys the site from the `main` branch using `netlify.toml`.

| Netlify setting | Value |
|-----------------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22.12.0` |

## Design Decisions

| Decision | Reason |
|----------|--------|
| `npm ci` in CI | Reproducible install from `package-lock.json` |
| Separate typecheck gate | Vite does not perform full TypeScript checking during build |
| Single serial job | The project is small, and serial gates provide readable failure order |
| Netlify for deployment | Static hosting fits the frontend-only scope |

## Learning Concept

**GitHub Actions** is the selected CI/CD concept. It improves project reliability by making validation repeatable on every pull request and push to `main`.

# Software Risk Assessment

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11
**Role:** Risk Analyst

## Risk Context

The portfolio is a public static frontend deployed to Netlify. The most important assets are professional credibility, project evidence, contact availability, downloadable documents, and public repository safety.

## Risk Register

| ID | Risk | Probability | Impact | Severity | Mitigation | Residual risk |
|----|------|-------------|--------|----------|------------|---------------|
| R-001 | Contact form fails because EmailJS is unavailable or misconfigured | Medium | Medium | Medium | Error toast, documented environment variables, Netlify env setup | Medium |
| R-002 | Secrets are committed to source control | Low | High | High | `.gitignore`, `.env.example`, documentation, publication review | Low |
| R-003 | Documentation drifts from source code | Medium | Medium | Medium | Compliance audit, traceability matrix, release notes | Medium |
| R-004 | CI fails because Node versions differ between local, CI, and Netlify | Medium | High | High | Node `22.12.0` documented in README, CI, Netlify config, package engines | Low |
| R-005 | Translation files become inconsistent | Low | Medium | Medium | Type-safe locale files based on `en.ts` schema | Low |
| R-006 | Accessibility regression blocks keyboard users | Medium | High | High | WCAG requirements, semantic controls, planned E2E and accessibility checks | Medium |
| R-007 | Public project documents expose sensitive data | Low | High | High | Manual review before adding files under `public/projects` | Low |
| R-008 | Large document assets increase load size | Medium | Low | Low | PDFs are linked from `public/`; core bundle remains separate | Low |

## Risk Matrix

| Severity | Risks |
|----------|-------|
| High | R-002, R-004, R-006, R-007 |
| Medium | R-001, R-003, R-005 |
| Low | R-008 |

## Mitigation Plan

- Run CI before every merge.
- Keep `.env.local` untracked and use `.env.example` for documentation.
- Update `CHANGELOG.md` and relevant docs with every release.
- Add browser-based E2E and accessibility checks in v1.1.0.
- Review all files added to `public/` for private data.

## Residual Risk Decision

The remaining risks are acceptable for a static portfolio. The highest remaining operational risk is third-party email delivery, which is communicated through user-facing error handling and documented as a known limitation.

# Security Engineering Report

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11
**Role:** Security Engineer

## Asset Identification

| Asset | Sensitivity | Protection |
|-------|-------------|------------|
| EmailJS identifiers | Public client-side identifiers | Stored in environment variables, not committed |
| Contact form data | Personal data submitted by visitor | Sent directly to EmailJS, not persisted by this app |
| CV and certificates | Public portfolio documents | Stored under `public/` intentionally |
| Source code | Public | Reviewed before publication |
| Deployment configuration | Low sensitivity | `netlify.toml`, GitHub Actions |

## Threat Model

| STRIDE category | Threat | Control |
|-----------------|--------|---------|
| Spoofing | Visitor submits false identity in contact form | Email validation, no trust decision based only on submission |
| Tampering | User manipulates form payload | EmailJS receives client payload; no privileged operation exists |
| Repudiation | Sender denies sending a message | No legal audit trail because the app is not a transactional system |
| Information disclosure | Secrets committed or exposed in errors | `.env.example`, `.gitignore`, no stack traces in UI |
| Denial of service | Repeated form submissions | Submit button disabled during send; EmailJS limits apply |
| Elevation of privilege | Client-side state modified | No privileged roles or backend access exist |

## Attack Surface

- Public HTML, CSS, JavaScript, and static assets.
- External links to GitHub, LinkedIn, live projects, and downloadable documents.
- Contact form submitted through EmailJS.
- Markdown-to-PDF download flow for project governance documents.

## Security Controls

| Control | Implementation |
|---------|----------------|
| Secret handling | `.env.local` ignored; `.env.example` documents required variables |
| External links | `target="_blank"` links use `rel="noreferrer"` |
| Form validation | Required fields and email input type |
| Dependency review | `npm install --package-lock-only` audit reported 0 vulnerabilities |
| CI validation | Typecheck, lint, tests, build |
| Sensitive data review | Public documents are intentional portfolio assets |

## Secure Coding Requirements

- Do not commit `.env.local`, API keys, tokens, or private certificates.
- Keep external service calls isolated in `src/infrastructure`.
- Keep user-facing errors safe and non-technical.
- Review markdown document rendering because content is inserted into a detached DOM container for PDF generation.

## Security Testing Strategy

| Test | Current status | Planned improvement |
|------|----------------|--------------------|
| Dependency audit | Manual npm audit during install metadata update | Add scheduled CI audit |
| Secret scan | Manual repository review | Add automated secret scanning |
| Link safety | Code review | Add lint rule or test coverage for external link attributes |
| Contact form abuse | Basic submit disable | Add rate limiting only if a backend is introduced |

## Readiness Decision

No critical security issue is known for the current static frontend scope. Security posture must be reviewed again if the project adds authentication, server-side storage, or a custom backend.

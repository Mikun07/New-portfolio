# Software Architecture Report

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11
**Role:** Software Architect

## Architectural Drivers

| Driver | Priority | Reason |
|--------|----------|--------|
| Maintainability | High | Single-maintainer portfolio must remain understandable |
| Performance | High | First impression depends on fast load and interaction |
| Accessibility | High | Public portfolio must support keyboard and assistive technology use |
| Testability | Medium | Core state transitions and future flows need regression coverage |
| Security | Medium | Public repo must avoid secrets and unsafe links |
| Scalability | Low | Static portfolio has limited runtime scaling needs |

## Architecture Style

The selected style is a layered single-page React application. The application is statically built with Vite and deployed to Netlify.

## Options Considered

| Option | Outcome | Reason |
|--------|---------|--------|
| Scroll-based SPA | Selected | Matches portfolio reading flow and keeps deployment simple |
| Multi-route SPA | Rejected for now | Project detail routes are not required in v1.0.0 |
| Server-rendered app | Rejected for now | Server runtime adds operational complexity without current requirement |
| Custom backend | Rejected for now | EmailJS covers the contact flow without persistent storage |

## Component Architecture

| Layer | Responsibility |
|-------|----------------|
| `core` | App-wide providers |
| `features` | Portfolio section rendering |
| `shared` | Reusable UI |
| `infrastructure` | External service boundaries |
| `i18n` | Translation data |

## Data Architecture

The application uses static source data, local storage preferences, and EmailJS delivery. It does not own a database.

## Cross-Cutting Concerns

| Concern | Strategy |
|---------|----------|
| Theme | `ThemeProvider` and CSS variables |
| Locale | Type-safe translation files and `LanguageProvider` |
| Notifications | `ToastProvider` |
| Email | `emailService.ts` infrastructure boundary |
| Documents | Static docs under `docs/` and `public/projects/` |
| CI | GitHub Actions quality gates |

## Architecture Decision Records

Existing ADRs document:

- Scroll-based SPA.
- CSS custom properties for theming.
- Context API for global state.
- `useReducer` for the contact form.
- Type-safe i18n.
- Layered folder structure.

## Testability Assessment

The contact reducer is separated from the component and tested directly. Provider and E2E tests are planned for the next minor release.

## Maintainability Assessment

The architecture has low runtime complexity and clear source boundaries. The main maintainability risk is documentation drift, which is managed through the compliance audit and traceability matrix.

## Interview Readiness

The architecture can be defended as the simplest structure that satisfies the portfolio requirements while still demonstrating separation of concerns, typed contracts, CI gates, and documented trade-offs.

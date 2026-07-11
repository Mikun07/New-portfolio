# Frontend Engineering Report

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11
**Role:** Frontend Engineer

## Frontend Requirements

The frontend must present six portfolio sections, support responsive navigation, persist theme and language preferences, display project evidence, and provide a contact workflow with visible success and failure states.

## User Flow Summary

| Flow | Entry | Success outcome | Failure handling |
|------|-------|-----------------|------------------|
| Review identity | Home section | Visitor sees name, role, location, CV CTA | Content remains static if scripts load slowly |
| Review experience | Navbar or scroll | Visitor reads skills and experience | Responsive layout preserves access |
| Inspect projects | Projects section | Visitor opens repo, live link, or docs | Missing live link is hidden |
| Send message | Contact section | Success toast and form reset | Error toast if EmailJS fails |
| Change language | Language picker | Locale updates and persists | TypeScript prevents missing keys |
| Change theme | Theme button | Theme updates and persists | OS preference used on first visit |

## Information Architecture

The interface is a single scroll-based page:

1. Home
2. About
3. Experience
4. Services
5. Projects
6. Contact
7. Footer

The navbar provides direct access to each major section.

## Component Strategy

| Component | Responsibility |
|-----------|----------------|
| `Navbar` | Theme, language, and section navigation |
| `ProjectCard` | Project presentation, links, docs dropdown, description toggle |
| `LanguagePicker` | Locale selection |
| `ScrollToTop` | Return to top after scrolling |
| `Footer` | Copyright and site footer |
| `Contact` | Contact details and form submission |

## State Management

| State | Owner | Reason |
|-------|-------|--------|
| Theme | `ThemeProvider` | Shared across app and persisted |
| Locale | `LanguageProvider` | Shared across all visible text |
| Toasts | `ToastProvider` | Cross-cutting notification state |
| Contact form | `formReducer` | Explicit transitions and direct unit testing |
| Docs dropdown | `ProjectCard` local state | Local interaction only |

## API Integration

The only external API is EmailJS. The integration is isolated in `src/infrastructure/email/emailService.ts`, and the UI depends on a typed `EmailPayload` contract.

## Accessibility Strategy

- Interactive controls use buttons or anchors according to behavior.
- Icon-only controls have `aria-label` where needed.
- Form fields use visible labels.
- External links use safe attributes.
- Keyboard navigation is required for core flows.

## Responsive Strategy

The layout supports mobile, tablet, desktop, and wide desktop. Navigation collapses into a drawer on smaller screens. Project cards use a responsive grid.

## Performance Strategy

- Static hosting through Netlify.
- Vite production build.
- PDF generation dependencies are loaded on demand through dynamic imports when a visitor downloads a markdown document as PDF.
- No route-level JavaScript split is needed for the current single-page scope.
- Lighthouse CI is planned for enforceable thresholds.

## Frontend Security Review

- No backend authorization decisions are made in the frontend.
- No secrets are stored in source.
- Contact fields use browser validation.
- Markdown-to-PDF rendering must only use trusted repository documents.

## Testing Strategy

Current automated coverage validates the contact reducer. Planned coverage includes component tests for providers and browser E2E tests for navigation, contact form, theme, and language behavior.

## Readiness Decision

Frontend design and implementation are ready for the current scope. The next quality improvement is browser-level coverage for critical visitor journeys.

# Ayomikun Festus-Olaleye Developer Portfolio

Ayomikun Festus-Olaleye Developer Portfolio is a React and TypeScript portfolio designed to help recruiters, technical interviewers, and collaborators evaluate my software engineering work through project evidence, experience, downloadable documents, and a contact workflow.

**Live site:** https://festus-olaleye-ayomikun.netlify.app

**Repository status:** Maintained portfolio project, version `1.0.0`

## Features

- Single-page portfolio with Home, About, Experience, Services, Projects, and Contact sections.
- Responsive layout for mobile, tablet, desktop, and wide desktop viewports.
- Light and dark theme support persisted with `localStorage`.
- Five-language interface: English, German, French, Dutch, and Swedish.
- Project cards with repository links, live links, expandable descriptions, and downloadable governance documents.
- Contact form using EmailJS with success and error toast notifications.
- Type-safe translation structure enforced by TypeScript.
- GitHub Actions CI pipeline for type checking, linting, testing, and production build validation.

## Technology Stack

| Area | Technology |
|------|------------|
| UI | React 18, TypeScript, Tailwind CSS |
| Build | Vite 6 |
| State | React Context, `useReducer` |
| Forms | HTML5 validation, EmailJS |
| Documents | marked, html2canvas, jsPDF |
| Testing | Vitest, Testing Library |
| CI/CD | GitHub Actions, Netlify |

## Architecture Overview

The source code uses a layered frontend structure so responsibilities remain visible:

```text
src/
|-- core/providers/        App-wide providers for theme, language, and toast state
|-- features/              Portfolio sections grouped by user-facing feature
|-- shared/components/     Reusable UI components
|-- infrastructure/email/  EmailJS integration boundary
|-- i18n/translations/     Locale files and translation schema
|-- test/                  Vitest test setup and unit tests
|-- types/                 Shared type re-exports
```

The architecture avoids backend or database ownership in this repository. Email delivery is delegated to EmailJS through a typed infrastructure wrapper.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22.12.0 or newer |
| npm | 10 or newer |

## Getting Started

```bash
git clone https://github.com/Mikun07/New-portfolio.git
cd New-portfolio
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Variables

The contact form uses EmailJS. Create `.env.local` from `.env.example` and provide these values:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

These values are client-side EmailJS identifiers. Do not commit `.env.local`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Run TypeScript with `tsc --noEmit` |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm test` | Run Vitest unit tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Quality Gates

The CI workflow runs on every push and pull request to `main`:

```text
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

The current automated test suite validates the contact form reducer used by `Contact.tsx`.

## Deployment

The portfolio is deployed on Netlify.

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22.12.0` |
| Live URL | https://festus-olaleye-ayomikun.netlify.app |

EmailJS variables must be configured in the Netlify site environment.

## Documentation

Governance artifacts are stored in `docs/`:

- `docs/requirements/`: requirements, user stories, acceptance criteria, traceability, and readiness review.
- `docs/architecture/`: architecture report and architectural decision records.
- `docs/design/`: module catalog, interface specifications, and design decision records.
- `docs/frontend/`: frontend engineering strategy.
- `docs/implementation/`: implementation plan and coding standards.
- `docs/quality/`: test strategy, quality gates, and metrics.
- `docs/security/`: threat model and security controls.
- `docs/risk/`: risk register and mitigation plan.
- `docs/devops/`: CI/CD, deployment, and operational readiness.
- `docs/github/`: repository publication readiness review.
- `docs/governance/`: framework compliance audit.

## Known Limitations

- The portfolio is a static frontend. There is no custom backend, database, server-side session handling, or server-side audit trail.
- Email delivery depends on EmailJS availability and browser network access.
- End-to-end browser tests and Lighthouse CI are planned for a later minor version.
- Section URLs are not deep-linked because the project uses scroll-based navigation.

## Future Improvements

- Add Playwright or Cypress tests for the main visitor journeys.
- Add Lighthouse CI thresholds for performance and accessibility.
- Add component tests for theme switching, language switching, and the contact form.
- Add project detail routes if long-form case studies become part of the portfolio.

## License

All rights are reserved. Public access is provided for portfolio review and technical evaluation only. See [LICENSE](LICENSE).

## Author

**Ayomikun Festus-Olaleye**

- GitHub: [@Mikun07](https://github.com/Mikun07)
- LinkedIn: [ayomikun-festus-olaleye](https://www.linkedin.com/in/ayomikun-festus-olaleye-bab137249/)
- Portfolio: https://festus-olaleye-ayomikun.netlify.app

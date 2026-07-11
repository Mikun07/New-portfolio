# Portfolio Project Overview

## What This Project Is

Ayomikun Festus-Olaleye Developer Portfolio is a governed React and TypeScript portfolio site. It is designed to help recruiters, technical interviewers, and collaborators evaluate professional identity, experience, project work, engineering evidence, downloadable documents, and contact availability from one public interface.

The project is a frontend-only application deployed as a static site on Netlify.

* `src/` contains the React application, organized by app-wide providers, user-facing features, reusable components, external service boundaries, translations, tests, and shared types.
* `docs/` contains the authored engineering and governance documentation.
* `public/projects/` contains downloadable project documents exposed through the portfolio UI.
* `public/` also contains public assets such as the resume, cover letter, certificates, and logo files.

The site does not own a custom backend or database. Contact messages are sent through EmailJS, and visitor preferences such as theme and language are stored in the visitor's browser.

## The Problem It Solves

A portfolio is often reviewed under time pressure. A recruiter may need to confirm role fit quickly, while a technical interviewer may need evidence that the candidate can make sound architecture, testing, security, and delivery decisions. Traditional portfolios can make this difficult when project summaries are vague, engineering documents are missing, repository links are scattered, or contact paths are unclear.

This portfolio solves that problem by treating the site as both a public profile and an engineering evidence package. It presents identity, skills, experience, projects, project documentation, live links, repository links, and a contact workflow in one responsive single-page application. The governance documents make the work easier to discuss in interviews because the project explains not only what was built, but why specific technical trade-offs were made.

## Who Uses It

The portfolio has three primary user groups.

| User | Goal | What the site gives them |
| --- | --- | --- |
| Recruiter | Assess fit quickly | Name, role, location, CV, skills, experience, project summaries, and contact details |
| Technical interviewer | Evaluate engineering depth | Architecture reports, ADRs, requirements, test strategy, security notes, CI/CD notes, and repository links |
| Collaborator or client | Decide whether to start a conversation | Services, examples of work, live project links, social links, and a contact form |

There is also one internal stakeholder: the site owner. The owner needs the codebase to remain maintainable as the portfolio grows, while keeping public documents safe to publish.

## Core Product Concepts

### Portfolio Sections

The application is a scroll-based single-page portfolio. The major sections are:

| Section | Purpose |
| --- | --- |
| Home | Introduces the candidate, role, location, core stack, profile image, and primary calls to action |
| About | Summarizes background, skills, education, and certifications |
| Experience | Presents professional experience as a structured timeline |
| Services | Shows services or collaboration areas the candidate can offer |
| Projects | Displays portfolio projects with technology tags, repository links, live links, and downloadable documents |
| Contact | Provides direct contact details, social links, and the EmailJS-powered message form |

The navigation uses `react-scroll` rather than a client-side router. This matches the current content model: the portfolio is meant to be read as a guided narrative rather than as a set of independent product pages.

### Projects

A project is represented in `src/features/projects/Projects.tsx` as typed data passed into reusable `ProjectCard` components. Each project can include:

| Field | Meaning |
| --- | --- |
| `title` | Display name of the project |
| `subtitle` | Project category or label |
| `description` | Long-form project summary with a read-more toggle when needed |
| `tags` | Technology and practice tags |
| `github` | Repository URL |
| `href` | Optional live site URL |
| `docs` | Optional list of downloadable project documents |
| `featured` | Optional badge for highlighted projects |

The portfolio currently highlights multiple projects, including ReqSmell, MikunAir, MikunStore, CineVault, and the portfolio itself. The Developer Portfolio project card is also used as a documentation hub for this repository.

### Governance Documents

The portfolio includes formal documentation for requirements, architecture, design, frontend engineering, backend scope, database scope, quality, security, risk, SEO, DevOps, release notes, and interview preparation.

There are two locations for these documents:

| Location | Purpose |
| --- | --- |
| `docs/` | Source documentation maintained with the repository |
| `public/projects/portfolio/` | Public copies that can be downloaded from the portfolio site |

Markdown files exposed through the portfolio are downloaded as PDFs in the browser. The download flow fetches the markdown file, renders it with `marked`, captures it with `html2canvas`, and saves it with `jsPDF`. This lets the portfolio present lightweight markdown in the repository while giving visitors a recruiter-friendly PDF download.

### Theme Preference

Theme is owned by `ThemeProvider` in `src/core/providers/ThemeProvider.tsx`. The provider:

* reads the saved `theme` value from `localStorage`;
* falls back to the operating system color-scheme preference;
* applies or removes the `dark` class on the document root;
* persists changes back to `localStorage`.

The CSS implementation uses custom properties so light and dark theme values can be switched without duplicating component markup.

### Language Preference

Language is owned by `LanguageProvider` in `src/core/providers/LanguageProvider.tsx`. The provider supports five locales: English, German, French, Dutch, and Swedish. The selected locale is persisted under `localStorage` key `locale`.

The English translation file defines the `Translations` TypeScript interface. Other locale files must satisfy that interface, so a missing translation key becomes a TypeScript error instead of a runtime surprise.

### Contact Messages

The contact form collects name, email, subject, and message. `Contact.tsx` owns the user interaction, while `formReducer.ts` owns state transitions and `emailService.ts` owns the EmailJS boundary.

The flow is:

```text
Visitor fills contact form
  to Contact.tsx dispatches reducer actions
  to sendContactEmail(payload)
  to EmailJS client SDK
  to recipient mailbox
```

The application does not persist messages. A successful send shows a success toast and resets the form. A failed send shows an error toast and leaves the user on the same page.

### Toasts

Toast notifications are owned by `ToastProvider`. The provider exposes `showToast(message, type)` and renders dismissible notifications for success, error, and informational states. The main current consumers are the contact flow and document download flow.

## How the Frontend Is Built

The frontend is built with React 18, TypeScript, Vite 6, and Tailwind CSS. It is a static SPA and does not require a server runtime after the build is produced.

The dependency footprint is intentionally small for the current scope:

| Area | Implementation |
| --- | --- |
| UI framework | React 18 |
| Language | TypeScript strict mode |
| Build tool | Vite 6 |
| Styling | Tailwind CSS plus CSS custom properties |
| Navigation | `react-scroll` for section scrolling |
| Email | `emailjs-com` wrapped by `emailService.ts` |
| Document downloads | `marked`, `html2canvas`, and `jsPDF`, loaded on demand |
| Testing | Vitest and Testing Library |
| Deployment | Netlify |

The source layout follows a layered frontend structure:

```text
src/
  core/
    providers/          App-wide theme, language, and toast providers
  features/
    home/               Hero and primary identity section
    about/              Background, skills, education, and certifications
    experience/         Experience timeline
    services/           Service offering cards
    projects/           Project grid and project metadata
    contact/            Contact section, reducer, and form flow
  shared/
    components/         Reusable UI components
    utils/              Shared utilities such as markdown-to-PDF download
  infrastructure/
    email/              EmailJS integration boundary
  i18n/
    translations/       Locale files and translation schema
  test/                 Vitest setup and unit tests
  types/                Shared TypeScript re-exports
```

This structure keeps app-wide concerns, feature sections, reusable UI, and external services separated without adding more architecture than the portfolio needs.

## How State Is Managed

The project does not use Redux, Zustand, React Query, or another global state library. State is deliberately scoped to where it is needed.

| State | Owner | Reason |
| --- | --- | --- |
| Theme | `ThemeProvider` | Shared preference used across the app |
| Locale | `LanguageProvider` | Shared preference used by every visible section |
| Toasts | `ToastProvider` | Cross-cutting feedback for form and download actions |
| Contact form | `formReducer` used by `Contact.tsx` | Explicit transitions and direct unit testing |
| Project description expansion | `ProjectCard` local state | Local UI interaction only |
| Docs dropdown visibility | `ProjectCard` local state | Local UI interaction only |

This approach avoids a central application store because the current state surface is small, low-frequency, and mostly UI-oriented.

## How External Boundaries Work

### EmailJS Boundary

`src/infrastructure/email/emailService.ts` is the only external service wrapper. It exposes `sendContactEmail(payload)` and hides the EmailJS SDK call from the UI. The payload contract is typed as `EmailPayload`, which contains:

```typescript
interface EmailPayload {
  user_name: string
  user_email: string
  user_subject: string
  user_message: string
  [key: string]: unknown
}
```

The required EmailJS identifiers are provided through Vite environment variables:

```text
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

These are client-side EmailJS identifiers, not server secrets, but they are still documented through `.env.example` and kept out of committed local environment files.

### Document Download Boundary

`src/shared/utils/downloadAsPdf.ts` owns markdown-to-PDF conversion. Project document buttons call this utility for `.md` files. The utility:

1. dynamically imports `marked`, `jspdf`, and `html2canvas`;
2. fetches the markdown file from `public/projects/...`;
3. converts markdown to HTML;
4. renders the HTML in an off-screen container;
5. captures the container as a canvas;
6. writes one or more PDF pages;
7. removes the temporary DOM container.

The implementation is intentionally client-side because the project has no backend and because documents are trusted repository assets.

## Backend and Database Scope

This repository does not contain a custom backend. That is a documented scope decision, not an accidental omission.

The current project does not need authentication, authorization, API routes, server-side persistence, background jobs, or an admin panel. The only runtime integration is EmailJS, and it is isolated behind the infrastructure boundary described above.

The repository also does not own a database. Data lives in:

| Data category | Storage location |
| --- | --- |
| Portfolio content | React source files and translation files |
| Project metadata | `src/features/projects/Projects.tsx` |
| Engineering documents | `docs/` and `public/projects/` |
| Resume, certificates, and static assets | `public/` |
| Theme preference | Visitor browser `localStorage` |
| Language preference | Visitor browser `localStorage` |
| Contact messages | EmailJS delivery flow and recipient mailbox |

The backend and database decisions should be reopened if the project adds message persistence, user accounts, content management, analytics storage, or an admin-managed project catalog.

## Security Model

The security model is based on the static frontend scope.

| Concern | Control |
| --- | --- |
| Secrets | `.env.local` is not committed; `.env.example` documents required variables |
| Contact data | Sent through EmailJS and not stored by this application |
| External links | Links opened in new tabs use safe `rel` attributes |
| Form input | Browser validation requires fields and email format |
| Public documents | Files under `public/` are treated as intentional public assets |
| Markdown rendering | Only trusted repository documents are exposed through the download flow |
| Dependencies | Dependency review is part of the documented quality process |

There are no privileged roles or protected backend operations in the current release, so client-side state changes cannot escalate access to private data.

## Testing and Continuous Integration

The current automated tests focus on the contact form reducer. This is the highest-value pure logic module because it controls the contact form's state transitions and is used directly by `Contact.tsx`.

The reducer test suite covers:

| Behavior | Coverage |
| --- | --- |
| Unknown action | Returns the existing state |
| `SET_FIELD` | Updates one field without mutating other fields |
| All text fields | Confirms name, email, subject, and message can be updated |
| `SET_SENDING` | Handles both true and false sending states |
| `RESET` | Returns the form to `initialFormState` |

The GitHub Actions workflow runs on pushes and pull requests to `main`. The configured pipeline is:

```text
npm ci
npm run typecheck
npm run lint
npm run test:coverage
npm run build
```

CI uses Node `22.12.0`, matching the documented Netlify runtime. The build step receives EmailJS identifiers through GitHub Actions secrets.

Future quality work is documented rather than hidden. Planned improvements include component tests for providers and browser end-to-end tests for navigation, theme switching, language switching, document downloads, and contact submission behavior. The metrics plan also identifies future coverage and Lighthouse thresholds.

## Deployment

The portfolio is deployed on Netlify from the `main` branch.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22.12.0` |
| Runtime type | Static frontend |

The site can be developed locally with the normal Vite workflow:

```text
npm install
npm run dev
```

Production deployment requires the three EmailJS environment variables to be configured in Netlify.

## Project Metrics

The following figures describe the repository at the time this overview was created.

| Metric | Value |
| --- | --- |
| Portfolio sections | 6 primary sections plus footer |
| Supported locales | 5 |
| TypeScript and TSX source files | 28 |
| TS/TSX source lines | 2,748 |
| Runtime dependencies | 8 |
| Development dependencies | 21 |
| Automated unit tests | 6 |
| Authored documentation files under `docs/` | 34 |
| Public portfolio document files | 34 |

The v1.0.0 metrics plan records a primary JavaScript bundle baseline of about 74.6 KB gzip and a CSS bundle baseline of about 4.7 KB gzip. PDF tooling is lazy-loaded when a visitor downloads a markdown document, so those libraries are not part of the first interaction path.

## Current Known Limitations

The current limitations are documented and form the roadmap for future work.

* There is no custom backend, database, server-side audit trail, or admin editing workflow.
* Contact delivery depends on EmailJS availability and correct environment configuration.
* The site uses scroll-based navigation, so individual project sections do not have deep-linked case study URLs.
* Browser end-to-end tests are planned but not yet implemented.
* Lighthouse CI is planned but not yet enforced.
* The public document set must be manually reviewed before new files are exposed under `public/projects/`.

These limitations are acceptable for the current purpose of the project: a public, maintainable, evidence-rich portfolio.

## Where to Look for More Detail

More detailed documentation is organized by engineering area:

| Area | Documents |
| --- | --- |
| Requirements | `docs/requirements/requirements-engineering-report.md`, functional requirements, non-functional requirements, user stories, acceptance criteria, and traceability matrix |
| Architecture | `docs/architecture/architecture-report.md` and ADRs 001 through 006 |
| Design | `docs/design/module-catalog.md`, `docs/design/interface-specs.md`, and `docs/design/DDR-001-emailservice-extraction.md` |
| Frontend | `docs/frontend/frontend-engineering-report.md` |
| Backend scope | `docs/backend/backend-scope.md` |
| Database scope | `docs/database/database-scope.md` |
| Quality | `docs/quality/test-strategy.md`, `docs/quality/quality-gates.md`, and `docs/quality/metrics-plan.md` |
| Security | `docs/security/security-engineering.md` and `SECURITY.md` |
| Risk | `docs/risk/risk-assessment.md` |
| SEO | `docs/seo/seo-engineering.md` |
| DevOps | `docs/devops/ci-cd-design.md`, `docs/devops/deployment-notes.md`, and `docs/devops/operational-readiness.md` |
| GitHub readiness | `docs/github/repository-readiness.md` |
| Interview preparation | `docs/portfolio/interview-preparation.md` |
| Release history | `CHANGELOG.md` and `docs/releases/release-notes-v1.0.0.md` |

## Interview Positioning

This project is useful in an interview because it is more than a visual portfolio. It demonstrates requirements thinking, architecture decisions, type-safe UI design, external service isolation, CI/CD discipline, security review, risk tracking, public documentation hygiene, and practical scope control. The main technical defense is that the project deliberately stays frontend-only because the current requirements do not justify a backend, while still leaving clear reopen criteria for when that decision should change.

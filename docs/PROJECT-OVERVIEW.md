# Developer Portfolio Project Overview

## What This Project Is

Ayomikun Festus-Olaleye Developer Portfolio is a public portfolio website for presenting software engineering experience, project evidence, governance documentation, and contact information in one responsive interface.

The project is a frontend-only React and TypeScript application deployed as a static site on Netlify. It does not own a custom backend or database. Contact form delivery is handled through EmailJS, which is isolated behind a typed infrastructure wrapper.

The repository is structured as one deployable application:

* `src/` contains the React application source code.
* `docs/` contains project governance, architecture, requirements, risk, security, testing, DevOps, and interview preparation documents.
* `public/projects/portfolio/` contains copies of the portfolio governance documents that can be downloaded from the live website.

## The Problem It Solves

A portfolio reviewer needs quick answers to practical questions: who the candidate is, what technical skills they can demonstrate, what projects show evidence of engineering depth, what decisions were made during development, whether the project is maintainable, and how the candidate can be contacted.

This project addresses those questions by combining a visitor-facing portfolio with downloadable engineering artifacts. The portfolio is not only a personal website. It is also a structured evidence package that supports technical interviews, recruiter screening, and project review.

## Who Uses It

The portfolio is designed around three primary user groups.

| User group | Goal | What the project provides |
| --- | --- | --- |
| Recruiter | Assess fit quickly | Name, role, location, skills, CV, experience, contact path |
| Technical interviewer | Evaluate engineering depth | Project cards, live links, repository links, ADRs, requirements, quality, and architecture docs |
| Collaborator | Decide whether to reach out | Services, examples of work, contact details, and contact form |

The site has no authenticated roles. All content is public, and write access exists only through the source repository.

## Core Domain Concepts

### Portfolio Sections

The application is organized as a single scroll-based page with six main sections: Home, About, Experience, Services, Projects, and Contact. The navigation bar smooth-scrolls to each section rather than using route-based page navigation.

This design supports a guided reading flow. A reviewer can move from identity to skills, experience, project evidence, and contact without changing pages.

### Projects

A project card represents one portfolio project. Each card can include a title, subtitle, description, technology tags, GitHub link, live site link, featured marker, and optional downloadable documents.

The portfolio project card links to this repository's own governance artifacts so reviewers can inspect how the project was planned, designed, tested, deployed, and reviewed.

### Governance Documents

The repository treats documentation as part of the product. The `docs/` folder contains requirements, architecture reports, design records, risk assessment, security review, frontend engineering strategy, implementation plan, quality strategy, deployment notes, repository readiness review, and interview preparation.

The same portfolio documents are mirrored into `public/projects/portfolio/` because files under `docs/` are not served by Vite in production.

### Theme and Language Preferences

The project supports dark and light themes. The selected theme is stored in `localStorage`, and the first visit respects the user's operating system color preference.

The interface also supports English, German, French, Dutch, and Swedish. Translation files are type-checked against the English source shape, so missing keys are caught during TypeScript validation.

### Contact Message

The contact form collects a name, email, subject, and message. The form uses HTML5 validation for required fields and email format, then sends the payload through EmailJS. On success, the form resets and shows a success toast. On failure, it shows an error toast.

The app does not store contact messages. EmailJS and the destination mailbox own delivery and retention.

## How the Application Is Built

The application uses React 18, TypeScript, Vite 6, Tailwind CSS, and Vitest. It is built as a static frontend, so the production deploy consists of HTML, CSS, JavaScript, images, PDFs, and markdown files.

The source layout is layered by responsibility:

```text
src/
  core/providers/        theme, language, and toast providers
  features/              home, about, experience, services, projects, contact
  shared/components/     navbar, footer, project card, language picker, scroll control
  shared/utils/          document download helpers
  infrastructure/email/  EmailJS wrapper
  i18n/translations/     locale files
  test/                  Vitest setup and unit tests
  types/                 shared type re-exports
```

The `core` layer owns app-wide state. The `features` layer owns visitor-facing sections. The `shared` layer owns reusable UI. The `infrastructure` layer owns the EmailJS service boundary.

The document download flow uses `marked`, `html2canvas`, and `jsPDF`, but those dependencies are loaded dynamically only when a visitor downloads a markdown document as a PDF. This keeps the initial bundle smaller for normal visitors.

## How the Main Components Fit Together

```text
App
  wraps providers
  renders Navbar
  renders portfolio sections
  renders Footer
  renders ScrollToTop

Projects
  renders ProjectCard entries
  passes document links from public/projects

Contact
  uses formReducer for form state
  calls emailService
  uses ToastProvider for feedback

emailService
  wraps EmailJS
  hides the external SDK from UI components
```

The frontend does not connect to a database and does not call a custom API. It interacts with browser storage for preferences and with EmailJS for contact delivery.

## Testing and Continuous Integration

The project uses Vitest for unit testing. The current test suite contains one test file, `src/test/formReducer.test.ts`, with six tests covering the contact form reducer.

Those tests cover:

* Unknown actions returning the current state.
* Updating each form field.
* Setting the sending state to true and false.
* Resetting a dirty form back to the initial state.

The reducer is tested from the production module `src/features/contact/formReducer.ts`, rather than duplicated inside the test file. This means a change to the real reducer is reflected in the test result.

GitHub Actions runs the quality gates on every push and pull request to `main`:

```text
npm ci
npm run typecheck
npm run lint
npm run test:coverage
npm run build
```

Coverage is configured through `@vitest/coverage-v8` and `npm run test:coverage`. The report includes text, JSON, and HTML output under `coverage/`. The coverage directory is ignored by Git.

## Project Metrics

The following figures describe the current repository state.

| Metric | Value |
| --- | --- |
| Source files under `src/` | 28 |
| Lines of source code under `src/` | 2,786 |
| Runtime dependencies | 8 |
| Development dependencies | 21 |
| Automated test files | 1 |
| Automated tests | 6 |
| Main deploy target | Netlify |
| Required Node version | 22.12.0 or newer |

The production build uses Vite. The latest successful local build produced a primary JavaScript gzip bundle of about 74.6 KB, with PDF generation tooling split into lazy-loaded chunks.

## Current Known Limitations

The project is intentionally frontend-only. It has no custom backend, database, server-side session management, or server-side audit log.

Email delivery depends on EmailJS availability and the user's browser network access. If EmailJS fails, the user receives an error toast, but the application cannot retry delivery from a server queue.

The portfolio uses scroll-based navigation, so individual sections do not have shareable route URLs. Project detail routes are a future option if long-form case studies need dedicated pages.

The current automated test suite is focused on reducer logic. Component tests, browser end-to-end tests, accessibility checks, and Lighthouse CI remain planned improvements.

## Where to Look for More Detail

The main repository guide is `README.md`.

The requirements set is in `docs/requirements/`, including functional requirements, non-functional requirements, user stories, acceptance criteria, traceability, and the requirements engineering report.

Architecture decisions are in `docs/architecture/`, including the architecture report and ADRs for scroll navigation, theming, context state, the contact form reducer, type-safe i18n, and folder structure.

Design documentation is in `docs/design/`, covering the module catalog, interface specifications, and design decision records.

Quality and testing documentation is in `docs/quality/`. Deployment and operations documentation is in `docs/devops/`.

Risk, security, SEO, GitHub readiness, implementation planning, and interview preparation each have dedicated folders under `docs/`.

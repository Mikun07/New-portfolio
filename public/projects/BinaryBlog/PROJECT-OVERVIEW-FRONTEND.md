# Blog Frontend Project Overview

Last documentation update: 2026-07-13.

## What This Project Is

Blog Frontend is a React single-page application for the Blog Backend API. It provides the browser client for readers to browse published posts, authenticated authors to manage their own posts, and admins to oversee users and posts.

```text
reader, author, or admin
    uses React UI
        which sends JSON requests with Axios
        to Blog Backend /api routes
            which validates input, enforces ownership, and stores data in MySQL
```

The frontend does not connect to the database. The backend owns authentication, authorization, validation, post ownership, publishing status, categories, tags, comments, and admin rules.

## The Problem It Solves

A blog platform needs a public reading surface, an authenticated author workspace, and admin oversight. Readers need a way to discover published posts. Authors need a way to create drafts, publish posts, update content, archive posts, and delete posts through the backend API. Admins need a way to create users, create posts, review post status, inspect user history, and see whether the backend API and database are reachable when needed.

Blog Frontend addresses this by providing public post browsing with filters, an author workspace, and an admin workspace that use the backend's canonical API contract.

## Who Uses It

| User Group | Frontend Capability |
| --- | --- |
| Guest reader | Browse published posts and filter by search, category, or tag. |
| Author | Register, log in, view and update profile information, and manage own posts. |
| Admin | Create users, create posts, review all posts, update post status, delete posts, inspect user history, and monitor backend API/database connectivity when supported by the backend. |

## Core Frontend Concepts

### Public Blog Discovery

The landing page calls `GET /api/blogs` and sends optional query parameters for `search`, `category`, `tag`, and `per_page`. The API only returns published posts.

### Authentication

Registration and login call the canonical authentication routes:

- `POST /api/auth/register`
- `POST /api/auth/login`

The frontend stores the returned Sanctum token in `localStorage` and sends it as `Authorization: Bearer <token>` for protected requests.

### Author Workspace

The protected profile area uses local session data, `GET /api/auth/me` to refresh account data, and `PATCH /api/auth/me` to update editable profile fields. The manage posts page uses:

- `GET /api/me/blogs`
- `POST /api/blogs`
- `PATCH /api/blogs/{id}`
- `DELETE /api/blogs/{id}`

The post form supports title, excerpt, content, cover image upload or cover image URL, category name, tags, status, and display date.

### Admin Workspace

The protected admin area uses the admin API for user and post oversight:

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/{id}/history`
- `PATCH /api/admin/users/{id}/role`
- `GET /api/admin/blogs`
- `PATCH /api/admin/blogs/{id}/status`
- `DELETE /api/admin/blogs/{id}`

Admins can also create posts through the shared post form and `POST /api/blogs`.

The admin dashboard also calls `GET /api/health` to display green, amber, or red connectivity indicators for the backend API and database. If the endpoint is missing, the dashboard shows a degraded state instead of crashing.

### API Client

`src/config/api.js` centralizes API behavior:

- Base URL from `VITE_API_BASE_URL`
- `/api` path prefix
- JSON headers
- Bearer token injection
- Response collection helpers
- Error message extraction

This keeps route contracts out of page components.

## Current Architecture

The frontend follows a small page and component structure.

| Area | Responsibility |
| --- | --- |
| `src/pages` | Route-level views for landing, authentication, profile, post management, and admin management. |
| `src/components` | Cards, forms, modals, navigation, and account display components. |
| `src/config/api.js` | API client and response helpers. |
| `src/store/auth.js` | Token and user session helpers. |
| `src/routes` | Nested protected route definitions. |
| `src/test` | Vitest, React Testing Library, accessibility, and Playwright tests. |
| `src/test/e2e` | Playwright end-to-end tests. |

This structure is appropriate for the current portfolio scope. A larger admin and comment moderation surface may justify more feature-based folders later.

## Development Timeline

This overview reflects the current Git commit timeline for the frontend work.

| Date | Commit message | Scope |
| --- | --- | --- |
| 2025-10-13 | Set up frontend quality workflow | Frontend quality workflow, CI, and test tooling setup. |
| 2025-10-22 | Centralize API and session handling | Central API client, session handling, cached profile data, and payload utilities. |
| 2025-10-31 | Add reusable UI shell components | Reusable UI shell components, navigation polish, notifications, toast messages, and error boundaries. |
| 2025-11-10 | Redesign public blog browsing | Public blog browsing redesign, responsive blog cards, and landing page assets. |
| 2025-11-18 | Improve authentication and profile flows | Login, signup, password guidance, profile editing, and protected route flow improvements. |
| 2025-11-27 | Enhance author post management | Author post-management forms, image upload support, and post editing/deletion workflows. |
| 2025-12-05 | Add admin management dashboard | Admin dashboard for users, posts, pagination, history, and backend/database connectivity status. |
| 2025-12-11 | Document and test blog frontend workflows | Documentation, automated tests, accessibility checks, and end-to-end coverage. |
| 2026-07-13 | Update GitHub Actions runtime | CI actions updated to Node 24-compatible `checkout@v5` and `setup-node@v5`; project runtime remains Node.js 22. |

## Project Metrics

The following figures describe the frontend repository after the API alignment, admin workspace, test setup, and CI runtime update work.

| Metric | Value |
| --- | ---: |
| App source files under `src` | 67 |
| Component files | 27 |
| Page files | 11 |
| Vitest test files | 14 |
| Vitest automated tests | 38 |
| Playwright E2E test files | 1 |
| Playwright E2E tests | 1 |
| Documentation files (`README.md` plus `docs/*.md`) | 3 |
| CI workflow files | 1 |
| Runtime dependency entries | 4 |
| Development dependency entries | 19 |
| npm script entries | 10 |

Latest local verification results:

| Check | Result |
| --- | --- |
| `npm run lint` | Passed on 2026-07-13 |
| `npm run test -- --pool=threads` | 14 test files passed, 38 tests passed on 2026-07-13 |
| `npm run build` | Passed on 2026-07-13 |
| `npm run test:e2e -- --output=.tmp\playwright-results` | 1 Playwright test passed on 2026-07-13 |
| `npm run test:coverage` | Timed out locally before reporting coverage on 2026-07-13 |
| `npm run test:ci` | Not rerun during the 2026-07-13 documentation refresh |
| `npm audit --audit-level=moderate` | Not rerun during the 2026-07-13 documentation refresh |

Previous completed coverage baseline retained after the local 2026-07-13 coverage timeout:

| Coverage Area | Percentage |
| --- | ---: |
| Statements | 68.35% |
| Branches | 52.02% |
| Functions | 60.86% |
| Lines | 68.27% |

## Security Model

The frontend supports backend security but does not replace it.

- Backend authorization remains authoritative.
- Protected routes check for a local token before rendering the author workspace.
- API calls use Sanctum bearer tokens.
- Secrets are not stored in frontend environment variables.
- A `401` response clears the local frontend session.

Current security limitation: the token is stored in `localStorage`, which should be reviewed before production use.

## Quality Status

Current checks:

- ESLint through `npm run lint`
- Vitest suite through `npm run test`
- Coverage collection through `npm run test:coverage`
- Playwright end-to-end test through `npm run test:e2e`
- Combined CI test command through `npm run test:ci`
- Production build through `npm run build`
- Dependency audit through `npm audit --audit-level=moderate`
- GitHub Actions workflow through `.github/workflows/ci.yml` using `actions/checkout@v5`, `actions/setup-node@v5`, and Node.js 22 for project commands

Current gaps:

- Comment submission and moderation screens are not implemented yet.
- Accessibility automation currently covers the login form and post form. Full page-level accessibility coverage still needs expansion.
- E2E coverage currently validates public blog browsing and filtering. Authenticated author E2E coverage can be added after the backend test data strategy is finalized.
- The CI workflow is committed and pushed to `main`; review the latest GitHub Actions run in GitHub after each push.

Recommended next quality step: add UI implementation and tests for comment workflows, then expand Playwright coverage for authenticated author and admin journeys.

## Known Limitations

- Comment submission and moderation screens are not implemented.
- Category and tag management screens are not implemented.
- Backend pagination metadata is not fully integrated into every listing yet.
- UI screenshots are not included yet.
- License decision is pending.

## Where to Look for More Detail

- `README.md` for setup, build, deployment, and repository orientation.
- `docs/ENGINEERING_READINESS.md` for framework-based readiness assessment.
- Backend API detail is maintained in the backend repository at `docs/API.md`.

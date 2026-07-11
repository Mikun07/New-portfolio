# IncidentTrack Project Overview

## What This Project Is

IncidentTrack is an incident management platform for engineering teams. It provides a shared, auditable system of record for tracking operational incidents from the point they are opened through investigation, mitigation, resolution, and postmortem review. The feature set covers the core incident response workflow used by tools such as Jira Service Management or PagerDuty, without attempting to replicate their full scope.

The project is a full-stack application split into two independently versioned repositories.

* `backend/` is a REST API, built with Node.js, TypeScript, Express, Prisma, and PostgreSQL, that owns all business logic, data, and access control.
* `frontend/` is a React and TypeScript single-page application that gives users a dashboard to work against that API.

The two repositories communicate only over HTTP. The frontend does not connect to the database directly.

## The Problem It Solves

When a production incident occurs, a team needs consistent answers to a small set of questions: what is broken, how severe it is, and who owns it; what has been tried so far, in what order; whether the incident is actually resolved or only temporarily quiet; what was learned once it is closed, and who is responsible for follow-up work; and who changed what, and when, for accountability afterward.

IncidentTrack addresses these questions by modeling incidents as a strict lifecycle tied to a service catalog, recording every meaningful action to a timeline and an audit log, and requiring a postmortem with trackable action items before an incident is considered fully closed.

## Who Uses It

The platform defines three roles, enforced on the server.

| Role | Permissions |
| --- | --- |
| VIEWER | Read services, incidents, postmortems, and action items. No write access. |
| RESPONDER | All VIEWER permissions, plus creating and updating services, creating and managing incidents, adding timeline notes, writing postmortems, and managing action items. |
| ADMIN | All RESPONDER permissions, plus managing user accounts and roles and viewing the audit log. |

Self-registered accounts are created with the RESPONDER role. An existing admin must promote a user to ADMIN or move a user to VIEWER afterward. The system rejects any change that would leave the platform with zero admins.

## Core Domain Concepts

### Services

A service represents anything the team monitors, such as a public API or a payments worker. Each service has a status of OPERATIONAL, DEGRADED, OUTAGE, or MAINTENANCE. Services exist independently of incidents and accumulate an incident history over time.

### Incidents

An incident is tied to exactly one service, carries a severity from SEV1 to SEV4, and moves through a state machine enforced by the backend:

```text
OPEN to INVESTIGATING to MITIGATED to RESOLVED to REVIEWED
OPEN to MITIGATED (direct)
INVESTIGATING to RESOLVED (direct)
```

REVIEWED is a terminal state. An incident that reaches it cannot be reopened. Any transition outside this graph is rejected by the API with a 409 status, so an invalid state cannot be reached even if the frontend contains a bug.

Severity is set once, at creation, by the person opening the incident. There is no formal rubric enforced by the system for choosing a level; the codebase defines each level only by the automatic effect it has on the related service's status.

| Severity | Effect on service status | Practical meaning in this system |
| --- | --- | --- |
| SEV1 | Forces the service to OUTAGE | The most severe level available. Reserved for incidents where the reporter considers the service fully down. |
| SEV2 | Forces the service to DEGRADED | The second most severe level. Reserved for incidents where the reporter considers the service impaired but not fully down. |
| SEV3 | No automatic change | A lower-severity incident. The service catalog is not updated automatically, so any status change must be made separately. |
| SEV4 | No automatic change | The lowest severity level. Same behavior as SEV3: no automatic service status change. |

This severity effect is one-directional and only applies at creation. Downgrading an incident's severity after creation does not reverse the service status change, and the API does not currently expose an endpoint to edit severity after an incident is opened.

Incident status describes where the incident is in its response lifecycle, independent of severity.

| Status | Meaning |
| --- | --- |
| OPEN | The incident has been created and has not yet been marked as under active investigation. This is the starting status for every incident. |
| INVESTIGATING | Someone is actively working to understand the cause. |
| MITIGATED | The immediate impact has been addressed, but the underlying cause may not yet be fully resolved. |
| RESOLVED | The incident is considered fixed. This is the earliest status at which a postmortem can be written. |
| REVIEWED | The incident has been through postmortem review and is closed. This status is terminal; the incident cannot be reopened or transitioned further. |

Service status describes the current operational state of a service, and can be set either automatically by incident creation or manually through the services API.

| Status | Meaning |
| --- | --- |
| OPERATIONAL | The service is working normally. This is the default status for a newly registered service. |
| DEGRADED | The service is impaired but still functioning. Set automatically by a SEV2 incident, or manually by an admin or responder. |
| OUTAGE | The service is down. Set automatically by a SEV1 incident, or manually by an admin or responder. |
| MAINTENANCE | The service is intentionally offline or restricted for planned work. Only ever set manually; no incident severity triggers this status automatically. |

### Timeline

Every incident maintains an append-only timeline: a chronological record of status changes, notes, and assignments. Status transitions write a timeline entry automatically. Responders can also add manual notes, for example to record that the on-call engineer was paged.

### Postmortems and Action Items

A postmortem can be written once an incident reaches RESOLVED or REVIEWED, and not before. The API rejects postmortem submissions on incidents that have not reached that stage. A postmortem requires five fields: root cause, impact summary, detection summary, resolution summary, and lessons learned. It can be saved as a draft and published later.

Action items are follow-up tasks, such as adding an alert for connection pool saturation. They can be created before or after a postmortem exists, optionally assigned to a user with a due date, and tracked through OPEN, IN_PROGRESS, DONE, and CANCELLED.

### Audit Log

Every sensitive write is recorded to an audit log with the actor, the action taken, the affected entity, and supporting metadata. This includes role changes, service status changes, incident creation, incident assignment, status transitions, postmortem saves and publishes, and action item changes. Only admins can read the audit log. This record supports accountability by answering who changed a given incident's status, and when.

## How the Backend Is Built

The backend runs on Node.js and TypeScript using ECMAScript modules, with Express 4 as the web framework, Prisma 5 as the ORM over PostgreSQL, and Zod for request validation. Authentication uses JWT bearer tokens through the `jsonwebtoken` package, and passwords are hashed with `bcryptjs`. Helmet and CORS middleware provide baseline HTTP security.

The architecture is a modular monolith, documented in `backend/docs/adr/0001-modular-monolith.md`. The service is deployed as a single unit, but the code is organized by business capability rather than left flat. This gives the codebase clear module boundaries without the operational cost of running separate services at the current scale of the project.

```text
Client to Express API to Middleware to Module Routes to Module Services to Prisma Client to PostgreSQL
```

Each business module, covering auth, users, services, incidents, postmortems, and audit, follows the same three-file shape. A `*.routes.ts` file defines HTTP routes and middleware composition. A `*.schemas.ts` file defines Zod request contracts. A `*.service.ts` file contains business logic and Prisma calls.

Cross-cutting concerns live in `src/middleware/`. `requireAuth` validates the bearer JWT and attaches the caller to the request. Role guards, including `requireRole`, `canModifyIncidents`, and `canViewProtectedData`, enforce the permissions described above. `validateBody`, `validateParams`, and `validateQuery` run Zod schemas before service logic executes. A global error handler normalizes every failure, including validation errors, Prisma constraint violations, application errors, and unexpected exceptions, into a single JSON envelope with `code`, `message`, and an optional `details` field. Unexpected errors do not expose internal detail to the client.

The data model, defined in `prisma/schema.prisma`, includes `User`, `Service`, `Incident`, `IncidentTimelineEntry`, `Postmortem`, `ActionItem`, and `AuditLog`. All records use UUID primary keys, and indexes exist on the columns used for filtering, including status, severity, role, foreign keys, and timestamps.

The full API surface is documented in `backend/docs/api-reference.md`, covering health checks, authentication routes, users, services, incidents, postmortems, action items, and audit logs, all mounted under `/api`.

The security model is documented in `backend/docs/security-model.md`. JWTs are signed with a required `JWT_SECRET`, passwords are hashed with bcrypt, role-based access control is enforced on the server rather than trusted from the client, and every input passes through Zod validation. The CORS allowlist is a required environment variable in production, and the API refuses to start without it. The current gaps, documented rather than hidden, are the absence of refresh token rotation, rate limiting, account lockout, multi-factor authentication, and CSRF protection for cookie-based auth. The last item is not currently a risk, since authentication is bearer-token only, but it is noted for future reference.

## How the Frontend Is Built

The frontend is built with React 19 and TypeScript, using Vite 6 as the build tool. The dependency footprint is intentionally minimal: no routing library, no state management library, no data-fetching cache library, and no CSS framework. `lucide-react` provides icons. This is a documented decision rather than an omission. The project's own documentation states that each of these tools should be added once the application's complexity justifies the additional dependency, not before.

The source layout is organized by feature rather than by route.

```text
src/
  app/                composition root, shell, view switch, shared state hook
  components/ui.tsx   shared presentational primitives
  features/
    auth/             login and registration
    dashboard/        overview metrics
    incidents/        list, detail, lifecycle, timeline, postmortems, action items
    services/         service registration and status
    team/             admin role management
    audit/            admin audit log viewer
  lib/
    api.ts            the HTTP boundary to the backend
    format.ts         display formatting helpers
  types/domain.ts      types mirroring backend response shapes
```

State management is centralized in one custom hook, `useIncidentTrack`, which owns session state (the JWT persisted in `localStorage`), navigation state, workspace data such as services, incidents, users, and audit logs, per-feature form state, and loading and error feedback. Mutations call the API and then reload the affected workspace data, rather than applying optimistic updates. This favors a simple and correct data flow over immediate UI feedback at the current stage of the project.

There is no client-side router. `ViewRouter.tsx` is a switch statement over a `view` string held in component state. A router is planned for when the application needs shareable or deep-linkable incident URLs.

`src/lib/api.ts` is the sole boundary between UI code and backend HTTP calls. It wraps `fetch` with a typed `api` object containing one method per backend endpoint, and it normalizes backend error responses into a typed `ApiError` carrying an HTTP status, a backend error code, and a safe message. No other file in the frontend calls `fetch` directly. The backend base URL is set through the build-time environment variable `VITE_API_BASE_URL`, which defaults to `http://localhost:4000` in local development.

## How the Two Repositories Fit Together

```text
frontend (React SPA, Vite dev server on port 5173)
    sends HTTPS/JSON requests with a bearer JWT
    to backend (Express API, Node.js server on port 4000)
        which reads and writes through Prisma
        to PostgreSQL
```

The frontend holds no direct database access and no business logic of consequence. Every rule, including valid status transitions, permission checks, and when a postmortem is allowed, is enforced by the backend. The frontend is responsible for presenting those rules to the user, not for enforcing them.

Authentication is a bearer JWT issued by `POST /api/auth/login` or `POST /api/auth/register`. The frontend stores the token in `localStorage` and sends it as an `Authorization: Bearer` header on every subsequent request.

The backend's CORS configuration must explicitly allow the frontend's origin, which is `http://localhost:5173` in local development. In production, `CORS_ORIGIN` is a required environment variable, and the API will not start without it.

## Testing and Continuous Integration

Both repositories include automated tests and GitHub Actions workflows.

The backend uses Vitest and Supertest, run against a real PostgreSQL instance rather than mocks. The project's testing documentation states that integration tests against a real database catch schema and constraint issues that mocked tests would miss. The suite currently contains 46 tests across five files: `auth.test.ts` covers registration, login, and current-user lookup, including case-insensitive email handling and credential validation; `incidents.test.ts` covers incident creation, the service status side effects of SEV1 and SEV2 incidents, every documented status transition, rejection of invalid transitions, and pagination and filtering; `postmortems.test.ts` covers postmortem creation, the RESOLVED-or-REVIEWED gate, publishing, updates, and action item creation and status changes; `rbac.test.ts` covers admin, responder, and viewer permission boundaries across the users, services, and audit routes, including the rule that the last remaining admin cannot be demoted; and `health.test.ts` covers the liveness endpoint. The CI workflow starts a `postgres:16-alpine` service container, runs Prisma client generation, builds the project, runs the test suite, and runs `npm audit` at the high severity threshold.

The frontend uses Vitest and React Testing Library, with component-level tests organized by feature. The suite currently contains 52 tests across seven files: `api.test.ts` and `format.test.ts` cover the HTTP client boundary and display formatting helpers; `AuthScreen.test.tsx` covers the login and register form, error and loading states, and password visibility; `IncidentsView.test.tsx` covers the incident list, the creation form, role-gated visibility of write controls, and the postmortem form's dependency on incident status; `ServicesView.test.tsx` and `TeamView.test.tsx` cover their respective list and role-gated write behavior; and `AuditView.test.tsx` covers the admin-only access boundary. Its CI workflow runs type checking, a production build, the test suite, and the same audit gate used by the backend.

Both repositories use `@vitest/coverage-v8` to measure line, branch, statement, and function coverage, run through `npm run test:coverage`. The backend's most recent run reports 86.04 percent statement coverage, 72.64 percent branch coverage, and 86.9 percent function coverage. Coverage is weakest in `services.service.ts` (40.9 percent) and the error handler's non-Zod, non-Prisma failure paths, since those branches require conditions the current test suite does not construct. The frontend's most recent run reports 52.63 percent statement coverage, 85.71 percent branch coverage, and 37.98 percent function coverage. The frontend gap is concentrated in `IncidentsView.tsx` (23.18 percent statements), which contains more interactive branches, such as lifecycle transition menus and conditional postmortem forms, than the current tests exercise directly. These figures reflect the state of the codebase at the time the coverage command was last run and will drift as code and tests change.

## Project Metrics

The following figures describe the codebase itself, gathered directly from each repository.

| Metric | Backend | Frontend |
| --- | --- | --- |
| Source files | 28 | 19 |
| Lines of source code | 1,706 | 2,381 |
| Runtime dependencies | 8 | 6 |
| Development dependencies | 11 | 7 |
| Automated tests | 46 | 52 |
| Statement coverage | 86.04% | 52.63% |
| Branch coverage | 72.64% | 85.71% |

The backend exposes 22 HTTP endpoints: 20 across the six business route modules (auth, users, services, incidents, postmortems, audit) and 2 health endpoints defined directly in `app.ts`. The data model defines seven Prisma models: `User`, `Service`, `Incident`, `IncidentTimelineEntry`, `Postmortem`, `ActionItem`, and `AuditLog`.

Separate from these codebase figures, IncidentTrack surfaces its own set of operational metrics to users on the dashboard: the count of incidents that are OPEN, INVESTIGATING, or MITIGATED, the count of SEV1 and SEV2 incidents, the count of services that are DEGRADED or OUTAGE, and the total count of action items across all incidents. These are product features, computed from live data by the frontend's `useIncidentTrack` hook, not statistics about the project's development.

## Current Known Limitations

These limitations are documented in each repository, not concealed, and form the roadmap for future work.

The backend has no refresh tokens, so sessions expire when the JWT expires with no silent renewal. It also has no rate limiting or account lockout on authentication endpoints.

The frontend has no client-side router, so individual incidents have no shareable or deep-linkable URL. It has no data-fetching cache layer, so every mutation triggers a full reload of the affected data. Neither repository has production telemetry, and there are no end-to-end tests exercising the frontend against a live backend.

## Where to Look for More Detail

The backend documentation set includes `backend/docs/architecture.md`, `backend/docs/api-reference.md`, `backend/docs/database-design.md`, `backend/docs/security-model.md`, and `backend/docs/operations.md`.

The frontend documentation set includes `frontend/docs/architecture.md`, `frontend/docs/api-integration.md`, `frontend/docs/state-management.md`, and `frontend/docs/ui-design-system.md`.

`docs/90-day-build-plan.md` in this folder describes the planned phase-by-phase build roadmap.

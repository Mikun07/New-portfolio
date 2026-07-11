# MikunAir Project Overview

## What This Project Is

MikunAir is a full-stack flight booking platform built as a portfolio project for a SAS Full Stack Engineer application. It provides the complete passenger journey: searching for flights, selecting seats and cabin class, entering passenger details, completing a booking, viewing booking history, and cancelling confirmed bookings. The feature set covers the core booking flow used by commercial airline systems, including support for connecting (multi-leg) itineraries and both one-way and return trips.

The project is split into two independently versioned and independently deployed repositories. The `backend/` repository is a REST and GraphQL API built with Node.js, TypeScript, Express, Drizzle ORM, and PostgreSQL that owns all business logic, data, and access control. The `frontend/` repository is a React and TypeScript single-page application that gives users a polished interface to drive that API. The two repositories communicate only over HTTP; the frontend does not connect to the database directly.

## The Problem It Solves

When a passenger searches for a flight, the system needs consistent answers to a short set of questions: which routes have available seats on the requested date; what the total price is across all fare components; whether the last remaining seat on a flight gets double-sold to two concurrent requests; what documents are needed to process the booking; and who made the booking and when, for accountability and GDPR compliance.

MikunAir addresses these questions by modelling flights as entities with real-time seat inventories, calculating fares deterministically in integer pence, preventing overbooking through a database-level `SELECT FOR UPDATE` transaction, collecting passenger PII only at the point of booking, and keeping an append-only audit log of every booking action.

## Who Uses It

The platform defines two roles, enforced on the server.

| Role | Permissions |
| --- | --- |
| USER | Search flights. Create bookings (authenticated or guest). View own booking history. Cancel own confirmed bookings. Request GDPR erasure of own PII. |
| ADMIN | All USER permissions, plus creating flights, updating flight details, and deactivating flights. |

Self-registered accounts are created with the USER role. An existing admin must promote a user to ADMIN directly in the database; there is no in-app role management screen beyond the admin flight management panel.

Guest booking is supported: a booking can be created without an authenticated session. The booking is stored without a `userId` link and cannot be retrieved through the authenticated booking history endpoint.

## Core Domain Concepts

### Airports

An airport is a lookup entity keyed by its IATA code (for example `LHR`, `ARN`, `CDG`). Airports are seeded into the database and are not created through the API. Every flight references exactly two airports: an origin and a destination.

### Flights

A flight represents a single scheduled service between two airports. It carries a flight number, departure and arrival timestamps with full timezone information, separate seat inventories for Economy and Business cabin classes, and separate fares for each class. Fares are stored as integer pence to avoid floating-point precision errors.

A flight moves through the following statuses:

| Status | Meaning |
| --- | --- |
| SCHEDULED | The flight is available for search and booking. This is the default status for a newly created flight. |
| DEPARTED | The flight has left the origin airport. Bookings can no longer be made against a departed flight. |
| CANCELLED | The flight has been cancelled by the airline. Bookings can no longer be made. |

### Connecting Flights

A connecting itinerary is formed by pairing two individual scheduled flights where the origin of the second leg matches the destination of the first and the layover is between 45 minutes and 6 hours. The pairing logic runs in the flight repository and is exposed through both the GraphQL `searchFlights` query and the internal `FlightAvailabilityService`. Connecting flight options are presented separately from direct options on the search results screen.

### Bookings

A booking ties one or more passengers to one outbound flight (and optionally one inbound flight for a return trip). It carries a six-character alphanumeric reference (for example `MK4B2Z`), a total price in integer pence, and the following status lifecycle:

```text
PENDING -> CONFIRMED
CONFIRMED -> CANCELLED
```

`PENDING` is the initial status written inside the database transaction. The booking is updated to `CONFIRMED` immediately after the transaction commits. `CANCELLED` is the only terminal state, and a cancelled booking cannot be reinstated through the API.

Seat decrement is atomic: the booking service uses a `SELECT FOR UPDATE` lock on the flight row inside a PostgreSQL transaction. Two concurrent requests for the last seat on a flight will serialise at the lock; the second will receive a `409 NO_SEATS_AVAILABLE` error.

### Passengers

A passenger record captures the full name, date of birth, document type (PASSPORT or ID_CARD), and document number of each traveller on a booking. Passenger PII is stored inline on each booking in the `booking_passengers` table rather than in a separate profile, which means the PII lifecycle is tied to the booking lifecycle. A separate `passenger_profiles` table allows authenticated users to save a profile for re-use, reducing re-entry on repeat bookings.

When a user requests GDPR erasure, their account is anonymised: the email is replaced with a hashed sentinel, the password hash is cleared, and all `booking_passengers` and `passenger_profiles` rows linked to that user are flagged `is_anonymised = true` and their PII fields overwritten with redacted values.

### Events

Domain events are published by the `BookingService` after a successful state change and consumed by the `NotificationService`. The current events are `booking.confirmed` and `booking.cancelled`. The event bus is an in-process `EventEmitter` singleton with no external message broker, so events do not survive a process restart.

### Audit Log

Every booking creation and cancellation is recorded to the `audit_log` table with the correlation ID of the originating HTTP request, the entity type, entity ID, action name, actor ID, and timestamp. The audit log is append-only and supports compliance queries such as "which requests touched booking ABC123?"

## How the Backend Is Built

The backend runs on Node.js and TypeScript using ECMAScript modules, with Express 4 as the web framework, Drizzle ORM 0.39 as the data layer over PostgreSQL, and Zod for request validation. Authentication uses JWT bearer tokens signed with `jsonwebtoken`. Passwords are hashed with bcrypt at cost factor 12. Helmet and CORS middleware provide baseline HTTP security.

The architecture is a modular monolith. The service is deployed as a single unit, but the code is organised by business capability rather than left flat. This gives the codebase clear module boundaries without the operational cost of running separate services.

```text
Client -> Express -> Middleware -> Module Router -> Module Handler -> Domain Service -> Repository -> Drizzle -> PostgreSQL
```

Each business module follows the same four-file shape:

| File | Responsibility |
| --- | --- |
| `*.router.ts` | HTTP route definitions and middleware composition |
| `*.handlers.ts` | Request parsing, calling domain services, writing HTTP responses |
| `domain/*.service.ts` | Business logic; all rules live here |
| `repository/postgres-*.repository.ts` | SQL queries via Drizzle |

Modules are: `identity` (auth), `booking`, `flight`, `passenger`, `admin`, `notification`.

Shared infrastructure lives in `src/shared/`:

| Directory | Contents |
| --- | --- |
| `auth/` | JWT sign/verify, request middleware that attaches `req.user`, correlation ID middleware |
| `database/` | Drizzle connection, transaction helper, schema, migrations, seed |
| `errors/` | Typed domain errors (`FlightNotFoundError`, `NoSeatsAvailableError`, `BookingAlreadyCancelledError`, etc.) and a centralised error handler that maps them to HTTP responses |
| `events/` | In-process `EventBus` (extends `EventEmitter`), domain event interfaces |
| `logger/` | Winston-based structured logger with a PII sanitiser applied to every log call |
| `validation/` | Zod schemas shared between request validation and GraphQL argument validation |

### GraphQL Layer

Flight search is exposed through a GraphQL endpoint at `POST /graphql` in addition to the REST API. The schema is a SDL file at `src/graphql/schema.graphql`. Resolvers live in `src/graphql/resolvers.ts` and delegate to `FlightAvailabilityService`. The GraphQL endpoint enforces a query depth limit of 5 to prevent deeply nested query abuse. All other endpoints are REST.

### Rate Limiting

A global rate limit of 200 requests per 15-minute window is applied to all `/api/*` routes using `express-rate-limit`. This is a defence-in-depth measure, not a substitute for network-level controls.

### Security Properties

| Property | Implementation |
| --- | --- |
| Access tokens | JWT, 15-minute expiry, stored in memory (never localStorage) on the client |
| Refresh tokens | JWT, 7-day expiry, issued in an HTTP-only, SameSite=Strict, Secure cookie |
| Password storage | bcrypt, cost factor 12 |
| PII logging | PII sanitiser applied to all Winston log calls; fields `email`, `fullName`, `dateOfBirth`, `documentNumber`, `documentType`, `passwordHash` are replaced with `[REDACTED]` |
| Stack traces | Never included in API responses; the global error handler sends only a typed error code and safe message |
| Request body size | Limited to 256 KB |
| CORS | Restricted to `FRONTEND_URL` environment variable; defaults to `http://localhost:5173` in development |

### Data Model

The Drizzle schema (`src/shared/database/schema.ts`) defines the following tables:

| Table | Purpose |
| --- | --- |
| `users` | Registered accounts with email, password hash, role (`USER` \| `ADMIN`), consent timestamps |
| `passenger_profiles` | Saved passenger details linked to a user account for re-use |
| `airports` | IATA code lookup table, seeded at startup |
| `flights` | Scheduled services with seat inventories and fares in integer pence |
| `bookings` | Booking records with a reference, status, total price, and optional user link |
| `booking_segments` | Junction table linking a booking to one or more flights with the cabin class and fare paid |
| `booking_passengers` | PII snapshot of each passenger at the time of booking |
| `audit_log` | Append-only record of every booking action |

All primary keys are UUIDs. Indexes exist on `flights(origin_iata, destination_iata, departure_at)`, `bookings(reference)`, `bookings(user_id)`, `users(email)`, and `audit_log(entity_type, entity_id)`.

### REST API Surface

All REST routes are mounted under `/api/v1`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | None | Register a new account; returns access token and sets refresh cookie |
| POST | `/api/v1/auth/login` | None | Authenticate; returns access token and sets refresh cookie |
| POST | `/api/v1/auth/refresh` | Refresh cookie | Issue a new access token using the refresh cookie |
| POST | `/api/v1/auth/logout` | None | Clear the refresh cookie |
| DELETE | `/api/v1/auth/me` | Bearer | Request GDPR erasure of the authenticated user |
| POST | `/api/v1/bookings` | Optional bearer | Create a booking (guest or authenticated) |
| GET | `/api/v1/bookings` | Bearer | List all bookings for the authenticated user |
| GET | `/api/v1/bookings/:reference` | Optional bearer | Get a single booking by reference |
| DELETE | `/api/v1/bookings/:reference` | Bearer | Cancel a confirmed booking |
| GET | `/api/v1/bookings/history` | Bearer | Get flight history for the authenticated user |
| GET | `/api/v1/passengers` | Bearer | List saved passenger profiles for the authenticated user |
| POST | `/api/v1/passengers` | Bearer | Save a passenger profile |
| GET | `/api/v1/admin/flights` | ADMIN | List all scheduled flights |
| POST | `/api/v1/admin/flights` | ADMIN | Create a new flight |
| PATCH | `/api/v1/admin/flights/:id` | ADMIN | Update flight details |
| DELETE | `/api/v1/admin/flights/:id` | ADMIN | Deactivate a flight |
| GET | `/health` | None | Liveness probe; returns `{ status: "ok", service: "mikunair-backend" }` |
| POST | `/graphql` | None | Flight search GraphQL endpoint |

## How the Frontend Is Built

The frontend is built with React 18 and TypeScript, using Vite 6 as the build tool and Tailwind CSS 4 for styling. Apollo Client drives the GraphQL flight search query. Axios handles all REST API calls. TanStack Query manages server state for REST responses (booking history, passenger profiles). React Router v6 handles client-side navigation.

The source layout is organised by feature module under `src/modules/`, with shared code under `src/shared/`.

```text
src/
  App.tsx                       route definitions; provider composition
  main.tsx                      application entry point
  modules/
    auth/                       login, registration, auth context, route guards
    search/                     home page, search form, results page, flight cards
    booking/                    booking flow wizard, passenger form, confirmation page
    profile/                    booking history, booking detail, flight history
    admin/                      admin flight management panel
  shared/
    api/
      apolloClient.ts           Apollo Client configured to POST /graphql
      axiosClient.ts            Axios instance with base URL and auth interceptor
    hooks/
      useFlightSearch.ts        Apollo query hook; calls searchFlights
      useBooking.ts             TanStack Query hooks for booking REST endpoints
      usePagination.ts          client-side pagination over an array
      useDebounce.ts            input debounce
      useLocalStorage.ts        typed localStorage hook (used for access token)
      useMediaQuery.ts          responsive breakpoint hook
      useToggle.ts              boolean toggle hook
      useWindowTitle.ts         document title management
      useClickOutside.ts        outside-click detection for dropdowns
    ui/
      Alert, Badge, Banner, Breadcrumbs, Button, Card, Divider, Drawer
      EmptyState, ErrorBoundary, Input, LoadingPage, Modal, NotFoundPage
      Pagination, ProgressBar, Select, SkipLink, Spinner, Tag, Tooltip
    utils/
      formatDate.ts             date/time display helpers
      formatDuration.ts         flight duration formatting (e.g. "2h 15m")
      formatPrice.ts            pence -> GBP display string (e.g. "GBP 85.00")
      classNames.ts             conditional CSS class concatenation
```

### Application Routes

| Path | Component | Auth |
| --- | --- | --- |
| `/` | `HomePage` | None |
| `/search` | `SearchResultsPage` | None |
| `/booking` | `BookingFlow` | None |
| `/booking/confirmation/:ref` | `ConfirmationPage` | None |
| `/auth/login` | `LoginPage` | None |
| `/auth/register` | `RegisterPage` | None |
| `/profile` | `ProfilePage` | Bearer required |
| `/profile/bookings/:ref` | `BookingDetailPage` | Bearer required |
| `/profile/history` | `FlightHistoryPage` | Bearer required |
| `/admin` | `AdminPage` | ADMIN role required |

All authenticated routes are wrapped in `ProtectedRoute`. The admin route is additionally wrapped in `AdminRoute`, which checks the role from the auth context and redirects to `/` if the user is not an admin.

### Authentication Flow

On login or registration, the backend returns an `accessToken` in the JSON body and sets a `refreshToken` in an HTTP-only SameSite=Strict cookie. The frontend stores the access token in memory via `AuthContext`, not in localStorage. The Axios client reads the token from context and attaches it as an `Authorization: Bearer` header on every subsequent request.

When the access token expires after 15 minutes, the client calls `POST /api/v1/auth/refresh`. That endpoint reads the cookie, verifies the refresh token, and issues a new access token without requiring the user to log in again. Logout calls `POST /api/v1/auth/logout` to clear the cookie and then removes the in-memory token.

### Flight Search Flow

The user fills the search form on `HomePage` or `SearchResultsPage`, providing an origin, destination, departure date, passenger count, cabin class, and trip type. The `useFlightSearch` hook sends a `searchFlights` GraphQL query to `POST /graphql`. The resolver runs two queries in parallel per direction: `findAvailable` for direct flights and `findConnecting` for connecting pairs.

Results are presented in four sections: outbound direct, outbound connecting, inbound direct (return trips only), and inbound connecting (return trips only). The user selects one option from the outbound section, and one from the inbound section for return trips, then clicks Continue to proceed to the booking step.

### Booking Flow

`BookingFlow` reads the selected flight IDs from the URL query string. The user fills a `PassengerForm` for each passenger, providing a full name, date of birth, document type, and document number. On submit, the client calls `POST /api/v1/bookings` with the flight IDs, seat class, and passenger array. The backend runs the atomic seat-lock transaction and returns a booking reference. The frontend then navigates to `/booking/confirmation/:ref`, which displays the reference and total price.

## How the Two Repositories Fit Together

```text
frontend (React SPA, Vite dev server on port 5173)
    sends GraphQL queries (flight search) to POST /graphql
    sends REST requests (auth, bookings, passengers) to /api/v1/*
    using a JWT bearer token for authenticated calls
    to backend (Express API, Node.js server on port 3000)
        which reads and writes through Drizzle ORM
        to PostgreSQL
```

The frontend holds no direct database access and no business logic. Every rule covering seat availability, booking cancellation eligibility, and GDPR erasure is enforced by the backend. The frontend is responsible for presenting those rules to the user, not for enforcing them.

In production the backend's CORS configuration must explicitly allow the frontend's origin via the `FRONTEND_URL` environment variable.

## Current Validation Snapshot

The latest local verification was completed on 2026-07-10 after the governance cleanup and Docker pass.

| Area | Status |
| --- | --- |
| Backend lint | Passed with `npm.cmd run lint` |
| Backend unit tests | Passed with `npm.cmd run test` (4 test files, 47 tests) |
| Backend production build | Passed with `npm.cmd run build` |
| Backend Docker image | Passed with `docker build --target production -t mikunair-backend:governance-check .` |
| Backend Compose config | Passed with `docker compose config` |
| Frontend lint | Passed with `npm.cmd run lint` |
| Frontend typecheck | Passed with `npm.cmd run typecheck` |
| Frontend unit and component tests | Passed with `npm.cmd run test` (20 test files, 144 tests) |
| Frontend production build | Passed with `npm.cmd run build` |
| Frontend Docker image | Passed with `docker build --target serve -t mikunair-frontend:governance-check .` |
| Frontend Compose config | Passed with `docker compose config` |

The frontend Docker build originally exposed a package lock mismatch for Playwright. `frontend/package-lock.json` has been synchronized with `package.json`, and the Docker build now completes. The frontend TypeScript setup also includes Node types and `playwright.config.ts`, so config files that use `process.env`, `node:path`, and `__dirname` are covered by typechecking.

Two validation items remain environment-dependent: local coverage runs hung in this Windows workspace, and the full Playwright E2E suite was not run locally because it requires backend, frontend, and PostgreSQL to run together. The CI workflow is configured to run that full-stack E2E path.

## Testing and Continuous Integration

Both repositories include automated tests and GitHub Actions workflows.

### Backend Tests

The backend uses Vitest with lightweight in-process mocks rather than a live database, making the suite fast and portable. The test files are:

| File | What it covers |
| --- | --- |
| `booking.service.test.ts` | `createBooking` happy path, overbooking prevention, cancellation, booking-not-found, forbidden access |
| `booking-reference.factory.test.ts` | Reference format, uniqueness, character-set constraints |
| `flight-availability.service.test.ts` | `searchFlights`, `searchConnectingFlights`, `assertSeatsAvailable` |
| `identity.service.test.ts` | Registration, login, duplicate email rejection, invalid credentials, GDPR erasure |

The CI workflow (`.github/workflows/backend-ci.yml`) runs: install, typecheck, lint, test with coverage, security audit, production build, and Docker image build.

### Frontend Tests

The frontend uses Vitest and React Testing Library. The test files are:

| File | What it covers |
| --- | --- |
| `AuthContext.test.tsx` | Login, logout, token refresh, state propagation |
| `LoginPage.test.tsx` | Login form submission, error display, loading state |
| `RegisterPage.test.tsx` | Registration form, validation, 409 duplicate email handling |
| `ProtectedRoute.test.tsx` | Redirect to `/auth/login` for unauthenticated users |
| `AdminRoute.test.tsx` | Redirect for non-admin users |
| `SearchForm.test.tsx` | Form field rendering, origin/destination swap, validation |
| `SearchForm.validation.test.ts` | Zod schema: invalid IATA codes, same-origin-destination rejection |
| `FlightCard.test.tsx` | Flight option display, price formatting, selection callback |
| `BookingFlow.test.tsx` | Passenger form rendering, API call on submit |
| `PassengerForm.validation.test.tsx` | Passenger Zod schema |
| `Modal.test.tsx` | Open/close, focus trap, keyboard dismiss |
| `Banner.test.tsx`, `Tooltip.test.tsx`, `Select.test.tsx`, `Pagination.test.tsx`, `ErrorBoundary.test.tsx` | Shared UI component behaviour |
| `formatDuration.test.ts`, `formatDate.test.ts`, `formatPrice.test.ts`, `classNames.test.ts` | Utility functions |

The CI workflow (`.github/workflows/frontend-ci.yml`) runs: install, typecheck, lint, unit and component tests with coverage, security audit, production build, and Docker image build. A separate `e2e` job, which runs after the main `ci` job, checks out the backend repository, starts a Postgres service container, runs database migrations and seeds, boots the full backend and frontend, and executes the Playwright suite.

### End-to-End Tests

Playwright E2E tests live in `frontend/tests/e2e/` and run against a full-stack environment (real backend + database) in CI.

| Spec | Journey |
| --- | --- |
| `booking-oneway.spec.ts` (E2E-001) | Guest one-way booking: search -> select flight -> fill passengers -> confirm |
| `booking-return.spec.ts` (E2E-002) | Authenticated return booking: select outbound and inbound -> confirm |
| `auth.spec.ts` (E2E-003) | Registration, login, wrong password, consent required, duplicate email, sign-out, route guards |
| `profile.spec.ts` (E2E-004) | Profile page structure, booking in history, status badges, detail navigation, GDPR erasure modal |
| `cancel-booking.spec.ts` (E2E-005) | Cancel a confirmed booking, dismiss without cancelling, already-cancelled guard |

## Project Metrics

The following figures describe the codebase.

| Metric | Backend | Frontend |
| --- | --- | --- |
| Source files | 48 | 91 |
| Runtime dependencies | 18 | 8 |
| Development dependencies | 22 | 22 |
| Backend test files | 4 |  -  |
| Frontend unit/component test files |  -  | 20 |
| E2E spec files |  -  | 5 |
| Database tables | 8 |  -  |
| REST endpoints | 17 |  -  |
| GraphQL queries | 1 (`searchFlights`) |  -  |

The backend exposes 17 REST endpoints across five route modules (identity, bookings, passengers, admin, health) plus one GraphQL endpoint. The data model defines eight Drizzle tables: `users`, `passenger_profiles`, `airports`, `flights`, `bookings`, `booking_segments`, `booking_passengers`, and `audit_log`.

## Current Known Limitations

These limitations are documented, not hidden, and represent the roadmap for future work.

The event bus is in-process. `booking.confirmed` and `booking.cancelled` events are consumed only by `NotificationService`, which currently logs a confirmation; no email is sent. A production deployment would replace the in-process bus with a durable broker (RabbitMQ or SQS) and integrate an email provider.

The admin panel in the frontend is a flight management screen only. User role management and audit log viewing require direct database access.

Refresh tokens are not rotated on use. Each call to `/auth/refresh` issues a new access token against the same long-lived refresh token. Rotation would improve the security posture if a refresh token were ever extracted from a cookie.

There is no rate limiting on authentication endpoints beyond the global 200 req/15 min limit. A per-IP brute-force limit on `/auth/login` and `/auth/register` is a clear improvement.

## Where to Look for More Detail

| Repository | Documentation |
| --- | --- |
| Root | `docs/GOVERNANCE-COMPLIANCE.md` |
| Backend | `backend/docs/requirements/REQ-001-backend-requirements.md` |
| Backend | `backend/docs/risk/RISK-001-backend-risk-assessment.md` |
| Backend | `backend/docs/security/SEC-001-backend-security-engineering.md` |
| Backend | `backend/docs/database/DATA-001-database-engineering.md` |
| Backend | `backend/docs/architecture/ARCH-001-backend-architecture.md` |
| Backend | `backend/docs/design/DESIGN-001-backend-design.md` |
| Backend | `backend/docs/quality/QUALITY-001-backend-testing-strategy.md` |
| Backend | `backend/docs/devops/DEVOPS-001-backend-deployment.md` |
| Backend | `backend/docs/adr/` (ADR-001 through ADR-005) |
| Backend | `backend/docs/changelog/CHANGELOG.md` |
| Frontend | `frontend/docs/requirements/REQ-001-frontend-requirements.md` |
| Frontend | `frontend/docs/risk/RISK-001-frontend-risk-assessment.md` |
| Frontend | `frontend/docs/security/SEC-001-frontend-security-engineering.md` |
| Frontend | `frontend/docs/architecture/ARCH-001-frontend-architecture.md` |
| Frontend | `frontend/docs/design/DESIGN-001-frontend-design.md` |
| Frontend | `frontend/docs/quality/QUALITY-001-frontend-testing-strategy.md` |
| Frontend | `frontend/docs/devops/DEVOPS-001-frontend-deployment.md` |
| Frontend | `frontend/docs/changelog/CHANGELOG.md` |

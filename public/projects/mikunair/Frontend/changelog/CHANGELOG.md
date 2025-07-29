# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [1.0.0] — 2026-06-26

### Added

**Backend implementation (Node.js/Express/TypeScript)**

- `backend/package.json` — full dependency manifest (Express, Drizzle ORM, GraphQL, Winston, Zod, bcrypt, JWT, Nodemailer, Vitest)
- `backend/tsconfig.json` + `tsconfig.build.json` — strict TypeScript configuration (ES2022, NodeNext modules)
- `backend/.eslintrc.json` — ESLint with TypeScript rules including `no-explicit-any`, `no-floating-promises`
- `backend/vitest.config.ts` — unit test config with 80% coverage thresholds on domain modules
- `backend/vitest.integration.config.ts` — integration test config (serial, 30s timeout)
- `backend/drizzle.config.ts` — Drizzle Kit config pointing at schema and migrations

**Shared infrastructure**
- `shared/database/schema.ts` — full Drizzle ORM schema: `users`, `passenger_profiles`, `airports`, `flights`, `bookings`, `booking_segments`, `booking_passengers`, `audit_log` (all enums, indexes, FK constraints)
- `shared/database/connection.ts` — pg Pool singleton + Drizzle db factory
- `shared/database/transaction.ts` — typed `withTransaction` helper
- `shared/database/migrate.ts` — standalone migration runner script
- `shared/logger/logger.ts` — Winston structured JSON logger with child logger support
- `shared/logger/sanitiser.ts` — PII sanitiser (strips 12 PII fields from log output, GDPR compliance)
- `shared/errors/domain-errors.ts` — 9 typed domain exception classes (FlightNotFoundError, NoSeatsAvailableError, BookingNotFoundError, BookingAlreadyCancelledError, ForbiddenError, UnauthorisedError, InvalidCredentialsError, ValidationError, InternalError)
- `shared/errors/error-handler.ts` — centralised Express error handler (no stack traces in responses)
- `shared/validation/schemas.ts` — Zod schemas for all API endpoints (register, login, booking, flight, passenger, search)
- `shared/events/event-bus.ts` — in-process EventEmitter event bus; `BookingConfirmedEvent`, `BookingCancelledEvent`
- `shared/auth/jwt.ts` — JWT sign/verify (15-min access token, 7-day refresh token)
- `shared/auth/middleware.ts` — `authenticate`, `optionalAuthenticate`, `requireRole` middleware
- `shared/auth/correlation.ts` — correlation ID injection middleware

**Identity module**
- `modules/identity/domain/identity.service.ts` — register (bcrypt cost 12), login, refreshTokens, requestErasure (GDPR)
- `modules/identity/repository/postgres-user.repository.ts` — IUserRepository implementation; `anonymise` nullifies all PII fields
- `modules/identity/handlers/auth.handlers.ts` — POST /auth/register, /auth/login, /auth/refresh, /auth/logout, /users/me/erasure
- `modules/identity/identity.router.ts` — route wiring

**Flight module**
- `modules/flight/domain/flight-availability.service.ts` — searchFlights, getFlightOrThrow, assertSeatsAvailable
- `modules/flight/repository/postgres-flight.repository.ts` — IFlightRepository implementation with compound search index query
- `src/graphql/schema.graphql` — GraphQL SDL (searchFlights query, FlightSearchResult, FlightOption, FareBreakdown, Airport, SeatClass enum)
- `src/graphql/resolvers.ts` — searchFlights resolver with outbound/inbound flight search

**Booking module**
- `modules/booking/domain/booking-reference.factory.ts` — 6-char alphanumeric reference generator (ambiguous chars excluded)
- `modules/booking/domain/booking.service.ts` — createBooking with `SELECT FOR UPDATE` atomic seat lock (FR-015 overbooking prevention), cancelBooking, getBookingHistory
- `modules/booking/repository/postgres-booking.repository.ts` — IBookingRepository implementation with segment/passenger hydration
- `modules/booking/handlers/booking.handlers.ts` — POST/GET/PATCH booking endpoints
- `modules/booking/booking.router.ts` — route wiring

**Passenger module**
- `modules/passenger/repository/postgres-passenger.repository.ts` — IPassengerRepository; `anonymiseByUserId` for GDPR erasure
- `modules/passenger/handlers/passenger.handlers.ts` — GET/POST/DELETE passenger profile endpoints
- `modules/passenger/passenger.router.ts` — route wiring

**Notification module**
- `modules/notification/notification.service.ts` — Nodemailer email dispatch on `booking.confirmed` event

**Admin module**
- `modules/admin/handlers/admin.handlers.ts` — ADMIN-only flight CRUD (list, create, update, deactivate)
- `modules/admin/admin.router.ts` — route wiring with `authenticate + requireRole('ADMIN')`

**App wiring**
- `src/app.ts` — Express app factory with full middleware stack (Helmet, CORS, rate limiter, compression, correlation ID, request logging, GraphQL, REST routes, error handler)
- `src/server.ts` — HTTP server with graceful SIGTERM/SIGINT shutdown
- `backend/Dockerfile` — 3-stage build (builder → development → production); non-root user in production
- `backend/scripts/validate-schema.ts` — GraphQL schema validation script (used in CI)
- `backend/.env.example` — environment variable reference

### Notes
- All fares stored as integer pence (DDR-002 — no floating-point money arithmetic)
- Overbooking prevention implemented via `SELECT FOR UPDATE` in PostgreSQL transaction (FR-015)
- PII never logged — sanitiser applied to all Winston output (GDPR)
- Stack traces never exposed in API responses (Security Rule)
- Business logic lives exclusively in domain services (Engineering Rule)
- Access token in memory only; refresh token in HTTP-only SameSite=Strict cookie (Security Rule)

---

## [0.1.0] — 2026-04-26

### Added
- Initial project documentation framework
- All six governance phases completed before implementation
- Engineering readiness confirmed

### Notes
- No implementation code yet. v0.1.0 marks the completion of all pre-implementation documentation.
- v1.0.0 marks the first complete, deployable backend implementation.


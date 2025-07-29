# Software Design Document

**Project:** MikunAir  
**Version:** v0.1.0  
**Status:** Approved  
**Date:** 2026-04-26  
**Author:** Festus-Olaleye Ayomikun  
**Depends On:** ARCH-001-software-architecture.md

---

## 1. Module Catalog

### Backend Modules

| Module | Responsibility | Dependencies |
|---|---|---|
| `flight` | Search availability, manage flight schedules, seat inventory | `shared/database`, `shared/logger` |
| `booking` | Booking lifecycle (create, confirm, cancel), reference generation, overbooking prevention | `flight`, `identity`, `shared/database`, `shared/events` |
| `identity` | User registration, login, JWT issuance, password hashing, GDPR erasure | `shared/database`, `shared/logger` |
| `passenger` | Saved passenger profile CRUD, PII anonymisation | `identity`, `shared/database` |
| `notification` | Email confirmation dispatch (event-driven) | `shared/events`, external SMTP |
| `admin` | Flight schedule CRUD, capacity view (admin-only) | `flight`, `booking`, `shared/auth` |
| `shared/auth` | JWT middleware, role enforcement | — |
| `shared/database` | Connection pool, transaction helpers, migration runner | — |
| `shared/events` | In-process event bus (EventEmitter wrapper) | — |
| `shared/logger` | Structured JSON logging with correlation ID | — |
| `shared/errors` | Domain exception classes, HTTP error mapper | — |
| `shared/validation` | Input validation schemas (Zod) | — |

### Frontend Modules

| Module | Responsibility |
|---|---|
| `search` | Search form, results list, flight card components |
| `booking` | Booking flow (passenger form, seat selection, confirmation) |
| `auth` | Login, registration, token management |
| `profile` | Booking history, saved passengers, GDPR deletion request |
| `admin` | Admin-only flight management UI |
| `shared/ui` | Design system components (Button, Input, Card, Modal) |
| `shared/api` | Axios HTTP client, Apollo GraphQL client, error handling |
| `shared/hooks` | Reusable React hooks (useAuth, useBooking, useFlightSearch) |

---

## 2. Interface Specifications

### IFlightRepository
```typescript
interface IFlightRepository {
  findAvailable(params: FlightSearchParams): Promise<Flight[]>;
  findById(id: string): Promise<Flight | null>;
  decrementSeatCount(flightId: string, seatClass: SeatClass, count: number, trx: Transaction): Promise<void>;
  create(flight: CreateFlightDTO): Promise<Flight>;
  update(id: string, flight: UpdateFlightDTO): Promise<Flight>;
  deactivate(id: string): Promise<void>;
}
```

### IBookingRepository
```typescript
interface IBookingRepository {
  create(booking: CreateBookingDTO, trx: Transaction): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByReference(reference: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus, trx: Transaction): Promise<void>;
  findAllForFlight(flightId: string): Promise<Booking[]>;
}
```

### IUserRepository
```typescript
interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  anonymise(userId: string, trx: Transaction): Promise<void>;
}
```

### BookingService Interface
```typescript
interface IBookingService {
  createBooking(dto: CreateBookingDTO, userId?: string): Promise<BookingConfirmation>;
  cancelBooking(bookingId: string, requestingUserId: string): Promise<void>;
  getBookingHistory(userId: string): Promise<Booking[]>;
}
```

---

## 3. REST API Design

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | None | Register new user |
| POST | `/api/v1/auth/login` | None | Login, returns JWT |
| POST | `/api/v1/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/v1/auth/logout` | JWT | Logout, clears refresh token |
| POST | `/api/v1/bookings` | Optional | Create booking (guest or user) |
| GET | `/api/v1/bookings` | JWT (USER) | Get user's booking history |
| GET | `/api/v1/bookings/:reference` | JWT | Get booking by reference |
| POST | `/api/v1/bookings/:id/cancel` | JWT | Cancel a booking |
| GET | `/api/v1/passengers` | JWT (USER) | Get saved passenger profiles |
| POST | `/api/v1/passengers` | JWT (USER) | Save a passenger profile |
| DELETE | `/api/v1/passengers/:id` | JWT (USER) | Delete a passenger profile |
| POST | `/api/v1/users/me/erasure` | JWT (USER) | GDPR data erasure request |
| GET | `/api/v1/admin/flights` | JWT (ADMIN) | List all flights |
| POST | `/api/v1/admin/flights` | JWT (ADMIN) | Create a flight |
| PATCH | `/api/v1/admin/flights/:id` | JWT (ADMIN) | Update a flight |
| DELETE | `/api/v1/admin/flights/:id` | JWT (ADMIN) | Deactivate a flight |
| GET | `/api/v1/health` | None | Health check |

---

## 4. GraphQL Schema (Flight Search)

```graphql
type Query {
  searchFlights(
    origin: String!
    destination: String!
    departureDate: String!
    passengers: Int!
    returnDate: String
    seatClass: SeatClass
  ): FlightSearchResult!
}

type FlightSearchResult {
  outbound: [FlightOption!]!
  inbound: [FlightOption!]
}

type FlightOption {
  id: ID!
  flightNumber: String!
  origin: Airport!
  destination: Airport!
  departureAt: String!
  arrivalAt: String!
  durationMinutes: Int!
  stops: Int!
  availableSeats: Int!
  farePerPassenger: FareBreakdown!
}

type FareBreakdown {
  baseFarePence: Int!
  taxesPence: Int!
  totalPence: Int!
  currency: String!
}

type Airport {
  iataCode: String!
  name: String!
  city: String!
  country: String!
}

enum SeatClass {
  ECONOMY
  BUSINESS
}
```

---

## 5. Domain Model Design

### Entities

**Flight**
- State: `SCHEDULED | CANCELLED | DEPARTED`
- Behaviour: `isAvailable(seatClass, count)` — returns false if available seats < requested count
- Invariant: seat counts are never negative

**Booking**
- State lifecycle: `PENDING → CONFIRMED → CANCELLED`
- Behaviour: `cancel()` — only from PENDING or CONFIRMED; emits `BookingCancelledEvent`
- Invariant: must have at least one BookingSegment and one BookingPassenger

**User**
- Behaviour: `anonymise()` — nullifies PII fields, sets `consent_withdrawn_at`
- Invariant: email unique, password_hash never null

### Value Objects

| Value Object | Description | Validation |
|---|---|---|
| `BookingReference` | 6-character alphanumeric, immutable | /^[A-Z0-9]{6}$/ |
| `IataCode` | 3-character uppercase airport code | /^[A-Z]{3}$/ |
| `MoneyAmount` | Integer pence, never negative | >= 0 |
| `SeatClass` | Enum: ECONOMY, BUSINESS | Enum validation |
| `BookingStatus` | Enum: PENDING, CONFIRMED, CANCELLED | Enum validation |

### Business Rules (enforced in domain services only)

1. Booking cannot be created if `flight.availableSeats(seatClass) < passengerCount` — enforced atomically via DB transaction with `SELECT FOR UPDATE`
2. A CANCELLED booking cannot be cancelled again — `BookingAlreadyCancelledError` thrown
3. GDPR erasure anonymises all PII but does NOT delete the Booking record (NFR-015: 7-year retention)
4. Fare prices are stored and calculated in integer pence — no floating-point arithmetic on money

---

## 6. Design Patterns

| Pattern | Applied Where | Justification |
|---|---|---|
| Repository | All data access | Decouples domain from persistence; enables unit test mock injection |
| Factory | `BookingReferenceFactory` | Encapsulates unique reference generation; keeps constructor clean |
| Strategy | `FareCalculationStrategy` | Different pricing rules without modifying Booking entity |
| Observer / Event Bus | `BookingConfirmedEvent → NotificationService` | Decouples notification from booking creation |
| Dependency Injection | All services | Constructor injection; no service locators; enables testing |
| Middleware Chain | Express request pipeline | Auth, logging, validation, error handling as composable middleware |

---

## 7. Error Handling Design

| Error | Domain Exception Class | HTTP Status | User-Facing Message |
|---|---|---|---|
| Flight not found | `FlightNotFoundError` | 404 | "Flight not found." |
| No seats available | `NoSeatsAvailableError` | 409 | "No seats available for this flight." |
| Booking not found | `BookingNotFoundError` | 404 | "Booking not found." |
| Unauthorised | `ForbiddenError` | 403 | "You do not have permission to perform this action." |
| Invalid credentials | `InvalidCredentialsError` | 401 | "Invalid email or password." |
| Validation failure | `ValidationError` | 422 | Field-specific Zod messages |
| Internal error | `InternalError` | 500 | "An unexpected error occurred. Reference: {correlationId}" |

**Rules:**
- Stack traces are never exposed in API responses (NFR-012)
- All errors logged with correlation ID before response is sent
- `500` responses include correlation ID so users can report them

---

## 8. Security Design

| Risk | Mitigation |
|---|---|
| Password exposure | bcrypt hash (cost 12); never stored or logged in plaintext |
| XSS / JWT theft | Access token in memory only; refresh token in HTTP-only cookie |
| CSRF on refresh | SameSite=Strict cookie; CSRF token for refresh endpoint |
| SQL injection | Drizzle ORM parameterised queries; no raw string interpolation |
| PII in logs | Log sanitiser strips name, DOB, document fields from log output |
| Data over-exposure | DTO projections on all responses; never raw DB entity serialisation |
| Admin abuse | ADMIN role verified in middleware before domain services are reached |
| GraphQL depth attacks | `graphql-depth-limit` middleware; max query depth = 5 |

---

## 9. Testability Assessment

Each module is independently testable:
- Domain services accept repository interfaces via constructor injection — unit tests inject mocks
- No domain service imports Express, Drizzle, or any HTTP/DB library
- Integration tests use a real test PostgreSQL instance via Docker Compose
- Frontend components are testable with React Testing Library without a running backend

---

## 10. Maintainability Assessment

| Factor | Assessment |
|---|---|
| Coupling | Low — modules communicate through interfaces only; no cross-module direct DB queries |
| Cohesion | High — each module owns its domain logic, data access contracts, and API handlers |
| Complexity | Moderate and justified — hybrid API pattern required by FR-019/FR-020 |
| Extensibility | New modules added without changes to existing ones |

---

## 11. Design Decision Records (DDRs)

### DDR-001: Zod for Input Validation

**Context:** Need a validation library for request bodies and query parameters.

**Options:** Joi, Yup, Zod

**Decision:** Zod — TypeScript-first, schema types can be inferred directly into domain DTOs, no manual type duplication.

**Consequences:** ✓ Type-safe validation with zero duplication. ✗ Slightly verbose for complex schemas.

---

### DDR-002: Integer Pence for Money Values

**Context:** Fare prices need to be stored and calculated without floating-point errors.

**Options:** Float (e.g. 125.50), Decimal string, Integer pence (12550)

**Decision:** Integer pence (e.g. £125.50 stored as `12550`). Division for display only, never for calculation.

**Consequences:** ✓ No rounding errors. ✓ Safe arithmetic. ✗ Requires formatting function for display.

---

### DDR-003: Drizzle ORM for Database Access

**Context:** Need an ORM or query builder for PostgreSQL.

**Options:** Prisma, TypeORM, Drizzle ORM, raw pg

**Decision:** Drizzle ORM — lightweight, TypeScript-native, SQL-close syntax, zero runtime overhead.

**Consequences:** ✓ Full type safety. ✓ SQL-level control. ✗ Less mature ecosystem than Prisma.

---

## 12. Learning Concept: Dependency Inversion Principle (DIP)

**What it is:** High-level modules (domain services) should not depend on low-level modules (database implementations). Both should depend on abstractions (interfaces). The PostgresBookingRepository depends on the IBookingRepository interface defined by the domain — not the other way around.

**Why chosen:** Directly enables NFR-010 (80% test coverage). BookingService tests inject a MockBookingRepository without touching PostgreSQL.

**How it improves the design:** Domain tests run in milliseconds. Swapping PostgreSQL requires only a new repository class — zero domain changes required.

**Trade-offs:** Requires interface definitions upfront. Overhead is small; payoff grows with business logic complexity.

**Interview discussion:** "My BookingService only knows about the IBookingRepository interface. The PostgreSQL implementation is injected at runtime. This means I can run 200 unit tests for the booking domain in under 2 seconds because none of them touch a real database. That's the Dependency Inversion Principle applied architecturally."

---

## Design Readiness Check

| Checkpoint | Status |
|---|---|
| Architecture reviewed and approved | ✓ |
| Module catalog produced | ✓ |
| Interface specifications defined | ✓ |
| Domain model designed | ✓ |
| REST + GraphQL API designed | ✓ |
| Design patterns selected with justification | ✓ |
| Error handling designed | ✓ |
| Security design reviewed | ✓ |
| Testability assessed | ✓ |
| Maintainability assessed | ✓ |
| Design Decision Records produced (3) | ✓ |
| DIP learning concept validated | ✓ |

**VERDICT: DESIGN APPROVED — Proceeding to Quality Engineering & Testing.**

---

*Document controlled under Version Control & Documentation Governance Framework.*  
*Next review: triggered by any module boundary change, new design pattern, or API contract change.*

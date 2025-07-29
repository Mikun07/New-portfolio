# Software Architecture Document

**Project:** MikunAir  
**Version:** v0.1.0  
**Status:** Approved  
**Date:** 2026-04-26  
**Author:** Festus-Olaleye Ayomikun  
**Depends On:** REQ-001-requirements-engineering.md

---

## 1. Architecture Drivers Analysis

Ranked by importance (derived from requirements):

| Rank | Driver | Source Requirements |
|---|---|---|
| 1 | Security | NFR-003–005, NFR-012, NFR-007 (GDPR) |
| 2 | Reliability | NFR-002, FR-015 (atomic overbooking prevention) |
| 3 | Maintainability | NFR-010, portfolio knowledge-transfer requirement |
| 4 | Testability | NFR-010, all quality gates |
| 5 | Performance | NFR-001, NFR-008 |
| 6 | Accessibility | NFR-006, NFR-014 |
| 7 | Scalability | NFR-009, NFR-013 |
| 8 | Compliance | NFR-007, NFR-015 |

---

## 2. Domain Decomposition

### Core Domain
**Flight Booking** — the irreplaceable business capability. Search, selection, and confirmation of flights.

### Supporting Domains
- **Identity & Access** — user registration, authentication, session management
- **Notification** — email confirmation delivery
- **Passenger Management** — saved profiles, PII lifecycle

### Generic Domains
- **Logging & Observability** — correlation IDs, structured logs
- **Configuration Management** — environment variables, secrets
- **API Gateway** — request routing, rate limiting, auth enforcement

---

## 3. Architecture Style Evaluation

| Style | Pros | Cons | Verdict |
|---|---|---|---|
| Microservices | Independent scaling, team autonomy | Extreme operational complexity for solo project; distributed tracing overhead | **Rejected** |
| Modular Monolith | Clean domain boundaries, simple deployment, easy to test | Single deployment unit | **Selected** |
| Clean Architecture | Strict dependency rules, highly testable, technology-agnostic core | More boilerplate upfront | **Applied within Modular Monolith** |
| Event-Driven | Loose coupling, async processing | Complex to debug; requires message broker | **Partially adopted** (notifications only) |

**Selected Architecture:** Modular Monolith with Clean Architecture layers — two runtimes (React SPA + Node.js/Express backend), with bounded module structure that could be extracted to microservices if scale required.

**Why not microservices:** For a portfolio project with a single developer, microservices introduce distributed systems complexity (service discovery, inter-service auth, distributed tracing, network partitions) without demonstrable value. The modular monolith delivers all the same architectural discipline — bounded contexts, domain isolation, dependency rules — without the operational overhead.

---

## 4. Architectural Decision Records (ADRs)

### ADR-001: Modular Monolith Backend

**Context:** Required to choose between monolith, modular monolith, and microservices for the API layer.

**Options Considered:**
1. Pure monolith — simple but no domain boundaries
2. Modular monolith — domain boundaries enforced by module structure, single deployable
3. Microservices — independent services per domain

**Decision:** Modular Monolith (Node.js/Express, TypeScript)

**Consequences:**
- ✓ Clear module boundaries demonstrable in interviews
- ✓ Single deployment unit simplifies DevOps
- ✓ Easily testable with unit and integration tests
- ✗ All modules share the same process (mitigated by strict module boundaries)

---

### ADR-002: React + TypeScript Frontend (SPA)

**Context:** Frontend framework selection.

**Options Considered:**
1. Next.js — SSR/SSG, file-based routing, excellent SEO
2. React SPA (Vite) — simpler, client-side only, faster development loop
3. Vue.js — smaller ecosystem match to SAS job description

**Decision:** React + TypeScript SPA with Vite, using React Router for client-side routing.

**Consequences:**
- ✓ Directly matches SAS job description (React.js)
- ✓ TypeScript enforces type safety end-to-end
- ✓ Vite provides fast dev server and optimised production builds
- ✗ No server-side rendering (acceptable; SEO not a requirement for prototype)

---

### ADR-003: PostgreSQL as Primary Database

**Context:** Database selection for booking and user data.

**Options Considered:**
1. PostgreSQL — relational, ACID transactions, strong typing
2. MongoDB — flexible schema, no ACID by default
3. SQLite — simple but not production-grade

**Decision:** PostgreSQL

**Consequences:**
- ✓ ACID transactions support FR-015 (atomic overbooking prevention)
- ✓ Demonstrates familiarity with Postgres (listed in SAS JD)
- ✓ Supports row-level security for GDPR isolation
- ✗ Schema migrations required as domain evolves (managed with migration tool)

---

### ADR-004: JWT Authentication (Stateless)

**Context:** Authentication strategy for user sessions.

**Options Considered:**
1. JWT (stateless) — scalable, no server-side session state
2. Session cookies (stateful) — simpler revocation, requires session store
3. OAuth2 / third-party — reduces auth implementation burden

**Decision:** JWT with 15-minute access token + refresh token stored in HTTP-only cookie.

**Consequences:**
- ✓ Stateless — supports NFR-009 (horizontal scaling)
- ✓ Industry standard pattern, discussable in interviews
- ✓ HTTP-only cookie for refresh token mitigates XSS risk
- ✗ Access token revocation requires blacklist (mitigated by short 15-min expiry)

---

### ADR-005: GraphQL for Flight Search, REST for Booking Operations

**Context:** FR-019 and FR-020 require both GraphQL and REST. Need to decide scope boundaries.

**Options Considered:**
1. GraphQL only — flexible queries, single endpoint
2. REST only — simpler, well-understood
3. Hybrid — GraphQL for read-heavy flexible queries, REST for mutations/operations

**Decision:** Hybrid. GraphQL for flight search (read-heavy, variable field selection). REST for booking CRUD (clear resource semantics, easier caching, auditability).

**Consequences:**
- ✓ Satisfies both FR-019 and FR-020
- ✓ Demonstrates both API paradigms (directly aligned with SAS JD)
- ✓ GraphQL excels at flexible search result shapes
- ✗ Slightly higher backend complexity (two paradigms to maintain)

---

## 5. Component Architecture

```
┌──────────────────────────────────────────────────────┐
│                   React SPA (Frontend)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Search  │  │ Booking  │  │  Auth / Profile  │   │
│  │  Module  │  │  Module  │  │     Module       │   │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │              │                 │              │
│  ┌────▼──────────────▼─────────────────▼──────────┐  │
│  │              API Client Layer (Axios/Apollo)    │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────┬────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼────────────────────────────┐
│               Node.js / Express Backend               │
│  ┌───────────────────────────────────────────────┐   │
│  │              API Gateway Layer                │   │
│  │  (Auth middleware, rate limiting, CORS, logs) │   │
│  └───────┬────────────────────────┬──────────────┘   │
│          │                        │                   │
│  ┌───────▼────────┐    ┌──────────▼─────────┐        │
│  │  GraphQL API   │    │    REST API         │        │
│  │  (Flight       │    │  (Bookings, Users,  │        │
│  │   Search)      │    │   Admin, GDPR)      │        │
│  └───────┬────────┘    └──────────┬──────────┘        │
│          │                        │                   │
│  ┌───────▼────────────────────────▼──────────────┐   │
│  │              Domain Layer (Modules)            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────┐  │   │
│  │  │  Flight  │ │ Booking  │ │   Identity    │  │   │
│  │  │  Module  │ │  Module  │ │    Module     │  │   │
│  │  └────┬─────┘ └────┬─────┘ └───────┬───────┘  │   │
│  └───────┼────────────┼───────────────┼──────────┘   │
│          │            │               │               │
│  ┌───────▼────────────▼───────────────▼──────────┐   │
│  │            Data Access Layer                  │   │
│  │         (Repository Pattern)                  │   │
│  └───────────────────┬───────────────────────────┘   │
└──────────────────────┼───────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| React SPA | Renders UI, manages client-side routing and state, calls backend APIs |
| API Gateway Layer | Auth enforcement, request logging, CORS, rate limiting, correlation ID injection |
| GraphQL API | Handles flight search queries with flexible field selection |
| REST API | Handles booking CRUD, user management, admin operations |
| Flight Module | Domain logic for flight availability, search, seat inventory |
| Booking Module | Domain logic for booking lifecycle, overbooking prevention, reference generation |
| Identity Module | User registration, authentication, JWT issuance, GDPR erasure |
| Data Access Layer | Repository pattern abstracting all database operations |
| PostgreSQL | Persistent storage with ACID transactions |

---

## 6. Data Architecture

### Core Data Model (Logical)

```
User
├── id (UUID)
├── email (unique, indexed)
├── password_hash
├── consent_given_at
├── consent_withdrawn_at (nullable)
└── created_at

PassengerProfile (saved profiles for registered users)
├── id (UUID)
├── user_id (FK → User)
├── full_name
├── date_of_birth
├── document_type (PASSPORT | ID_CARD)
├── document_number
└── is_anonymised (bool, default false)

Airport
├── iata_code (PK, 3-char)
├── name, city, country, timezone

Flight
├── id (UUID)
├── flight_number
├── origin_iata (FK → Airport)
├── destination_iata (FK → Airport)
├── departure_at (timestamptz)
├── arrival_at (timestamptz)
├── economy_seats_total / available
├── business_seats_total / available
├── economy_fare_pence (integer — avoids float rounding errors)
├── business_fare_pence (integer)
└── status (SCHEDULED | CANCELLED | DEPARTED)

Booking
├── id (UUID)
├── reference (6-char unique alphanumeric)
├── user_id (FK → User, nullable for guest)
├── status (PENDING | CONFIRMED | CANCELLED)
├── created_at / updated_at

BookingSegment
├── id (UUID)
├── booking_id (FK → Booking)
├── flight_id (FK → Flight)
└── seat_class (ECONOMY | BUSINESS)

BookingPassenger
├── id (UUID)
├── booking_id (FK → Booking)
├── full_name, date_of_birth, document_type, document_number
└── is_anonymised (bool, default false)

AuditLog
├── id (UUID)
├── correlation_id
├── entity_type / entity_id
├── action
├── actor_id (nullable)
└── occurred_at
```

### Data Consistency Strategy

| Operation | Consistency Model | Mechanism |
|---|---|---|
| Booking creation + seat decrement | Strong | `SELECT FOR UPDATE` within PostgreSQL transaction |
| GDPR erasure | Strong | Explicit UPDATE query across PII fields within transaction |
| Email notification | Eventual | Event emitted post-commit; retry on failure |
| Audit logging | Eventual | Written after successful operation |

---

## 7. Quality Attribute Analysis

| Attribute | Architectural Decision |
|---|---|
| Performance | Indexed DB columns on origin, destination, departure_at; connection pooling; Vite bundle optimisation |
| Scalability | Stateless JWT — horizontal API scaling via container replication |
| Reliability | DB transactions for booking atomicity; health check endpoints; Docker restart policies |
| Security | JWT + HTTP-only cookies; bcrypt cost 12; TLS at reverse proxy; no stack traces in API responses |
| Accessibility | Component library with ARIA; axe-core automated testing in CI |
| Maintainability | Module boundaries; Repository pattern; TypeScript throughout |
| Compliance | GDPR anonymisation; consent capture; AuditLog for all state transitions |
| Testability | Repository pattern enables mock injection; domain layer has no framework dependencies |

---

## 8. Cross-Cutting Concerns

| Concern | Strategy |
|---|---|
| Authentication | JWT middleware at API Gateway; all protected routes require valid token |
| Authorization | Role-based (USER, ADMIN); enforced in domain services, not controllers |
| Logging | Structured JSON logs (Winston); correlation ID injected at request entry |
| Monitoring | `/health` endpoint; `/metrics` Prometheus-compatible endpoint |
| Observability | Correlation ID propagated through all layers; AuditLog captures booking lifecycle |
| Error Handling | Centralised error handler maps domain exceptions to HTTP codes; no stack traces exposed |
| Configuration | Environment variables via `.env`; never hardcoded; secrets excluded from git |
| Secrets | `.env.local` for dev; container environment variables at runtime in production |
| Auditing | AuditLog records all booking state transitions with actor, timestamp, correlation ID |

---

## 9. Deployment Architecture

### Local Development
- Docker Compose: frontend (Vite), backend (Node.js), PostgreSQL
- `.env.local` configuration
- Hot reload enabled

### Staging
- Docker Compose on Azure Container Instance or VPS
- Secrets injected via CI/CD secrets
- HTTPS via Azure-managed certificate

### Production (Target)
- Azure Container Apps (scale-to-zero)
- Azure Database for PostgreSQL (managed)
- Azure Container Registry
- GitHub Actions CI/CD

---

## 10. Testability Assessment

| Test Type | Architecture Support |
|---|---|
| Unit | Domain services have no framework dependencies — pure functions testable in isolation |
| Integration | Repository pattern supports real DB integration tests with test database |
| Contract | GraphQL schema + OpenAPI spec define contracts |
| E2E | Playwright against running full stack |
| Performance | Stateless API supports k6 load testing |
| Security | JWT, CORS, rate limiting all testable via API integration tests |

---

## 11. Maintainability Assessment

| Factor | Assessment |
|---|---|
| Coupling | Low — modules communicate through defined interfaces only |
| Cohesion | High — each module owns domain logic, data access, and API handlers |
| Complexity | Moderate — hybrid GraphQL/REST is justified by FR-019/FR-020 |
| Extensibility | New domain module requires no changes to existing modules |
| Technical Debt Risk | None at architecture level. Won't Have items explicitly excluded. |

---

## 12. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Race condition on last available seat | High | Medium | `SELECT FOR UPDATE` in DB transaction |
| JWT theft via XSS | High | Low | HTTP-only cookie for refresh token; short-lived access tokens |
| GDPR erasure incomplete | High | Low | Anonymisation tested; covers all PII fields explicitly |
| DB migration breaks running system | Medium | Medium | Drizzle ORM migrations; run in CI before deployment |
| GraphQL complexity attacks | Medium | Low | Query depth limiting middleware |

---

## 13. Learning Concept: Clean Architecture

**What it is:** Clean Architecture (Robert C. Martin) organises code into concentric layers — Entities (domain), Use Cases (application logic), Interface Adapters (controllers, repositories), and Frameworks/Drivers. The Dependency Rule: source code dependencies may only point inward. The domain layer has no knowledge of Express, React, or PostgreSQL.

**Why chosen:** The booking domain has non-trivial rules (overbooking prevention, booking lifecycle, GDPR erasure) that must be unit-testable without a running database or HTTP server.

**How it improves the system:** Domain services (FlightAvailabilityService, BookingService) can be tested without mocking Express or PostgreSQL. The repository interface is defined in the domain; implementations live in the infrastructure layer.

**Trade-offs:** More initial boilerplate than a simple layered Express app. Justified for a portfolio project because it demonstrates architectural maturity.

**Interview discussion:** "I applied Clean Architecture to ensure the core booking domain logic is testable in isolation. The BookingService doesn't know about Express or PostgreSQL — it only depends on the IBookingRepository interface. This is the Dependency Inversion Principle applied at the architectural level."

---

## Architecture Readiness Check

| Checkpoint | Status |
|---|---|
| Architecture drivers ranked | ✓ |
| Domain decomposed | ✓ |
| Architecture style selected with justification | ✓ |
| ADRs produced (5) | ✓ |
| Component architecture designed | ✓ |
| Data architecture designed | ✓ |
| Quality attributes addressed | ✓ |
| Cross-cutting concerns designed | ✓ |
| Deployment architecture defined | ✓ |
| Testability reviewed | ✓ |
| Maintainability reviewed | ✓ |
| Risk assessment completed | ✓ |

**VERDICT: ARCHITECTURE APPROVED — Proceeding to Software Design.**

---

*Document controlled under Version Control & Documentation Governance Framework.*  
*Next review: triggered by any architectural change or new ADR.*

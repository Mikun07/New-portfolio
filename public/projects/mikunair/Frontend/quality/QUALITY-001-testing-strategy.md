# Quality Engineering & Testing Strategy

**Project:** MikunAir  
**Version:** v0.1.0  
**Status:** Approved  
**Date:** 2026-04-26  
**Author:** Festus-Olaleye Ayomikun  
**Depends On:** DESIGN-001-software-design.md

---

## 1. Quality Attribute Analysis

Quality attributes ranked by business importance:

| Rank | Attribute | Source |
|---|---|---|
| 1 | Reliability | NFR-002, FR-015 (no overbooking) |
| 2 | Security | NFR-003–005, NFR-012 |
| 3 | Correctness | All functional requirements |
| 4 | Accessibility | NFR-006, NFR-014 |
| 5 | Performance | NFR-001, NFR-008 |
| 6 | Maintainability | NFR-010 |
| 7 | Compliance (GDPR) | NFR-007, NFR-015 |

---

## 2. Quality Risk Assessment

### Business Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Overbooking — passenger books a full flight | High | Medium | Atomic DB transaction with SELECT FOR UPDATE; integration test for concurrent bookings |
| GDPR erasure incomplete PII fields not anonymised | High | Low | Explicit field list in anonymisation query; integration test verifying zero PII post-erasure |
| Confirmation email not sent | Medium | Low | Event-driven notification; retry logic; integration test verifying email dispatch |

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Race condition on seat decrement | High | Medium | Integration test simulating concurrent requests to same flight |
| JWT validation bypass | High | Low | Security integration tests for protected endpoints without/with expired/invalid tokens |
| Search index missing — slow search | Medium | Medium | Performance test; DB index defined in migration; verified in CI |
| Form validation bypassed via API | Medium | Low | Validation at API layer (Zod); unit tests for all schema rules |

### Security Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| SQL injection via search params | High | Low | Parameterised queries (Drizzle ORM); security integration test with injection strings |
| Unauthenticated access to admin endpoints | High | Low | Auth middleware unit test; integration test for each admin route without ADMIN role |
| XSS via booking reference display | Medium | Low | React escapes by default; no `dangerouslySetInnerHTML`; CSP headers |

---

## 3. Test Strategy

### Testing Pyramid

```
         ┌─────────────┐
         │   E2E (10%) │  ← Playwright: 3–5 critical user journeys
         ├─────────────┤
         │ Integration  │  ← Supertest + real DB: all API routes + concurrent booking
         │   (30%)     │
         ├─────────────┤
         │  Unit (60%) │  ← Vitest: all domain services, value objects, repositories (mocked)
         └─────────────┘
```

| What is tested | Why | When | Who |
|---|---|---|---|
| Domain services | Core business logic correctness | Pre-commit (unit) | Developer |
| API endpoints | Integration between layers | CI on every push | CI pipeline |
| Concurrent booking | Race condition prevention | CI on every push | CI pipeline |
| Authentication flows | Security boundary | CI on every push | CI pipeline |
| Critical user journeys | End-to-end correctness | CI on PR merge | CI pipeline |
| Accessibility | WCAG 2.1 AA compliance | CI on every push | CI pipeline |
| Performance | Search response time | CI nightly | CI pipeline |

---

## 4. Unit Testing Plan

**Framework:** Vitest (TypeScript-native, Vite-compatible)

**Components to unit test:**

| Component | Scope | Mocking Strategy |
|---|---|---|
| `BookingService.createBooking` | Overbooking prevention, reference generation, event emission | Mock IBookingRepository, IFlightRepository, EventBus |
| `BookingService.cancelBooking` | Status transition validation, authorization check | Mock IBookingRepository |
| `IdentityService.register` | Password hashing, duplicate detection, consent recording | Mock IUserRepository |
| `IdentityService.login` | Credential validation, JWT issuance | Mock IUserRepository |
| `IdentityService.anonymise` | All PII fields cleared correctly | Mock IUserRepository, verify anonymised DTO |
| `FlightAvailabilityService` | Seat availability check logic | Mock IFlightRepository |
| `BookingReferenceFactory` | Uniqueness, format (6-char alphanumeric) | No mocks needed — pure function |
| `MoneyAmount` value object | Non-negative invariant, formatting | No mocks needed |
| `BookingStatus` transitions | Valid and invalid transitions | No mocks needed |
| Zod validation schemas | All valid and invalid inputs for each endpoint | No mocks needed |

**Coverage Target:** 80% minimum on all business logic modules (NFR-010).

**Rules:**
- Never test implementation details — test behaviour
- One assertion per test where possible
- Test names follow: `should [do X] when [condition Y]`

---

## 5. Integration Testing Plan

**Framework:** Supertest + real PostgreSQL (Docker Compose test environment)

**Test Database:** Isolated test DB, reset between test suites via migration rollback.

| Test Scenario | Endpoint / Operation | Assertion |
|---|---|---|
| Flight search returns results | `GET /graphql` (searchFlights) | Status 200, results array non-empty |
| Flight search returns empty | `GET /graphql` (no matching flights) | Status 200, empty results array |
| Guest booking creation | `POST /api/v1/bookings` | Status 201, booking reference returned |
| Concurrent booking only one succeeds | `POST /api/v1/bookings` × 2 simultaneous on last seat | One 201, one 409 — no overbooking |
| User registration | `POST /api/v1/auth/register` | Status 201, token returned |
| Login with valid credentials | `POST /api/v1/auth/login` | Status 200, JWT returned |
| Login with invalid credentials | `POST /api/v1/auth/login` (wrong password) | Status 401 |
| Access protected endpoint without token | `GET /api/v1/bookings` (no auth header) | Status 401 |
| Access admin endpoint as USER | `POST /api/v1/admin/flights` (USER role) | Status 403 |
| Cancel a booking | `POST /api/v1/bookings/:id/cancel` | Status 200, status = CANCELLED |
| Cancel already-cancelled booking | `POST /api/v1/bookings/:id/cancel` twice | Second call returns 409 |
| GDPR erasure | `POST /api/v1/users/me/erasure` then `GET /api/v1/users/me` | PII fields are [REDACTED] |
| SQL injection in search | `searchFlights(origin: "'; DROP TABLE flights; --")` | Status 422 or empty results no DB error |

---

## 6. Contract Testing Plan

**Approach:** OpenAPI (REST) + GraphQL schema-based contract validation.

| Contract | Provider | Consumer | Validation Method |
|---|---|---|---|
| REST API v1 | Node.js backend | React frontend | OpenAPI spec validated in CI; Zod schemas match OpenAPI types |
| GraphQL Search API | Node.js backend | React Apollo client | GraphQL schema introspection; Apollo codegen generates typed hooks |

**Breaking Change Detection:**
- OpenAPI spec version-controlled in `docs/api/openapi.yaml`
- GraphQL schema version-controlled in `backend/src/graphql/schema.graphql`
- CI step runs `graphql-inspector` to detect breaking schema changes on every PR

---

## 7. End-to-End Testing Plan

**Framework:** Playwright (TypeScript)

**Critical User Journeys:**

| Journey | Steps | Pass Criteria |
|---|---|---|
| One-way booking (guest) | Search → Select flight → Enter passenger → Confirm | Booking reference displayed; no errors |
| Return flight booking (guest) | Search with return date → Select outbound + inbound → Passenger → Confirm | Both segments in confirmation |
| User registration and login | Register → Login → View dashboard | Dashboard shows user's bookings |
| View booking history | Login → Navigate to bookings | At least one booking listed |
| Cancel a booking | Login → Bookings → Cancel → Confirm | Booking status shows CANCELLED |

**Environment:** Playwright runs against Docker Compose full-stack environment in CI.

---

## 8. Performance Testing Plan

**Framework:** k6

**Performance Goals (from NFR-001, NFR-008):**

| Metric | Target | Test Type |
|---|---|---|
| Flight search P95 response time | < 2000ms under 100 concurrent users | Load test |
| Booking creation P95 response time | < 3000ms under 50 concurrent users | Load test |
| Frontend Lighthouse score (mobile) | ≥ 80 | Lighthouse CI |
| API error rate under load | < 1% | Load test |

**k6 script:** `tests/performance/search-load.js` — 100 virtual users, 5-minute duration.

**Thresholds:** k6 test fails CI if P95 exceeds target or error rate exceeds 1%.

---

## 9. Security Testing Plan

| Test Area | Method | Assertion |
|---|---|---|
| Authentication bypass | Call protected endpoints without JWT | All return 401 |
| Role escalation | USER calls ADMIN endpoint | Returns 403 |
| Expired JWT | Send expired access token | Returns 401 |
| Invalid JWT signature | Tamper with JWT payload | Returns 401 |
| SQL injection in search | Pass malformed SQL in query params | Returns 422 or safe empty result |
| GraphQL depth attack | Send deeply nested query (depth > 5) | Returns 400 (depth limit exceeded) |
| Rate limiting | Send 200 requests in 1 minute | Returns 429 after threshold |
| CSRF on refresh | POST to refresh without SameSite cookie | Rejected |

**Tools:** Supertest integration tests + OWASP ZAP baseline scan in CI (optional for portfolio).

---

## 10. Accessibility Testing Plan

**Standard:** WCAG 2.1 Level AA (NFR-006)

| Test Method | Tool | When | Assertion |
|---|---|---|---|
| Automated component scan | axe-core (via `@axe-core/react`) | Unit/component tests | Zero critical violations per component |
| Full-page accessibility audit | Playwright + axe | E2E tests | Zero critical violations per page |
| Keyboard navigation | Playwright keyboard events | E2E tests | All interactive elements reachable by Tab; Enter/Space activates controls |
| Screen reader simulation | Manual (NVDA / VoiceOver) | Pre-release | All content announced correctly |
| Colour contrast | axe-core | Automated CI | AA contrast ratio ≥ 4.5:1 for normal text |

---

## 11. Quality Gates

All gates must pass before deployment is permitted.

| Gate | Condition | Failure Action |
|---|---|---|
| Build Gate | TypeScript compilation succeeds with zero errors | Block merge |
| Lint Gate | ESLint zero critical violations; Prettier formatted | Block merge |
| Unit Test Gate | All unit tests pass; coverage ≥ 80% on business logic | Block merge |
| Integration Test Gate | All integration tests pass | Block merge |
| Accessibility Gate | Zero axe-core critical violations | Block merge |
| Security Gate | No high-severity vulnerabilities (`npm audit`) | Block merge |
| Contract Gate | No breaking changes in OpenAPI / GraphQL schema | Block merge |
| Performance Gate | P95 search ≤ 2000ms; error rate ≤ 1% | Block deployment to staging |

---

## 12. Test Data Strategy

| Strategy | Detail |
|---|---|
| Seed data | `tests/fixtures/seed.sql` — airports, flights, test users pre-loaded for integration tests |
| Test database isolation | Separate `flight_booking_test` database; reset via migration rollback before each suite |
| No production data | All test data is synthetic; no PII from real users ever used |
| Booking reference collisions | Factory generates references with UUID-seeded randomness to avoid test conflicts |

---

## 13. Defect Management Strategy

| Step | Process |
|---|---|
| Detection | Automated test failure in CI; manual testing; accessibility audit |
| Classification | P1 (data loss, security, overbooking), P2 (functional failure), P3 (UX), P4 (cosmetic) |
| Root Cause Analysis | Every P1/P2 bug requires RCA comment in the fix PR |
| Regression Prevention | Bug fix must include a regression test that would have caught the issue |

---

## 14. Quality Metrics

| Metric | Target | Collection | Review Frequency |
|---|---|---|---|
| Unit test coverage (business logic) | ≥ 80% | Vitest coverage (CI) | Every PR |
| Integration test pass rate | 100% | CI pipeline | Every push |
| E2E test pass rate | 100% | CI pipeline | Every PR merge |
| Accessibility violations (critical) | 0 | axe-core CI | Every push |
| Build success rate | ≥ 95% | GitHub Actions | Weekly |
| Security vulnerability count (high+critical) | 0 | npm audit CI | Every push |
| P95 search response time | ≤ 2000ms | k6 nightly | Nightly |

---

## 15. Testability Assessment

| Area | Assessment |
|---|---|
| Domain services | Excellent constructor-injected interfaces; no framework dependencies |
| Repositories | Testable via integration tests with real DB; mockable for unit tests |
| API layer | Testable with Supertest; no hidden global state |
| React components | Testable with React Testing Library; no tight coupling to routing or context |
| Concurrent booking | Testable via parallel Supertest requests in integration test |

---

## 16. Learning Concept: Contract Testing

**What it is:** Contract testing verifies that two services (a provider and a consumer) agree on an API contract — the shape of requests and responses — independently of each other. Instead of running a full integration test requiring both services, each side tests against a shared contract definition.

**Why chosen:** The React frontend (consumer) and Node.js backend (provider) must agree on the GraphQL schema and REST response shapes. A breaking schema change (e.g. renaming a field) would silently break the frontend. Contract testing catches this in CI before deployment.

**How it improves quality:** Breaking changes are caught at the earliest possible point — during CI on the PR that introduces them — not when a user reports a blank screen in production.

**Trade-offs:** Contract files must be kept in sync. For a single-team project, a shared TypeScript types package achieves similar guarantees with less overhead; consumer-driven contract testing (Pact) adds more value in multi-team settings.

**Interview discussion:** "I use GraphQL schema introspection and Apollo codegen to generate TypeScript types for my React components directly from the backend schema. If I change the GraphQL API in a breaking way, the TypeScript compiler fails on the frontend immediately. That's contract enforcement at compile time."

---

## Quality Readiness Check

| Checkpoint | Status |
|---|---|
| Quality attributes ranked | ✓ |
| Risk assessment completed | ✓ |
| Test strategy defined (pyramid) | ✓ |
| Unit testing plan completed | ✓ |
| Integration testing plan completed | ✓ |
| Contract testing plan completed | ✓ |
| E2E testing plan completed | ✓ |
| Performance testing plan completed | ✓ |
| Security testing plan completed | ✓ |
| Accessibility testing plan completed | ✓ |
| Quality gates defined | ✓ |
| Test data strategy defined | ✓ |
| Defect management strategy defined | ✓ |
| Quality metrics defined | ✓ |
| Testability assessed | ✓ |
| Contract testing learning concept validated | ✓ |

**VERDICT: QUALITY STRATEGY APPROVED — Proceeding to DevOps & Deployment.**

---

*Document controlled under Version Control & Documentation Governance Framework.*  
*Next review: triggered by any new feature, new API endpoint, or test failure pattern.*

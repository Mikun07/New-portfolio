# Requirements Engineering Document

**Project:** MikunAir  
**Version:** v0.1.0  
**Status:** Approved  
**Date:** 2026-04-26  
**Author:** Festus-Olaleye Ayomikun

---

## 1. Problem Definition Report

### Problem Statement

Travellers booking flights today face fragmented, slow, and error-prone digital experiences. Search results are unclear, multi-passenger bookings require repeated data entry, and users frequently lose booking context due to session expiry or navigation errors.

**Specific problem:** No professional-grade flight booking prototype exists in this portfolio that demonstrates full-stack engineering competence aligned with airline industry systems.

**Why it exists:** Airline booking systems evolved from legacy GDS infrastructure, producing interfaces that are technically complex but user-hostile. Modern travellers expect sub-second search, clear pricing, and mobile-first experiences.

**Who is affected:** Leisure travellers, business travellers, travel administrators.

**Consequence if unsolved:** Users abandon bookings, airlines lose revenue, and this portfolio lacks a strong enterprise-relevant project.

---

## 2. Stakeholder Analysis

| Stakeholder | Goals | Frustrations | Needs | Constraints |
|---|---|---|---|---|
| Guest Traveller | Find and book a flight quickly | Unclear pricing, slow search | Fast search, clear totals, email confirmation | No account required |
| Registered Traveller | Save preferences, view history | Re-entering data every time | Saved passengers, booking history | Must log in |
| Travel Administrator | Book for multiple passengers | Bulk data entry, no group tools | Multi-passenger flow, printable itinerary | Internal access only |
| System Administrator | Manage flight data | No admin UI | CRUD for flights/routes via API | Internal access only |
| Regulator (GDPR) | Ensure data privacy | Data stored longer than needed | Data minimisation, consent, erasure rights | EU GDPR binding |
| Future Developer | Extend the system | Missing docs, unclear boundaries | Clean API, documented architecture | Monorepo structure |

---

## 3. Domain Model

### Key Entities

| Entity | Description |
|---|---|
| Flight | Scheduled service between two airports. Has departure/arrival times, operated aircraft, available seat inventory. |
| Route | Directional pair of airports (origin → destination). |
| Airport | IATA code, city, country, timezone. |
| Passenger | Name, date of birth, document type/number, contact info. |
| Booking | One or more passengers on one or more flight segments. Lifecycle: PENDING → CONFIRMED → CANCELLED. |
| Booking Reference | Unique 6-character alphanumeric identifier (e.g. ABC123). |
| Seat | Position on an aircraft. Attributes: class (Economy/Business), availability. |
| Fare | Price rule applied to a seat/class combination, inclusive of taxes. |
| Payment | Transactional record associated with a booking (mocked in prototype). |
| User Account | Registered user identity with authentication credentials. |

### Domain Rules

- A booking must have at least one passenger and one flight segment.
- A flight cannot be overbooked — seat inventory must be checked atomically before confirmation.
- A booking in CONFIRMED state can only be cancelled, not modified.
- GDPR: passenger PII must be deletable on request; explicit consent must be captured at registration.

---

## 4. User Personas

### Persona 1 — Emma (Leisure Traveller)
- 28, marketing professional, books 4–6 flights/year
- **Goals:** Find cheapest fare, complete booking in under 5 minutes
- **Pain points:** Hidden fees revealed at checkout, re-entering details each session
- **Technical proficiency:** High (mobile-first)
- **Success:** Completes round-trip booking with seat selection in one session

### Persona 2 — David (Frequent Business Traveller)
- 42, consultant, books 2+ flights/month
- **Goals:** Flexible fares, fast rebooking, booking history
- **Pain points:** No saved passenger profiles, no fare comparison
- **Technical proficiency:** High (desktop and mobile)
- **Success:** Books in under 2 minutes using saved profile, views all upcoming trips

### Persona 3 — Sarah (Travel Administrator)
- 35, executive assistant, books for a team of 8
- **Goals:** Book multiple passengers on the same flight, generate itinerary
- **Pain points:** One-at-a-time booking flows, no group confirmation
- **Technical proficiency:** Medium
- **Success:** Books 3 passengers under one booking reference

---

## 5. User Stories

### Guest User Stories
| ID | Story |
|---|---|
| US-001 | As a guest traveller, I want to search for available flights by origin, destination, and date, so that I can find suitable options. |
| US-002 | As a guest traveller, I want to see a clear breakdown of fare prices including taxes, so that I am not surprised at checkout. |
| US-003 | As a guest traveller, I want to enter passenger details and receive a booking confirmation by email, so that I have a record of my trip. |
| US-004 | As a guest traveller, I want to search for return flights in the same flow, so that I can book a round trip without starting over. |

### Registered User Stories
| ID | Story |
|---|---|
| US-005 | As a registered traveller, I want to create an account and log in, so that my bookings are saved to my profile. |
| US-006 | As a registered traveller, I want to view my booking history, so that I can see past and upcoming trips. |
| US-007 | As a registered traveller, I want to cancel a confirmed booking, so that I can free my seat if plans change. |
| US-008 | As a registered traveller, I want to save passenger profiles, so that I do not re-enter details each time. |

### Administrative Stories
| ID | Story |
|---|---|
| US-009 | As a system administrator, I want to manage flight schedules via an API, so that flight data remains current. |
| US-010 | As a system administrator, I want to view all bookings for a given flight, so that I can manage capacity. |

### Edge Case Stories
| ID | Story |
|---|---|
| US-011 | As a traveller, I want to be informed immediately if a flight becomes fully booked while I am in checkout, so that I do not complete payment for an unavailable seat. |
| US-012 | As a traveller, I want the system to retain my search state if I navigate back, so that I do not lose my selected flights. |
| US-013 | As a registered traveller, I want to request deletion of my personal data, so that I can exercise my GDPR right to erasure. |

---

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | The system shall allow users to search for one-way flights by origin airport, destination airport, departure date, and passenger count (1–9). | Must Have |
| FR-002 | The system shall allow users to search for return flights by specifying a return date in the same search form. | Must Have |
| FR-003 | The system shall return available flights matching search criteria within 2 seconds. | Must Have |
| FR-004 | The system shall display for each flight: flight number, departure/arrival times, duration, stops, and fare inclusive of taxes. | Must Have |
| FR-005 | The system shall allow users to select a flight and proceed to a passenger details form. | Must Have |
| FR-006 | The system shall validate all passenger fields (full name, DOB, document type, document number) before checkout proceeds. | Must Have |
| FR-007 | The system shall generate a unique booking reference upon successful booking confirmation. | Must Have |
| FR-008 | The system shall send a booking confirmation to the passenger's email address. | Must Have |
| FR-009 | The system shall allow users to register an account with email and password. | Must Have |
| FR-010 | The system shall allow registered users to log in and log out securely. | Must Have |
| FR-011 | The system shall allow registered users to view their booking history. | Must Have |
| FR-012 | The system shall allow registered users to cancel a booking with PENDING or CONFIRMED status. | Must Have |
| FR-013 | The system shall allow registered users to save and manage passenger profiles. | Should Have |
| FR-014 | The system shall allow administrators to create, update, and deactivate flight schedules via a secured API. | Must Have |
| FR-015 | The system shall prevent overbooking by checking seat availability atomically before confirming a booking. | Must Have |
| FR-016 | The system shall capture explicit user consent for data processing at registration. | Must Have |
| FR-017 | The system shall allow registered users to request deletion of their personal data. | Must Have |
| FR-018 | The system shall support seat selection (Economy/Business) during the booking flow. | Should Have |
| FR-019 | The system shall expose a GraphQL API for flight search queries. | Should Have |
| FR-020 | The system shall provide a RESTful API for booking management operations. | Must Have |

---

## 7. Non-Functional Requirements

| ID | Requirement | Category | Priority |
|---|---|---|---|
| NFR-001 | Flight search results must be returned within 2 seconds for 95% of requests under 100 concurrent users. | Performance | Must Have |
| NFR-002 | The system must achieve 99.5% uptime in the production environment. | Reliability | Must Have |
| NFR-003 | All API endpoints must be protected by authentication except public search and health check endpoints. | Security | Must Have |
| NFR-004 | Passwords must be hashed using bcrypt with a minimum cost factor of 12. | Security | Must Have |
| NFR-005 | All data in transit must be encrypted using TLS 1.2 or higher. | Security | Must Have |
| NFR-006 | The frontend must achieve WCAG 2.1 Level AA compliance. | Accessibility | Must Have |
| NFR-007 | The system must process personal data in compliance with GDPR, including lawful basis and data subject rights support. | Compliance | Must Have |
| NFR-008 | The frontend must achieve a Lighthouse performance score of ≥ 80 on mobile. | Performance | Should Have |
| NFR-009 | The API layer must support horizontal scaling without architectural changes. | Scalability | Should Have |
| NFR-010 | All business logic modules must maintain minimum 80% unit test coverage. | Maintainability | Must Have |
| NFR-011 | All booking state transitions must be logged with correlation IDs. | Observability | Must Have |
| NFR-012 | API responses must not expose internal stack traces or database error messages. | Security | Must Have |
| NFR-013 | The system must support up to 500 concurrent users without degradation. | Scalability | Could Have |
| NFR-014 | All UI components must be navigable by keyboard alone. | Accessibility | Must Have |
| NFR-015 | Booking records must be retained for a minimum of 7 years; PII must be anonymisable on erasure request. | Compliance | Must Have |

---

## 8. Requirements Validation Report

| Criterion | Assessment |
|---|---|
| Completeness | All functional areas covered: search, booking, user management, administration, GDPR. ✓ |
| Consistency | No conflicting requirements. FR-015 and NFR-009 are compatible via atomic DB transactions. ✓ |
| Verifiability | All NFRs are measurable (response times, coverage %, WCAG level). No vague terms remain. ✓ |
| Feasibility | All requirements achievable within React/Node.js/TypeScript stack. ✓ |
| GDPR Alignment | FR-016, FR-017, NFR-007, NFR-015 collectively satisfy consent, erasure, retention, lawful basis. ✓ |

---

## 9. Prioritisation Matrix (MoSCoW)

| Priority | Items |
|---|---|
| Must Have | FR-001–012, FR-014–017, FR-020 \| NFR-001–007, NFR-010–012, NFR-014–015 |
| Should Have | FR-013, FR-018, FR-019 \| NFR-008, NFR-009 |
| Could Have | Multi-language support, loyalty points \| NFR-013 |
| Won't Have (v1.0.0) | Live payment processing, GDS integration, native mobile app |

---

## 10. Acceptance Criteria

### FR-001 — Flight Search
- **Given** a user has entered a valid origin, destination, and future departure date with at least 1 passenger
- **When** they submit the search form
- **Then** the system shall return available flights within 2 seconds, or display a "no flights found" message

### FR-003 — Search Performance
- **Given** 100 concurrent users are submitting search requests
- **When** the system is under normal load
- **Then** 95% of responses shall be returned within 2 seconds

### FR-007 — Booking Reference Generation
- **Given** a user has completed all passenger details and confirmed the booking
- **When** the booking is submitted
- **Then** the system shall generate a unique 6-character alphanumeric reference and display it on the confirmation screen

### FR-010 — Authentication
- **Given** a registered user submits valid email and password credentials
- **When** they attempt to log in
- **Then** the system shall authenticate the user, return a JWT token, and redirect them to their dashboard

### FR-015 — Overbooking Prevention
- **Given** a flight has 1 remaining seat and two users attempt to book it simultaneously
- **When** both booking requests are processed
- **Then** exactly one booking shall succeed and the other shall receive an "unavailable" error no overbooking shall occur

### FR-017 — GDPR Erasure
- **Given** a registered user submits a data deletion request
- **When** the system processes the request
- **Then** all PII fields shall be anonymised within 30 days; bookings shall be retained in anonymised form for legal compliance

### NFR-006 — Accessibility
- **Given** any page of the application
- **When** tested with axe-core WCAG 2.1 AA ruleset
- **Then** zero critical violations shall be reported

---

## 11. Traceability Matrix

| Problem | Stakeholder | User Story | Functional Req | NFR | Acceptance Criteria |
|---|---|---|---|---|---|
| Fragmented search | Emma | US-001 | FR-001, FR-002, FR-003, FR-004 | NFR-001 | FR-001 AC, FR-003 AC |
| Hidden fees | Emma | US-002 | FR-004 | — | FR-004 AC |
| Re-entering data | David | US-008 | FR-013 | — | FR-013 AC |
| No booking history | David | US-006 | FR-011 | — | FR-011 AC |
| Overbooking risk | System | US-011 | FR-015 | — | FR-015 AC |
| GDPR compliance | Regulator | US-013 | FR-016, FR-017 | NFR-007, NFR-015 | FR-017 AC |
| Admin flight management | Admin | US-009, US-010 | FR-014 | NFR-003 | FR-014 AC |
| Accessibility | Regulator/All | All | — | NFR-006, NFR-014 | NFR-006 AC |
| Security | All | All | FR-009, FR-010 | NFR-003, NFR-004, NFR-005, NFR-012 | FR-010 AC |

---

## 12. Engineering Readiness Assessment

| Checkpoint | Status |
|---|---|
| Problem clearly defined | ✓ |
| Stakeholders identified | ✓ |
| Domain understood | ✓ |
| User stories completed (13) | ✓ |
| Functional requirements specified (20) | ✓ |
| Non-functional requirements specified (15) | ✓ |
| Requirements validated | ✓ |
| Requirements prioritised (MoSCoW) | ✓ |
| Acceptance criteria created | ✓ |
| Traceability established | ✓ |

**VERDICT: ENGINEERING READINESS CONFIRMED — Proceeding to Software Architecture.**

---

*Document controlled under Version Control & Documentation Governance Framework.*  
*Next review: triggered by any change to project scope or requirements.*

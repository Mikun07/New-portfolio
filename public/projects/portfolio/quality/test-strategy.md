# Test Strategy

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

## Testing Philosophy

Testing exists to reduce risk and increase confidence. The portfolio's primary risks are:
1. The contact form fails silently (user thinks message was sent, but it wasn't).
2. A code change breaks an existing UI section.
3. A missing translation key causes a runtime crash.

Each test layer targets a specific category of risk.

---

## Testing Pyramid

```
         /--------\
        /   E2E    \       ← Critical user journeys (Cypress - planned v1.1.0)
       /------------\
      / Integration  \     ← Component render + context integration (planned v1.1.0)
     /----------------\
    /    Unit Tests    \   ← Pure logic, zero DOM (Vitest - 6 tests, passing)
   /--------------------\
```

---

## Unit Testing (Current - Vitest)

**What is tested:** The `formReducer` pure function in `src/features/contact/Contact.tsx`.

**Why:** The reducer manages all contact form state transitions. It is pure (no side effects), making it trivial to test without React.

**Test file:** `src/test/formReducer.test.ts`

**Coverage:**
| Test | Action | Assertion |
|------|--------|-----------|
| Unknown action | `{ type: 'UNKNOWN' }` | Returns initial state unchanged |
| SET_FIELD - single field | Updates `email`, leaves others intact | Immutability confirmed |
| SET_FIELD - all fields | Iterates all 4 text fields | Each field updatable independently |
| SET_SENDING true | `{ type: 'SET_SENDING', value: true }` | `sending` becomes `true` |
| SET_SENDING false | From `sending: true` | `sending` becomes `false` |
| RESET | Dirty state | Returns exactly `initialState` |

**Framework:** Vitest 4.1.5 with `@vitest-environment node` (no DOM needed for pure reducer).

**Run:** `npm test`

---

## Integration Testing (Planned - v1.1.0)

**Scope:** Render each page section in a test DOM with all providers wrapped around it; assert key content appears.

**Framework:** Vitest + `@testing-library/react` + jsdom (already installed).

**Priority targets:**
- `ThemeProvider` - toggling theme applies `dark` class to document root.
- `LanguageProvider` - switching locale updates rendered text.
- `Contact` - form field updates dispatch to reducer correctly.

---

## End-to-End Testing (Planned - v1.1.0)

**Scope:** Full user journeys in a real browser.

**Framework:** Cypress (referenced in portfolio but not yet configured in this repo).

**Priority journeys:**
1. Load page → verify all 6 sections render without errors.
2. Click "Get in touch" → smooth scroll to Contact section.
3. Fill contact form → submit → assert success toast appears.
4. Toggle dark mode → assert `dark` class on `<html>`.
5. Switch language to Deutsch → assert navbar text changes to German.
6. Mobile: open hamburger → click a link → assert drawer closes and section is visible.

---

## Learning Concept: Contract Testing

Contract testing verifies that a consumer (e.g., `Contact.tsx`) and a provider (e.g., `emailService.ts`) agree on the shape of the data exchanged - independently of each other.

**What it is:** A test that defines the expected interface at a boundary and checks both sides conform to it, without requiring both to run together.

**Why it matters here:** If `emailService.ts` changes its `EmailPayload` interface, the TypeScript compiler already catches the mismatch. In a larger system where services are deployed independently, Pact or similar tools would enforce this at the wire level.

**Interview talking point:** "I applied contract thinking to the infrastructure boundary - `EmailPayload` is the typed contract between Contact and the email service. TypeScript enforces it at compile time; in a microservice context, I'd use Pact to enforce it at the network level."

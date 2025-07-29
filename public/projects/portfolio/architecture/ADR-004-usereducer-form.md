# ADR-004: useReducer for Contact Form over Per-Field useState

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

The contact form has 4 text fields plus a `sending` flag. Options are: (a) one `useState` call per field, (b) a single `useState` with an object, or (c) `useReducer` with explicit action types.

## Decision

Use `useReducer` with three action types: `SET_FIELD`, `SET_SENDING`, and `RESET`. The reducer and its types live in `src/features/contact/Contact.tsx`.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Per-field useState (5 calls) | Simple; no boilerplate | Scattered state; reset requires 5 calls; hard to test atomically |
| Single object useState | Fewer calls; reset is one call | No explicit transitions; harder to follow state flow |
| useReducer (chosen) | Explicit transitions; fully testable in isolation; `RESET` is a single dispatch | Slightly more boilerplate; reducer must be mirrored in test file if tested in isolation |

## Consequences

**Positive:**
- The reducer is a pure function and is independently testable without React - confirmed by `src/test/formReducer.test.ts` (6 passing tests).
- State transitions are explicit and auditable: every field update, every send cycle, every reset is a named action.
- `RESET` action clears all fields in a single dispatch after successful submission.

**Negative:**
- The test file mirrors the reducer and types inline (with a comment noting the source). If the reducer is refactored into a separate module, the test file must be updated.
- Slightly more verbose than `useState` for a simple form.

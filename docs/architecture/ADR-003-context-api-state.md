# ADR-003: React Context API over Redux or Zustand for Global State

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

Three pieces of global state are needed: current theme, current locale, and toast notifications. Candidates were Redux Toolkit, Zustand, and React's built-in Context API + useState/useReducer.

## Decision

Use React Context API with `useState` for theme and locale, and `useState` + `useCallback` for toasts. No external state library.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Redux Toolkit | DevTools, time-travel debugging, well-understood at scale | Boilerplate (slices, store, selectors) disproportionate for 3 simple values |
| Zustand | Minimal boilerplate, no provider needed | External dependency; less idiomatic React; overkill for this scope |
| Context API (chosen) | Zero dependencies; React-native; appropriate for low-frequency global state | Can cause re-renders if context value changes frequently; not suitable for high-frequency updates like animation state |

## Consequences

**Positive:**
- No additional packages required.
- Each concern is isolated in its own provider (`ThemeProvider`, `LanguageProvider`, `ToastProvider`).
- Provider nesting in `App.tsx` is explicit and readable.

**Negative:**
- Any component consuming a context re-renders when that context value changes. For the portfolio's low-frequency updates (theme toggle, language switch, occasional toast) this is not a performance concern.
- If the portfolio were to grow into an app with many interactive components sharing state, a store-based solution would become preferable.

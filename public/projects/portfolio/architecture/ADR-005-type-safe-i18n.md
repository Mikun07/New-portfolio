# ADR-005: Homegrown Type-Safe i18n over react-i18next

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

The portfolio supports 5 languages (EN, DE, FR, NL, SV). A translation system is needed that ensures all locales are always in sync with the English source of truth.

## Decision

Use a homegrown approach: `src/i18n/translations/en.ts` exports a typed `Translations` object and a `Translations` type. All other locale files (`de.ts`, `fr.ts`, `nl.ts`, `sv.ts`) import `type { Translations }` from `en.ts` and must satisfy the full interface at compile time. `LanguageProvider` imports all five, stores them in a `Record<Locale, Translations>`, and provides the active one as `t` via context.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| react-i18next | Industry standard; lazy loading; pluralisation support; large ecosystem | External dependency; JSON-based (loses TypeScript checking); runtime key lookups; overkill for a static portfolio |
| Homegrown typed approach (chosen) | Zero external dependencies; TypeScript enforces locale completeness at compile time; `t.nav.home` is typed and autocompleted | No pluralisation; no lazy loading; manual locale files must be kept in sync by the developer |

## Consequences

**Positive:**
- If a translator adds a key to `en.ts`, TypeScript immediately reports an error in any locale file missing that key - no runtime surprises.
- All translation keys are autocompleted in the editor (`t.contact.send`, `t.home.bio1`, etc.).
- No build step or JSON parsing required.

**Negative:**
- Adding a new language requires creating a new `.ts` file and importing it in `LanguageProvider`.
- No support for pluralisation rules (not needed for this content).
- Translation strings are loaded eagerly (all 5 locales in the initial bundle) - acceptable for a portfolio of this size (~237 KB JS bundle).

# ADR-002: CSS Custom Properties for Theming over Tailwind Dark Prefix

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

The portfolio requires dark/light mode switching. Tailwind CSS 3 offers a `dark:` variant that applies styles when a `dark` class is present on `<html>`. An alternative is to use CSS custom properties (`--bg`, `--accent`, etc.) that are swapped at the `:root` / `.dark` level.

## Decision

Use CSS custom properties defined in `src/index.css` for all colour values. Components reference tokens like `style={{ backgroundColor: 'var(--bg)' }}`. The `dark` class on `<html>` (applied by ThemeProvider) overrides the token values.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Tailwind `dark:` prefix | Familiar to Tailwind users; co-located with other utility classes | Every element needs a `dark:` companion class; verbose; hard to centralise colour decisions |
| CSS custom properties (chosen) | Single token set swapped at root; components are theme-agnostic; trivial to change a colour globally | Requires inline `style` attributes for dynamic values; bypasses Tailwind's design system |

## Consequences

**Positive:**
- Changing any colour requires editing one token in `index.css`, not hunting through component files.
- Components contain zero theme-specific logic - they only reference tokens.
- Smooth CSS transitions on colour changes work automatically via `transition-colors`.

**Negative:**
- Token values are not visible in component markup - a reader must cross-reference `index.css`.
- Tailwind's IntelliSense doesn't autocomplete `var(--token)` values.
- Inline `style` attributes are needed alongside Tailwind class attributes, making the markup slightly mixed.

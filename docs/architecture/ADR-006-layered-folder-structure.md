# ADR-006: Layered Folder Structure (core / features / shared / infrastructure)

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

The original `src/` structure used generic folders (`pages/`, `components/`, `context/`) that do not communicate architectural boundaries or dependency direction. The governance framework requires a structure that makes layers explicit and enforces separation of concerns.

## Decision

Reorganise `src/` into four architectural layers:

```
src/
├── core/providers/        # App-wide singleton providers (ThemeProvider, LanguageProvider, ToastProvider)
├── features/              # Vertical slices - one folder per page section
├── shared/components/     # Horizontal reusable UI consumed by multiple features or App.tsx
├── infrastructure/email/  # Boundary to external services (EmailJS)
├── i18n/                  # Translation files (feeds core/providers/LanguageProvider)
└── types/                 # Shared TypeScript type re-exports
```

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Flat `pages/` + `components/` + `context/` | Familiar, low overhead | No visible dependency direction; "components" is too broad; infrastructure concerns mixed in |
| Feature-first only (`features/home/`, `features/about/`, etc.) | Each feature is fully self-contained | Shared UI has no clear home; providers don't fit cleanly into any feature |
| Layered (chosen) | Explicit dependency direction: infrastructure ← core ← features/shared ← App | More folders; slightly longer import paths |

## Dependency Rules

- `infrastructure/` depends on nothing internal.
- `core/providers/` depends only on `i18n/` and React.
- `features/*/` and `shared/components/` depend on `core/` and `infrastructure/`.
- `App.tsx` depends on all four layers.
- No cross-feature imports (features do not import from other features).

## Consequences

**Positive:**
- A new developer can immediately understand where to find providers, shared components, page sections, and external integrations.
- Dependency direction is explicit - following imports upward always leads toward the infrastructure boundary.
- Adding a new section means creating a new folder under `features/` with no impact on other features.

**Negative:**
- Import paths are longer (`../../core/providers/LanguageProvider` vs `../../context/LanguageContext`).
- The `shared/` layer may grow over time and require further decomposition if the portfolio expands significantly.

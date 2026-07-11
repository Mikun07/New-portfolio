# Release Notes - v1.0.0

**Release Date:** 2026-06-28
**Type:** Major (initial governed release)

---

## Summary

v1.0.0 is the first release of the portfolio under the governance framework. No user-visible functionality has changed. This release establishes the architectural foundation, documentation artefacts, and CI pipeline that all future changes will build upon.

---

## What Changed

### Source Structure
The `src/` directory was reorganised from flat `pages/` + `components/` + `context/` folders into a four-layer architecture:

| Layer | Path | Purpose |
|-------|------|---------|
| Core | `src/core/providers/` | App-wide React context providers |
| Features | `src/features/*/` | Vertical slices per portfolio section |
| Shared | `src/shared/components/` | Reusable UI components |
| Infrastructure | `src/infrastructure/email/` | External service boundaries |

### New Files Created
- `src/infrastructure/email/emailService.ts`: typed EmailJS wrapper
- `src/types/index.ts`: shared TypeScript type re-exports
- `CHANGELOG.md`: versioned change log
- `.github/workflows/ci.yml`: GitHub Actions CI pipeline
- `docs/`: full governance documentation (see below)

### ESLint Fixes
- `--ext js,jsx` corrected to `--ext ts,tsx` (was linting nothing)
- `.eslintignore` was `*` (ignored everything); corrected to `node_modules` + `dist`
- `@typescript-eslint/parser` and `plugin:@typescript-eslint/recommended` added to `.eslintrc.cjs`

### Documentation Created
- 6 Architecture Decision Records (ADRs)
- Functional requirements (FR-001 – FR-020)
- Non-functional requirements (NFR-001 – NFR-010)
- User stories (US-001 – US-015)
- Acceptance criteria (BDD Given/When/Then)
- Requirements traceability matrix
- Module catalog
- Interface specifications
- Design Decision Record (DDR-001)
- Test strategy
- Quality gates definition
- Metrics plan
- CI/CD design
- Deployment notes

---

## What Did Not Change

- All visible UI, layout, styling, and animations
- All user-facing content (bio, experience, projects, skills, contact details)
- i18n translation files (EN, DE, FR, NL, SV)
- All 6 formReducer unit tests pass without modification
- CSS custom property theming system
- Vite, Tailwind, PostCSS, and TypeScript configuration

---

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | 0 errors, 0 warnings |
| `npm test` | 6/6 passed |
| `npm run build` | Success (dist/ produced, primary JS gzip below 100 KB) |

---

## Migration Notes

No migration is required for visitors or end users. For developers cloning the repository fresh, the `npm install` then `npm run dev` workflow is unchanged. Import paths within `src/` have changed; see [ADR-006](../architecture/ADR-006-layered-folder-structure.md) for the full mapping.

---

## Next Version

v1.1.0 is planned to add:
- Cypress E2E test suite covering all 6 critical user journeys
- Integration tests for ThemeProvider and LanguageProvider
- Vitest coverage reporting (target ≥ 70%)
- Lighthouse CI gate in the pipeline

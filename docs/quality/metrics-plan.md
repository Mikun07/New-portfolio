# Quality Metrics Plan

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

## Current Baseline (v1.0.0)

| Metric | Value | Collection Method |
|--------|-------|-------------------|
| Unit test count | 6 | `npm test` output |
| Unit test pass rate | 100% | `npm test` output |
| TypeScript errors | 0 | `npm run typecheck` |
| ESLint warnings | 0 | `npm run lint` |
| Primary JS bundle size (gzip) | ~74.6 KB | `vite build` output |
| CSS bundle size (gzip) | ~4.7 KB | `vite build` output |
| PDF tooling chunks | Lazy-loaded on document download | `vite build` output |

---

## Target Metrics (v1.1.0)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Unit test coverage | ≥ 70% line | Establish a baseline that forces future contributors to maintain coverage |
| Lighthouse Performance | ≥ 90 desktop | Visitor experience; signals engineering quality to technical reviewers |
| Lighthouse Accessibility | ≥ 90 | WCAG 2.1 AA compliance (NFR-003) |
| JS bundle (gzip) | <= 100 KB | Current primary bundle is ~74.6 KB gzip; PDF tooling is lazy-loaded |
| Build duration (CI) | ≤ 2 min | Current CI run takes ~60 s total; fast feedback is a quality signal |

---

## Metric Definitions

**Test Coverage** - percentage of source lines executed during the test suite. Measured by `vitest run --coverage` with `@vitest/coverage-v8`.

**Lighthouse Performance** - Google Lighthouse composite score measuring First Contentful Paint, Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift, and Speed Index.

**Bundle Size** - gzipped size of the primary `dist/assets/index-*.js` bundle. Measured from Vite build output. PDF generation libraries are split into lazy-loaded chunks and are not required for first-page interaction.

**Build Duration** - wall-clock time for the full CI pipeline (type-check + lint + test + build) on `ubuntu-latest`. Measured by GitHub Actions step timings.

---

## Review Cadence

Metrics are reviewed:
- On every PR merge (automated CI output).
- On every MINOR version release (manual Lighthouse run).
- On every MAJOR version release (full quality audit against all NFRs).

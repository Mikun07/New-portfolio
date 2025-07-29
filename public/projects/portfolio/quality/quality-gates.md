# Quality Gates

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

Quality gates are mandatory checks that must pass before any code merges to `main`. They are enforced by the GitHub Actions CI pipeline (`.github/workflows/ci.yml`).

## Gate 1: Type Safety

| Property | Value |
|----------|-------|
| Tool | `tsc --noEmit` |
| Threshold | 0 type errors |
| Blocks merge? | Yes |
| Rationale | TypeScript strict mode is the primary correctness guard. Compile errors mean a contract has been broken - a missing prop, a wrong type, an unresolved import. |

## Gate 2: Code Quality

| Property | Value |
|----------|-------|
| Tool | `eslint . --ext ts,tsx --max-warnings 0` |
| Threshold | 0 errors, 0 warnings |
| Blocks merge? | Yes |
| Rationale | Zero-warning policy ensures quality does not erode incrementally. Every new warning must be resolved (not suppressed) before it can merge. |

## Gate 3: Unit Tests

| Property | Value |
|----------|-------|
| Tool | `vitest run` |
| Threshold | All tests pass (currently 6/6) |
| Blocks merge? | Yes |
| Rationale | Any failing test indicates a regression in tested business logic. The formReducer tests are fast (~9 ms) and have no external dependencies. |

## Gate 4: Build

| Property | Value |
|----------|-------|
| Tool | `vite build` |
| Threshold | Exit code 0, `dist/` produced |
| Blocks merge? | Yes |
| Rationale | A successful build proves the production bundle compiles without errors, all assets resolve, and the output is deployable to Netlify. |

---

## Gate Execution Order

```
Type check → Lint → Test → Build
```

Each gate must pass before the next runs. The pipeline stops at the first failure to preserve CI minutes and give fast feedback.

---

## Future Gates (Planned - v1.1.0)

| Gate | Tool | Threshold |
|------|------|-----------|
| Coverage | `vitest --coverage` | ≥ 70% line coverage |
| Lighthouse CI | `lhci autorun` | Performance ≥ 90 |
| Bundle size | `bundlewatch` | JS gzip ≤ 100 KB |

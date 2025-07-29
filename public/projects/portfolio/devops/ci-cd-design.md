# CI/CD Design

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

## Pipeline Overview

```
push / PR to main
       │
       ▼
┌─────────────────────────────────────────┐
│  Job: Type-check · Lint · Test · Build  │
│  Runner: ubuntu-latest                  │
│  Node: 20 LTS                           │
├─────────────────────────────────────────┤
│ 1. actions/checkout@v4                  │
│ 2. actions/setup-node@v4 (cache: npm)   │
│ 3. npm ci                               │
│ 4. npx tsc --noEmit          ← Gate 1  │
│ 5. npm run lint               ← Gate 2  │
│ 6. npm test                   ← Gate 3  │
│ 7. npm run build              ← Gate 4  │
└─────────────────────────────────────────┘
       │
       ▼ (on main push only, handled by Netlify)
  Netlify Deploy
```

**File:** `.github/workflows/ci.yml`

---

## Environment Strategy

### Development
- **Tool:** `npm run dev` (Vite HMR, `localhost:5173`)
- **Config:** `.env.local` with `VITE_EMAILJS_*` credentials (gitignored)
- **Purpose:** Feature development, local UI testing

### Production
- **Platform:** Netlify (continuous deployment from `main` branch)
- **Build command:** `npm run build`
- **Publish directory:** `dist/`
- **Config:** Environment variables set in Netlify UI (never in source)

### CI (GitHub Actions)
- **Purpose:** Validate every push and PR before merging
- **Secrets:** `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` stored in GitHub Actions Secrets (Settings → Secrets and variables → Actions)
- **Note:** Secrets are only needed for the `npm run build` step. The `npm test` step does not require them (formReducer is environment-independent).

---

## Design Decisions

**Why `npm ci` instead of `npm install`?**
`npm ci` installs from `package-lock.json` exactly, ensuring reproducible installs. `npm install` may update lockfile, introducing non-determinism.

**Why Node 20?**
Node 20 is LTS as of 2024 and is the minimum recommended for Vite 4. Using an explicit version (`node-version: '20'`) prevents silent breakage when GitHub Actions updates its default Node version.

**Why is `tsc --noEmit` a separate step from `vite build`?**
`vite build` uses `esbuild` for transpilation and does not perform type checking. `tsc --noEmit` provides the actual TypeScript strict-mode type check. Without this step, type errors are invisible in CI.

**Why one job instead of parallel jobs?**
The portfolio is small. Parallel jobs would add GitHub Actions overhead and cost without meaningful time saving. One serial job gives fast, cheap feedback.

---

## Learning Concept: GitHub Actions

**What it is:** A CI/CD platform built into GitHub. Workflows are defined in YAML files under `.github/workflows/`. Each workflow runs on events (push, PR, schedule) in ephemeral virtual machines.

**Why it was selected:** The repository is already on GitHub, making GitHub Actions the zero-friction choice. No external CI tool needs to be configured or authenticated.

**How it improves operations:** Every push to `main` and every pull request automatically runs type-check, lint, tests, and build. A broken change cannot silently reach production; the pipeline blocks merging.

**Trade-offs:**
- Free for public repositories; 2,000 minutes/month on free tier for private repos.
- Cold start adds ~20-30 seconds to each run (checkout, Node setup).
- YAML syntax can be fragile; indentation errors cause silent failures.

**Interview talking point:** "I set up a four-stage GitHub Actions pipeline (type-check, lint, test, build) in that order, because each gate validates a different kind of correctness. TypeScript finds contract errors, ESLint finds style regressions, Vitest finds logic errors, and Vite build confirms the production bundle compiles. They fail fast in that sequence."

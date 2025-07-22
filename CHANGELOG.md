# Changelog

All notable changes to this project are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version Classification

| Increment | When to use | Example |
|-----------|-------------|---------|
| MAJOR (X.0.0) | Breaking UI change, removed section, incompatible architecture | v2.0.0 |
| MINOR (1.X.0) | New section, new language, new feature added | v1.1.0 |
| PATCH (1.0.X) | Bug fix, copy update, dependency security patch | v1.0.1 |

---

## [1.0.0] - 2026-06-28

### Added
- Layered source architecture: `core/` · `features/` · `shared/` · `infrastructure/`
- `src/infrastructure/email/emailService.ts` - typed EmailJS abstraction extracted from Contact
- `src/types/index.ts` - shared TypeScript type re-exports
- `docs/` folder with full framework compliance artefacts:
  - `docs/architecture/` - 6 Architectural Decision Records (ADRs)
  - `docs/requirements/` - Functional requirements, NFRs, user stories, acceptance criteria, traceability matrix
  - `docs/design/` - Module catalog, interface specs, Design Decision Record
  - `docs/quality/` - Test strategy, quality gates, metrics plan
  - `docs/devops/` - CI/CD design, deployment notes
  - `docs/releases/` - Release notes for v1.0.0
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`): type-check → lint → test → build
- `CHANGELOG.md` with version classification rules

### Changed
- Package version from `0.0.0` to `1.0.0`
- ESLint script: `--ext js,jsx` → `--ext ts,tsx` (was silently linting nothing)
- `.eslintignore`: was `*` (ignored everything) → now correctly ignores only `node_modules` and `dist`
- ESLint config: added `@typescript-eslint/parser` and `plugin:@typescript-eslint/recommended`
- All source import paths updated to reflect new layered structure

### Unchanged
- All visible UI, styling, and user-facing functionality
- All 6 formReducer unit test assertions pass without modification
- i18n translations (en, de, fr, nl, sv) files untouched
- CSS custom property theming system
- Vite, Tailwind, PostCSS, and TypeScript configuration

# Requirements Traceability Matrix

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

| FR ID  | User Story | Component File | Test Coverage |
|--------|------------|---------------|---------------|
| FR-001 | US-001 | `src/features/home/Home.tsx` | Visual / E2E (planned) |
| FR-002 | US-005 | `src/features/home/Home.tsx` | Visual |
| FR-003 | US-001 | `src/features/home/Home.tsx` | Visual |
| FR-004 | US-002 | `src/features/home/Home.tsx` | Manual |
| FR-005 | US-003 | `src/features/home/Home.tsx` | Visual |
| FR-006 | US-003 | `src/features/about/About.tsx` | Visual |
| FR-007 | US-004 | `src/features/about/About.tsx` | Visual |
| FR-008 | US-003 | `src/features/about/About.tsx` | Manual |
| FR-009 | US-004 | `src/features/experience/Experience.tsx` | Visual |
| FR-010 | US-009 | `src/features/services/Services.tsx` | Visual |
| FR-011 | US-006 | `src/features/projects/Projects.tsx` | Visual |
| FR-012 | US-006, US-008 | `src/shared/components/ProjectCard/ProjectCard.tsx` | Visual |
| FR-013 | US-007 | `src/shared/components/ProjectCard/ProjectCard.tsx`, `src/features/projects/Projects.tsx` | Visual |
| FR-014 | US-010 | `src/features/contact/Contact.tsx` | Visual |
| FR-015 | US-010 | `src/features/contact/Contact.tsx` | Visual |
| FR-016 | US-011 | `src/features/contact/Contact.tsx`, `src/infrastructure/email/emailService.ts` | Unit (reducer logic) |
| FR-017 | US-011 | `src/features/contact/Contact.tsx` | Unit (`RESET` action - `formReducer.test.ts`) |
| FR-018 | US-010 | `src/features/contact/Contact.tsx` | Unit (`SET_SENDING` action - `formReducer.test.ts`) |
| FR-019 | US-013 | `src/core/providers/ThemeProvider.tsx` | Manual |
| FR-020 | US-012 | `src/core/providers/LanguageProvider.tsx`, `src/shared/components/LanguagePicker/LanguagePicker.tsx` | Manual |

---

## Test File Index

| Test File | Covers |
|-----------|--------|
| `src/test/formReducer.test.ts` | FR-017 (RESET), FR-018 (SET_SENDING), FR-016 (SET_FIELD for each form field), edge cases |

## Coverage Gaps (Planned)

- E2E tests (Cypress) for FR-001 through FR-015 and FR-019, FR-020 - planned for v1.1.0
- Integration test for FR-016 (EmailJS send) using a mock - planned for v1.1.0

# Database Engineering Scope Decision

**Project:** Ayomikun Festus-Olaleye Developer Portfolio
**Version:** 1.0.0
**Date:** 2026-07-11
**Role:** Database Engineer

## Scope Decision

This repository does not own a database. All portfolio content is static source data, TypeScript constants, markdown documents, PDFs, and image assets. Visitor contact messages are sent through EmailJS and are not stored by this application.

## Data Review

| Data category | Storage location | Persistence owner |
|---------------|------------------|-------------------|
| Portfolio content | Source files in `src/` | Repository |
| Project documents | `docs/` and `public/projects/` | Repository |
| CV and certificates | `public/` | Repository |
| Theme preference | Browser `localStorage` | Visitor browser |
| Locale preference | Browser `localStorage` | Visitor browser |
| Contact message | EmailJS delivery flow | EmailJS and recipient mailbox |

## Integrity Rules

- Translation keys must satisfy the TypeScript schema exported by `en.ts`.
- Project document links must point to files under `public/projects/` or trusted URLs.
- Environment variables must not be committed.

## Reopen Criteria

The database framework must be fully applied if the project adds message persistence, user accounts, content management, analytics storage, or admin-managed projects.

## Readiness Decision

Database implementation is not applicable to the current static frontend scope.

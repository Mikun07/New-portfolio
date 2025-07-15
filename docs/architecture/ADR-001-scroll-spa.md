# ADR-001: Scroll-Based SPA over Multi-Route Navigation

**Status:** Accepted
**Date:** 2026-06-28
**Deciders:** Ayomikun Festus-Olaleye

## Context

A personal portfolio site needs to present 6 sections (Home, About, Experience, Services, Projects, Contact) in a single cohesive reading experience. Two approaches were considered: traditional multi-page routing with React Router, or a single scrollable page using anchor-based smooth scroll.

## Decision

Use `react-scroll` for smooth anchor-based navigation on a single HTML document. React Router is installed as a dependency but not used for navigation.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| React Router (multi-route) | Deep-linkable URLs per section, browser back-button support | Each route is a separate render; adds routing boilerplate; sections feel disconnected |
| Scroll-based SPA (chosen) | Seamless reading flow; no route matching overhead; simpler layout | Sections not independently deep-linkable; less familiar for app-like portfolios |

## Consequences

**Positive:**
- Visitors experience the portfolio as a continuous narrative, which is appropriate for a personal bio site.
- No route matching, lazy loading, or suspense needed. Layout is always fully mounted.
- Navbar links always know exactly where each section is via react-scroll's `to` prop.

**Negative:**
- A visitor cannot directly link to, say, the Projects section via a URL.
- Browser history does not reflect section position (no pushState on scroll).

**Neutral:**
- `react-router-dom` remains in `package.json` but is unused. It may be added for future project detail pages without restructuring.

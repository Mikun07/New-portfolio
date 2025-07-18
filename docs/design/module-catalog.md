# Module Catalog

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

## core/providers

### ThemeProvider
**Responsibility:** Manages light/dark theme state, persists to `localStorage`, and applies the `dark` class to `<html>`.
**Public interface:** `ThemeProvider` (React component), `useTheme()` → `{ theme: 'light' | 'dark', toggleTheme: () => void }`
**Consumed by:** `App.tsx`, `Navbar`, `Sidebar`
**Dependencies:** React only

### LanguageProvider
**Responsibility:** Manages active locale, maps locale to translation object, persists to `localStorage`.
**Public interface:** `LanguageProvider` (React component), `useLanguage()` → `{ locale, setLocale, t: Translations }`, `languages` array
**Consumed by:** `App.tsx`, all feature pages, `Navbar`, `Sidebar`, `Footer`, `LanguagePicker`
**Dependencies:** React, `src/i18n/translations/*`

### ToastProvider
**Responsibility:** Manages a list of active toast notifications with auto-dismiss after 5 seconds and a manual dismiss button.
**Public interface:** `ToastProvider` (React component), `useToast()` → `{ showToast(message, type) }`
**Consumed by:** `App.tsx`, `Contact`
**Dependencies:** React only

---

## features

### home/Home
**Responsibility:** Renders the hero section with profile photo, bio, tech stack pills, and CTAs.
**Public interface:** `Home` (default export, React component)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`, `react-scroll`, `assets/img/Dp.jpg`

### about/About
**Responsibility:** Renders skills by category, education entries, and certification links.
**Public interface:** `About` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`, `assets/img/Ap.jpg`

### experience/Experience
**Responsibility:** Renders a vertical timeline of work experience entries with bullet-point achievements.
**Public interface:** `Experience` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`

### services/Services
**Responsibility:** Renders 6 service offering cards with icon, description, and tech tags.
**Public interface:** `Services` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`

### projects/Projects
**Responsibility:** Renders 6 project cards in a responsive grid using `ProjectCard`.
**Public interface:** `Projects` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`, `ProjectCard`

### contact/Contact
**Responsibility:** Renders contact details, manages the contact form via `useReducer`, and sends messages via `emailService`.
**Public interface:** `Contact` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`, `ToastProvider`, `emailService`

---

## shared/components

### Navbar
**Responsibility:** Mobile-only top navigation bar with hamburger drawer and smooth-scroll links.
**Public interface:** `Navbar` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `ThemeProvider`, `LanguageProvider`, `LanguagePicker`, `react-scroll`

### Sidebar
**Responsibility:** Desktop-only sticky right panel with profile, social links, contact info, theme toggle, and language picker.
**Public interface:** `Sidebar` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `ThemeProvider`, `LanguageProvider`, `LanguagePicker`, `assets/img/Dp.jpg`

### Footer
**Responsibility:** Displays copyright year and "Built with React & TypeScript" credit.
**Public interface:** `Footer` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `LanguageProvider`

### ProjectCard
**Responsibility:** Reusable card for displaying a project with thumbnail/placeholder, hover overlay, expandable description, tech tags, and action links.
**Public interface:** `ProjectCard` (default export), accepts `ProjectCardProps`
**Consumed by:** `features/projects/Projects`
**Dependencies:** React only

### LanguagePicker
**Responsibility:** Drop-up language selector that dispatches locale changes via `LanguageProvider`.
**Public interface:** `LanguagePicker` (default export)
**Consumed by:** `Navbar`, `Sidebar`
**Dependencies:** `LanguageProvider`

### ScrollToTop
**Responsibility:** Fixed floating button that appears after 400 px of scroll and smooth-scrolls to top.
**Public interface:** `ScrollToTop` (default export)
**Consumed by:** `App.tsx`
**Dependencies:** `react-use` (`useWindowScroll`)

---

## infrastructure/email

### emailService
**Responsibility:** Typed wrapper around `emailjs.send()` that abstracts the third-party API boundary.
**Public interface:** `sendContactEmail(payload: EmailPayload): Promise<void>`, `EmailPayload` interface
**Consumed by:** `features/contact/Contact`
**Dependencies:** `emailjs-com`, Vite env vars (`VITE_EMAILJS_*`)

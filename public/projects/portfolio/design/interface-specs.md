# Interface Specifications

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28

---

## ProjectCard Props

```typescript
interface CardLabels {
  code: string      // Text for GitHub button (e.g. "Code")
  live: string      // Text for live-site button (e.g. "Live")
  readMore: string  // Toggle label when description is collapsed
  showLess: string  // Toggle label when description is expanded
  featured: string  // Text on the featured badge
  docsBtn: string   // Text for the docs dropdown trigger button (e.g. "Docs")
}

interface DocEntry {
  label: string  // Display name shown in the dropdown (e.g. "Project Report (PDF)")
  url: string    // Path or URL to the downloadable file
}

interface ProjectCardProps {
  img?: string              // Optional thumbnail image URL
  github: string            // Required GitHub repository URL
  href?: string             // Optional live site URL (omit to hide live button)
  docs?: DocEntry[]         // Optional list of downloadable documents (triggers dropdown)
  title: string             // Project display title
  subtitle: string          // Badge text (e.g. "Featured Project", "Web Application")
  description: string       // Full description text (truncated at 200 chars without toggle)
  tags: string[]            // Technology tags displayed at bottom
  featured?: boolean        // Whether to show the featured badge
  labels: CardLabels        // Internationalised label strings
}
```

**Validation rules:**
- `github` must be a valid URL - not validated at runtime, enforced by type.
- `description.length > 220` triggers the "Read more / Show less" toggle.
- `img` is optional - if absent, a gradient placeholder with the first letter of `title` is shown.

---

## EmailPayload Interface

```typescript
interface EmailPayload {
  user_name: string
  user_email: string
  user_subject: string
  user_message: string
  [key: string]: unknown  // Index signature required by emailjs-com SDK
}
```

**Validation rules:**
- All four named fields are required and non-empty (enforced by HTML5 `required` on form inputs).
- `user_email` is validated as a valid email format by HTML5 `type="email"`.

---

## Contact Form Reducer

Defined in `src/features/contact/formReducer.ts`.

```typescript
interface FormState {
  name: string
  email: string
  subject: string
  message: string
  sending: boolean
}

type FormAction =
  | { type: 'SET_FIELD'; field: FormField; value: string }
  | { type: 'SET_SENDING'; value: boolean }
  | { type: 'RESET' }
```

**Contract:**
- `SET_FIELD` updates one text field without mutating the previous state.
- `SET_SENDING` updates only the submit-in-progress flag.
- `RESET` returns the form to `initialFormState`.
- The reducer is imported by both `Contact.tsx` and `src/test/formReducer.test.ts`.

---

## Translations Interface (excerpt)

Defined in `src/i18n/translations/en.ts` - the authoritative schema all locales must satisfy.

```typescript
export interface Translations {
  nav: { home: string; about: string; experience: string; services: string; projects: string; contact: string }
  home: { location: string; role: string; available: string; bio1: string; bio2: string; coreStack: string; cta: { contact: string; experience: string; cv: string } }
  about: { eyebrow: string; heading: string; bio1: string; bio2: string; skills: string; education: string; certifications: string }
  experience: { eyebrow: string; heading: string }
  services: { eyebrow: string; heading: string }
  projects: { eyebrow: string; heading: string; code: string; live: string; readMore: string; showLess: string; featured: string; docsBtn: string }
  contact: { eyebrow: string; heading: string; intro: string; name: string; namePlaceholder: string; email: string; emailPlaceholder: string; subject: string; subjectPlaceholder: string; message: string; messagePlaceholder: string; send: string; sending: string; successToast: string; errorToast: string }
  footer: { rights: string; builtWith: string }
}
```

**Constraint:** Any locale file that does not satisfy `Translations` causes a TypeScript compile error, enforcing locale completeness at build time.

---

## Context Hook Return Types

### useTheme()
```typescript
{ theme: 'light' | 'dark'; toggleTheme: () => void }
```
Throws `Error('useTheme must be used inside ThemeProvider')` if called outside the provider.

### useLanguage()
```typescript
{ locale: Locale; setLocale: (l: Locale) => void; t: Translations }
```
Throws `Error('useLanguage must be used inside LanguageProvider')` if called outside the provider.

### useToast()
```typescript
{ showToast: (message: string, type?: 'success' | 'error' | 'info') => void }
```
Throws `Error('useToast must be used inside ToastProvider')` if called outside the provider.

# Festus Olaleye Ayomikun — Developer Portfolio

A modern, fully responsive personal portfolio built with React 18, TypeScript, and Tailwind CSS. Features dark/light mode, a global language switcher (EN / SV / FR / NL), a custom toast notification system, and a useReducer-driven contact form with EmailJS integration.

**Live site:** https://festus-olaleye-ayomikun.netlify.app

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 + |
| npm | 9 + |

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Mikun07/New-portfolio.git
cd New-portfolio

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local
# Then fill in your EmailJS credentials (see Environment Variables below)

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

The contact form uses [EmailJS](https://www.emailjs.com/) to send emails without a backend. Create a `.env.local` file at the project root (it is gitignored):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> For Netlify deployments, add these same keys under **Site configuration → Environment variables** and trigger a redeploy.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint check across all source files |
| `npm test` | Run Vitest unit tests (single run) |
| `npm run test:watch` | Run Vitest in interactive watch mode |

---

## Site Walkthrough

### Home
Hero section with name, role title, and a short professional tagline. Animated entrance and a prominent CTA linking to the Contact section.

### About
A two-column layout: personal bio on the left, a stats/highlights panel on the right covering years of experience, technologies used, and completed projects.

### Experience
Vertical timeline of professional roles and education. Each entry shows company/institution, dates, and key responsibilities or achievements.

### Services
Icon-driven service cards describing frontend specialisms — React development, UI/UX implementation, responsive design, and performance optimisation.

### Projects
Six-project grid (3-column on large screens). Each card includes:
- Gradient placeholder with the project's initial letter
- Title, subtitle badge, and truncated description (4-line clamp)
- **Read more / Show less** toggle for longer descriptions
- Tech tag pills pinned to the bottom of each card
- GitHub and live-site icon links
- "Featured" badge on the FFSD Travels card

### Contact
A `useReducer`-driven form (name, email, message) with real-time validation state, a loading spinner during send, and toast notifications for success and error outcomes. Powered by EmailJS — no backend required.

### Sidebar (desktop)
Fixed right-hand panel visible on `lg` breakpoints and above. Contains:
- Profile photo and name
- Social links (GitHub, LinkedIn)
- Theme toggle (light/dark)
- Language picker (drop-up menu)

### Language Switcher
Supports four locales with full UI translation:

| Code | Language |
|------|----------|
| en | English |
| de | German |
| fr | French |
| nl | Dutch |
| sv | Swedish |

Selection is persisted to `localStorage` and restored on next visit. All locale files implement the same `Translations` type — missing keys are a TypeScript compile error.

### Dark / Light Mode
One-click toggle between dark and light themes. Preference is persisted to `localStorage`. All colours use CSS custom properties (`--bg`, `--accent`, `--text-primary`, etc.) so every component responds automatically.

### Toast Notifications
A custom `ToastContext` powers non-blocking alerts. Toasts appear top-right (clearing the sidebar on desktop), auto-dismiss after 5 seconds with a draining progress bar, and can be dismissed manually. Three types: `success`, `error`, and `info`.

---

## Testing

Unit tests are written with **Vitest**. Run them with:

```bash
npm test
```

### Test Coverage

| Test | Description |
|------|-------------|
| Unknown action returns state unchanged | Reducer ignores unrecognised action types |
| SET_FIELD updates only the target field | Other fields are not mutated |
| SET_FIELD works for all form fields | name, email, message all respond correctly |
| SET_SENDING true sets sending flag | UI can disable the submit button |
| SET_SENDING false clears sending flag | UI re-enables the button after response |
| RESET restores initial state | All fields cleared, sending reset to false |

Tests live in `src/test/formReducer.test.ts`. The `// @vitest-environment node` directive is used to avoid jsdom ESM conflicts for pure logic tests.

---

## Project Structure

```
New-portfolio/
├── public/
├── src/
│   ├── assets/               # Images and static assets
│   ├── components/
│   │   ├── Card/             # ProjectCard
│   │   ├── Footer/
│   │   ├── LanguagePicker/   # Drop-up locale selector
│   │   ├── Navbar/
│   │   ├── ScrollToTop/
│   │   └── Sidebar/
│   ├── context/
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── i18n/
│   │   └── translations/
│   │       ├── en.ts         # Source of truth + Translations type
│   │       ├── sv.ts
│   │       ├── fr.ts
│   │       └── nl.ts
│   ├── pages/
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── Experience/
│   │   ├── Home/
│   │   ├── Projects/
│   │   └── Services/
│   ├── test/
│   │   ├── formReducer.test.ts
│   │   └── setup.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.local                # (gitignored) EmailJS credentials
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 |
| Language | TypeScript (strict) |
| Build tool | Vite 4 |
| Styling | Tailwind CSS 3 |
| Routing | Scroll-based (no router) |
| State | useReducer, Context API |
| Email | EmailJS |
| Icons | Ionicons (web components) |
| Testing | Vitest, @testing-library/react |
| Deployment | Netlify |

---

## Key Design Decisions

- **useReducer for form state** — keeps all field updates, loading state, and reset in a single pure function, making the form logic independently testable.
- **Type-safe i18n without a library** — `en.ts` exports a `Translations` type that all other locale files must satisfy. Any missing translation key is caught at compile time.
- **CSS custom properties for theming** — a single set of design tokens (`--bg`, `--accent`, etc.) applied at `:root` level; both dark and light modes swap the token values without touching any component.
- **Drop-up language menu** — `bottom-full mb-2` positioning ensures the locale list opens above the trigger, preventing overflow at the bottom of the fixed sidebar.
- **No external toast library** — `ToastContext` provides `showToast(message, type)` globally; toasts are rendered inside `ThemeProvider` so CSS variables resolve correctly.

---

## Deployment

The portfolio is deployed on **Netlify** via continuous deployment from the `main` branch.

1. Push to `main` — Netlify automatically runs `npm run build` and deploys `dist/`.
2. Add EmailJS environment variables in **Site configuration → Environment variables**.
3. No `_redirects` file is needed (single-page, scroll-based navigation).

---

## Author

**Festus Olaleye Ayomikun**
Frontend Developer

- GitHub: [@Mikun07](https://github.com/Mikun07)
- LinkedIn: [festus-olaleye-ayomikun](https://www.linkedin.com/in/festus-olaleye-ayomikun)
- Portfolio: https://festus-olaleye-ayomikun.netlify.app

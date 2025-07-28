# Ayomikun Festus-Olaleye - Developer Portfolio

A modern, fully responsive personal portfolio built with React 18, TypeScript, and Tailwind CSS. Features a Claymorphism + Minimalism UI, dark/light mode, a global language switcher (EN / DE / FR / NL / SV), a custom toast notification system, and a useReducer-driven contact form with EmailJS integration.

**Live site:** https://festus-olaleye-ayomikun.netlify.app

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 9+ |

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
# Fill in your EmailJS credentials (see Environment Variables below)

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

The contact form uses [EmailJS](https://www.emailjs.com/) to send emails without a backend. Create a `.env.local` file at the project root (gitignored):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

For Netlify deployments, add these same keys under **Site configuration -> Environment variables** and trigger a redeploy.

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

## Project Structure

```
New-portfolio/
├── src/
│   ├── core/providers/       ThemeProvider, LanguageProvider, ToastProvider
│   ├── features/             home, about, experience, services, projects, contact
│   ├── shared/components/    Navbar, Footer, ProjectCard, LanguagePicker, ScrollToTop
│   ├── infrastructure/email/ emailService.ts (EmailJS wrapper)
│   ├── i18n/translations/    en, de, fr, nl, sv
│   ├── types/                index.ts (Translations type re-export)
│   ├── test/                 formReducer.test.ts, setup.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── docs/                     Governance artefacts (ADRs, FRs, NFRs, quality gates, etc.)
├── .github/workflows/ci.yml  GitHub Actions CI pipeline
├── CHANGELOG.md
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 |
| Language | TypeScript (strict) |
| Build tool | Vite 4 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| State | useReducer, Context API |
| Email | EmailJS |
| Icons | Ionicons (web components) |
| Testing | Vitest |
| CI/CD | GitHub Actions + Netlify |

---

## CI Pipeline

Four sequential gates run on every push and PR to `main`:

```
tsc --noEmit -> npm run lint -> npm test -> npm run build
```

All four must pass before a PR can merge.

---

## Testing

```bash
npm test
```

Six unit tests cover the `formReducer` pure function in `src/test/formReducer.test.ts`.

---

## Author

**Ayomikun Festus-Olaleye**
Software Engineer | Full-Stack + AI Systems

- GitHub: [@Mikun07](https://github.com/Mikun07)
- LinkedIn: [ayomikun-festus-olaleye](https://www.linkedin.com/in/ayomikun-festus-olaleye-bab137249/)
- Portfolio: https://festus-olaleye-ayomikun.netlify.app

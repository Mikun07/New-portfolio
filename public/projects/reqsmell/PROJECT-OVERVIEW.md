# ReqSmell Project Overview

## What This Project Is

ReqSmell is a research prototype that evaluates whether large language models can detect defects in software requirements specifications. It provides a browser-based workflow for uploading a set of requirements, running that set through Claude and ChatGPT, and comparing what each model detects.

The project is a full-stack application split into two independently versioned repositories, co-located on disk under one parent folder.

* `Backend/` is a REST API, built with Python, FastAPI, and Pydantic, that owns the analysis pipelines, prompt construction, and provider calls.
* `Frontend/` is a React and TypeScript single-page application that gives the researcher a four-step wizard to work against that API.

The two repositories communicate only over HTTP. The frontend does not call Anthropic or OpenAI directly, and it never holds a provider API key.

## The Problem It Solves

Requirements specifications commonly contain two categories of defect that are difficult to catch by manual review at scale: ambiguity, where a requirement can be read more than one way, and inconsistency, where two or more requirements conflict with each other. Both defects raise the cost of a software project by delaying design decisions and producing systems that do not match what stakeholders needed.

The research question behind this prototype, stated in `Backend/docs/REQUIREMENTS.md`, is whether large language models can detect ambiguity and inconsistency with sufficient accuracy to be useful in practice, and whether different LLMs agree with each other when doing so. ReqSmell addresses this by running the same requirement set through two providers under identical prompts and reporting where their classifications match and where they diverge.

## Who Uses It

`Backend/docs/REQUIREMENTS.md` defines three personas rather than enforced system roles, since the backend has no authentication or multi-user access in this version.

| Persona | Goal |
| --- | --- |
| Researcher (thesis author) | Upload a requirements dataset, run both models, and compare their outputs for the thesis evaluation |
| Developer maintaining the prototype | Understand the codebase, run the test suite, and extend the system safely |
| Academic reviewer | Read the documentation and assess the rigor and results of the research |

There is no login, no account system, and no distinction between user roles at the API level. The system is scoped to single-user local use, and multi-user access is explicitly listed as out of scope.

## Core Domain Concepts

### Requirements Upload

A researcher uploads a CSV file of requirements. `csv_service.py` detects the column names for requirement ID, text, domain, type, and project, and rejects files that lack a text column or exceed the configured size limit. Each parsed row becomes a `RequirementRow` with an ID, text, and optional domain, type, and project fields, defaulting to `General`, `UNKNOWN`, and `Default` when not present in the source file.

### Analysis Configuration

Before running analysis, the researcher chooses which providers to use (`claude`, `chatgpt`, or both), which smell types to check (`ambiguity`, `inconsistency`, or both), the LLM temperature, and the maximum group size used when batching requirements for inconsistency checks. At least one model and one smell type must be selected; the API rejects an empty selection.

### Analysis Pipelines

Each combination of model and smell type runs as an independent asynchronous pipeline, identified by a `PipelineKey`: `claudeAmbiguity`, `claudeInconsistency`, `chatgptAmbiguity`, or `chatgptInconsistency`. Ambiguity pipelines send one LLM call per requirement. Inconsistency pipelines group requirements by project and domain, chunk groups larger than the configured maximum, and send one LLM call per group. A failure in one pipeline does not stop the others; the failed pipeline is marked `error` while the rest continue and report their own results.

### Results and Reports

Each ambiguity result carries a label (`SMELL` or `CLEAN`), a confidence level (`HIGH`, `MEDIUM`, or `LOW`), an ambiguity type (`lexical`, `syntactic`, `referential`, `semantic`, or `none`), an explanation, and an optional suggestion. Each inconsistency result carries the same label and confidence fields for a pair of requirements, along with both requirement texts and an explanation.

`comparison_service.py` aggregates per-model results into a `ModelReport`, which summarizes smell counts and rates broken down by smell type, domain, and requirement type, and a `ComparisonReport`, which shows where Claude and ChatGPT agree or disagree on the same requirement. Agreement statistics include full agreement count, Claude-only detections, ChatGPT-only detections, and an overall agreement rate.

### Mock and Live Modes

The `USE_REAL_LLM` environment variable, false by default, controls whether the backend calls the real Anthropic and OpenAI APIs or returns deterministic local responses with no network calls and no API keys required. This lets a developer run the full pipeline and test suite without incurring provider cost or needing credentials.

## How the Backend Is Built

The backend runs on Python 3.11, using FastAPI as the web framework, Pydantic v2 for request and response validation, and Uvicorn as the ASGI server. There is no database and no ORM; analysis state lives in `run_store.py`, an in-memory dictionary guarded by an `asyncio.Lock`. State is not persisted, and a server restart clears all runs.

```text
Browser (React frontend) to FastAPI Backend to Anthropic (Claude) and OpenAI (ChatGPT)
                                |
                          In-memory run store
```

The backend is organized into five layers, documented in `Backend/docs/ARCHITECTURE.md`.

| Layer | File | Responsibility |
| --- | --- | --- |
| Entry point | `app/main.py` | FastAPI application factory; wires middleware, routers, and logging |
| Routers | `app/routers/upload.py`, `app/routers/analysis.py` | HTTP routing and status code selection only, no business logic |
| Services | `csv_service.py`, `prompt_service.py`, `llm_clients.py`, `response_parser.py`, `analysis_service.py`, `comparison_service.py` | All business logic, one responsibility per service |
| Models | `app/models.py` | Every Pydantic model used as an API contract, shared with the frontend's TypeScript types |
| Config | `app/config.py` | All runtime configuration read from environment variables through a single cached `get_settings()` call |

Prompt templates in `prompt_service.py` carry an embedded version number, currently `2.1`, so a given set of results can be traced back to the prompt that produced them.

The full API surface has four endpoints: `GET /health`, `POST /api/upload`, `POST /api/analyse`, and `GET /api/status/{run_id}`. These are documented in `Backend/docs/ARCHITECTURE.md` and `Backend/docs/REQUIREMENTS.md`.

The security model is documented in `Backend/docs/SECURITY.md`. There is no authentication; the design assumes single-user local deployment. Provider API keys are read from a local `.env` file, are never sent to the browser, and are excluded from source control and from logs by default. CORS origins are restricted to localhost by configuration. The main risk considered outside key handling is prompt injection through requirement text, addressed by placing that text in a labeled field within a structured JSON prompt rather than treating it as an instruction.

## How the Frontend Is Built

The frontend is built with React 18 and TypeScript, using Vite 6 as the build tool and Tailwind CSS for styling. There is no routing library; navigation is a four-step wizard, driven entirely by Redux state rather than by URL routes. State management uses Redux Toolkit, with three slices: `wizardSlice`, `analysisSlice`, and `toastSlice`.

```text
src/
  api/client.ts            sole HTTP boundary to the backend, built on axios
  components/
    charts/                bar and donut charts for result breakdowns
    dashboard/              report, comparison, and summary views
    shared/                 shared UI primitives (buttons, tables, dropzone, stepper)
    steps/                  the four wizard steps: upload, configure, run, dashboard
  hooks/                    analysis run polling, file upload, pagination, table search
  store/                    Redux store and slices
  types/index.ts            types mirroring backend response shapes
  utils/                    CSV parsing, formatting, and PDF and CSV report generation
```

The four wizard steps mirror the backend pipeline directly: upload a CSV, configure models and smell types, run the analysis while polling for progress, and view the resulting dashboard. Recharts renders the bar and donut charts on the dashboard, and `jspdf` with `html2canvas` generates the exported PDF report. `papaparse` handles client-side CSV parsing for preview before upload.

`src/api/client.ts` is the only file that makes HTTP calls to the backend. It exposes three functions: `uploadCsv`, `startAnalysis`, and `getRunStatus`, along with helpers that normalize backend error responses into readable messages. In development, Vite's proxy configuration forwards `/api/*` requests to `http://localhost:8000`.

## How the Two Repositories Fit Together

```text
Frontend (React SPA, Vite dev server on port 5173)
    sends HTTP requests (JSON and multipart)
    to Backend (FastAPI, Uvicorn server on port 8000)
        which calls, when USE_REAL_LLM is true
        Anthropic (Claude) and OpenAI (ChatGPT)
```

The frontend holds no provider credentials and performs no smell detection logic of its own. Every classification, every comparison calculation, and every pipeline decision happens in the backend. The frontend is responsible for collecting input, displaying progress, and rendering results, not for producing them.

The backend's CORS configuration must explicitly allow the frontend's origin, `http://localhost:5173` in local development, through the `CORS_ORIGINS` environment variable.

Both repositories share a type contract by convention rather than by generated code: every Pydantic model in `Backend/app/models.py` has a matching type in `Frontend/src/types/index.ts`, and `Backend/docs/ARCHITECTURE.md` states that a change to one must be reflected in the other.

## Testing and Continuous Integration

Both repositories include automated tests and GitHub Actions workflows.

The backend uses pytest, pytest-asyncio, and FastAPI's `TestClient`, run against the mock LLM path (`USE_REAL_LLM=false`) rather than live provider calls. The suite contains 22 tests across six files: `test_config.py`, `test_csv_service.py`, `test_llm_clients.py`, `test_prompt_service.py`, `test_response_parser.py`, and `test_routes.py`. The CI workflow (`Backend/.github/workflows/backend-ci.yml`) runs a quality job, covering ruff formatting and linting, mypy in strict mode, and pylint with a minimum score of 10.0, followed by a separate test job.

The frontend uses Vitest, jsdom, and React Testing Library. The suite contains 18 test cases across six files under `Frontend/__tests__/`, covering the API client, CSV parsing, formatting utilities, report generation, and the CSV download hook. Its CI workflow (`Frontend/.github/workflows/frontend-ci.yml`) runs ESLint and a TypeScript type check, then the test suite, then a production build.

Both repositories now measure coverage with `@vitest/coverage-v8` (frontend) and `pytest-cov` (backend), run through `npm run test:coverage` and `pytest --cov=app` respectively. The backend's most recent run reports 69 percent statement coverage across `app/`. Coverage is strongest in the routers, models, and prompt service, all at 91 percent or above, and weakest in `analysis_service.py` (25 percent) and `comparison_service.py` (23 percent), since those modules orchestrate live pipeline execution and report aggregation that the current test suite does not exercise directly; they are covered instead through the parsing and route-level tests that check their inputs and outputs. The frontend's most recent run reports 18.67 percent statement coverage and 68.01 percent branch coverage across `src/`. Coverage is concentrated in the utility and API client modules that already have direct unit tests (`reportFactory.ts` at 99 percent, `sampleDashboardResult.ts` at 99 percent, `csvParser.ts` at 86 percent), while the React components under `src/components/` and the Redux slices under `src/store/` currently have no dedicated tests and report 0 percent. These figures reflect the state of the codebase at the time the coverage command was last run and will drift as code and tests change.

## Project Metrics

The following figures describe the codebase itself, gathered directly from each repository.

| Metric | Backend | Frontend |
| --- | --- | --- |
| Source files | 21 | 45 |
| Lines of source code (approximate) | 2,518 (app and tests combined) | 5,324 (including CSS) |
| Runtime dependencies | 7 | 10 |
| Development dependencies | 7 | 21 |
| Automated tests | 22 | 18 |
| Statement coverage | 69% | 18.67% |
| Branch coverage | not reported by pytest-cov (line-based tool) | 68.01% |

The backend exposes four HTTP endpoints across two route modules plus a health check. It defines no persistent data model; all state is held in the in-memory run store described above.

## Current Known Limitations

These limitations are documented in `Backend/docs/REQUIREMENTS.md` and `Backend/docs/SECURITY.md`, not concealed, and reflect deliberate scope decisions for a thesis prototype rather than oversights.

The backend has no authentication, no multi-user support, and no persistent storage; all analysis state is lost on restart. There is no rate limiting on the API, since provider API keys are assumed to be under the researcher's own control. The system is designed for local, single-user use and is not intended for deployment to a shared or public environment in its current form.

## Where to Look for More Detail

The backend documentation set includes `Backend/docs/ARCHITECTURE.md`, `Backend/docs/REQUIREMENTS.md`, `Backend/docs/SECURITY.md`, `Backend/docs/RISK_ASSESSMENT.md`, `Backend/docs/DEVOPS.md`, `Backend/docs/COMMANDS.md`, and `Backend/docs/VERSIONING.md`.

The `.AI_tool/` folder at the repository root contains extended AI-context summaries for both repositories: `backend_README.md` and `frontend_README.md`.

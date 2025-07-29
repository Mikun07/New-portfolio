# DevOps & Deployment Strategy

**Project:** MikunAir  
**Version:** v0.1.0  
**Status:** Approved  
**Date:** 2026-04-26  
**Author:** Festus-Olaleye Ayomikun  
**Depends On:** QUALITY-001-testing-strategy.md

---

## 1. Operational Requirements Analysis

### Availability
- Target: 99.5% uptime (NFR-002)
- Acceptable downtime: ~3.6 hours/month
- Recovery strategy: Docker restart policies; managed PostgreSQL with automatic failover

### Recovery Requirements
- RTO (Recovery Time Objective): < 30 minutes for infrastructure failure
- RPO (Recovery Point Objective): < 1 hour (daily DB backup minimum)

### Scalability Requirements
- Baseline: 100 concurrent users (NFR-001)
- Burst target: 500 concurrent users (NFR-013)
- Scaling mechanism: horizontal container replication (stateless API; NFR-009)

### Security Requirements
- All traffic encrypted (TLS 1.2+; NFR-005)
- Secrets never hardcoded or committed to git
- Container images scanned for vulnerabilities in CI

### Compliance Requirements
- GDPR: personal data processed in EU regions only (Azure North Europe / West Europe)
- Data retention: booking records retained for 7 years (NFR-015)

---

## 2. Environment Strategy

### Development Environment
- **Purpose:** Local feature development and testing
- **Infrastructure:** Docker Compose (frontend, backend, PostgreSQL)
- **Access:** Developer only (localhost)
- **Configuration:** `.env.local` (gitignored)
- **Deployment process:** `docker compose up --build`

### Staging Environment
- **Purpose:** Pre-production validation, integration testing, release verification
- **Infrastructure:** Azure Container Instance (or single VPS with Docker Compose)
- **Access:** Developer + QA only; no public access
- **Configuration:** Environment variables injected via GitHub Actions secrets
- **Deployment process:** Automated on push to `main` branch after all CI gates pass

### Production Environment
- **Purpose:** Live portfolio demonstration
- **Infrastructure:** Azure Container Apps (scale-to-zero; cost-efficient for portfolio)
- **Access:** Public (frontend); API protected by JWT
- **Configuration:** Azure Key Vault for secrets; environment variables at runtime
- **Deployment process:** Automated on tagged release (`vX.Y.Z`) after staging validation

---

## 3. Containerisation Strategy

### Decision: Use Docker for all services

All three services are containerised:

| Service | Base Image | Justification |
|---|---|---|
| Frontend | `node:20-alpine` (build) → `nginx:alpine` (serve) | Multi-stage build minimises final image size; nginx serves static assets efficiently |
| Backend | `node:20-alpine` | Minimal, production-safe Node.js image |
| Database | `postgres:16-alpine` | Used in dev/staging only; Azure Database for PostgreSQL used in production |

### Multi-Stage Docker Builds

**Frontend Dockerfile (summary):**
```
Stage 1 (builder): node:20-alpine → npm ci → npm run build → /app/dist
Stage 2 (serve):   nginx:alpine → copy /app/dist → nginx.conf → PORT 80
```

**Backend Dockerfile (summary):**
```
Stage 1 (builder): node:20-alpine → npm ci → npm run build → /app/dist
Stage 2 (runtime): node:20-alpine → copy dist + node_modules → NODE_ENV=production → PORT 3000
```

### Docker Compose (development)
```yaml
services:
  frontend:   build: ./frontend,   ports: ["5173:80"]
  backend:    build: ./backend,    ports: ["3000:3000"], depends_on: [postgres]
  postgres:   image: postgres:16-alpine, ports: ["5432:5432"]
```

### Environment Consistency
- Development, staging, and production all run the same Docker images
- Only environment variables differ between environments
- `.dockerignore` excludes `node_modules`, `.env*`, `*.log`

---

## 4. CI/CD Pipeline Design

### Continuous Integration (GitHub Actions)

Triggered on: every push to any branch and every pull request.

```
┌─────────────────────────────────────────────────────┐
│                   CI Pipeline                        │
│                                                      │
│  1. Checkout code                                    │
│  2. Setup Node.js 20                                 │
│  3. Install dependencies (npm ci)                    │
│  4. TypeScript type check (tsc --noEmit)             │
│  5. ESLint + Prettier check                          │
│  6. Unit tests + coverage (Vitest)                   │
│     → Fail if coverage < 80% on business logic      │
│  7. Start Docker Compose (test DB)                   │
│  8. Run database migrations                          │
│  9. Integration tests (Supertest)                    │
│ 10. Accessibility scan (axe-core)                    │
│ 11. Security audit (npm audit --audit-level=high)    │
│ 12. Contract validation (graphql-inspector)          │
│ 13. Docker build (validate image builds)             │
│ 14. Stop Docker Compose                              │
└─────────────────────────────────────────────────────┘
```

**All 14 steps must pass.** Any failure blocks merge.

### Continuous Delivery (GitHub Actions)

Triggered on: push to `main` after CI passes.

```
1. CI pipeline (above) — must pass
2. Docker build and push to Azure Container Registry
3. Deploy to Staging (Azure Container Instance)
4. Run E2E tests against staging (Playwright)
5. Run performance tests against staging (k6)
6. Notify: pass or fail
```

### Continuous Deployment (GitHub Actions)

Triggered on: git tag `vX.Y.Z` push.

```
1. CD pipeline (above) — must pass
2. Deploy to Production (Azure Container Apps)
3. Health check: GET /api/v1/health → 200 OK
4. Smoke test: one E2E journey against production
```

### Rollback Procedure
- Azure Container Apps supports instant revision rollback
- Command: `az containerapp revision set-mode --revision <previous-revision>`
- Automated rollback triggered if health check fails post-deployment

---

## 5. Infrastructure Architecture

### Compute
| Environment | Resource | Justification |
|---|---|---|
| Development | Docker Compose (local) | No cloud cost; consistent with production containers |
| Staging | Azure Container Instance (1 vCPU, 1.5GB) | Low cost; single container group sufficient for validation |
| Production | Azure Container Apps (0.5–1 vCPU, scale 0–3) | Scale-to-zero for cost efficiency; scales under load |

### Storage
| Resource | Type | Purpose |
|---|---|---|
| Development | Docker volume (postgres_data) | Local DB persistence |
| Staging | Azure Database for PostgreSQL (Flexible Server, Burstable B1ms) | Managed, cost-efficient |
| Production | Azure Database for PostgreSQL (Flexible Server, General Purpose D2s_v3) | Managed, automated backups, point-in-time restore |

### Networking
| Component | Purpose |
|---|---|
| Azure Application Gateway / Container Apps Ingress | TLS termination, HTTPS enforcement, reverse proxy |
| CORS configuration in Express | Restricts allowed origins to frontend domain |
| VNet integration (production) | Backend not directly internet-accessible; traffic routes via ingress |

---

## 6. Configuration Management

### Environment Variables (never hardcoded)

| Variable | Development | Staging | Production |
|---|---|---|---|
| `DATABASE_URL` | `postgres://localhost:5432/...` | GitHub Actions secret | Azure Key Vault reference |
| `JWT_SECRET` | `.env.local` | GitHub Actions secret | Azure Key Vault reference |
| `JWT_REFRESH_SECRET` | `.env.local` | GitHub Actions secret | Azure Key Vault reference |
| `SMTP_HOST` | Mailhog (local) | GitHub Actions secret | Azure Key Vault reference |
| `NODE_ENV` | `development` | `staging` | `production` |
| `FRONTEND_URL` | `http://localhost:5173` | Staging URL | Production URL |

### Secrets Management
- **Development:** `.env.local` (gitignored via `.gitignore`)
- **Staging:** GitHub Actions encrypted secrets
- **Production:** Azure Key Vault; secrets referenced as environment variables at container runtime
- **Rule:** No secret ever appears in source code, Docker image, or git history

---

## 7. Monitoring Strategy

### System Monitoring
| Metric | Tool | Threshold | Alert |
|---|---|---|---|
| Container CPU utilisation | Azure Monitor | > 80% sustained 5 min | Email alert |
| Container memory utilisation | Azure Monitor | > 85% | Email alert |
| Database connections | Azure Monitor | > 80% of max | Email alert |

### Application Monitoring
| Metric | Collection | Threshold | Alert |
|---|---|---|---|
| API response time (P95) | Custom middleware → `/metrics` endpoint | > 2000ms | Email alert |
| HTTP error rate (5xx) | Express middleware | > 1% over 5 min | Email alert |
| Request rate | Express middleware | Baseline × 3 (spike detection) | Log |

### Business Monitoring
| Metric | Collection | Purpose |
|---|---|---|
| Bookings created per hour | AuditLog query | Portfolio demo metric |
| Failed booking attempts (overbooking) | AuditLog query | Verify FR-015 effectiveness |
| GDPR erasure requests | AuditLog query | Compliance reporting |

---

## 8. Logging Strategy

### Structured Logging (Winston)

All log entries are JSON with these fields:

```json
{
  "timestamp": "2026-06-26T19:00:00.000Z",
  "level": "info",
  "correlationId": "a1b2c3d4-...",
  "service": "booking",
  "action": "booking.created",
  "entityId": "booking-uuid",
  "userId": "user-uuid",
  "message": "Booking created successfully"
}
```

**Rules:**
- PII fields (name, email, DOB, document numbers) are NEVER logged
- Errors include correlationId; stack traces logged server-side only, never in API responses
- Log levels: `error` (production issues), `warn` (unexpected states), `info` (business events), `debug` (development only)

### Log Retention
- Development: console output only
- Staging: Azure Monitor Logs (30-day retention)
- Production: Azure Monitor Logs (90-day retention; booking events in AuditLog for 7 years)

### Log Analysis
- Error spikes detected via Azure Monitor alert rules
- Incident investigation: correlationId from user report → search AuditLog + application logs

---

## 9. Observability Architecture

**Three pillars:**

| Pillar | Implementation |
|---|---|
| Metrics | Custom Express middleware exports Prometheus-format metrics at `/metrics`; scraped by Azure Monitor |
| Logs | Winston structured JSON → Azure Monitor Logs |
| Traces | Correlation ID injected at API Gateway layer; propagated in all log entries and AuditLog rows |

**End-to-end request visibility:** Every request gets a UUID correlation ID. Trace a booking failure: API log (correlationId) → BookingService log (same ID) → AuditLog entry (same ID) → DB transaction record.

---

## 10. Security Operations Review

| Area | Control |
|---|---|
| Secrets management | Azure Key Vault (production); GitHub Secrets (CI); .env.local (dev, gitignored) |
| Deployment security | Docker images scanned with `trivy` in CI; base images pinned to digest |
| Access control | Production Azure resources access-controlled via Azure RBAC; no shared credentials |
| Infrastructure security | Backend not publicly accessible; only ingress exposes HTTPS endpoints |
| Dependency security | `npm audit` in CI; Dependabot enabled on GitHub repo for automated security PRs |
| Container hardening | Non-root user in Dockerfile; read-only filesystem where possible |

---

## 11. Backup & Disaster Recovery

### Backup Strategy
| Environment | Method | Frequency | Retention | Restore Test |
|---|---|---|---|---|
| Production DB | Azure Database automated backups | Daily (full) + continuous WAL | 7 days point-in-time | Monthly restore test |
| Container images | Azure Container Registry | On every CI build | Latest 10 tagged versions | — |

### Disaster Recovery
- **RTO:** < 30 minutes (Azure Container Apps redeploy from registry; DB restore from latest backup)
- **RPO:** < 1 hour (continuous WAL archiving)
- **Failover:** Azure Container Apps supports automatic revision-based rollback; DB failover via Azure managed standby

---

## 12. Incident Management

| Step | Process |
|---|---|
| Detection | Azure Monitor alert or user report with correlation ID |
| Classification | P1 (data loss/security breach/overbooking), P2 (service unavailable), P3 (degraded performance), P4 (cosmetic) |
| Response | P1: immediate rollback + investigation. P2: rollback + fix within 1 hour. |
| Root Cause Analysis | Written for all P1/P2 incidents; stored in `docs/incidents/` |
| Postmortem | P1 incidents require blameless postmortem document |

---

## 13. Scalability Assessment

### Current Capacity
- Stateless Node.js API: 100 concurrent users per container instance (NFR-001)
- PostgreSQL connection pool: 20 connections default (configurable)

### Scaling Strategy
| Layer | Mechanism | When |
|---|---|---|
| API (horizontal) | Azure Container Apps scale-out (0 → 3 replicas) | CPU > 70% or request queue depth |
| Database | Azure PostgreSQL vertical scaling (increase tier) | Connection count > 80% of max |
| Frontend | Static assets served by nginx; CDN cacheable | No scaling action needed |

### Caching Strategy (future)
- Flight search results cacheable for 60 seconds (data changes infrequently)
- Redis cache layer added as Should Have in a future minor version

---

## 14. Cost Analysis

### Monthly Estimates (portfolio / low traffic)

| Resource | Tier | Estimated Cost |
|---|---|---|
| Azure Container Apps (backend) | Scale-to-zero; ~2 vCPU-hours/day | ~£5–10/month |
| Azure Database for PostgreSQL | Flexible Server, Burstable B1ms | ~£12–15/month |
| Azure Container Registry | Basic | ~£4/month |
| Azure Monitor (logs) | 5GB/month | ~£2–5/month |
| Azure Static Web Apps (frontend) | Free tier | £0 |
| **Total** | | **~£23–34/month** |

### Cost vs Reliability Trade-offs
- Scale-to-zero on Container Apps saves ~60% vs always-on VM — acceptable for portfolio
- Burstable DB tier saves cost; upgrade path to General Purpose is straightforward when needed
- No Kubernetes cluster overhead (Azure Container Apps abstracts this)

---

## 15. Operational Readiness Review

| Checkpoint | Status |
|---|---|
| CI/CD pipeline defined | ✓ |
| Infrastructure defined (dev/staging/production) | ✓ |
| Monitoring defined | ✓ |
| Logging defined | ✓ |
| Observability architecture defined | ✓ |
| Security operations reviewed | ✓ |
| Backup & recovery strategy defined | ✓ |
| Incident management defined | ✓ |
| Scalability reviewed | ✓ |
| Cost analysis completed | ✓ |

**VERDICT: OPERATIONAL READINESS CONFIRMED.**

---

## 16. Learning Concept: GitHub Actions CI/CD

**What it is:** GitHub Actions is a CI/CD platform integrated directly into GitHub. Workflows are YAML files in `.github/workflows/` that define automated pipelines — triggered by push, PR, tag, or schedule. Each workflow consists of jobs and steps that run on GitHub-hosted or self-hosted runners.

**Why chosen:** GitHub Actions is free for public repositories, requires no external CI infrastructure, integrates natively with the project's GitHub repo, and is widely used in industry (directly relevant for a portfolio demonstrating DevOps competence). It also integrates with Azure for deployment.

**How it improves operations:**
- Every push runs all quality gates automatically — no manual test runs
- Deployments are reproducible and automated — no "works on my machine" risk
- Rollback is one CLI command or one click in Azure Portal

**Trade-offs:** GitHub Actions has a monthly minutes limit on private repos (2000 min/month on free tier). For a portfolio project with moderate CI usage, this is sufficient. For higher-volume projects, self-hosted runners or paid tiers are appropriate.

**Interview discussion:** "My CI pipeline runs 14 steps automatically on every push — type check, lint, unit tests with coverage enforcement, integration tests against a real Docker Compose database, accessibility scan, and security audit. Nothing can merge unless all gates pass. This means the main branch is always deployable."

---

*Document controlled under Version Control & Documentation Governance Framework.*  
*Next review: triggered by any infrastructure change, new CI step, or deployment strategy revision.*

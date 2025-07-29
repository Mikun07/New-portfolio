# Version Control & Documentation Governance

**Project:** MikunAir  
**Version:** v0.1.0  
**Author:** Festus-Olaleye Ayomikun  
**Date:** 2026-04-26

---

## Version Classification

| Type | Format | Triggers |
|---|---|---|
| Major (vX.0.0) | Architecture change, major requirement change, major UI redesign | ADRs + Migration Notes + Release Notes required |
| Minor (vX.Y.0) | New feature, new module, new workflow | Feature Spec + Updated User Stories + Acceptance Criteria + Test updates required |
| Patch (vX.Y.Z) | Bug fix, refactor, package update, docs update | Patch Notes + Impact Assessment required |

## Traceability Rule

Every change must be traceable:

```
Requirement → Design Decision → Implementation → Test → Release
```

If traceability cannot be established, the change is rejected.

## Release Readiness Checklist

Before creating any release:

- [ ] Requirements updated (if scope changed)
- [ ] Architecture updated (if structural change)
- [ ] Tests updated (for all changed behaviour)
- [ ] Documentation updated (all affected docs)
- [ ] CHANGELOG.md updated
- [ ] All CI quality gates passing

## Documentation Ownership

| Document | Owner | Update Trigger |
|---|---|---|
| REQ-001-requirements-engineering.md | Requirements Phase | Any scope or requirement change |
| ARCH-001-software-architecture.md | Architecture Phase | Any ADR, component, or data model change |
| DESIGN-001-software-design.md | Design Phase | Any module, interface, or API change |
| QUALITY-001-testing-strategy.md | Quality Phase | Any new feature, new risk, or test failure pattern |
| DEVOPS-001-deployment-strategy.md | DevOps Phase | Any infrastructure or pipeline change |
| CHANGELOG.md | Release Manager | Every version increment |
| CLAUDE.md | All | Any governance rule change |

## Knowledge Transfer Standard

A new developer must be able to understand **what changed, why it changed, how it works, and how to extend it** using only the project documentation.

If this is not possible, the documentation is incomplete and must be updated before the change is merged.

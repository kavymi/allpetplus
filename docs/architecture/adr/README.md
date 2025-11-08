# Architecture Decision Records (ADRs)

**Purpose:** Document significant architectural decisions made for All Pet Plus  
**Format:** Based on [Michael Nygard's ADR template](https://github.com/joelparkerhenderson/architecture-decision-record)

---

## What is an ADR?

An **Architecture Decision Record** (ADR) is a document that captures an important architectural decision made along with its context and consequences.

**When to create an ADR:**
- Significant technology choices (frameworks, databases, cloud providers)
- Architecture patterns (microservices, event-driven, etc.)
- Major refactorings or migrations
- Security or compliance decisions
- Decisions that are hard to reverse

**When NOT to create an ADR:**
- Minor implementation details
- Temporary workarounds
- Obvious choices with no alternatives

---

## ADR List

### Active Decisions

| Number | Title | Date | Status |
|--------|-------|------|--------|
| [001](./001-use-trpc-for-api.md) | Use tRPC for API Layer | 2025-09-15 | ✅ Accepted |
| [002](./002-hybrid-microservices-approach.md) | Hybrid Microservices Approach | 2025-09-20 | ✅ Accepted |
| [003](./003-iframe-vs-module-federation.md) | Iframe vs Module Federation | 2025-10-01 | ✅ Accepted |
| [004](./004-nx-monorepo-tooling.md) | NX Monorepo Tooling | 2025-09-10 | ✅ Accepted |

### Template

| Number | Title | Date | Status |
|--------|-------|------|--------|
| [000](./000-template.md) | ADR Template | N/A | 📝 Template |

---

## Decision Status

- **Proposed** - Decision under consideration
- **Accepted** - Decision approved and implemented
- **Deprecated** - No longer recommended but may still be in use
- **Superseded** - Replaced by a newer decision (link to the new one)

---

## Quick Summaries

### 001: Use tRPC for API Layer

**Decision:** Use tRPC for all frontend ↔ backend communication  
**Why:** 100% type safety, great DX, perfect for TypeScript monorepo  
**Status:** ✅ Accepted, in production

**Key benefits:**
- End-to-end type safety
- Automatic client generation
- Excellent developer experience
- Easy refactoring

---

### 002: Hybrid Microservices Approach

**Decision:** Start with modular monolith, extract microservices when needed  
**Why:** Balance simplicity with future scalability  
**Status:** ✅ Accepted, implemented

**Key strategy:**
- Modular monolith for most services
- Extract high-traffic modules to microservices
- Keep low-traffic in monolith

**Current state:**
- `services/backend` - Modular monolith ✅
- `services/builder-service` - Extractable template ✅

---

### 003: Iframe vs Module Federation

**Decision:** Use iframe integration for micro-frontends initially  
**Why:** Simpler, complete isolation, can upgrade to Module Federation later  
**Status:** ✅ Accepted, in use for pet-licensing

**Trade-offs:**
- ✅ Simple implementation
- ✅ Complete isolation
- ⚠️ Less seamless UX
- 🔮 May migrate to Module Federation for better UX

---

### 004: NX Monorepo Tooling

**Decision:** Use NX for monorepo management  
**Why:** Best caching, affected commands, dependency graph  
**Status:** ✅ Accepted, saves 70% build time

**Key benefits:**
- 70% faster builds (caching)
- Affected-only testing
- Dependency visualization
- Great TypeScript support

---

## Creating a New ADR

### 1. Copy the Template

```bash
cp docs/architecture/adr/000-template.md docs/architecture/adr/005-your-title.md
```

### 2. Fill In the Sections

- **Date:** Today's date
- **Status:** Usually "Proposed" initially
- **Deciders:** Who was involved in the decision
- **Context:** Why is this decision needed?
- **Decision:** What was decided?
- **Consequences:** What are the pros/cons?
- **Alternatives:** What else was considered?

### 3. Number Sequentially

Use the next number in sequence (currently up to 004).

### 4. Add to This Index

Update the ADR List table above with your new ADR.

### 5. Link Related ADRs

Cross-reference related decisions in the "Related Decisions" section.

---

## ADR Workflow

### Proposing a Decision

1. Create ADR with status "Proposed"
2. Share with team for review
3. Discuss in architecture meeting
4. Update based on feedback

### Accepting a Decision

1. Update status to "Accepted"
2. Add to this index
3. Begin implementation
4. Update documentation

### Deprecating a Decision

1. Update status to "Deprecated"
2. Add note explaining why
3. Link to replacement if exists
4. Update this index

### Superseding a Decision

1. Create new ADR
2. Update old ADR status to "Superseded by [ADR-XXX]"
3. Link new ADR to old one
4. Update this index

---

## Example: Full Decision Process

**Scenario:** Deciding on a state management library

```markdown
Week 1: Create ADR-005-state-management.md
  - Status: Proposed
  - Alternatives: Redux, Zustand, Recoil, Jotai
  - Team review requested

Week 2: Team discusses
  - Votes for Zustand
  - Concerns addressed
  - Decision made

Week 2: Update ADR
  - Status: Accepted
  - Add final rationale
  - Update index

Week 3: Implementation
  - Begin using Zustand
  - Update documentation
  - Review in 3 months
```

---

## Future ADRs to Consider

**Backend:**
- [ ] Database separation strategy
- [ ] Event bus implementation (Redis vs NATS)
- [ ] Service extraction criteria
- [ ] API versioning strategy

**Frontend:**
- [ ] State management library
- [ ] Animation library choice
- [ ] Form handling approach
- [ ] Testing strategy

**Infrastructure:**
- [ ] Cloud provider selection
- [ ] CI/CD platform
- [ ] Monitoring solution
- [ ] Log aggregation

**Security:**
- [ ] Secrets management in production
- [ ] GDPR compliance approach
- [ ] Audit logging strategy

---

## Related Documentation

- [Architecture Overview](/docs/architecture/architecture.md)
- [Microservices Architecture](/docs/architecture/microservices-architecture.md)
- [Micro-Frontend Architecture](/docs/architecture/microfrontend-architecture.md)
- [Hybrid Implementation](/docs/architecture/hybrid-architecture-implementation.md)

---

## Resources

### About ADRs
- [ADR GitHub Organization](https://adr.github.io/)
- [When to Write an ADR](https://github.com/joelparkerhenderson/architecture-decision-record#when-to-write-an-adr)
- [ADR Tools](https://github.com/npryce/adr-tools)

### Our Process
- Architecture meetings: Bi-weekly Wednesdays
- ADR reviews: Part of architecture meeting
- Required reviewers: 2+ team members
- Final approval: Tech Lead

---

**Last Updated:** October 23, 2025  
**Next ADR Number:** 005  
**Total ADRs:** 4 active + 1 template


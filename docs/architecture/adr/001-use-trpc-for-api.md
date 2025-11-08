# 1. Use tRPC for API Layer

**Date:** 2025-09-15  
**Status:** Accepted  
**Deciders:** Development Team

---

## Context

We needed a way to build type-safe APIs between our Next.js frontend and Fastify backend. Options included:
- REST with manual types
- GraphQL
- tRPC
- gRPC

We wanted:
- End-to-end type safety
- Good developer experience
- Easy refactoring
- TypeScript-first approach

---

## Decision

We will use tRPC as our API layer for all frontend ↔ backend communication.

**Implementation:**
- Location: `libs/api/`
- Routers for each domain (designs, pets, orders, users)
- Zod for runtime validation
- React Query integration for frontend

---

## Consequences

### Positive

- ✅ 100% type safety from DB to UI
- ✅ Automatic client generation
- ✅ Excellent DX with autocomplete
- ✅ Compile-time error checking
- ✅ Easy refactoring (rename propagates)
- ✅ No manual API client code

### Negative

- ⚠️ TypeScript-only (not a concern for us)
- ⚠️ Less suitable for public APIs
- ⚠️ Learning curve for team

### Neutral

- Still use Fastify for webhooks (not tRPC)
- Still use REST for external integrations

---

## Alternatives Considered

### Alternative 1: REST with OpenAPI

**Pros:**
- Industry standard
- Public API friendly
- Tool support

**Cons:**
- Manual type generation
- Type sync issues
- More boilerplate

**Why not chosen:** Type safety not guaranteed, manual sync needed

---

### Alternative 2: GraphQL

**Pros:**
- Flexible queries
- Good tooling
- Industry adoption

**Cons:**
- More complex setup
- Overhead for simple queries
- N+1 query issues

**Why not chosen:** Too complex for our needs

---

## Related Decisions

- Future: May use REST for public API
- Webhooks will continue using Fastify REST

---

## References

- [tRPC Documentation](https://trpc.io)
- [Team Discussion Thread]
- [Proof of Concept Results]

---

**Last Updated:** 2025-09-15

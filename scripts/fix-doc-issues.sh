#!/bin/bash
#
# Script Name: fix-doc-issues.sh
# Purpose: Quick fixes for documentation issues from audit
# Usage: ./scripts/fix-doc-issues.sh
#

set -e
set -u
set -o pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

function log_info() {
  echo -e "${BLUE}ℹ${NC}  $1"
}

function log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

function log_error() {
  echo -e "${RED}✗${NC} $1"
}

function log_warning() {
  echo -e "${YELLOW}⚠${NC}  $1"
}

echo ""
echo "==============================================="
echo "  Documentation Issues - Quick Fix Script"
echo "==============================================="
echo ""

# Change to repo root
cd "$(dirname "$0")/.."

log_info "Running automated fixes..."
echo ""

# Fix 1: Already done manually - broken links
log_success "Broken links already fixed manually"

# Fix 2: Already done - duplicate api-keys.md removed
log_success "Duplicate api-keys.md already removed"

# Fix 3: Create missing directories
log_info "Creating missing directories..."
mkdir -p docs/architecture/adr
mkdir -p docs/archive/2025-09
mkdir -p docs/archive/2025-10
mkdir -p docs/archive/legacy
log_success "Created directory structure"

# Fix 4: Create placeholder files for missing docs
log_info "Creating placeholder documentation files..."

# Security doc
if [ ! -f docs/security.md ]; then
  cat > docs/security.md << 'EOF'
# Security Guidelines

**Last Updated:** October 23, 2025  
**Status:** Draft

---

## Overview

Security best practices and guidelines for All Pet Plus development.

---

## Authentication & Authorization

### Clerk Integration

**Current implementation:** Clerk for authentication

**Best practices:**
- Never store passwords locally
- Use Clerk's built-in security features
- Validate JWT tokens on backend
- Implement proper session management

---

## Environment Variables

### Sensitive Data

**Never commit:**
- API keys
- Database credentials
- JWT secrets
- Third-party service tokens

**Use `.env` files:**
- Add `.env` to `.gitignore`
- Use `env.template` for documentation
- Rotate secrets regularly

---

## API Security

### Rate Limiting

**Implement rate limiting on:**
- Authentication endpoints
- Public API endpoints
- Webhook endpoints

**Tools:** Fastify rate-limit plugin

---

### Input Validation

**Always validate with Zod:**
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

## CORS Configuration

**Restrict origins:**
```typescript
cors: {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}
```

---

## Database Security

### Connection Security

- Use SSL/TLS for connections
- Implement connection pooling
- Limit connection privileges
- Regular backups

### Query Safety

- Use Prisma (prevents SQL injection)
- Never concatenate user input
- Sanitize all inputs

---

## Secrets Management

### Development

- Use `.env.local` files
- Never commit secrets
- Use placeholder values in templates

### Production

- Use environment variables
- Consider secrets manager (AWS Secrets Manager, etc.)
- Rotate regularly

---

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced
- [ ] Database credentials secure
- [ ] Error messages don't leak info
- [ ] Logging doesn't include sensitive data

---

## Reporting Security Issues

**Found a security issue?**

1. DO NOT create public issue
2. Email: security@harnesshero.com
3. Include detailed description
4. We'll respond within 24 hours

---

## Related Documentation

- [Environment Setup](/docs/guides/environment-setup.md)
- [API Reference](/docs/api/backend-api-reference.md)

---

**Last Updated:** October 23, 2025
EOF
  log_success "Created docs/security.md"
fi

# CONTRIBUTING doc
if [ ! -f docs/CONTRIBUTING.md ]; then
  cat > docs/CONTRIBUTING.md << 'EOF'
# Contributing to Documentation

**Last Updated:** October 23, 2025

---

## Documentation Standards

### File Naming

**Use kebab-case:**
```
✅ create-new-feature.md
❌ CREATE_NEW_FEATURE.md
❌ CreateNewFeature.md
```

---

### File Location

**Choose appropriate directory:**
- `/docs/guides/` - How-to guides
- `/docs/architecture/` - Design decisions
- `/docs/development/` - Development practices
- `/docs/features/` - Feature documentation
- `/docs/api/` - API reference
- `/docs/ops/` - Operations and deployment

---

### Document Template

```markdown
# Document Title

**Last Updated:** YYYY-MM-DD  
**Author:** Your Name  
**Status:** Draft | Review | Complete

---

## Overview

Brief description of what this document covers.

---

## Sections

### Section 1

Content...

### Section 2

Content...

---

## Related Documentation

- [Link to related doc 1](/docs/path/to/doc.md)
- [Link to related doc 2](/docs/path/to/doc.md)

---

**Last Updated:** YYYY-MM-DD
```

---

## Quality Checklist

Before submitting documentation:

- [ ] File name uses kebab-case
- [ ] Has "Last Updated" date
- [ ] All links tested and work
- [ ] Code examples tested
- [ ] Terminology consistent (check glossary)
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Added to relevant index
- [ ] Related docs cross-referenced
- [ ] No sensitive information
- [ ] Spell-checked
- [ ] Grammar-checked

---

## Review Process

1. Create PR with documentation changes
2. Request review from team
3. Address feedback
4. Merge when approved
5. Update main README if needed

---

## Maintaining Documentation

### When to Update

- Feature changes
- API changes
- Architecture changes
- Bug fixes that affect docs
- User feedback

### Quarterly Review

- Check for outdated information
- Verify all links work
- Update screenshots
- Add missing examples
- Archive obsolete docs

---

## Style Guide

### Headings

- Use Title Case for H1
- Use Sentence case for H2, H3
- Be descriptive and specific

### Code Examples

```typescript
// Always include:
// 1. Context (what this does)
// 2. Working code
// 3. Expected output (if applicable)

// Good example with context
const result = calculatePrice({
  size: 'M',
  color: 'blue',
}); // Returns: 49.99
```

### Lists

- Use bullet points for unordered lists
- Use numbered lists for sequential steps
- Be concise but clear

### Links

- Use relative links for internal docs
- Use descriptive link text (not "click here")
- Verify links work before committing

---

## Getting Help

- Check existing documentation first
- Ask in team chat
- Create discussion for clarification
- Refer to this guide

---

**Last Updated:** October 23, 2025
EOF
  log_success "Created docs/CONTRIBUTING.md"
fi

# CHANGELOG
if [ ! -f CHANGELOG.md ]; then
  cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to All Pet Plus will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Documentation audit and improvements
- Comprehensive glossary
- Micro-frontend integration patterns guide
- Scripts documentation
- Security guidelines
- Contributing guidelines

### Changed
- Reorganized archive folder by date
- Fixed broken documentation links
- Improved consistency in terminology

### Fixed
- Broken links in documentation index
- Duplicate api-keys.md file removed

---

## [0.1.0] - 2025-10-23

### Added
- Pet licensing micro-frontend
- tRPC implementation for type-safe APIs
- Hybrid microservices architecture
- Modular monolith with extractable services
- Comprehensive documentation system
- Scaffold script for automated project creation
- Docker Compose configurations
- Development scripts (setup, dev-tabs, dev-tmux)

### Infrastructure
- NX monorepo with workspace management
- Next.js 15 with App Router
- Fastify 4 backend
- PostgreSQL database with Prisma ORM
- Redis for caching and event bus
- Clerk authentication

---

## How to Update

When making changes:

1. Add entry under [Unreleased]
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Be clear and concise
4. Link to issues/PRs if applicable

Example:
```markdown
### Added
- New pet insurance micro-frontend (#123)
- Integration with veterinary API (#124)

### Fixed
- Authentication issue in dashboard (#125)
```

---

**For detailed release notes, see GitHub Releases.**
EOF
  log_success "Created CHANGELOG.md"
fi

echo ""
log_info "Creating ADR (Architecture Decision Record) template..."

if [ ! -f docs/architecture/adr/000-template.md ]; then
  cat > docs/architecture/adr/000-template.md << 'EOF'
# [Number]. [Title]

**Date:** YYYY-MM-DD  
**Status:** Proposed | Accepted | Deprecated | Superseded by [ADR-XXX]  
**Deciders:** [List of people involved]

---

## Context

What is the issue that we're seeing that is motivating this decision or change?

---

## Decision

What is the change that we're proposing and/or doing?

---

## Consequences

### Positive

- What becomes easier or better?

### Negative

- What becomes more difficult?

### Neutral

- What changes but isn't clearly positive or negative?

---

## Alternatives Considered

### Alternative 1: [Name]

**Description:** What is this alternative?

**Pros:**
- Advantage 1
- Advantage 2

**Cons:**
- Disadvantage 1
- Disadvantage 2

**Why not chosen:** Reason

---

## Related Decisions

- [ADR-XXX]: Related decision 1
- [ADR-YYY]: Related decision 2

---

## References

- [Link to discussion]
- [Link to research]
- [Link to documentation]

---

**Last Updated:** YYYY-MM-DD
EOF
  log_success "Created ADR template"
fi

# Create example ADR
if [ ! -f docs/architecture/adr/001-use-trpc-for-api.md ]; then
  cat > docs/architecture/adr/001-use-trpc-for-api.md << 'EOF'
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
EOF
  log_success "Created example ADR"
fi

echo ""
log_warning "Manual fixes still needed:"
echo ""
echo "  1. Review and organize archive folder contents"
echo "  2. Add more ADRs for past decisions"
echo "  3. Expand security documentation"
echo "  4. Add performance benchmarks"
echo "  5. Update any remaining references to old file names"
echo ""

log_success "Automated fixes complete!"
echo ""
echo "==============================================="
echo ""
echo "📝 Next steps:"
echo ""
echo "  1. Review generated files:"
echo "     - docs/security.md"
echo "     - docs/CONTRIBUTING.md"
echo "     - CHANGELOG.md"
echo "     - docs/architecture/adr/"
echo ""
echo "  2. Customize security.md for your needs"
echo ""
echo "  3. Add more ADRs for architectural decisions"
echo ""
echo "  4. Update CHANGELOG.md as you make changes"
echo ""
echo "  5. Read full audit report:"
echo "     docs/analysis/audit-issues-and-gaps.md"
echo ""
echo "==============================================="
echo ""


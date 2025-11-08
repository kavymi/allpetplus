# Cursor AI Rules - Harness Hero

**Purpose:** Organized, topic-based rules for AI assistants working on Harness Hero  
**Format:** `.mdc` files with `alwaysApply: true` frontmatter

---

## 📚 Available Rules

### 🏗️ [architecture.mdc](./architecture.mdc)
- Monorepo structure (apps/ vs services/)
- Library organization
- Technology decisions (why tRPC, why NX)
- Data flow architecture
- Deployment architecture
- Scalability patterns

### 🎯 [trpc-patterns.mdc](./trpc-patterns.mdc)
- When to use tRPC vs Fastify
- Query patterns (read operations)
- Mutation patterns (write operations)
- Creating new tRPC procedures
- Import patterns for tRPC
- Anti-patterns to avoid

### 📦 [monorepo-imports.mdc](./monorepo-imports.mdc)
- Import hierarchy (@pet/* vs @/ vs relative)
- Library organization
- Available path aliases
- Import rules and best practices
- When to create shared code
- Migration patterns

### ⚡ [code-quality.mdc](./code-quality.mdc)
- TypeScript requirements (no `any`!)
- Component requirements (loading, error, empty states)
- Error handling patterns
- Accessibility requirements
- Performance rules
- Testing requirements
- Documentation standards

### 🎨 [component-patterns.mdc](./component-patterns.mdc)
- Component template
- Import order
- Styling with Tailwind CSS v4
- State management with Zustand
- Component organization
- Animation & motion patterns
- Best practices

### 📝 [documentation.mdc](./documentation.mdc)
- Documentation structure
- When and where to document
- Documentation quality standards
- Templates
- Required reading for AI
- Keeping docs current

### 🤖 [ai-guidelines.mdc](./ai-guidelines.mdc)
- Core principles
- Before writing code checklist
- Code quality checklist
- Self-improvement process
- Pattern recognition
- Success indicators

### 🛠️ [development.mdc](./development.mdc)
- File organization
- Node version requirements
- Development commands
- Environment setup
- Code organization
- Import conventions

### 🚀 [creating-services.mdc](./creating-services.mdc) ✨ NEW
- Decision tree (micro-frontend vs route vs module)
- Creating micro-frontends (20 min)
- Creating microservices (15 min)
- Creating backend modules (10 min)
- Port conventions
- Templates to copy
- Integration patterns

---

## How Rules Work

### Format:
```markdown
---
alwaysApply: true
---

# Rule Topic

## Section

Content...
```

### Loading:
- All `.mdc` files in `.cursor/rules/` are automatically loaded
- Rules with `alwaysApply: true` are always active
- AI assistants reference these when working on code

---

## For AI Assistants

### Before Starting Work:
1. Read all rules in `.cursor/rules/`
2. Check `/docs/README.md` for documentation
3. Search codebase for similar patterns
4. Follow established conventions

### When User Requests New Service:
1. **Check:** `.cursor/rules/creating-services.mdc` for decision tree
2. **Use:** Appropriate template (pet-licensing, builder-service, or pet module)
3. **Follow:** Step-by-step guide (15-20 min process)
4. **Integrate:** Via dashboard tab or tRPC router
5. **Document:** What was created

### When Implementing Features:
1. Reference relevant rule file
2. Follow documented patterns
3. Maintain consistency
4. Update docs if needed

### Priority Order:
1. `.cursor/rules/` - Specific, actionable rules
2. `/docs/guides/` - Step-by-step how-to guides
3. `/docs/architecture/` - Architecture decisions
4. Codebase search - Existing patterns

---

## For Developers

### Adding New Rules:
1. Create new `.mdc` file in `.cursor/rules/`
2. Add frontmatter with `alwaysApply: true`
3. Write clear, actionable rules
4. Include code examples
5. Update this README

### Updating Rules:
1. Edit the relevant `.mdc` file
2. Keep examples current
3. Remove deprecated patterns
4. Add new learnings

### Rule Organization:
- **One topic per file** for clarity
- **Actionable content** - what to do, not theory
- **Code examples** - show don't tell
- **Cross-reference** related rules

---

## Quick Reference

**Need to know about...**
- Creating services? → `creating-services.mdc` ✨
- tRPC patterns? → `trpc-patterns.mdc`
- Import rules? → `monorepo-imports.mdc`
- Component structure? → `component-patterns.mdc`
- Code quality? → `code-quality.mdc`
- Architecture? → `architecture.mdc`
- Documentation? → `documentation.mdc`
- AI guidelines? → `ai-guidelines.mdc`
- General dev? → `development.mdc`

---

**Last Updated:** October 8, 2025  
**Maintained By:** Engineering Team
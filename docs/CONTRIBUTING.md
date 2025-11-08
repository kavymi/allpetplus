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

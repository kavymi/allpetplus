# AI Development Guidelines - Self-Improvement Framework

**Purpose:** Enable AI assistants to provide exceptional development support  
**Audience:** AI systems (Claude, GPT-4, etc.) working on All Pet Plus  
**Version:** 1.0

---

## 🎯 Philosophy

### The Prime Directive
**"Understand deeply, execute completely, improve continuously"**

As an AI assistant, your role is to:
1. **Amplify** developer productivity, not replace developer judgment
2. **Maintain** code quality and consistency
3. **Learn** from every interaction
4. **Adapt** to project-specific patterns
5. **Document** decisions and rationale

---

## 🧠 Cognitive Framework

### 1. **Analysis Phase (Before Acting)**

#### Questions to Ask Yourself:
```markdown
Context Understanding:
- [ ] What is the user really asking for?
- [ ] What's the broader context of this request?
- [ ] Are there similar implementations in the codebase?
- [ ] What are the acceptance criteria?

Technical Analysis:
- [ ] What patterns exist for this type of task?
- [ ] What dependencies or side effects exist?
- [ ] What are the performance implications?
- [ ] What could go wrong?

Documentation Check:
- [ ] Is there documentation for this feature area?
- [ ] Are there examples I can reference?
- [ ] What conventions are established?
- [ ] Are there known gotchas?
```

#### Analysis Tools:
```typescript
// 1. Broad exploration
codebase_search("How does authentication work?", [])

// 2. Find similar patterns
grep("useAuth", "apps/web/src")

// 3. Read relevant files
read_file("apps/web/src/lib/trpc.ts")

// 4. Check documentation
read_file("docs/guides/trpc-usage-examples.md")
```

### 2. **Planning Phase (Before Implementing)**

#### Create Mental Model:
```markdown
1. **What needs to change?**
   - Which files?
   - What functions/components?
   - What tests?

2. **What's the impact?**
   - Breaking changes?
   - Performance implications?
   - Dependencies affected?

3. **What's the sequence?**
   - Backend changes first?
   - Types before implementation?
   - Tests after or during?

4. **What documentation updates?**
   - New guides needed?
   - Existing docs to update?
   - Examples to add?
```

### 3. **Execution Phase (While Implementing)**

#### Quality Gates:
```typescript
// ✅ BEFORE writing code, verify:
1. Pattern exists in codebase?
   → Search for similar implementations
   
2. Types defined properly?
   → Explicit types, no `any`
   
3. Error handling included?
   → Try-catch, error states, user feedback
   
4. Loading states present?
   → isLoading checks, skeleton states
   
5. Accessibility considered?
   → ARIA labels, keyboard navigation, focus management
```

#### Implementation Standards:
```typescript
// ✅ Every component should have:

// 1. Explicit types
interface ComponentProps {
  data: DesignData;
  onUpdate: (id: string) => Promise<void>;
}

// 2. Loading state
if (isLoading) return <LoadingState />;

// 3. Error state
if (error) return <ErrorState message={error.message} />;

// 4. Empty state
if (!data || data.length === 0) return <EmptyState />;

// 5. Success state
return <div>{/* Actual content */}</div>;
```

### 4. **Verification Phase (After Implementing)**

#### Self-Review Checklist:
```markdown
Code Quality:
- [ ] TypeScript strict mode passes
- [ ] No `any` types used
- [ ] Explicit function signatures
- [ ] Proper error handling

User Experience:
- [ ] Loading states present
- [ ] Error states present
- [ ] Empty states present
- [ ] Accessible markup

Performance:
- [ ] No unnecessary re-renders
- [ ] Proper memoization
- [ ] Efficient queries
- [ ] Code splitting considered

Testing:
- [ ] Unit tests for logic
- [ ] Integration tests for features
- [ ] Edge cases covered
- [ ] Error cases tested

Documentation:
- [ ] Code comments for complex logic
- [ ] Updated relevant docs
- [ ] Examples provided if needed
- [ ] Breaking changes documented
```

---

## 📚 Learning & Adaptation

### Pattern Recognition

#### What to Track:
```markdown
1. **User Acceptance Patterns**
   ✅ Changes accepted without modification
      → Pattern is good, use it again
   
   ⚠️ Changes with minor tweaks
      → Pattern mostly good, refine it
   
   ❌ Changes rewritten completely
      → Pattern wrong, learn the correct one

2. **Common Corrections**
   - Type definitions → Be more explicit
   - Error handling → Always include it
   - Import paths → Use correct aliases
   - Component structure → Follow established patterns

3. **Successful Implementations**
   - tRPC migration → Analyzed first, executed completely
   - Documentation organization → Comprehensive planning
   - Type safety → Full end-to-end coverage
```

#### Learning Loop:
```mermaid
User Request
    ↓
Analyze Codebase
    ↓
Implement Solution
    ↓
User Feedback
    ↓
Track Pattern (Success/Failure)
    ↓
Update Internal Model
    ↓
Apply in Future Requests
```

### Adaptation Strategy:

#### Short-Term Learning (Per Session):
```markdown
1. **Session Start:**
   - Review recent changes
   - Check what was accepted/corrected
   - Identify patterns

2. **During Session:**
   - Apply learned patterns
   - Verify against established conventions
   - Adjust based on feedback

3. **Session End:**
   - Summarize what was learned
   - Document new patterns
   - Note areas for improvement
```

#### Long-Term Learning (Cross-Session):
```markdown
1. **Reference Documentation**
   - Always check /docs/ first
   - Follow documented patterns
   - Update docs when patterns evolve

2. **Code Archaeology**
   - Search for recent similar implementations
   - Understand evolution of patterns
   - Identify deprecated approaches

3. **Continuous Refinement**
   - Improve type definitions
   - Enhance error messages
   - Better component structure
   - More efficient implementations
```

---

## 🎯 Decision-Making Framework

### When Faced with Ambiguity:

```markdown
1. **Search the codebase**
   - Is there a similar pattern?
   - How was it solved before?
   - What did the user prefer?

2. **Check documentation**
   - Is there a guide for this?
   - Are there examples?
   - What's the recommended approach?

3. **Make educated inference**
   - What aligns with project values?
   - What's the most maintainable?
   - What provides best UX?

4. **Propose with rationale**
   - Explain the decision
   - Show alternatives considered
   - Allow for course correction
```

### Technology Choices:

```markdown
When to use tRPC:
✅ Frontend needs backend data
✅ User operations (CRUD)
✅ Authenticated endpoints
✅ Type safety is critical

When to use Fastify:
✅ External webhooks
✅ Background workers
✅ Public APIs
✅ Third-party integrations

When to create new library:
✅ Code shared across multiple apps
✅ Domain-specific logic (builder, commerce)
✅ Reusable utilities
✅ Type definitions shared with backend

When to keep in app:
✅ App-specific components
✅ Page-level logic
✅ UI-only utilities
✅ Local state management
```

---

## 💡 Advanced Techniques

### Parallel Execution

```typescript
// ✅ DO: Maximize parallel operations
const results = await Promise.all([
  read_file('file1.ts'),
  read_file('file2.ts'),
  read_file('file3.ts'),
  grep('pattern', 'src/'),
]);

// ❌ DON'T: Sequential when unnecessary
const file1 = await read_file('file1.ts');
const file2 = await read_file('file2.ts');
const file3 = await read_file('file3.ts');
```

### Efficient Information Gathering

```typescript
// ✅ DO: Batch related searches
Promise.all([
  codebase_search("How is authentication implemented?"),
  codebase_search("Where are user permissions checked?"),
  grep("Clerk", "apps/web/src"),
]);

// ❌ DON'T: One at a time when independent
codebase_search("How is authentication implemented?");
// wait for result...
codebase_search("Where are user permissions checked?");
// wait for result...
```

### Smart File Reading

```typescript
// ✅ DO: Read multiple related files at once
Promise.all([
  read_file('libs/api/src/trpc.ts'),
  read_file('libs/api/src/context.ts'),
  read_file('libs/api/src/root.ts'),
]);

// ✅ DO: Use line ranges for large files
read_file('large-file.ts', { offset: 100, limit: 50 });

// ❌ DON'T: Read entire 1000+ line files unnecessarily
read_file('huge-file.ts'); // Consider grep or codebase_search first
```

---

## 🔬 Debugging Methodology

### Systematic Approach:

```markdown
1. **Reproduce the Issue**
   - Understand the error message
   - Identify the failing code
   - Check related code

2. **Gather Context**
   - Read the file with the error
   - Check imports and dependencies
   - Review recent changes

3. **Hypothesize Root Cause**
   - Type mismatch?
   - Missing dependency?
   - Configuration issue?
   - Logic error?

4. **Test Hypothesis**
   - Check TypeScript types
   - Verify imports resolve
   - Check configuration
   - Review logic flow

5. **Implement Fix**
   - Make minimal change
   - Verify fix works
   - Check for side effects
   - Update tests if needed

6. **Prevent Recurrence**
   - Add type safety
   - Improve error messages
   - Document gotcha
   - Update patterns
```

---

## 📊 Quality Metrics

### Track Success:

```markdown
Measure these metrics:
1. **First-Time Success Rate**
   - How often are suggestions accepted as-is?
   - Target: >80%

2. **Iteration Count**
   - How many revisions needed?
   - Target: <3 per feature

3. **Type Safety Coverage**
   - Percentage of code with explicit types
   - Target: 100%

4. **Documentation Accuracy**
   - Are docs up-to-date and helpful?
   - Target: 100% accurate

5. **Pattern Consistency**
   - Following established conventions?
   - Target: 100% consistent
```

### Continuous Improvement:

```markdown
Weekly Review:
- What patterns worked well?
- What needed correction?
- What can be improved?
- What new patterns emerged?

Monthly Audit:
- Are docs still accurate?
- Are patterns still optimal?
- What deprecated patterns to remove?
- What new best practices to add?
```

---

## 🎓 Project-Specific Learnings

### What Works Well:

1. **tRPC for API layer** ✅
   - End-to-end type safety
   - Zero boilerplate
   - Great DX

2. **Comprehensive analysis first** ✅
   - Understand before implementing
   - Create plan documents
   - Get buy-in on approach

3. **Incremental migration** ✅
   - POC first
   - Migrate gradually
   - Keep what works

4. **Documentation-driven** ✅
   - Write guides during implementation
   - Include examples
   - Maintain accuracy

### What to Avoid:

1. **Premature optimization** ❌
   - Don't over-engineer
   - Solve current problems
   - YAGNI principle

2. **Incomplete implementations** ❌
   - Finish what you start
   - Include all states (loading, error, empty)
   - Add proper error handling

3. **Inconsistent patterns** ❌
   - Check existing code
   - Follow conventions
   - Don't introduce new patterns without reason

4. **Stale documentation** ❌
   - Update docs with code changes
   - Remove obsolete content
   - Keep examples working

---

## 🚀 Excellence Standards

### Code Excellence:
```typescript
// This is the standard for all code:

// ✅ Explicit types
interface DesignCardProps {
  design: SavedDesign;
  onDelete: (id: string) => Promise<void>;
}

// ✅ Complete error handling
export function DesignCard({ design, onDelete }: DesignCardProps): React.ReactElement {
  const [state, setState] = useState<RequestState<void>>({ status: 'idle' });

  const handleDelete = async () => {
    try {
      setState({ status: 'loading' });
      await onDelete(design.id);
      setState({ status: 'success', data: undefined });
    } catch (error) {
      setState({ 
        status: 'error', 
        error: error instanceof Error ? error : new Error('Unknown error') 
      });
    }
  };

  // ✅ All states handled
  if (state.status === 'loading') return <LoadingState />;
  if (state.status === 'error') return <ErrorState message={state.error.message} />;

  // ✅ Accessible markup
  return (
    <div role="article" aria-label={`Design: ${design.name}`}>
      <Button 
        onClick={handleDelete}
        aria-label={`Delete design ${design.name}`}
      >
        Delete
      </Button>
    </div>
  );
}
```

### Documentation Excellence:
```markdown
# Feature Name

**Purpose:** One-line description  
**Status:** In Progress / Complete  
**Related:** Links to related docs

## Quick Start

[Concise, actionable steps]

## Detailed Guide

[Comprehensive explanation with examples]

## Troubleshooting

[Common issues and solutions]

## Examples

[Working code examples]
```

---

## 🎁 Best Practices Summary

### For Every Task:

1. **📖 Read First**
   - Search codebase for patterns
   - Check documentation
   - Understand context

2. **🎯 Plan Thoroughly**
   - Break into steps
   - Identify dependencies
   - Consider edge cases

3. **💻 Implement Completely**
   - Full type safety
   - Error handling
   - Loading states
   - Accessibility

4. **✅ Verify Quality**
   - Types compile
   - Linter passes
   - Logic correct
   - UX smooth

5. **📝 Document Well**
   - Code comments
   - Updated docs
   - Examples included
   - Gotchas noted

6. **🔄 Learn Always**
   - Track feedback
   - Note corrections
   - Improve patterns
   - Update guidelines

---

## 🎯 Success Indicators

You're doing well when:
- ✅ User accepts changes with minimal modifications
- ✅ Code follows project conventions automatically
- ✅ Type safety is perfect (no `any`)
- ✅ Documentation is accurate and helpful
- ✅ Implementations are complete, not partial
- ✅ You reference existing patterns before creating new ones

You need improvement when:
- ❌ User rewrites your suggestions
- ❌ Type errors or `any` types appear
- ❌ Missing error/loading states
- ❌ Pattern inconsistent with codebase
- ❌ Documentation out of sync
- ❌ Incomplete implementations

---

## 🌟 Excellence Checklist

### Before Submitting ANY Code:

```markdown
Type Safety:
- [ ] No `any` types
- [ ] Explicit function signatures
- [ ] Proper interface definitions
- [ ] Generic types where appropriate

Completeness:
- [ ] Loading states included
- [ ] Error states included
- [ ] Empty states included
- [ ] Success states clear

Error Handling:
- [ ] Try-catch for async
- [ ] User-friendly messages
- [ ] Proper error types
- [ ] Graceful degradation

Performance:
- [ ] No unnecessary re-renders
- [ ] Proper memoization
- [ ] Efficient queries
- [ ] Code splitting considered

Accessibility:
- [ ] Semantic HTML
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management

Testing:
- [ ] Testable code structure
- [ ] Edge cases covered
- [ ] Type tests implied
- [ ] Integration points clear

Documentation:
- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] Examples provided
- [ ] Breaking changes noted
```

---

## 📈 Continuous Improvement

### Track Your Performance:

```markdown
Daily:
- What patterns did I use successfully?
- What corrections did the user make?
- What can I learn from those corrections?

Weekly:
- Am I following project conventions consistently?
- Are my suggestions being accepted more often?
- What areas need more study?

Monthly:
- Have I internalized the codebase patterns?
- Am I providing increasing value?
- What new skills or patterns have I learned?
```

### Improvement Actions:

```markdown
When you notice a pattern of corrections:
1. **Identify** the pattern
2. **Understand** why it's preferred
3. **Document** it (update this file!)
4. **Apply** it going forward
5. **Verify** improvement in next uses

Example:
- User always adds error states → Always include them
- User prefers tRPC over fetch → Default to tRPC
- User fixes type definitions → Be more explicit with types
```

---

## 🎯 Final Guidelines

### Prime Directives:

1. **Never use `any` type** - Find the proper type always
2. **Never skip error handling** - Every async operation needs try-catch
3. **Never ignore loading states** - Users need feedback
4. **Never break type safety** - Maintain 100% type coverage
5. **Never leave incomplete** - Finish what you start
6. **Never stop learning** - Improve with every interaction

### Success Formula:

```
Exceptional AI Development =
  Deep Understanding +
  Complete Execution +
  Continuous Learning +
  Quality Focus +
  User Empathy
```

---

## 📚 Required Reading

Before working on All Pet Plus:
1. `/CLAUDE.md` - This file
2. `/.cursorrules` - Project conventions
3. `/docs/README.md` - Documentation index
4. `/docs/architecture/` - System architecture
5. `/docs/development/code-patterns.md` - Code patterns

---

**Remember:** You're a force multiplier for developers. Make them more productive, help them write better code, and learn from every interaction to become an even better assistant.

🎯 **Goal:** 10x developer productivity through exceptional AI assistance

---

**For the team:** This document evolves. Update it as patterns emerge and improve.

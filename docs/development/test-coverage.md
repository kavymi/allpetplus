# Test Coverage Standards & Targets

**Last Updated:** October 23, 2025  
**Status:** Production Ready  
**Tool:** Jest coverage reports

---

## Coverage Targets

### Overall Project Targets

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| **Statements** | 70% | 80% | 90%+ |
| **Branches** | 65% | 75% | 85%+ |
| **Functions** | 70% | 80% | 90%+ |
| **Lines** | 70% | 80% | 90%+ |

**Current Status:** 📊 To be measured

---

### Per-Project Targets

| Project | Statements | Branches | Functions | Lines | Priority |
|---------|------------|----------|-----------|-------|----------|
| **libs/domain** | 90% | 85% | 90% | 90% | 🔴 Critical |
| **libs/api** | 85% | 80% | 85% | 85% | 🔴 Critical |
| **libs/shared** | 80% | 75% | 80% | 80% | 🟡 High |
| **libs/messaging** | 75% | 70% | 75% | 75% | 🟢 Medium |
| **apps/web** | 70% | 65% | 70% | 70% | 🟢 Medium |
| **services/backend** | 80% | 75% | 80% | 80% | 🔴 Critical |

**Rationale:**
- **libs/domain** - Business logic, highest impact → Highest coverage
- **libs/api** - API layer, critical for reliability → High coverage
- **apps/web** - UI components, harder to test → Moderate coverage
- **services/backend** - Backend logic, high impact → High coverage

---

## What to Test

### ✅ Must Test (High Priority)

1. **Business Logic** - All functions in `libs/domain/`
   ```typescript
   // libs/domain/src/lib/builder/pricing.ts
   describe('calculatePrice', () => {
     it('should calculate base price correctly', () => {
       expect(calculatePrice({ size: 'M', color: 'blue', hardware: 'silver' }))
         .toBe(49.99);
     });
     
     it('should add premium for gold hardware', () => {
       expect(calculatePrice({ size: 'M', color: 'blue', hardware: 'gold' }))
         .toBe(64.99);
     });
   });
   ```

2. **API Endpoints** - All tRPC procedures
   ```typescript
   // libs/api/src/routers/designs.spec.ts
   describe('designsRouter', () => {
     it('should list designs for authenticated user', async () => {
       const result = await caller.designs.list({ limit: 10 });
       expect(result.designs).toHaveLength(10);
     });
   });
   ```

3. **Data Validation** - All Zod schemas
   ```typescript
   // libs/domain/src/lib/builder/validation.spec.ts
   describe('builderConfigSchema', () => {
     it('should accept valid config', () => {
       expect(() => builderConfigSchema.parse({
         size: 'M',
         color: 'blue',
         hardware: 'gold',
       })).not.toThrow();
     });
     
     it('should reject invalid size', () => {
       expect(() => builderConfigSchema.parse({
         size: 'INVALID',
       })).toThrow();
     });
   });
   ```

4. **Critical User Flows** - Happy path + error cases
   ```typescript
   // apps/web/src/app/(builder)/customize/page.spec.tsx
   describe('Builder Flow', () => {
     it('should allow user to customize harness', async () => {
       render(<BuilderPage />);
       
       // Select size
       await userEvent.click(screen.getByText('Medium'));
       
       // Select color
       await userEvent.click(screen.getByLabelText('Blue'));
       
       // Verify preview updates
       expect(screen.getByTestId('preview')).toHaveAttribute('data-color', 'blue');
     });
   });
   ```

5. **Utility Functions** - All helpers in `libs/shared/`
   ```typescript
   // libs/shared/src/lib/utils.spec.ts
   describe('formatPrice', () => {
     it('should format USD correctly', () => {
       expect(formatPrice(49.99)).toBe('$49.99');
     });
     
     it('should handle zero', () => {
       expect(formatPrice(0)).toBe('$0.00');
     });
   });
   ```

---

### 🟡 Should Test (Medium Priority)

1. **React Components** - Stateful components
2. **Hooks** - Custom React hooks
3. **Error Handling** - Error boundary behavior
4. **Integration Tests** - Multiple components together
5. **API Integration** - Frontend ↔ Backend communication

---

### 🟢 Nice to Test (Low Priority)

1. **Presentational Components** - Simple display components
2. **Constants** - Static values
3. **Type Definitions** - TypeScript handles this
4. **Styling** - Visual regression testing (optional)

---

## Running Coverage Reports

### Generate Coverage

```bash
# All projects
npm run test -- --coverage

# Specific project
nx test domain --coverage

# With HTML report
nx test domain --coverage --coverageReporters=html

# Open HTML report
open coverage/libs/domain/index.html
```

---

### Coverage Output

```bash
npm run test -- --coverage

# Output:
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   82.5  |   75.3   |   85.1  |   82.8  |
 libs/domain           |   91.2  |   87.5   |   92.0  |   91.5  |
  builder/             |   95.0  |   92.0   |   96.0  |   95.2  |
   pricing.ts          |   100   |   100    |   100   |   100   |
   types.ts            |   80.0  |   75.0   |   85.0  |   80.5  |
  pet/                 |   88.0  |   82.0   |   89.0  |   88.5  |
 libs/api              |   85.0  |   78.0   |   87.0  |   85.5  |
 apps/web              |   72.0  |   65.0   |   74.0  |   72.5  |
-----------------------|---------|----------|---------|---------|
```

---

## Jest Configuration

### Coverage Settings

```javascript
// jest.config.ts
export default {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    // Higher threshold for critical code
    './libs/domain/**/*.ts': {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    './libs/api/**/*.ts': {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
  ],
};
```

---

### What NOT to Cover

**Excluded from coverage:**
```javascript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  
  // Exclude:
  '!**/*.d.ts',           // Type definitions
  '!**/*.stories.tsx',    // Storybook stories
  '!**/*.spec.ts',        // Test files themselves
  '!**/*.test.ts',        // Test files
  '!**/node_modules/**',  // Dependencies
  '!**/.next/**',         // Build output
  '!**/dist/**',          // Build output
  '!**/coverage/**',      // Coverage reports
],
```

---

## Testing Pyramid

### Distribution of Tests

```
         /\
        /  \  E2E Tests
       /    \ (5-10%)
      /------\
     /        \ Integration Tests  
    /          \ (20-30%)
   /------------\
  /              \ Unit Tests
 /                \ (60-70%)
/------------------\
```

**Target Distribution:**
- **Unit Tests:** 60-70% of total tests
- **Integration Tests:** 20-30% of total tests
- **E2E Tests:** 5-10% of total tests

---

### Current Test Distribution

| Type | Count | Percentage | Target | Status |
|------|-------|------------|--------|--------|
| **Unit** | 📊 TBD | 📊 TBD | 60-70% | 🔍 Measure |
| **Integration** | 📊 TBD | 📊 TBD | 20-30% | 🔍 Measure |
| **E2E** | 📊 TBD | 📊 TBD | 5-10% | 🔍 Measure |
| **Total** | 📊 TBD | 100% | - | 🔍 Measure |

---

## Code Coverage Best Practices

### 1. Write Testable Code

```typescript
// ❌ Hard to test (many responsibilities)
function handleSubmit(data: FormData) {
  validateData(data);
  saveToDatabase(data);
  sendEmail(data.email);
  updateUI();
}

// ✅ Easy to test (single responsibility)
function validateData(data: FormData) {
  return schema.parse(data);
}

function saveToDatabase(data: ValidData) {
  return db.create(data);
}

function sendEmail(email: string) {
  return emailService.send(email);
}
```

---

### 2. Test Edge Cases

```typescript
describe('calculatePrice', () => {
  // Happy path
  it('should calculate standard price', () => {
    expect(calculatePrice({ size: 'M' })).toBe(49.99);
  });
  
  // Edge cases
  it('should handle smallest size', () => {
    expect(calculatePrice({ size: 'XS' })).toBe(39.99);
  });
  
  it('should handle largest size', () => {
    expect(calculatePrice({ size: 'XXL' })).toBe(59.99);
  });
  
  // Error cases
  it('should throw on invalid size', () => {
    expect(() => calculatePrice({ size: 'INVALID' })).toThrow();
  });
  
  // Boundary conditions
  it('should handle zero weight', () => {
    expect(calculatePrice({ size: 'M', weight: 0 })).toBe(49.99);
  });
});
```

---

### 3. Use Test Coverage to Find Gaps

```bash
# Generate coverage
npm run test -- --coverage

# Look for:
# - Red lines (uncovered)
# - Yellow lines (partially covered branches)
# - Missing edge cases

# Focus on high-value, high-risk code first
```

---

### 4. Don't Game the Metrics

```typescript
// ❌ Bad: Tests that don't test anything
it('should exist', () => {
  expect(myFunction).toBeDefined();
});

// ❌ Bad: Tests that just call code
it('should call function', () => {
  myFunction();  // No assertions!
});

// ✅ Good: Tests that verify behavior
it('should return correct value for input', () => {
  const result = myFunction(input);
  expect(result).toEqual(expectedOutput);
});
```

---

## Coverage by File Type

### TypeScript Files

```javascript
// jest.config.ts
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',  // Exclude type definitions
],
```

**Target:** 80% overall

---

### React Components

```javascript
collectCoverageFrom: [
  'src/components/**/*.tsx',
  '!src/components/**/*.stories.tsx',  // Exclude Storybook
],
```

**Target:** 70% (UI harder to test)

**Focus on:**
- User interactions
- State changes
- Error states
- Loading states

---

### Business Logic

```javascript
collectCoverageFrom: [
  'libs/domain/src/**/*.ts',
],
```

**Target:** 90% (most critical code)

**Must test:**
- All exported functions
- All validation schemas
- All calculations
- All transformations

---

## Increasing Coverage

### Finding Untested Code

```bash
# Generate coverage with details
npm run test -- --coverage --verbose

# Look at HTML report
open coverage/index.html

# Find uncovered lines (highlighted in red)
```

---

### Adding Tests for Uncovered Code

**Process:**
1. Run coverage report
2. Find red/yellow lines
3. Understand what code does
4. Write test for that branch/path
5. Verify coverage increases
6. Repeat

**Example:**
```typescript
// Original function (50% coverage)
function processOrder(order: Order) {
  if (order.status === 'paid') {
    return fulfillOrder(order);  // Tested ✓
  } else {
    return sendReminder(order);  // Not tested ✗
  }
}

// Add test for uncovered branch
it('should send reminder for unpaid orders', () => {
  const order = { status: 'pending' };
  const result = processOrder(order);
  expect(result).toEqual({ reminderSent: true });
});

// Coverage now: 100%
```

---

## Coverage Enforcement

### Git Hooks (Pre-commit)

```javascript
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "npm run test -- --findRelatedTests --coverage --bail"
    ]
  }
}
```

**Prevents commits if:**
- Tests fail
- Coverage drops below threshold

---

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 24
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests with coverage
        run: npm run test -- --coverage
        
      - name: Check coverage thresholds
        run: |
          # Fails if below thresholds
          npm run test -- --coverage --ci
          
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

---

### Codecov Integration

**badge in README.md:**
```markdown
[![codecov](https://codecov.io/gh/yourorg/all-pet-plus/branch/main/graph/badge.svg)](https://codecov.io/gh/yourorg/all-pet-plus)
```

**Pull Request Comments:**
```
Coverage: 82.5% (+2.3%) ✓
Files changed: 3
Coverage increased in 2 files:
  + libs/domain/builder/pricing.ts: 95% (+5%)
  + libs/api/routers/designs.ts: 88% (+3%)
```

---

## Testing Strategy by Layer

### Domain Layer (libs/domain/)

**What to test:**
- All business logic functions
- All validation schemas
- All calculations
- All transformations

**Example:**
```typescript
// libs/domain/src/lib/builder/pricing.spec.ts
describe('Builder Pricing', () => {
  describe('calculatePrice', () => {
    it('should calculate base price', () => {
      const config = { size: 'M', color: 'blue', hardware: 'silver' };
      expect(calculatePrice(config)).toBe(49.99);
    });
    
    it('should add size premium for XXL', () => {
      const config = { size: 'XXL', color: 'blue', hardware: 'silver' };
      expect(calculatePrice(config)).toBe(59.99);
    });
    
    it('should add hardware premium', () => {
      const config = { size: 'M', color: 'blue', hardware: 'gold' };
      expect(calculatePrice(config)).toBe(64.99);
    });
    
    it('should combine premiums', () => {
      const config = { size: 'XXL', color: 'blue', hardware: 'gold', customText: 'Max' };
      expect(calculatePrice(config)).toBe(79.99);
    });
  });
  
  describe('builderConfigSchema', () => {
    it('should validate correct config', () => {
      const result = builderConfigSchema.safeParse({
        size: 'M',
        color: 'blue',
        hardware: 'gold',
      });
      expect(result.success).toBe(true);
    });
    
    it('should reject invalid size', () => {
      const result = builderConfigSchema.safeParse({
        size: 'JUMBO',
        color: 'blue',
        hardware: 'gold',
      });
      expect(result.success).toBe(false);
    });
  });
});
```

**Coverage Target:** 90%

---

### API Layer (libs/api/)

**What to test:**
- All tRPC procedures
- Input validation
- Authentication checks
- Error handling

**Example:**
```typescript
// libs/api/src/routers/designs.spec.ts
import { createInnerTRPCContext } from '../context';
import { appRouter } from '../root';

describe('Designs Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  
  beforeEach(() => {
    const ctx = createInnerTRPCContext({
      userId: 'user_123',
      db: mockDb,
    });
    caller = appRouter.createCaller(ctx);
  });
  
  describe('list', () => {
    it('should return user designs only', async () => {
      const result = await caller.designs.list({ limit: 10 });
      
      expect(result.designs).toHaveLength(10);
      expect(result.designs.every(d => d.userId === 'user_123')).toBe(true);
    });
    
    it('should filter by status', async () => {
      const result = await caller.designs.list({ status: 'ACTIVE' });
      
      expect(result.designs.every(d => d.status === 'ACTIVE')).toBe(true);
    });
    
    it('should paginate correctly', async () => {
      const page1 = await caller.designs.list({ limit: 5 });
      const page2 = await caller.designs.list({
        limit: 5,
        cursor: page1.pageInfo.endCursor!,
      });
      
      expect(page1.designs).toHaveLength(5);
      expect(page2.designs).toHaveLength(5);
      expect(page1.designs[0].id).not.toBe(page2.designs[0].id);
    });
  });
  
  describe('create', () => {
    it('should create design for authenticated user', async () => {
      const result = await caller.designs.create({
        name: 'Test Design',
        configJson: { size: 'M' },
      });
      
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Design');
    });
    
    it('should throw on invalid input', async () => {
      await expect(
        caller.designs.create({ name: '', configJson: {} })
      ).rejects.toThrow('Name is required');
    });
  });
});
```

**Coverage Target:** 85%

---

### Frontend Components (apps/web/)

**What to test:**
- User interactions
- State management
- Error handling
- Loading states

**Example:**
```typescript
// apps/web/src/components/builder/options-pane.spec.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { OptionsPane } from './options-pane';

describe('OptionsPane', () => {
  it('should render all size options', () => {
    render(<OptionsPane />);
    
    expect(screen.getByText('XS')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });
  
  it('should update selection on click', async () => {
    const onUpdate = jest.fn();
    render(<OptionsPane onUpdate={onUpdate} />);
    
    await userEvent.click(screen.getByText('M'));
    
    expect(onUpdate).toHaveBeenCalledWith({ size: 'M' });
  });
  
  it('should show loading state', () => {
    render(<OptionsPane isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('should show error state', () => {
    render(<OptionsPane error="Failed to load" />);
    
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
```

**Coverage Target:** 70%

---

### Backend Services

**What to test:**
- Route handlers
- Service layer logic
- Error handling
- Validation

**Example:**
```typescript
// services/backend/src/modules/builder/service.spec.ts
import { BuilderService } from './service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('BuilderService', () => {
  let service: BuilderService;
  let mockDb: ReturnType<typeof mockDeep<PrismaClient>>;
  
  beforeEach(() => {
    mockDb = mockDeep<PrismaClient>();
    service = new BuilderService(mockDb);
  });
  
  describe('listDesigns', () => {
    it('should return user designs', async () => {
      mockDb.savedDesign.findMany.mockResolvedValue([
        { id: '1', name: 'Design 1', userId: 'user_123' },
      ]);
      
      const result = await service.listDesigns('user_123');
      
      expect(result).toHaveLength(1);
      expect(mockDb.savedDesign.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_123' },
      });
    });
  });
});
```

**Coverage Target:** 80%

---

## Coverage Reporting

### HTML Reports

**Generate and view:**
```bash
npm run test -- --coverage --coverageReporters=html
open coverage/index.html
```

**Features:**
- File-by-file coverage
- Line-by-line highlighting
- Branch coverage visualization
- Uncovered line numbers

---

### Terminal Reports

```bash
npm run test -- --coverage --coverageReporters=text-summary

# Output:
=============================== Coverage summary ===============================
Statements   : 82.5% ( 1650/2000 )
Branches     : 75.3% ( 753/1000 )
Functions    : 85.1% ( 340/400 )
Lines        : 82.8% ( 1656/2000 )
================================================================================
```

---

### CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Test with coverage
  run: npm run test -- --coverage --ci

- name: Upload to Codecov
  uses: codecov/codecov-action@v3

- name: Comment on PR
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    fail_ci_if_error: true
    verbose: true
```

---

## Improving Low Coverage

### Process

1. **Identify low-coverage files**
   ```bash
   npm run test -- --coverage | grep "%" | sort -k2 -n
   ```

2. **Prioritize by risk**
   - High risk (business logic) → Test first
   - Low risk (UI components) → Test later

3. **Write tests incrementally**
   - Don't try to reach 100% immediately
   - Add 10-20% coverage per sprint
   - Focus on critical paths

4. **Track progress**
   - Weekly coverage reports
   - Celebrate improvements
   - Set sprint goals

---

## Exceptions to Coverage Rules

### When 100% Coverage is NOT Worth It

1. **Trivial getters/setters**
   ```typescript
   get name() { return this._name; }  // Don't need to test
   ```

2. **Type definitions**
   ```typescript
   interface User { id: string; }  // TypeScript tests this
   ```

3. **External library wrappers**
   ```typescript
   export { Button } from 'external-ui-lib';  // Library already tested
   ```

4. **Unreachable defensive code**
   ```typescript
   if (typeof window === 'undefined') {
     // Only for SSR, hard to test both paths
   }
   ```

---

## Coverage Goals by Quarter

### Q4 2025

| Project | Current | Q4 Goal | Tasks |
|---------|---------|---------|-------|
| **libs/domain** | 📊 TBD | 85% | Add validation tests |
| **libs/api** | 📊 TBD | 80% | Add router tests |
| **apps/web** | 📊 TBD | 65% | Add component tests |
| **services/backend** | 📊 TBD | 75% | Add service tests |

---

### Q1 2026

| Project | Q4 Actual | Q1 Goal | Tasks |
|---------|-----------|---------|-------|
| **libs/domain** | 85% (goal) | 90% | Add edge case tests |
| **libs/api** | 80% (goal) | 85% | Add error handling tests |
| **apps/web** | 65% (goal) | 70% | Add integration tests |
| **services/backend** | 75% (goal) | 80% | Add module tests |

---

## Monitoring Coverage

### Weekly Reports

```bash
# Generate weekly report
npm run test -- --coverage > coverage-$(date +%Y%m%d).txt

# Compare to last week
diff coverage-20251016.txt coverage-20251023.txt
```

---

### Coverage Badges

**Add to README.md:**
```markdown
[![Coverage](https://img.shields.io/codecov/c/github/yourorg/all-pet-plus)](https://codecov.io/gh/yourorg/all-pet-plus)
```

---

### Dashboard

**Track over time:**
- Use Codecov dashboard
- Graph coverage trends
- See file-level changes
- Identify coverage drops

---

## Related Documentation

- [Testing Guide](/docs/development/testing-guide.md) - How to write tests
- [Playwright Guide](/docs/development/playwright-guide.md) - E2E testing
- [Performance Benchmarks](/docs/development/performance-benchmarks.md) - Performance targets

---

## Quick Reference

### Generate Coverage

```bash
# All projects
npm run test -- --coverage

# Single project
nx test domain --coverage

# Watch mode with coverage
nx test domain --coverage --watch

# HTML report
nx test domain --coverage --coverageReporters=html
open coverage/libs/domain/index.html
```

### Check Thresholds

```bash
# Will fail if below thresholds
npm run test -- --coverage --ci
```

### Coverage Configuration

```javascript
// jest.config.ts
coverageThresholds: {
  global: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
}
```

---

**Last Updated:** October 23, 2025  
**Next Review:** End of Q4 2025  
**Status:** Framework Complete, Measurements Needed


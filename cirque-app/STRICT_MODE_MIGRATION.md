# TypeScript Strict Mode Migration

## Overview

We're incrementally migrating to TypeScript strict mode using **Betterer**, a tool that creates a snapshot of current errors and prevents new ones from being introduced.

## Current Status

- ✅ Betterer configured
- ✅ Strict tsconfig created (`tsconfig.strict.json`)
- ⏳ Baseline will be created on first run
- ⏳ Incremental fixes in progress

## What is Betterer?

Betterer is a tool that:
1. Takes a snapshot of your current TypeScript errors with strict mode enabled
2. Fails CI builds if new strict mode errors are introduced
3. Automatically updates the snapshot as you fix errors
4. Prevents regressions

This allows us to migrate to strict mode gradually without blocking feature development.

## How to Use

### Running Betterer

```bash
# Check for regressions (run this before commits)
npm run better

# Update the baseline after fixing errors
npm run better:update

# Run in CI mode (fails if there are regressions)
npm run better:ci

# Check strict mode errors manually
npm run check:strict
```

### Workflow

1. **Before making changes**: Run `npm run better` to ensure no regressions
2. **While developing**: Write code as normal
3. **Before committing**: Run `npm run better`
   - If it passes: ✅ No new strict mode violations
   - If it fails: ❌ You introduced new strict mode errors - fix them!
4. **After fixing errors**: Run `npm run better:update` to update the baseline

### Fixing Strict Mode Errors

When you have time to improve code quality:

1. Run `npm run check:strict` to see all strict mode errors
2. Pick a file or module to fix
3. Fix the TypeScript errors in that file
4. Run `npm run better:update` to update the baseline
5. Commit your improvements

## Common Strict Mode Issues & Fixes

### 1. Implicit Any

**Error:**
```typescript
function process(data) { // ❌ Parameter 'data' implicitly has an 'any' type
  return data.value;
}
```

**Fix:**
```typescript
function process(data: { value: string }) { // ✅ Explicit type
  return data.value;
}
```

### 2. Strict Null Checks

**Error:**
```typescript
const user = users.find(u => u.id === id); // ❌ 'user' is possibly 'undefined'
return user.name;
```

**Fix:**
```typescript
const user = users.find(u => u.id === id);
if (!user) throw new Error('User not found'); // ✅ Null check
return user.name;

// Or use optional chaining
return user?.name ?? 'Unknown';
```

### 3. Strict Property Initialization

**Error:**
```typescript
class MyClass {
  name: string; // ❌ Property 'name' has no initializer
  constructor() {}
}
```

**Fix:**
```typescript
class MyClass {
  name: string; // ✅ Initialized in constructor
  constructor(name: string) {
    this.name = name;
  }
}

// Or use definite assignment assertion if you know it's set elsewhere
class MyClass {
  name!: string; // ✅ Definite assignment assertion
  constructor() {
    this.init();
  }
  init() {
    this.name = 'default';
  }
}
```

### 4. Unknown in Catch Variables

**Error:**
```typescript
try {
  doSomething();
} catch (error) {
  console.error(error.message); // ❌ 'error' is of type 'unknown'
}
```

**Fix:**
```typescript
try {
  doSomething();
} catch (error) {
  if (error instanceof Error) { // ✅ Type guard
    console.error(error.message);
  }
}
```

### 5. No Implicit This

**Error:**
```typescript
const obj = {
  value: 42,
  getValue() {
    return function() {
      return this.value; // ❌ 'this' implicitly has type 'any'
    };
  }
};
```

**Fix:**
```typescript
const obj = {
  value: 42,
  getValue() {
    return () => { // ✅ Arrow function captures correct 'this'
      return this.value;
    };
  }
};
```

## Strict Mode Compiler Options

Our `tsconfig.strict.json` enables these options:

| Option | What it does |
|--------|--------------|
| `strict` | Enables all strict type checking options |
| `noImplicitAny` | Error on expressions and declarations with implied `any` type |
| `strictNullChecks` | `null` and `undefined` are not assignable to other types |
| `strictFunctionTypes` | Check function parameter types more strictly |
| `strictBindCallApply` | Check `bind`, `call`, `apply` methods |
| `strictPropertyInitialization` | Class properties must be initialized |
| `noImplicitThis` | Error when `this` has type `any` |
| `useUnknownInCatchVariables` | Catch variables are `unknown` instead of `any` |
| `alwaysStrict` | Emit `"use strict"` in output |
| `noUnusedLocals` | Error on unused local variables |
| `noUnusedParameters` | Error on unused parameters |
| `exactOptionalPropertyTypes` | Differentiate between `undefined` and optional |
| `noImplicitReturns` | Error on code paths that don't return a value |
| `noFallthroughCasesInSwitch` | Error on switch statement fallthrough |
| `noUncheckedIndexedAccess` | Add `undefined` to index signature results |
| `noImplicitOverride` | Require `override` keyword for overridden members |
| `noPropertyAccessFromIndexSignature` | Require bracket notation for index signatures |

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Check TypeScript strict mode
  run: npm run better:ci
```

This will fail the build if anyone introduces new strict mode violations.

## Progress Tracking

To see current progress:

```bash
# See all strict mode errors
npm run check:strict

# Count total errors
npm run check:strict 2>&1 | grep "error TS" | wc -l
```

## Best Practices

1. **Fix errors incrementally** - Don't try to fix everything at once
2. **Fix by file or module** - Work through one area at a time
3. **Update baseline after fixes** - Run `npm run better:update`
4. **Don't suppress errors** - Use `// @ts-expect-error` sparingly and only with good reason
5. **Write strict code from day one** - New code should pass strict checks

## Resources

- [Betterer Documentation](https://phenomnomnominal.github.io/betterer/)
- [TypeScript Handbook: Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Incremental TypeScript Migration Guide](https://webdev-sb.blogspot.com/2025/03/enabling-typescript-strict-mode-in.html)

## Goal

**Target**: Enable `strict: true` in main `tsconfig.json` once Betterer baseline shows 0 errors.

This migration improves code quality, catches bugs earlier, and makes the codebase more maintainable.

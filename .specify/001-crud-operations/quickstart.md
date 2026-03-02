# Developer Quickstart: CRUD Operations

**Feature**: CRUD Operations for Posts  
**Branch**: `001-crud-operations`  
**Date**: 2026-02-27

## Overview

This guide helps developers get started implementing CRUD operations for the social media posts application. Follow this guide to understand the architecture, set up your environment, and begin development following TDD principles.

---

## Prerequisites

- Node.js 18+ installed
- Git configured
- Familiarity with React, TypeScript, and Jest
- VS Code or preferred editor

---

## Getting Started

### 1. Switch to Feature Branch

```bash
git checkout 001-crud-operations
```

If the branch doesn't exist locally:

```bash
git fetch origin
git checkout -b 001-crud-operations origin/001-crud-operations
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install shadcn/ui Components

Install required UI primitives:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
```

These components will be added to `src/components/ui/`.

### 4. Run Development Server

```bash
npm run dev
```

The app should be available at `http://localhost:5173`.

### 5. Run Tests (Watch Mode)

In a separate terminal:

```bash
npm run test:watch
```

---

## Architecture Overview

### Project Structure

```
src/
├── components/         # React components
│   ├── Post/          # Existing post card (will enhance)
│   ├── PostActions/   # Existing actions (will enhance)
│   ├── PostForm/      # NEW - Form for create/edit
│   ├── PostDialog/    # NEW - Modal wrapper
│   ├── DeleteConfirmDialog/  # NEW - Delete confirmation
│   ├── PostDetailModal/      # NEW - Detailed view
│   └── ui/            # shadcn/ui primitives
├── contexts/          # React Context for state management
│   └── PostsContext.tsx  # Will enhance with CRUD
├── services/          # API integration layer
│   └── api.service.ts    # Will add create/update/delete
├── hooks/             # Custom React hooks
│   └── usePostForm.ts    # NEW - Form state management
├── lib/               # Utilities
│   ├── utils.ts       # Existing utilities
│   └── validation.ts  # NEW - Form validation
└── types/             # TypeScript interfaces
    ├── post.types.ts  # Will add DTOs
    └── api.types.ts   # Existing API types
```

### Data Flow

```
User Action (UI)
    ↓
Component (PostForm, PostDialog)
    ↓
Context Method (createPost, updatePost, deletePost)
    ↓
Optimistic Update (immediate UI update)
    ↓
API Service (api.service.ts)
    ↓
JSONPlaceholder API
    ↓
[Success] Confirm optimistic update
[Error] Revert optimistic update + show error
```

---

## Development Workflow

### Test-Driven Development (TDD)

**IMPORTANT**: Constitution mandates TDD. Always write tests before implementation.

#### TDD Cycle

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests green

#### Example TDD Workflow

```bash
# 1. Create test file first
touch src/lib/validation.test.ts

# 2. Write failing test
# (Edit validation.test.ts - see example below)

# 3. Run tests (should fail)
npm run test

# 4. Implement function
# (Edit validation.ts)

# 5. Run tests (should pass)
npm run test

# 6. Refactor if needed
```

#### Example Test (validation.test.ts)

```typescript
import { validateTitle, validateBody } from './validation';

describe('validateTitle', () => {
  it('should return error for empty title', () => {
    const result = validateTitle('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Title is required');
  });

  it('should return error for title exceeding 255 characters', () => {
    const longTitle = 'a'.repeat(256);
    const result = validateTitle(longTitle);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('255 characters');
  });

  it('should pass for valid title', () => {
    const result = validateTitle('Valid Title');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
```

---

## Implementation Order

Follow this order for systematic development:

### Phase 1: Foundation (Days 1-2)

#### Task 1.1: Type Definitions

- [ ] Create `CreatePostRequest`, `UpdatePostRequest` interfaces in `post.types.ts`
- [ ] Write tests for type exports (basic TypeScript compilation tests)

#### Task 1.2: Validation Utilities

- [ ] **TEST**: Create `lib/validation.test.ts` with tests for `validateTitle` and `validateBody`
- [ ] **IMPLEMENT**: Create `lib/validation.ts` with validation functions
- [ ] Ensure 100% test coverage for validation logic

#### Task 1.3: API Service Functions

- [ ] **TEST**: Add tests to `api.service.test.ts` for `createPost`, `updatePost`, `deletePost`
- [ ] **IMPLEMENT**: Add API functions to `api.service.ts`
- [ ] Mock fetch calls in tests
- [ ] Test error handling and response transformation

### Phase 2: Context & State (Days 3-4)

#### Task 2.1: Enhanced PostsContext

- [ ] **TEST**: Add tests to `PostsContext.test.tsx` for CRUD operations
- [ ] **TEST**: Test optimistic updates and rollback on error
- [ ] **IMPLEMENT**: Add `createPost`, `updatePost`, `deletePost` to PostsContext
- [ ] **IMPLEMENT**: Add loading states (`creatingPost`, `updatingPostId`, `deletingPostId`)

#### Task 2.2: Custom Hook (usePostForm)

- [ ] **TEST**: Create `hooks/usePostForm.test.ts`
- [ ] **TEST**: Test form state, validation, submission, errors
- [ ] **IMPLEMENT**: Create `hooks/usePostForm.ts`
- [ ] Use React Testing Library's `renderHook` for hook tests

### Phase 3: UI Components (Days 5-7)

#### Task 3.1: PostForm Component

- [ ] **TEST**: Create `PostForm.test.tsx`
- [ ] **TEST**: Test rendering, validation, submission, cancel
- [ ] **IMPLEMENT**: Create `PostForm.tsx`
- [ ] Use usePostForm hook
- [ ] Add character counters and validation errors

#### Task 3.2: PostDialog Component

- [ ] **TEST**: Create `PostDialog.test.tsx`
- [ ] **TEST**: Test open/close, mode switching, form submission
- [ ] **IMPLEMENT**: Create `PostDialog.tsx`
- [ ] Use shadcn/ui Dialog component
- [ ] Integrate PostForm

#### Task 3.3: DeleteConfirmDialog Component

- [ ] **TEST**: Create `DeleteConfirmDialog.test.tsx`
- [ ] **TEST**: Test confirmation flow, cancel, loading state
- [ ] **IMPLEMENT**: Create `DeleteConfirmDialog.tsx`
- [ ] Use shadcn/ui Dialog component

#### Task 3.4: PostDetailModal Component

- [ ] **TEST**: Create `PostDetailModal.test.tsx`
- [ ] **TEST**: Test rendering, actions, close
- [ ] **IMPLEMENT**: Create `PostDetailModal.tsx`
- [ ] Display full post content and metadata

### Phase 4: Integration (Days 8-9)

#### Task 4.1: Enhance PostActions Component

- [ ] **TEST**: Update `PostActions.test.tsx` with Edit/Delete button tests
- [ ] **IMPLEMENT**: Add Edit and Delete buttons to `PostActions.tsx`

#### Task 4.2: Enhance Post Component (Optional)

- [ ] **TEST**: Update `Post.test.tsx` with click-to-view tests
- [ ] **IMPLEMENT**: Add click handler to open PostDetailModal

#### Task 4.3: Integration with App.tsx

- [ ] Add state for dialog open/close
- [ ] Wire up create button in header
- [ ] Connect PostActions to dialogs
- [ ] Test complete user flows

#### Task 4.4: Integration Tests

- [ ] **TEST**: Create `tests/integration/post-crud.test.tsx`
- [ ] **TEST**: Test complete create → edit → delete workflow
- [ ] **TEST**: Test error scenarios and recovery
- [ ] **TEST**: Test keyboard navigation

### Phase 5: Polish & Accessibility (Day 10)

#### Task 5.1: Accessibility Audit

- [ ] Run automated a11y tests (jest-axe)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify ARIA labels and roles

#### Task 5.2: Performance Optimization

- [ ] Add React.memo to components
- [ ] Use useCallback for handlers
- [ ] Lazy load dialogs
- [ ] Run Lighthouse audit

#### Task 5.3: Error Handling & Edge Cases

- [ ] Test network errors
- [ ] Test concurrent operations
- [ ] Test rapid clicks
- [ ] Test long content

---

## Testing Guidelines

### Unit Test Example (Component)

```typescript
// PostForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from './PostForm';

describe('PostForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with title and body inputs', () => {
    render(
      <PostForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
  });

  it('should show validation error for empty title on blur', async () => {
    render(
      <PostForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.click(titleInput);
    await userEvent.tab(); // Blur

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('should call onSubmit with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <PostForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await userEvent.type(screen.getByLabelText(/title/i), 'Test Title');
    await userEvent.type(screen.getByLabelText(/body/i), 'Test Body');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Title',
        body: 'Test Body',
      });
    });
  });
});
```

### Integration Test Example

```typescript
// tests/integration/post-crud.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

describe('Post CRUD Integration', () => {
  it('should create, edit, and delete a post', async () => {
    render(<App />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText(/social media posts/i)).toBeInTheDocument();
    });

    // Create post
    await userEvent.click(screen.getByRole('button', { name: /create post/i }));
    await userEvent.type(screen.getByLabelText(/title/i), 'Integration Test Post');
    await userEvent.type(screen.getByLabelText(/body/i), 'Test content #integration');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify post appears
    expect(await screen.findByText('Integration Test Post')).toBeInTheDocument();

    // Edit post
    const postCard = screen.getByText('Integration Test Post').closest('[role="article"]');
    const editButton = within(postCard).getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Edited Post Title');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Verify edit
    expect(await screen.findByText('Edited Post Title')).toBeInTheDocument();

    // Delete post
    const updatedPostCard = screen.getByText('Edited Post Title').closest('[role="article"]');
    const deleteButton = within(updatedPostCard).getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    // Confirm deletion
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

    // Verify deletion
    await waitFor(() => {
      expect(screen.queryByText('Edited Post Title')).not.toBeInTheDocument();
    });
  });
});
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Mock Fetch

**Problem**: Tests fail with network errors.

**Solution**: Mock fetch globally in test setup:

```typescript
// jest.setup.ts
global.fetch = jest.fn();

// In test
beforeEach(() => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ id: 1, title: 'Test', body: 'Body', userId: 1 }),
  });
});
```

### Pitfall 2: Not Waiting for Async Updates

**Problem**: Tests fail because they don't wait for state updates.

**Solution**: Use `waitFor` or `findBy` queries:

```typescript
// ❌ Bad
expect(screen.getByText('Success')).toBeInTheDocument();

// ✅ Good
expect(await screen.findByText('Success')).toBeInTheDocument();

// ✅ Also good
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Pitfall 3: Form Validation Not Triggering

**Problem**: Validation doesn't run in tests.

**Solution**: Properly simulate blur events:

```typescript
// ❌ Bad
fireEvent.blur(input);

// ✅ Good
await userEvent.click(input);
await userEvent.tab(); // Triggers blur
```

### Pitfall 4: Dialog Not Closing

**Problem**: Dialog remains open after submission in tests.

**Solution**: Ensure onOpenChange is called in component:

```typescript
// In PostDialog.tsx
const handleSubmit = async values => {
  await onSubmit(values);
  onOpenChange(false); // Close dialog after successful submit
};
```

---

## Code Style Guidelines

### Component Structure

```typescript
// 1. Imports (grouped: React, third-party, local)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Post } from '@/types/post.types';

// 2. Type definitions
interface ComponentProps {
  // ...
}

// 3. Component (use named export)
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Effects (if any)
  useEffect(() => {
    // ...
  }, []);

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions

- Components: PascalCase (`PostForm`, `DeleteConfirmDialog`)
- Functions/variables: camelCase (`createPost`, `isSubmitting`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_TITLE_LENGTH`)
- Types/Interfaces: PascalCase (`PostFormProps`, `CreatePostRequest`)
- Test files: `Component.test.tsx` or `function.test.ts`

---

## Debugging Tips

### Debug Tests

```bash
# Run single test file
npm test PostForm.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="validation"

# Debug with breakpoints (use debugger; in code)
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug React Components

```tsx
// In component
console.log('Current state:', { values, errors, touched });

// In test
screen.debug(); // Prints current DOM
```

### Check Test Coverage

```bash
npm run test:coverage

# Open coverage report
open coverage/lcov-report/index.html
```

---

## Resources

### Documentation

- [React Testing Library](https://testing-library.com/react)
- [Jest](https://jestjs.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/guide)

### Related Files

- [spec.md](./spec.md) - Feature specification
- [research.md](./research.md) - Technical decisions
- [data-model.md](./data-model.md) - Entity definitions
- [contracts/api-contracts.md](./contracts/api-contracts.md) - API contracts
- [contracts/component-contracts.md](./contracts/component-contracts.md) - Component interfaces

---

## Getting Help

- Check existing component tests for patterns
- Review PostsContext for state management examples
- Refer to shadcn/ui docs for component usage
- Constitution file (`.specify/memory/constitution.md`) for coding standards

---

## Next Steps

1. ✅ Read this quickstart guide
2. ✅ Set up development environment
3. ✅ Review architecture and contracts
4. → Start with Phase 1: Foundation (validation utilities)
5. → Follow TDD: Write tests first!
6. → Commit frequently with conventional commit messages
7. → Run `npm run test:coverage` regularly to maintain 80%+ coverage

Happy coding! 🚀

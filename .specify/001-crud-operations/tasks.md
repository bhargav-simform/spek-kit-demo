# Task Breakdown: CRUD Operations for Posts

**Feature**: CRUD Operations for Posts  
**Branch**: `001-crud-operations`  
**Date**: 2026-03-02  
**Status**: Ready for Implementation

## Overview

This document breaks down the CRUD operations implementation into discrete, actionable tasks following Test-Driven Development (TDD) principles. Each task includes time estimates, dependencies, acceptance criteria, and implementation guidance.

---

## Task Summary

| Phase                  | Tasks        | Estimated Time | Total           |
| ---------------------- | ------------ | -------------- | --------------- |
| Phase 1: Foundation    | 7 tasks      | 0.5-1h each    | 4-6 hours       |
| Phase 2: API & State   | 6 tasks      | 1-2h each      | 8-10 hours      |
| Phase 3: UI Components | 8 tasks      | 1-2h each      | 10-14 hours     |
| Phase 4: Integration   | 5 tasks      | 0.5-1.5h each  | 4-6 hours       |
| Phase 5: Polish        | 4 tasks      | 1-2h each      | 5-7 hours       |
| **TOTAL**              | **30 tasks** | -              | **31-43 hours** |

**Estimated Calendar Time**: 5-7 working days (following TDD, includes testing and code review)

---

## Phase 1: Foundation & Types (4-6 hours)

Setup foundational types, validation utilities, and UI primitives required by all other components.

### Task 1.1: Install UI Dependencies

**Estimate**: 15-30 minutes  
**Dependencies**: None  
**Priority**: P0 (Blocking)

**Description**: Install shadcn/ui components required for CRUD operations.

**Steps**:

1. Run `npx shadcn@latest add dialog`
2. Run `npx shadcn@latest add input`
3. Run `npx shadcn@latest add textarea`
4. Run `npx shadcn@latest add label`
5. Verify components installed to `src/components/ui/`
6. Test that components import successfully

**Acceptance Criteria**:

- ✅ All 4 UI components exist in `src/components/ui/`
- ✅ No build errors
- ✅ Components export expected interfaces

**Files Modified**:

- `src/components/ui/dialog.tsx` (new)
- `src/components/ui/input.tsx` (new)
- `src/components/ui/textarea.tsx` (new)
- `src/components/ui/label.tsx` (new)

---

### Task 1.2: Define Type Interfaces

**Estimate**: 30-45 minutes  
**Dependencies**: None  
**Priority**: P0 (Blocking)

**Description**: Add new type definitions for CRUD DTOs and form state.

**TDD Approach**:

1. ❌ Write test in `src/types/post.types.test.ts` (new file) validating type shapes
2. ❌ Implement types in `src/types/post.types.ts`
3. ✅ Tests pass

**Steps**:

1. Create test file `src/types/post.types.test.ts`
2. Add type-checking tests using TypeScript type assertions
3. Add interfaces to `src/types/post.types.ts`:
   - `CreatePostRequest`
   - `UpdatePostRequest`
   - `PostFormData`
   - `FormErrors`
   - `TouchedFields`
4. Export all new types

**Acceptance Criteria**:

- ✅ All 5 new interfaces defined
- ✅ Types properly exported from `post.types.ts`
- ✅ TypeScript compilation successful
- ✅ Type tests pass

**Files Modified**:

- `src/types/post.types.ts` (enhanced)
- `src/types/post.types.test.ts` (new)

**Code Reference**:

```typescript
export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequest {
  id: number;
  title: string;
  body: string;
}

export interface FormErrors {
  title?: string;
  body?: string;
  submit?: string;
}

export interface TouchedFields {
  title: boolean;
  body: boolean;
}

export interface PostFormData {
  title: string;
  body: string;
  errors: FormErrors;
  touched: TouchedFields;
  isSubmitting: boolean;
}
```

---

### Task 1.3: Create Validation Utilities

**Estimate**: 45-60 minutes  
**Dependencies**: Task 1.2  
**Priority**: P0 (Blocking)

**Description**: Implement form validation functions for post title and body.

**TDD Approach**:

1. ❌ Write tests in `src/lib/validation.test.ts` for all validation scenarios
2. ❌ Implement validation functions in `src/lib/validation.ts`
3. ✅ All tests pass

**Steps**:

1. Create `src/lib/validation.test.ts`
2. Write test cases:
   - Empty title/body rejection
   - Whitespace-only rejection
   - Length validation (1-255 for title, 1-5000 for body)
   - Valid input acceptance
   - Trimming behavior
3. Create `src/lib/validation.ts`
4. Implement functions:
   - `validatePostTitle(title: string): string | undefined`
   - `validatePostBody(body: string): string | undefined`
   - `validatePostForm(data: { title: string; body: string }): FormErrors`

**Acceptance Criteria**:

- ✅ All validation edge cases covered
- ✅ Functions return undefined for valid input
- ✅ Functions return error messages for invalid input
- ✅ Test coverage ≥ 90%
- ✅ Error messages are user-friendly

**Files Modified**:

- `src/lib/validation.ts` (new)
- `src/lib/validation.test.ts` (new)

**Code Reference**:

```typescript
export function validatePostTitle(title: string): string | undefined {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 'Title is required';
  }
  if (trimmed.length > 255) {
    return 'Title must be 255 characters or less';
  }
  return undefined;
}

export function validatePostBody(body: string): string | undefined {
  const trimmed = body.trim();
  if (trimmed.length === 0) {
    return 'Post content is required';
  }
  if (trimmed.length > 5000) {
    return 'Post content must be 5000 characters or less';
  }
  return undefined;
}
```

---

### Task 1.4: Create usePostForm Hook - Tests

**Estimate**: 45-60 minutes  
**Dependencies**: Task 1.2, 1.3  
**Priority**: P1

**Description**: Write comprehensive tests for the usePostForm custom hook (TDD Part 1).

**TDD Approach**:

1. ❌ Write all hook tests first (this task)
2. ❌ Implement hook functionality (Task 1.5)
3. ✅ Tests pass

**Steps**:

1. Create `src/hooks/usePostForm.test.ts`
2. Write test cases covering:
   - Initial state setup (empty form)
   - Initial state with existing post (edit mode)
   - Field updates (handleChange)
   - Field blur events (handleBlur)
   - Form submission (handleSubmit)
   - Validation on blur
   - Validation on submit
   - Reset functionality
   - Loading states during submission
   - Error handling

**Acceptance Criteria**:

- ✅ Test file created with comprehensive test suite
- ✅ Tests use @testing-library/react-hooks
- ✅ All hook behaviors specified in tests
- ✅ Tests initially fail (no implementation yet)

**Files Modified**:

- `src/hooks/usePostForm.test.ts` (new)

---

### Task 1.5: Create usePostForm Hook - Implementation

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 1.4  
**Priority**: P1

**Description**: Implement the usePostForm custom hook for form state management (TDD Part 2).

**TDD Approach**:

1. ✅ Tests already written (Task 1.4)
2. ❌ Implement hook functionality (this task)
3. ✅ Tests pass

**Steps**:

1. Create `src/hooks/usePostForm.ts`
2. Implement hook with:
   - State management for form fields
   - Validation integration
   - Change and blur handlers
   - Submit handler
   - Reset functionality
3. Run tests and iterate until all pass
4. Export hook

**Acceptance Criteria**:

- ✅ All tests from Task 1.4 pass
- ✅ Hook properly manages form state
- ✅ Validation triggers correctly on blur and submit
- ✅ Hook accepts optional initial post for edit mode
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/hooks/usePostForm.ts` (new)

**Code Reference**:

```typescript
export function usePostForm(
  initialPost?: Post,
  onSubmit?: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>
) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialPost?.title || '',
    body: initialPost?.body || '',
    errors: {},
    touched: { title: false, body: false },
    isSubmitting: false,
  });

  const handleChange = (field: 'title' | 'body', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: 'title' | 'body') => {
    // Validate and update touched state
  };

  const handleSubmit = async () => {
    // Validate, call onSubmit, handle errors
  };

  const reset = () => {
    // Reset form state
  };

  return { formData, handleChange, handleBlur, handleSubmit, reset };
}
```

---

### Task 1.6: Extract Hashtag Utility Enhancement

**Estimate**: 15-30 minutes  
**Dependencies**: None  
**Priority**: P2

**Description**: Ensure hashtag extraction utility is properly exposed and tested.

**TDD Approach**:

1. ❌ Write/enhance tests for hashtag extraction
2. ❌ Verify or enhance implementation
3. ✅ Tests pass

**Steps**:

1. Check if `extractHashtags` exists in `src/lib/utils.ts`
2. If not, create tests in `src/lib/utils.test.ts`
3. Implement/verify `extractHashtags(text: string): string[]`
4. Test edge cases (no hashtags, multiple hashtags, special characters)

**Acceptance Criteria**:

- ✅ Function extracts hashtags from text using regex `/#(\w+)/g`
- ✅ Returns array of hashtags without # prefix
- ✅ Handles empty strings and text without hashtags
- ✅ Test coverage ≥ 80%

**Files Modified**:

- `src/lib/utils.ts` (enhanced if needed)
- `src/lib/utils.test.ts` (enhanced)

---

### Task 1.7: Setup Test Utilities

**Estimate**: 30-45 minutes  
**Dependencies**: None  
**Priority**: P1

**Description**: Create test utilities and mocks for testing CRUD components.

**Steps**:

1. Create `src/test/test-utils.tsx` (if doesn't exist)
2. Add custom render function with PostsContext wrapper
3. Create mock data factory for posts
4. Create mock API service
5. Setup Jest mock helpers

**Acceptance Criteria**:

- ✅ Custom render function wraps components with necessary providers
- ✅ Mock data factory generates realistic post objects
- ✅ Mock API service mimics real API behavior
- ✅ Test utilities are reusable across all component tests

**Files Modified**:

- `src/test/test-utils.tsx` (new or enhanced)
- `src/test/mocks.ts` (new)

---

## Phase 2: API Layer & State Management (8-10 hours)

Implement API service functions and enhance PostsContext with CRUD operations.

### Task 2.1: API Service - Create Post (Tests)

**Estimate**: 30-45 minutes  
**Dependencies**: Task 1.2  
**Priority**: P0 (Blocking)

**Description**: Write tests for the createPost API function (TDD Part 1).

**TDD Approach**:

1. ❌ Write tests (this task)
2. ❌ Implement function (Task 2.2)
3. ✅ Tests pass

**Steps**:

1. Open `src/services/api.service.test.ts`
2. Add test suite for `createPost`:
   - Successful post creation
   - HTTP error handling (400, 500)
   - Network error handling
   - Response transformation to Post interface
   - Request body structure validation

**Acceptance Criteria**:

- ✅ Test suite covers all success and error scenarios
- ✅ Tests verify correct API endpoint and method (POST)
- ✅ Tests verify response transformation
- ✅ Tests initially fail (no implementation)

**Files Modified**:

- `src/services/api.service.test.ts` (enhanced)

---

### Task 2.2: API Service - Create Post (Implementation)

**Estimate**: 45-60 minutes  
**Dependencies**: Task 2.1  
**Priority**: P0 (Blocking)

**Description**: Implement the createPost API function (TDD Part 2).

**TDD Approach**:

1. ✅ Tests already written (Task 2.1)
2. ❌ Implement function (this task)
3. ✅ Tests pass

**Steps**:

1. Open `src/services/api.service.ts`
2. Implement `createPost(request: CreatePostRequest): Promise<Post>`
3. Add fetch call to `POST /posts`
4. Add error handling
5. Add response transformation
6. Run tests and iterate until pass

**Acceptance Criteria**:

- ✅ Function posts to correct endpoint
- ✅ Request body correctly formatted
- ✅ Response transformed to Post interface with all required fields
- ✅ Errors properly handled and thrown
- ✅ All tests from Task 2.1 pass
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/services/api.service.ts` (enhanced)

**Code Reference**:

```typescript
export async function createPost(request: CreatePostRequest): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    ...data,
    engagement: { likes: 0, comments: 0, shares: 0 },
    isLiked: false,
    timestamp: new Date(),
    hashtags: extractHashtags(data.body),
    imageUrl: undefined,
    user: undefined,
  };
}
```

---

### Task 2.3: API Service - Update Post

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 2.2  
**Priority**: P0 (Blocking)

**Description**: Implement updatePost API function with tests (combined TDD).

**TDD Approach**:

1. ❌ Write tests first
2. ❌ Implement function
3. ✅ Tests pass

**Steps**:

1. Add test suite in `api.service.test.ts` for `updatePost`
2. Test success scenario, errors, response transformation
3. Implement `updatePost(request: UpdatePostRequest): Promise<Post>`
4. Use PATCH method for partial updates
5. Handle HTTP and network errors
6. Transform response to Post interface

**Acceptance Criteria**:

- ✅ Tests cover all scenarios
- ✅ Function uses PATCH method to `/posts/:id`
- ✅ Response properly transformed
- ✅ All tests pass
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/services/api.service.ts` (enhanced)
- `src/services/api.service.test.ts` (enhanced)

---

### Task 2.4: API Service - Delete Post

**Estimate**: 45-60 minutes  
**Dependencies**: Task 2.3  
**Priority**: P0 (Blocking)

**Description**: Implement deletePost API function with tests (combined TDD).

**TDD Approach**:

1. ❌ Write tests first
2. ❌ Implement function
3. ✅ Tests pass

**Steps**:

1. Add test suite in `api.service.test.ts` for `deletePost`
2. Test success (returns void), 404 errors, other errors
3. Implement `deletePost(postId: number): Promise<void>`
4. Use DELETE method
5. Handle errors appropriately

**Acceptance Criteria**:

- ✅ Tests cover all scenarios
- ✅ Function uses DELETE method to `/posts/:id`
- ✅ Returns void on success
- ✅ Properly handles 404 and other errors
- ✅ All tests pass
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/services/api.service.ts` (enhanced)
- `src/services/api.service.test.ts` (enhanced)

---

### Task 2.5: PostsContext - Add CRUD Methods (Tests)

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 2.2, 2.3, 2.4  
**Priority**: P0 (Blocking)

**Description**: Write tests for enhanced PostsContext with CRUD operations (TDD Part 1).

**TDD Approach**:

1. ❌ Write context tests (this task)
2. ❌ Implement context methods (Task 2.6)
3. ✅ Tests pass

**Steps**:

1. Open `src/contexts/PostsContext.test.tsx`
2. Add test suites for:
   - `createPost(request: CreatePostRequest)` - optimistic update
   - `updatePost(request: UpdatePostRequest)` - optimistic update
   - `deletePost(postId: number)` - optimistic removal
   - Error handling and rollback for each operation
   - Loading states during operations

**Acceptance Criteria**:

- ✅ Tests cover optimistic updates
- ✅ Tests verify rollback on error
- ✅ Tests check loading states
- ✅ Tests verify API service is called correctly
- ✅ Tests initially fail (no implementation)

**Files Modified**:

- `src/contexts/PostsContext.test.tsx` (enhanced)

---

### Task 2.6: PostsContext - Add CRUD Methods (Implementation)

**Estimate**: 1.5-2 hours  
**Dependencies**: Task 2.5  
**Priority**: P0 (Blocking)

**Description**: Implement CRUD methods in PostsContext (TDD Part 2).

**TDD Approach**:

1. ✅ Tests already written (Task 2.5)
2. ❌ Implement methods (this task)
3. ✅ Tests pass

**Steps**:

1. Open `src/contexts/PostsContext.tsx`
2. Add state for operation loading/errors
3. Implement `createPost`:
   - Add optimistic post with temp ID
   - Call API service
   - Replace temp post with real post
   - Handle errors and rollback
4. Implement `updatePost`:
   - Optimistically update post
   - Call API service
   - Rollback on error
5. Implement `deletePost`:
   - Optimistically remove post
   - Call API service
   - Rollback on error
6. Run tests and iterate

**Acceptance Criteria**:

- ✅ All CRUD methods implemented
- ✅ Optimistic updates working
- ✅ Error handling with rollback
- ✅ Loading states managed
- ✅ All tests from Task 2.5 pass
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/contexts/PostsContext.tsx` (enhanced)

**Code Reference**:

```typescript
const createPost = async (request: CreatePostRequest) => {
  const tempId = Date.now();
  const optimisticPost: Post = {
    id: tempId,
    ...request,
    engagement: { likes: 0, comments: 0, shares: 0 },
    isLiked: false,
    timestamp: new Date(),
    hashtags: extractHashtags(request.body),
    imageUrl: undefined,
    user: undefined,
  };

  setPosts(prev => [optimisticPost, ...prev]);

  try {
    const createdPost = await apiService.createPost(request);
    setPosts(prev => prev.map(p => (p.id === tempId ? createdPost : p)));
  } catch (error) {
    setPosts(prev => prev.filter(p => p.id !== tempId));
    throw error;
  }
};
```

---

## Phase 3: UI Components (10-14 hours)

Build all UI components for CRUD operations following TDD.

### Task 3.1: PostForm Component - Tests

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 1.5  
**Priority**: P1

**Description**: Write comprehensive tests for PostForm component (TDD Part 1).

**TDD Approach**:

1. ❌ Write tests (this task)
2. ❌ Implement component (Task 3.2)
3. ✅ Tests pass

**Steps**:

1. Create `src/components/PostForm/PostForm.test.tsx`
2. Write tests for:
   - Rendering in create mode (empty form)
   - Rendering in edit mode (pre-filled)
   - User typing in title/body fields
   - Validation error display
   - Form submission
   - Disabled state during submission
   - Cancel button behavior
   - Accessibility (labels, ARIA attributes)

**Acceptance Criteria**:

- ✅ Comprehensive test suite created
- ✅ Tests cover user interactions
- ✅ Tests verify validation display
- ✅ Tests check accessibility
- ✅ Tests initially fail

**Files Modified**:

- `src/components/PostForm/PostForm.test.tsx` (new)
- `src/components/PostForm/index.ts` (new)

---

### Task 3.2: PostForm Component - Implementation

**Estimate**: 1.5-2 hours  
**Dependencies**: Task 3.1  
**Priority**: P1

**Description**: Implement PostForm component (TDD Part 2).

**TDD Approach**:

1. ✅ Tests already written (Task 3.1)
2. ❌ Implement component (this task)
3. ✅ Tests pass

**Steps**:

1. Create `src/components/PostForm/PostForm.tsx`
2. Implement form using usePostForm hook
3. Add Input and Textarea from shadcn/ui
4. Display validation errors
5. Add submit and cancel buttons
6. Handle loading states
7. Ensure accessibility (proper labels, ARIA)
8. Run tests and iterate

**Acceptance Criteria**:

- ✅ Component renders correctly in both modes
- ✅ Form validation works
- ✅ usePostForm hook integrated
- ✅ All tests from Task 3.1 pass
- ✅ WCAG 2.1 AA compliant
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/components/PostForm/PostForm.tsx` (new)

**Props Interface**:

```typescript
interface PostFormProps {
  post?: Post; // Undefined for create, provided for edit
  onSubmit: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string; // "Create Post" or "Save Changes"
}
```

---

### Task 3.3: PostDialog Component

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 3.2  
**Priority**: P1

**Description**: Create PostDialog modal wrapper for create/edit operations (combined TDD).

**TDD Approach**:

1. ❌ Write tests
2. ❌ Implement component
3. ✅ Tests pass

**Steps**:

1. Create `src/components/PostDialog/PostDialog.test.tsx`
2. Write tests for:
   - Dialog open/close behavior
   - PostForm rendering inside dialog
   - Proper title display (Create vs Edit)
   - Close on successful submit
   - Close on cancel
3. Create `src/components/PostDialog/PostDialog.tsx`
4. Integrate shadcn/ui Dialog component
5. Embed PostForm inside
6. Handle open/close state

**Acceptance Criteria**:

- ✅ Dialog opens and closes correctly
- ✅ Displays appropriate title
- ✅ PostForm properly embedded
- ✅ Closes after successful submission
- ✅ All tests pass
- ✅ Test coverage ≥ 80%

**Files Modified**:

- `src/components/PostDialog/PostDialog.tsx` (new)
- `src/components/PostDialog/PostDialog.test.tsx` (new)
- `src/components/PostDialog/index.ts` (new)

**Props Interface**:

```typescript
interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post; // Undefined for create mode
  onSubmit: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>;
}
```

---

### Task 3.4: DeleteConfirmDialog Component

**Estimate**: 1 hour  
**Dependencies**: Task 1.1  
**Priority**: P1

**Description**: Create confirmation dialog for post deletion (combined TDD).

**TDD Approach**:

1. ❌ Write tests
2. ❌ Implement component
3. ✅ Tests pass

**Steps**:

1. Create test file with tests for:
   - Dialog rendering
   - Confirm button action
   - Cancel button action
   - Close on confirm/cancel
   - Loading state during deletion
   - Accessibility
2. Create component using shadcn/ui Dialog
3. Display warning message
4. Add Confirm and Cancel buttons
5. Handle loading state

**Acceptance Criteria**:

- ✅ Dialog displays warning clearly
- ✅ Confirm triggers deletion callback
- ✅ Cancel closes dialog without action
- ✅ Loading state disables buttons
- ✅ Accessible (focus management, ARIA)
- ✅ All tests pass
- ✅ Test coverage ≥ 85%

**Files Modified**:

- `src/components/DeleteConfirmDialog/DeleteConfirmDialog.tsx` (new)
- `src/components/DeleteConfirmDialog/DeleteConfirmDialog.test.tsx` (new)
- `src/components/DeleteConfirmDialog/index.ts` (new)

**Props Interface**:

```typescript
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  postTitle: string; // Display in warning message
}
```

---

### Task 3.5: PostDetailModal Component

**Estimate**: 1.5-2 hours  
**Dependencies**: Task 1.1  
**Priority**: P2

**Description**: Create detailed post view modal (combined TDD).

**TDD Approach**:

1. ❌ Write tests
2. ❌ Implement component
3. ✅ Tests pass

**Steps**:

1. Create test file testing:
   - Post details rendering
   - Hashtags display
   - Engagement metrics display
   - Close button functionality
   - Edit/Delete action integration
2. Create component using Dialog
3. Display full post content
4. Show user info, engagement, hashtags
5. Add Edit and Delete buttons
6. Make responsive for mobile

**Acceptance Criteria**:

- ✅ All post details displayed correctly
- ✅ Edit/Delete actions available
- ✅ Responsive design (mobile/desktop)
- ✅ Accessible navigation
- ✅ All tests pass
- ✅ Test coverage ≥ 80%

**Files Modified**:

- `src/components/PostDetailModal/PostDetailModal.tsx` (new)
- `src/components/PostDetailModal/PostDetailModal.test.tsx` (new)
- `src/components/PostDetailModal/index.ts` (new)

---

### Task 3.6: Enhance PostActions Component

**Estimate**: 1 hour  
**Dependencies**: None  
**Priority**: P1

**Description**: Add Edit and Delete buttons to existing PostActions component.

**TDD Approach**:

1. ❌ Enhance existing tests
2. ❌ Add new buttons
3. ✅ Tests pass

**Steps**:

1. Open `src/components/PostActions/PostActions.test.tsx`
2. Add tests for:
   - Edit button rendering
   - Delete button rendering
   - Click handlers for edit/delete
3. Open `src/components/PostActions/PostActions.tsx`
4. Add Edit button with Lucide icon (Edit2 or Pencil)
5. Add Delete button with Lucide icon (Trash2)
6. Wire up onClick handlers
7. Maintain existing like/comment/share functionality

**Acceptance Criteria**:

- ✅ Edit button added with proper icon
- ✅ Delete button added with proper icon
- ✅ Buttons trigger correct callbacks
- ✅ Existing functionality preserved
- ✅ Accessible (labels, keyboard nav)
- ✅ All tests pass
- ✅ Test coverage maintained ≥ 80%

**Files Modified**:

- `src/components/PostActions/PostActions.tsx` (enhanced)
- `src/components/PostActions/PostActions.test.tsx` (enhanced)

**Props Enhancement**:

```typescript
interface PostActionsProps {
  // Existing props...
  onEdit?: () => void; // NEW
  onDelete?: () => void; // NEW
}
```

---

### Task 3.7: Enhance Post Component

**Estimate**: 45-60 minutes  
**Dependencies**: Task 3.6  
**Priority**: P1

**Description**: Update Post component to handle edit/delete/detail actions.

**TDD Approach**:

1. ❌ Enhance tests
2. ❌ Update component
3. ✅ Tests pass

**Steps**:

1. Open `src/components/Post/Post.test.tsx`
2. Add tests for:
   - Edit action callback
   - Delete action callback
   - Click to view detail callback
3. Open `src/components/Post/Post.tsx`
4. Pass edit/delete handlers to PostActions
5. Add onClick handler to card for detail view
6. Update props interface

**Acceptance Criteria**:

- ✅ Post forwards actions to PostActions
- ✅ Click on post card triggers detail view
- ✅ Props properly typed
- ✅ All tests pass
- ✅ Test coverage maintained ≥ 80%

**Files Modified**:

- `src/components/Post/Post.tsx` (enhanced)
- `src/components/Post/Post.test.tsx` (enhanced)

**Props Enhancement**:

```typescript
interface PostProps {
  post: Post;
  onEdit?: () => void; // NEW
  onDelete?: () => void; // NEW
  onViewDetail?: () => void; // NEW
}
```

---

### Task 3.8: Create FloatingActionButton Component

**Estimate**: 45-60 minutes  
**Dependencies**: Task 1.1  
**Priority**: P2

**Description**: Create floating action button (FAB) for initiating post creation.

**TDD Approach**:

1. ❌ Write tests
2. ❌ Implement component
3. ✅ Tests pass

**Steps**:

1. Create test file testing:
   - Button rendering
   - Click action
   - Fixed positioning
   - Accessibility
2. Create component with:
   - Fixed position (bottom-right)
   - Plus icon (Lucide Plus)
   - onClick handler
   - Accessible label
   - Responsive visibility

**Acceptance Criteria**:

- ✅ Button fixed to bottom-right
- ✅ Triggers create action on click
- ✅ Visible on mobile and desktop
- ✅ Proper z-index layering
- ✅ Accessible (ARIA label, keyboard)
- ✅ All tests pass
- ✅ Test coverage ≥ 80%

**Files Modified**:

- `src/components/FloatingActionButton/FloatingActionButton.tsx` (new)
- `src/components/FloatingActionButton/FloatingActionButton.test.tsx` (new)
- `src/components/FloatingActionButton/index.ts` (new)

---

## Phase 4: Integration (4-6 hours)

Connect all components to the main App and implement CRUD workflows.

### Task 4.1: Integrate CRUD Modals in App Component

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 2.6, 3.3, 3.4  
**Priority**: P0 (Blocking)

**Description**: Add state management and modal integration to App.tsx.

**TDD Approach**:

1. ❌ Write integration tests
2. ❌ Update App component
3. ✅ Tests pass

**Steps**:

1. Open or create `src/App.test.tsx`
2. Add tests for:
   - Create post flow
   - Edit post flow
   - Delete post flow
   - Modal open/close behavior
3. Open `src/App.tsx`
4. Add state for:
   - `createDialogOpen`
   - `editDialogOpen`
   - `deleteDialogOpen`
   - `selectedPost`
   - `detailPost`
5. Import PostDialog, DeleteConfirmDialog, PostDetailModal
6. Wire up callbacks to PostsContext methods
7. Add FAB for create action

**Acceptance Criteria**:

- ✅ All modals integrated
- ✅ State properly managed
- ✅ Context methods called correctly
- ✅ All integration tests pass
- ✅ Test coverage ≥ 80%

**Files Modified**:

- `src/App.tsx` (enhanced)
- `src/App.test.tsx` (enhanced)

---

### Task 4.2: Wire Up Post Component Actions

**Estimate**: 30-45 minutes  
**Dependencies**: Task 4.1, 3.7  
**Priority**: P1

**Description**: Connect Post component actions to App state and modals.

**Steps**:

1. Update `src/App.tsx` to pass callbacks to Post components
2. Implement handlers:
   - `handleEditPost(post: Post)` - opens edit dialog
   - `handleDeletePost(post: Post)` - opens delete dialog
   - `handleViewDetail(post: Post)` - opens detail modal
3. Pass handlers through PostGrid to Post components
4. Test full flow

**Acceptance Criteria**:

- ✅ Edit button opens edit dialog with correct post
- ✅ Delete button opens delete confirmation
- ✅ Click on post opens detail view
- ✅ All flows tested end-to-end

**Files Modified**:

- `src/App.tsx` (enhanced)
- `src/components/PostGrid/PostGrid.tsx` (enhanced if needed)

---

### Task 4.3: Add Error Toast Notifications

**Estimate**: 1 hour  
**Dependencies**: Task 4.1  
**Priority**: P2

**Description**: Implement user feedback for CRUD operation errors.

**Steps**:

1. Install or create toast notification system
2. Add error handling in App.tsx for CRUD operations
3. Display user-friendly error messages:
   - "Failed to create post. Please try again."
   - "Failed to update post. Please try again."
   - "Failed to delete post. Please try again."
4. Test error scenarios

**Acceptance Criteria**:

- ✅ Errors display as toast notifications
- ✅ Messages are user-friendly
- ✅ Toasts auto-dismiss after 5 seconds
- ✅ Multiple toasts handled gracefully

**Files Modified**:

- `src/App.tsx` (enhanced)
- `src/components/ui/toast.tsx` (new or existing)

---

### Task 4.4: Add Success Feedback

**Estimate**: 30-45 minutes  
**Dependencies**: Task 4.3  
**Priority**: P2

**Description**: Add success confirmations for CRUD operations.

**Steps**:

1. Add success toasts in App.tsx:
   - "Post created successfully!"
   - "Post updated successfully!"
   - "Post deleted successfully!"
2. Show toasts after successful operations
3. Optionally add subtle animations

**Acceptance Criteria**:

- ✅ Success messages display after operations
- ✅ Messages are encouraging
- ✅ UX feels responsive and complete

**Files Modified**:

- `src/App.tsx` (enhanced)

---

### Task 4.5: Integration Testing - E2E CRUD Flows

**Estimate**: 1.5-2 hours  
**Dependencies**: Task 4.1, 4.2, 4.3, 4.4  
**Priority**: P1

**Description**: Create comprehensive integration tests for all CRUD workflows.

**TDD Approach**:

1. ❌ Write E2E tests
2. ✅ Run tests (should pass if previous tasks complete)
3. ✅ Fix any issues found

**Steps**:

1. Create `src/tests/integration/post-crud.test.tsx`
2. Write tests for:
   - Complete create post flow (FAB → form → submit → post appears)
   - Complete edit post flow (post → edit → modify → save → update reflects)
   - Complete delete post flow (post → delete → confirm → post removed)
   - Detail view flow (post → view detail → close)
   - Error handling flows
   - Optimistic update verification
3. Use real PostsContext (not mocked)
4. Mock only API service

**Acceptance Criteria**:

- ✅ All CRUD flows tested end-to-end
- ✅ Tests verify optimistic updates
- ✅ Tests verify error handling
- ✅ Tests check accessibility in flows
- ✅ All tests pass
- ✅ Test coverage ≥ 80%

**Files Modified**:

- `src/tests/integration/post-crud.test.tsx` (new)

---

## Phase 5: Polish & Accessibility (5-7 hours)

Final polish, accessibility audit, performance optimization, and documentation.

### Task 5.1: Accessibility Audit & Fixes

**Estimate**: 2-2.5 hours  
**Dependencies**: All Phase 4 tasks  
**Priority**: P1

**Description**: Conduct comprehensive accessibility audit and fix issues.

**Steps**:

1. Install and run axe-core or similar a11y testing tool
2. Test keyboard navigation through all CRUD flows:
   - Tab order logical
   - Enter/Space trigger actions
   - Escape closes modals
   - Focus trap in dialogs
3. Verify screen reader support:
   - All interactive elements labeled
   - ARIA roles correct
   - Live regions for dynamic updates
   - Status messages announced
4. Check color contrast (WCAG AA: 4.5:1)
5. Verify focus indicators visible
6. Fix all identified issues
7. Document accessibility features

**Acceptance Criteria**:

- ✅ Zero critical a11y violations (axe-core)
- ✅ All CRUD flows keyboard navigable
- ✅ Screen reader tested (NVDA/JAWS/VoiceOver)
- ✅ Color contrast ≥ 4.5:1
- ✅ Focus indicators visible
- ✅ WCAG 2.1 Level AA compliant
- ✅ A11y documentation added to README

**Files Modified**:

- Various components (a11y fixes)
- `README.md` (accessibility section)

---

### Task 5.2: Performance Optimization

**Estimate**: 1.5-2 hours  
**Dependencies**: Task 4.5  
**Priority**: P2

**Description**: Optimize component performance and bundle size.

**Steps**:

1. Add React.memo to:
   - PostForm (prevent re-renders during typing in other fields)
   - Post (prevent grid re-renders)
   - PostActions
2. Use useCallback for:
   - CRUD handlers in App
   - Form handlers in usePostForm
3. Add lazy loading for modals:
   - `const PostDialog = lazy(() => import('./PostDialog'))`
4. Verify no unnecessary re-renders (React DevTools Profiler)
5. Check bundle impact (< 20KB for new code)
6. Test performance:
   - Form typing smooth (60fps)
   - Modal open/close fast (< 200ms)
   - Optimistic updates instant

**Acceptance Criteria**:

- ✅ Unnecessary re-renders eliminated
- ✅ Modals lazy loaded
- ✅ Bundle size increase < 20KB (gzipped)
- ✅ Form typing at 60fps
- ✅ Modal animations smooth
- ✅ Performance metrics documented

**Files Modified**:

- Various components (memoization)
- `src/App.tsx` (lazy loading)

---

### Task 5.3: Mobile Responsiveness Polish

**Estimate**: 1-1.5 hours  
**Dependencies**: Task 4.2  
**Priority**: P2

**Description**: Ensure excellent mobile experience for all CRUD operations.

**Steps**:

1. Test all CRUD flows on mobile viewport (375px width)
2. Verify touch targets ≥ 44x44px
3. Test modals on mobile:
   - Full-screen on small devices
   - Proper scrolling for long content
   - Keyboard doesn't obscure inputs
4. Optimize form layout for mobile
5. Test landscape orientation
6. Add mobile-specific enhancements:
   - Larger touch areas
   - Simplified layouts
   - Auto-focus inputs on mobile

**Acceptance Criteria**:

- ✅ All CRUD flows work smoothly on mobile
- ✅ Touch targets meet minimum size
- ✅ Modals properly sized for mobile
- ✅ Forms easy to use on small screens
- ✅ Tested on iOS Safari and Chrome Android
- ✅ No horizontal scroll on mobile

**Files Modified**:

- Various components (responsive styles)

---

### Task 5.4: Documentation & Code Comments

**Estimate**: 1-1.5 hours  
**Dependencies**: All tasks  
**Priority**: P2

**Description**: Add comprehensive documentation and code comments.

**Steps**:

1. Add JSDoc comments to:
   - All public functions in api.service
   - usePostForm hook
   - PostsContext CRUD methods
   - Complex validation logic
2. Update README.md:
   - Feature description
   - CRUD usage guide
   - Screenshots or GIFs
   - Testing instructions
   - Accessibility features
3. Add inline comments for complex logic
4. Document known limitations (JSONPlaceholder)
5. Add troubleshooting section

**Acceptance Criteria**:

- ✅ All public APIs documented (JSDoc)
- ✅ README updated with feature info
- ✅ Complex logic has explanatory comments
- ✅ JSONPlaceholder limitations documented
- ✅ Contributing guide updated (if exists)

**Files Modified**:

- `README.md` (enhanced)
- Various source files (comments)
- `CHANGELOG.md` (new or updated)

---

## Task Dependencies Graph

```
Phase 1: Foundation
1.1 (Install UI) ──┬──> 1.2 (Types) ──> 1.3 (Validation) ──┬──> 1.4 (Hook Tests)
                   │                                         │
                   │                                         └──> 1.5 (Hook Impl)
                   │
                   └──> 1.6 (Hashtags) ──> 1.7 (Test Utils)

Phase 2: API & State
1.2 ──> 2.1 (Create Tests) ──> 2.2 (Create Impl) ──> 2.3 (Update) ──> 2.4 (Delete)
                                                          │
                                                          └──> 2.5 (Context Tests) ──> 2.6 (Context Impl)

Phase 3: UI Components
1.5 ──> 3.1 (Form Tests) ──> 3.2 (Form Impl) ──> 3.3 (Dialog)
1.1 ──┬──> 3.4 (Delete Dialog)
      ├──> 3.5 (Detail Modal)
      └──> 3.8 (FAB)

3.6 (Enhance Actions) ──> 3.7 (Enhance Post)

Phase 4: Integration
2.6 + 3.3 + 3.4 ──> 4.1 (App Integration) ──┬──> 4.2 (Wire Actions) ──> 4.5 (E2E Tests)
                                              │
                                              └──> 4.3 (Error Toast) ──> 4.4 (Success Toast)

Phase 5: Polish
All Phase 4 ──> 5.1 (A11y) ──┬──> 5.4 (Docs)
4.5 ──> 5.2 (Performance) ───┤
4.2 ──> 5.3 (Mobile) ─────────┘
```

---

## Testing Requirements Summary

### Coverage Targets

- **Unit Tests**: ≥ 85% coverage for utilities, hooks, services
- **Component Tests**: ≥ 80% coverage for all UI components
- **Integration Tests**: ≥ 80% coverage for CRUD workflows
- **Overall**: ≥ 80% total coverage

### Test Types

1. **Unit Tests**:
   - Validation functions
   - API service functions
   - usePostForm hook
   - Utility functions

2. **Component Tests**:
   - All new components (PostForm, PostDialog, etc.)
   - Enhanced components (Post, PostActions, PostsContext)
   - User interaction scenarios
   - Accessibility attributes

3. **Integration Tests**:
   - End-to-end CRUD flows
   - Optimistic updates
   - Error handling
   - Multi-component interactions

### Test Tools

- Jest 30.2 (test runner)
- React Testing Library 16.3 (component testing)
- @testing-library/user-event 14.6 (user interactions)
- @testing-library/jest-dom (assertions)
- @testing-library/react-hooks (hook testing)

---

## Risk Mitigation

### Risk 1: JSONPlaceholder Limitations

**Impact**: Medium  
**Likelihood**: High  
**Mitigation**:

- Document limitations clearly in code comments
- Implement optimistic UI updates to mask fake persistence
- Consider adding localStorage backup for demo purposes
- Plan for easy migration to real backend (keep API service isolated)

### Risk 2: Bundle Size Increase

**Impact**: Low  
**Likelihood**: Medium  
**Mitigation**:

- Lazy load modals and dialogs (Task 5.2)
- Use tree-shaking friendly imports
- Monitor bundle size during development
- Target < 20KB increase (gzipped)

### Risk 3: Accessibility Issues

**Impact**: High  
**Likelihood**: Low  
**Mitigation**:

- Follow WCAG 2.1 guidelines from start
- Use semantic HTML and ARIA appropriately
- Test with keyboard and screen readers (Task 5.1)
- Run automated a11y tests (axe-core)

### Risk 4: Test Coverage Below Target

**Impact**: Medium  
**Likelihood**: Low  
**Mitigation**:

- Follow TDD strictly (tests first)
- Review coverage after each phase
- Set up CI to enforce coverage minimums
- Prioritize critical path coverage

---

## Implementation Guidelines

### TDD Workflow (Red-Green-Refactor)

1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

### Code Quality Checklist

- [ ] TypeScript: No `any` types, strict mode enabled
- [ ] ESLint: Zero violations
- [ ] Prettier: Auto-formatted
- [ ] SonarQube: Zero critical issues
- [ ] Tests: Coverage targets met
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Performance: No unnecessary re-renders

### Git Workflow

- Create feature branch from `001-crud-operations`
- Commit after each completed task
- Use Conventional Commits format:
  - `feat: add createPost API function`
  - `test: add tests for PostForm component`
  - `fix: resolve validation error display`
  - `refactor: optimize Post component memoization`
  - `docs: update README with CRUD usage`
- Push regularly and create PR when phase complete

### Review Checkpoints

1. **After Phase 1**: Review types, validation, hooks
2. **After Phase 2**: Review API service and context
3. **After Phase 3**: Review UI components and UX
4. **After Phase 4**: Review integration and flows
5. **After Phase 5**: Final review before merge

---

## Success Metrics

### Development Metrics

- ✅ All 30 tasks completed
- ✅ Test coverage ≥ 80%
- ✅ Zero critical SonarQube issues
- ✅ Zero ESLint violations
- ✅ Bundle size increase < 20KB

### User Experience Metrics

- ✅ Create post flow < 30 seconds
- ✅ Edit post flow < 20 seconds
- ✅ Delete post flow < 10 seconds
- ✅ All API responses < 3 seconds
- ✅ Form validation prevents 100% invalid submissions
- ✅ WCAG 2.1 Level AA compliant

### Code Quality Metrics

- ✅ 10 new components created
- ✅ 3 components enhanced
- ✅ 4 API functions added
- ✅ 30+ test files created/enhanced
- ✅ Documentation updated

---

## Next Steps After Completion

1. **Code Review**: Submit PR for `001-crud-operations` branch
2. **QA Testing**: Manual testing of all CRUD flows
3. **Performance Testing**: Verify Core Web Vitals
4. **Accessibility Testing**: Full screen reader test
5. **Documentation Review**: Ensure README is complete
6. **Demo**: Prepare demo video or screenshots
7. **Merge**: Merge to main branch after approval

---

## Notes

- **Estimated Total Time**: 31-43 hours (5-7 working days)
- **Recommended Approach**: Follow phases sequentially, complete all tasks in a phase before moving to next
- **Testing**: Run tests continuously during development (watch mode)
- **Commits**: Commit after each task completion for easy rollback
- **Documentation**: Keep this task list updated with completion status

---

**Generated**: 2026-03-02  
**Command**: `/speckit.tasks`  
**Based on**: [plan.md](./plan.md), [spec.md](./spec.md)

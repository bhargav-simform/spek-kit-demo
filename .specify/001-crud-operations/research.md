# Research: CRUD Operations for Posts

**Feature**: CRUD Operations for Posts  
**Branch**: `001-crud-operations`  
**Date**: 2026-02-27

## Purpose

This document consolidates research findings and technical decisions for implementing CRUD operations in the existing React social media posts application. All "NEEDS CLARIFICATION" items from the Technical Context have been resolved through research and architectural analysis.

## Technical Decisions

### 1. Form Management Approach

**Decision**: Use controlled components with custom React hooks for form state management

**Rationale**:

- Existing codebase already uses React hooks pattern (PostsContext, custom hooks)
- No form library dependencies currently in the project - adding one would increase bundle size
- Simple forms (title + body) don't justify React Hook Form or Formik overhead
- Custom `usePostForm` hook provides type-safe form state with minimal code
- Full control over validation logic and error handling
- Maintains consistency with existing codebase patterns

**Alternatives Considered**:

- **React Hook Form**: Rejected - adds 25KB to bundle, overkill for 2-field forms, would introduce new pattern
- **Formik**: Rejected - larger bundle size (35KB), more complex API, declining popularity
- **Uncontrolled components with refs**: Rejected - harder to test, less React-idiomatic, validation complexity

**Implementation Notes**:

- Create `src/hooks/usePostForm.ts` with form state, validation, and submission logic
- Validation rules: title (1-255 chars), body (1-5000 chars), both required
- Include character count display for user feedback
- Handle loading, error, and success states within the hook

---

### 2. Dialog/Modal Component Strategy

**Decision**: Use shadcn/ui Dialog component (@radix-ui/react-dialog)

**Rationale**:

- Constitution mandates shadcn/ui as primary component library
- Project already includes @radix-ui dependencies (avatar, separator, slot)
- Dialog primitive provides accessible, keyboard-navigable modals out-of-the-box
- Consistent with existing UI component architecture
- Zero-config accessibility (focus trap, ESC to close, ARIA attributes)
- Headless UI pattern allows full styling control with Tailwind

**Alternatives Considered**:

- **Custom modal implementation**: Rejected - reinventing wheel, accessibility complexity, violates constitution
- **React Modal library**: Rejected - duplicates shadcn/ui functionality, violates constitution "no mixing libraries"
- **Native HTML dialog element**: Rejected - browser support concerns, less control, styling limitations

**Implementation Notes**:

- Install shadcn/ui dialog: `npx shadcn@latest add dialog`
- Also install required primitives: `npx shadcn@latest add input textarea label`
- Create three dialog variants: PostDialog (create/edit), DeleteConfirmDialog, PostDetailModal
- Use Dialog.Root, Dialog.Trigger, Dialog.Content, Dialog.Header pattern

---

### 3. API Integration Pattern

**Decision**: Extend existing api.service.ts with createPost, updatePost, deletePost functions

**Rationale**:

- Existing `getPosts()` function already establishes pattern for API interaction
- JSONPlaceholder API supports all CRUD operations (documented at jsonplaceholder.typicode.com/guide)
- Consistent error handling with existing fetch-based approach
- No need for Axios or other HTTP client - native fetch is sufficient
- TypeScript types ensure type safety across service layer

**Alternatives Considered**:

- **React Query/TanStack Query**: Rejected - significant bundle increase (40KB), learning curve, overkill for simple API
- **Axios**: Rejected - unnecessary dependency, fetch API handles all requirements
- **SWR**: Rejected - caching strategy not needed, optimistic updates handled in context layer

**API Endpoints** (JSONPlaceholder):

```
POST   /posts           - Create new post
PUT    /posts/:id       - Update entire post
PATCH  /posts/:id       - Update partial post (preferred - lighter payload)
DELETE /posts/:id       - Delete post
```

**Implementation Notes**:

- Use PATCH for updates (lighter than PUT, only sends changed fields)
- JSONPlaceholder returns simulated responses (doesn't persist) - document this limitation
- Transform responses to match existing Post interface
- Include auto-generation of timestamp, engagement metrics, hashtag extraction
- Assume userId = 1 for all operations (no auth context in current app)

---

### 4. State Management Strategy

**Decision**: Extend existing PostsContext with CRUD operations and optimistic updates

**Rationale**:

- Existing PostsContext already manages posts array and provides context-based state
- Optimistic UI updates improve perceived performance (constitution requirement: <3s API response)
- Context pattern is established and understood in codebase
- No need for Redux/Zustand for this feature scope
- Maintains separation of concerns: context manages state, service handles API

**Optimistic Update Strategy**:

1. **Create**: Immediately add post to top of feed with temporary ID, show loading state
2. **Update**: Immediately update post in array, revert on error
3. **Delete**: Immediately remove from array, restore on error
4. **Error Handling**: Display toast/snackbar, revert optimistic change, allow retry

**Implementation Notes**:

- Add to PostsContext interface: `createPost`, `updatePost`, `deletePost` methods
- Generate temporary IDs using `Date.now()` or crypto.randomUUID()
- Track loading state per-operation (e.g., `deletingPostId: number | null`)
- Provide error state with operation context for better UX

---

### 5. Form Validation Strategy

**Decision**: Client-side validation with custom validation utilities in `lib/validation.ts`

**Rationale**:

- Validation rules are simple and well-defined (character limits, required fields)
- No need for validation library (Yup, Zod) for this scope
- Custom validation functions provide full control and zero dependencies
- Can be unit tested independently
- Reusable across form components

**Validation Rules**:

- Title: Required, 1-255 characters, trim whitespace
- Body: Required, 1-5000 characters, trim whitespace
- Real-time validation on blur and on submit
- Display character count and remaining characters
- Clear error messages below each field

**Implementation Notes**:

```typescript
// lib/validation.ts
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTitle(title: string): ValidationResult;
export function validateBody(body: string): ValidationResult;
export function validatePost(
  title: string,
  body: string
): { isValid: boolean; errors: Record<string, string> };
```

---

### 6. Component Architecture

**Decision**: Composition-based architecture with single-responsibility components

**Rationale**:

- Existing codebase follows component composition (Post, PostHeader, PostContent, PostActions)
- Each dialog/form component should handle one concern
- Promotes reusability and testability
- Easier to maintain and reason about

**Component Hierarchy**:

```
App
└── PostGrid
    └── Post
        ├── PostHeader
        ├── PostContent
        ├── PostActions (enhanced)
        │   ├── Edit button → triggers PostDialog
        │   └── Delete button → triggers DeleteConfirmDialog
        ├── PostDialog (new)
        │   └── PostForm (new)
        ├── DeleteConfirmDialog (new)
        └── PostDetailModal (new)
```

**Implementation Notes**:

- PostDialog: Handles both create and edit modes via props (mode: 'create' | 'edit', initialValues?)
- PostForm: Pure form component, receives values and onChange handlers
- DeleteConfirmDialog: Reusable confirmation dialog accepting title, message, onConfirm
- PostDetailModal: Read-only view of full post with all details

---

### 7. Testing Strategy

**Decision**: Component tests with React Testing Library, integration tests for workflows

**Rationale**:

- Existing test setup uses Jest + React Testing Library
- Constitution requires 80% coverage minimum
- User-centric testing approach (testing behavior, not implementation)
- Integration tests validate complete CRUD workflows

**Test Coverage**:

- **Unit Tests**: Form validation functions, usePostForm hook, API service functions
- **Component Tests**: Each component in isolation with mocked dependencies
- **Integration Tests**: Complete user workflows (create → edit → delete)
- **User Event Tests**: Keyboard navigation, form submission, cancel operations

**Test Cases** (non-exhaustive):

- PostForm: Validation errors, character limits, successful submission, cancel action
- PostDialog: Open/close, mode switching, data persistence
- DeleteConfirmDialog: Confirmation flow, cancel, keyboard ESC
- PostsContext: CRUD operations, optimistic updates, error handling, revert on failure
- api.service: HTTP requests, response transformation, error handling

---

### 8. Accessibility Considerations

**Decision**: WCAG 2.1 Level AA compliance using shadcn/ui primitives and semantic HTML

**Rationale**:

- Constitution mandates WCAG 2.1 AA compliance
- shadcn/ui Dialog component provides built-in a11y (focus trap, ARIA labels, keyboard nav)
- Screen reader announcements for CRUD operation outcomes
- Proper focus management for modal workflows

**Implementation Checklist**:

- ✅ All form inputs have associated labels (using Label primitive)
- ✅ Error messages announced to screen readers (aria-live, aria-describedby)
- ✅ Dialogs have descriptive titles (Dialog.Title)
- ✅ Focus trapped within open dialogs
- ✅ ESC key closes dialogs
- ✅ Focus returns to trigger element on dialog close
- ✅ Buttons have clear, descriptive text (no icon-only buttons without aria-label)
- ✅ Color contrast meets 4.5:1 ratio (using Tailwind's color system)
- ✅ Keyboard navigation for all interactive elements (Tab, Enter, ESC)
- ✅ Loading states communicated (aria-busy, loading indicators)

---

### 9. Performance Optimization

**Decision**: React.memo, useCallback, and code splitting for optimal performance

**Rationale**:

- Constitution requires <2.5s LCP, <100ms FID, <0.1 CLS
- Prevents unnecessary re-renders in grid of posts
- Dialog components lazy-loaded only when needed
- Optimistic updates reduce perceived latency

**Optimizations**:

- Memoize PostForm component to prevent re-renders
- useCallback for all event handlers in forms
- Lazy load dialog components: `const PostDialog = lazy(() => import('./PostDialog'))`
- Debounce character count updates (use existing patterns if applicable)
- Virtual scrolling if post count exceeds 100 (existing PostGrid may already handle)

---

## Dependencies to Add

Based on research, the following dependencies need to be added:

1. **shadcn/ui components** (via CLI):

   ```bash
   npx shadcn@latest add dialog
   npx shadcn@latest add input
   npx shadcn@latest add textarea
   npx shadcn@latest add label
   ```

   - These are copied into `src/components/ui/` (no npm install needed)
   - Based on @radix-ui primitives (already in dependencies)

2. **No new npm dependencies required** - all functionality achievable with existing tech stack

---

## Risks & Mitigations

| Risk                                     | Impact | Likelihood | Mitigation                                                    |
| ---------------------------------------- | ------ | ---------- | ------------------------------------------------------------- |
| JSONPlaceholder doesn't persist data     | Medium | Certain    | Document limitation, consider local storage fallback for demo |
| Form validation edge cases               | Low    | Medium     | Comprehensive unit tests, user testing                        |
| Optimistic update race conditions        | Medium | Low        | Implement request cancellation, unique temp IDs               |
| Accessibility gaps in custom components  | High   | Low        | Use shadcn/ui primitives, automated a11y tests                |
| Bundle size increase affects performance | Medium | Low        | Code splitting, lazy loading, bundle analysis in CI           |

---

## Open Questions Resolved

All initial questions from Technical Context have been resolved through research. No remaining blockers for Phase 1 design.

## Next Steps

Proceed to **Phase 1: Design & Contracts**

- Create data-model.md defining entities and validation rules
- Define API contracts in contracts/api-contracts.md
- Define component interfaces in contracts/component-contracts.md
- Create quickstart.md for developer onboarding

# Component Contracts: CRUD Operations

**Feature**: CRUD Operations for Posts  
**Branch**: `001-crud-operations`  
**Date**: 2026-02-27

## Overview

This document defines the interfaces (props, state, and behavior) for all React components involved in CRUD operations. These contracts ensure consistent component APIs and facilitate testing and maintenance.

---

## Component Hierarchy

```
App
└── PostGrid
    └── Post (enhanced)
        ├── PostHeader
        ├── PostContent
        ├── PostActions (enhanced)
        │   ├── [Edit Button] → triggers PostDialog
        │   ├── [Delete Button] → triggers DeleteConfirmDialog
        │   └── [existing actions]
        ├── PostDialog (new)
        │   └── PostForm (new)
        ├── DeleteConfirmDialog (new)
        └── PostDetailModal (new)
```

---

## New Components

### 1. PostForm

**Purpose**: Reusable form component for creating and editing posts. Handles input, validation, and submission.

**File**: `src/components/PostForm/PostForm.tsx`

**Props Interface**:

```typescript
export interface PostFormProps {
  mode: 'create' | 'edit';
  initialValues?: {
    title: string;
    body: string;
  };
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
```

**Prop Descriptions**:

- `mode`: Determines form behavior (create new vs edit existing)
- `initialValues`: Pre-fill form for edit mode (optional for create mode)
- `onSubmit`: Async callback when form is submitted with valid data
- `onCancel`: Callback when user cancels the form
- `isSubmitting`: External loading state (disables form during submission)

**Internal State**:

```typescript
interface PostFormState {
  title: string;
  body: string;
  errors: {
    title?: string;
    body?: string;
    submit?: string;
  };
  touched: {
    title: boolean;
    body: boolean;
  };
}
```

**Behavior**:

- Validates title and body on blur and on submit
- Displays character count for both fields (title: 255, body: 5000)
- Shows validation errors below each field
- Disables submit button when validation fails or when submitting
- Clears form after successful creation (not after edit)
- Calls onCancel when cancel button clicked or ESC pressed

**Accessibility**:

- All inputs have associated labels
- Error messages have `role="alert"` and `aria-live="polite"`
- Character counts have `aria-live="polite"`
- Submit button has `aria-busy={isSubmitting}`

**Example Usage**:

```tsx
<PostForm
  mode="create"
  onSubmit={async values => {
    await createPost(values);
  }}
  onCancel={closeDialog}
  isSubmitting={creatingPost}
/>
```

---

### 2. PostDialog

**Purpose**: Modal dialog wrapper for PostForm. Handles dialog state and submission coordination.

**File**: `src/components/PostDialog/PostDialog.tsx`

**Props Interface**:

```typescript
export interface PostDialogProps {
  mode: 'create' | 'edit';
  post?: Post; // Required for edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
}
```

**Prop Descriptions**:

- `mode`: Create or edit mode
- `post`: Existing post data (required for edit mode)
- `open`: Controlled open state
- `onOpenChange`: Callback when dialog open state changes
- `onSubmit`: Async callback for form submission

**Behavior**:

- Renders Dialog with PostForm inside
- Dialog title changes based on mode ("Create Post" vs "Edit Post")
- Closes dialog automatically after successful submission
- Prevents closing while submitting (isSubmitting state)
- Resets form state when dialog closes after edit (not after create)

**Accessibility**:

- Uses shadcn/ui Dialog component (full a11y support)
- Focus trapped within dialog
- ESC key closes dialog (unless submitting)
- Focus returns to trigger element on close

**Example Usage**:

```tsx
<PostDialog
  mode="edit"
  post={selectedPost}
  open={isEditDialogOpen}
  onOpenChange={setIsEditDialogOpen}
  onSubmit={async values => {
    await updatePost({ id: selectedPost.id, ...values });
  }}
/>
```

---

### 3. DeleteConfirmDialog

**Purpose**: Reusable confirmation dialog for destructive actions (primarily post deletion).

**File**: `src/components/DeleteConfirmDialog/DeleteConfirmDialog.tsx`

**Props Interface**:

```typescript
export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string; // Default: "Delete"
  cancelText?: string; // Default: "Cancel"
  isDeleting?: boolean;
}
```

**Prop Descriptions**:

- `open`: Controlled open state
- `onOpenChange`: Callback when dialog open state changes
- `onConfirm`: Async callback when user confirms deletion
- `title`: Dialog title (e.g., "Delete Post?")
- `description`: Warning message (e.g., "This action cannot be undone.")
- `confirmText`: Custom text for confirm button
- `cancelText`: Custom text for cancel button
- `isDeleting`: Loading state (disables buttons during deletion)

**Behavior**:

- Renders warning icon (AlertTriangle from lucide-react)
- Confirm button styled as destructive (red)
- Disables both buttons when deleting
- Shows loading spinner on confirm button when deleting
- Closes automatically after successful confirmation
- ESC key closes dialog (unless deleting)

**Accessibility**:

- Uses shadcn/ui Dialog component
- Warning icon has `aria-hidden="true"`
- Confirm button has `aria-busy={isDeleting}`
- Focus on cancel button by default (safer default)

**Example Usage**:

```tsx
<DeleteConfirmDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  onConfirm={async () => {
    await deletePost(selectedPost.id);
  }}
  title="Delete Post?"
  description="This will permanently delete this post. This action cannot be undone."
  isDeleting={deletingPostId === selectedPost.id}
/>
```

---

### 4. PostDetailModal

**Purpose**: Display complete post details in a modal. Useful for viewing full content that may be truncated in grid view.

**File**: `src/components/PostDetailModal/PostDetailModal.tsx`

**Props Interface**:

```typescript
export interface PostDetailModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLike?: (postId: number) => void; // Optional like functionality in modal
  onEdit?: (post: Post) => void; // Optional edit action
  onDelete?: (post: Post) => void; // Optional delete action
}
```

**Prop Descriptions**:

- `post`: Post data to display
- `open`: Controlled open state
- `onOpenChange`: Callback when dialog open state changes
- `onLike`: Optional callback for liking post within modal
- `onEdit`: Optional callback to open edit dialog
- `onDelete`: Optional callback to open delete dialog

**Behavior**:

- Renders full post content (no truncation)
- Displays user info, timestamp, engagement metrics
- Shows all hashtags as clickable badges
- Includes like button (if onLike provided)
- Includes edit/delete actions (if callbacks provided)
- ESC key closes modal

**Layout**:

```
┌─────────────────────────────────────┐
│ [X Close]                           │
│                                     │
│ [Avatar] User Name                  │
│          @username                  │
│          2 hours ago                │
│                                     │
│ ──────────────────────────────────  │
│                                     │
│ Full Post Title                     │
│                                     │
│ Full post body content with no      │
│ truncation. All text is visible     │
│ including #hashtags and emojis.     │
│                                     │
│ #hashtag1 #hashtag2 #hashtag3       │
│                                     │
│ ──────────────────────────────────  │
│                                     │
│ ❤️ 42 likes  💬 12 comments         │
│ 🔄 5 shares                          │
│                                     │
│ [Like] [Edit] [Delete]              │
└─────────────────────────────────────┘
```

**Accessibility**:

- Uses shadcn/ui Dialog component
- All interactive elements keyboard accessible
- Hashtags are focusable links/buttons
- Action buttons have clear labels

**Example Usage**:

```tsx
<PostDetailModal
  post={selectedPost}
  open={isDetailModalOpen}
  onOpenChange={setIsDetailModalOpen}
  onLike={toggleLike}
  onEdit={post => openEditDialog(post)}
  onDelete={post => openDeleteDialog(post)}
/>
```

---

## Enhanced Components

### 5. PostActions (Enhanced)

**Purpose**: Action buttons for post (Like, Edit, Delete). Enhanced to include Edit and Delete actions.

**File**: `src/components/PostActions/PostActions.tsx` (existing, will be modified)

**Current Props**:

```typescript
export interface PostActionsProps {
  postId: number;
  isLiked: boolean;
  onLike: (postId: number) => void;
}
```

**Enhanced Props**:

```typescript
export interface PostActionsProps {
  postId: number;
  isLiked: boolean;
  onLike: (postId: number) => void;
  onEdit?: (postId: number) => void; // NEW
  onDelete?: (postId: number) => void; // NEW
}
```

**Behavior Changes**:

- Add Edit button (pencil icon) that calls onEdit when clicked
- Add Delete button (trash icon) that calls onDelete when clicked
- Edit/Delete buttons only shown if callbacks provided (optional for backward compatibility)
- All buttons have hover states and tooltips

**Accessibility**:

- Edit button: `aria-label="Edit post"`
- Delete button: `aria-label="Delete post"`

**Example Usage**:

```tsx
<PostActions
  postId={post.id}
  isLiked={post.isLiked}
  onLike={handleLike}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### 6. Post (Enhanced)

**Purpose**: Post card component. Enhanced to support click-to-view-details.

**File**: `src/components/Post/Post.tsx` (existing, will be modified)

**Current Props**:

```typescript
export interface PostProps {
  post: Post;
  onLike: (postId: number) => void;
}
```

**Enhanced Props** (optional enhancement):

```typescript
export interface PostProps {
  post: Post;
  onLike: (postId: number) => void;
  onViewDetails?: (post: Post) => void; // NEW - Optional click handler
}
```

**Behavior Changes**:

- If `onViewDetails` provided, entire card becomes clickable
- Add subtle hover effect to indicate clickability
- `cursor: pointer` when onViewDetails present
- Clicking card calls onViewDetails (opens PostDetailModal)
- Preserve existing like button functionality (event propagation stopped)

**Accessibility**:

- If clickable, wrap in button or add role="button" with keyboard support
- `aria-label="View post details: {post.title}"`

**Example Usage**:

```tsx
<Post post={post} onLike={handleLike} onViewDetails={handleViewDetails} />
```

---

## Shared UI Components (shadcn/ui)

### 7. Dialog (from shadcn/ui)

**Installation**: `npx shadcn@latest add dialog`

**Usage Pattern**:

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog body */}
  </DialogContent>
</Dialog>;
```

---

### 8. Input, Textarea, Label (from shadcn/ui)

**Installation**:

```bash
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
```

**Usage Pattern**:

```tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="title">Title</Label>
  <Input
    id="title"
    value={title}
    onChange={e => setTitle(e.target.value)}
    aria-invalid={!!errors.title}
    aria-describedby={errors.title ? 'title-error' : undefined}
  />
  {errors.title && (
    <p id="title-error" className="text-sm text-red-600" role="alert">
      {errors.title}
    </p>
  )}
</div>;
```

---

## Custom Hooks

### 9. usePostForm

**Purpose**: Encapsulates form state management, validation, and submission logic.

**File**: `src/hooks/usePostForm.ts`

**Interface**:

```typescript
export interface UsePostFormOptions {
  initialValues?: {
    title: string;
    body: string;
  };
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
  mode: 'create' | 'edit';
}

export interface UsePostFormReturn {
  values: {
    title: string;
    body: string;
  };
  errors: {
    title?: string;
    body?: string;
    submit?: string;
  };
  touched: {
    title: boolean;
    body: boolean;
  };
  isSubmitting: boolean;
  handleChange: (
    field: 'title' | 'body'
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (field: 'title' | 'body') => () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function usePostForm(options: UsePostFormOptions): UsePostFormReturn;
```

**Behavior**:

- Manages form values, errors, touched state, and submission state
- Validates fields on blur and on submit
- Calls onSubmit callback with validated values
- Handles async submission and error state
- Provides reset function to clear form (useful after create)

**Example Usage**:

```tsx
function PostForm({ mode, initialValues, onSubmit, onCancel }) {
  const form = usePostForm({
    initialValues,
    onSubmit,
    mode,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        value={form.values.title}
        onChange={form.handleChange('title')}
        onBlur={form.handleBlur('title')}
      />
      {form.touched.title && form.errors.title && (
        <span>{form.errors.title}</span>
      )}
      {/* ...rest of form */}
    </form>
  );
}
```

---

## Context Enhancements

### 10. PostsContext (Enhanced)

**Purpose**: Global state management for posts. Enhanced to include CRUD operations.

**File**: `src/contexts/PostsContext.tsx` (existing, will be modified)

**Current Interface**:

```typescript
interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  toggleLike: (postId: number) => void;
  refreshPosts: () => Promise<void>;
}
```

**Enhanced Interface**:

```typescript
interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  toggleLike: (postId: number) => void;
  refreshPosts: () => Promise<void>;

  // NEW CRUD operations
  createPost: (request: CreatePostRequest) => Promise<void>;
  updatePost: (request: UpdatePostRequest) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;

  // NEW loading states
  creatingPost: boolean;
  updatingPostId: number | null;
  deletingPostId: number | null;
}
```

**New Method Behaviors**:

#### createPost

```typescript
async createPost(request: CreatePostRequest): Promise<void>
```

- Sets `creatingPost = true`
- Generates temporary post with temp ID (Date.now())
- Adds temp post to top of posts array (optimistic update)
- Calls `api.service.createPost(request)`
- On success: Replace temp post with API response
- On error: Remove temp post, set error state, reject promise
- Finally: Set `creatingPost = false`

#### updatePost

```typescript
async updatePost(request: UpdatePostRequest): Promise<void>
```

- Sets `updatingPostId = request.id`
- Finds existing post in array
- Saves original post (for rollback on error)
- Updates post in array (optimistic update)
- Calls `api.service.updatePost(request)`
- On success: Keep updated post
- On error: Restore original post, set error state, reject promise
- Finally: Set `updatingPostId = null`

#### deletePost

```typescript
async deletePost(postId: number): Promise<void>
```

- Sets `deletingPostId = postId`
- Finds post in array
- Removes post from array (optimistic update)
- Saves removed post (for rollback on error)
- Calls `api.service.deletePost(postId)`
- On success: Keep removed
- On error: Restore post to array, set error state, reject promise
- Finally: Set `deletingPostId = null`

---

## Testing Contracts

### Component Test Structure

Each component should have corresponding test file following this pattern:

```typescript
describe('ComponentName', () => {
  describe('rendering', () => {
    it('should render with required props', () => {});
    it('should render in different modes/states', () => {});
  });

  describe('user interactions', () => {
    it('should handle form input', () => {});
    it('should call callbacks when actions performed', () => {});
    it('should validate user input', () => {});
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {});
    it('should be keyboard navigable', () => {});
    it('should trap focus in dialog', () => {});
  });

  describe('error handling', () => {
    it('should display validation errors', () => {});
    it('should handle submission errors', () => {});
  });
});
```

### Example Test Cases

#### PostForm Tests

```typescript
it('should display validation error for empty title', async () => {
  const { getByLabelText, getByText } = render(<PostForm {...props} />);

  const titleInput = getByLabelText(/title/i);
  fireEvent.blur(titleInput);

  expect(getByText(/title is required/i)).toBeInTheDocument();
});

it('should call onSubmit with valid data', async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  const { getByLabelText, getByRole } = render(
    <PostForm mode="create" onSubmit={onSubmit} onCancel={jest.fn()} />
  );

  fireEvent.change(getByLabelText(/title/i), { target: { value: 'Test Title' } });
  fireEvent.change(getByLabelText(/body/i), { target: { value: 'Test Body' } });
  fireEvent.click(getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      body: 'Test Body',
    });
  });
});
```

---

## Next Steps

With component contracts defined, proceed to:

1. Create developer quickstart guide in `quickstart.md`
2. Begin implementation following TDD principles (tests first)

import { usePostForm } from '@/hooks/usePostForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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

const MAX_TITLE_LENGTH = 255;
const MAX_BODY_LENGTH = 5000;

export function PostForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting: externalIsSubmitting,
}: PostFormProps) {
  const form = usePostForm({
    mode,
    initialValues,
    onSubmit,
  });

  const isSubmitting = externalIsSubmitting ?? form.isSubmitting;
  const hasErrors = !!form.errors.title || !!form.errors.body;

  const titleLength = form.values.title.length;
  const bodyLength = form.values.body.length;

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="post-title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="post-title"
          type="text"
          value={form.values.title}
          onChange={form.handleChange('title')}
          onBlur={form.handleBlur('title')}
          disabled={isSubmitting}
          aria-invalid={form.touched.title && !!form.errors.title}
          aria-describedby={
            form.touched.title && form.errors.title
              ? 'title-error'
              : 'title-char-count'
          }
          placeholder="Enter post title"
        />
        <div className="flex justify-between items-center text-sm">
          {form.touched.title && form.errors.title ? (
            <p
              id="title-error"
              className="text-red-600"
              role="alert"
              aria-live="polite"
            >
              {form.errors.title}
            </p>
          ) : (
            <div />
          )}
          <p
            id="title-char-count"
            className={`text-gray-500 ${
              titleLength > MAX_TITLE_LENGTH ? 'text-red-600' : ''
            }`}
            aria-live="polite"
          >
            {titleLength}/{MAX_TITLE_LENGTH}
          </p>
        </div>
      </div>

      {/* Body Field */}
      <div className="space-y-2">
        <Label htmlFor="post-body">
          Body <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="post-body"
          value={form.values.body}
          onChange={form.handleChange('body')}
          onBlur={form.handleBlur('body')}
          disabled={isSubmitting}
          rows={6}
          aria-invalid={form.touched.body && !!form.errors.body}
          aria-describedby={
            form.touched.body && form.errors.body
              ? 'body-error'
              : 'body-char-count'
          }
          placeholder="What's on your mind?"
        />
        <div className="flex justify-between items-center text-sm">
          {form.touched.body && form.errors.body ? (
            <p
              id="body-error"
              className="text-red-600"
              role="alert"
              aria-live="polite"
            >
              {form.errors.body}
            </p>
          ) : (
            <div />
          )}
          <p
            id="body-char-count"
            className={`text-gray-500 ${
              bodyLength > MAX_BODY_LENGTH ? 'text-red-600' : ''
            }`}
            aria-live="polite"
          >
            {bodyLength}/{MAX_BODY_LENGTH}
          </p>
        </div>
      </div>

      {/* Submit Error */}
      {form.errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600" role="alert">
            {form.errors.submit}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || hasErrors}
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : mode === 'create'
              ? 'Create Post'
              : 'Update Post'}
        </Button>
      </div>
    </form>
  );
}

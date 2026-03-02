import { useState } from 'react';
import { PostForm } from '@/components/PostForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Post } from '@/types/post.types';

export interface PostDialogProps {
  mode: 'create' | 'edit';
  post?: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
}

export function PostDialog({
  mode,
  post,
  open,
  onOpenChange,
  onSubmit,
}: PostDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { title: string; body: string }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Close dialog after successful submission
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const initialValues =
    mode === 'edit' && post
      ? {
          title: post.title,
          body: post.body,
        }
      : undefined;

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Post' : 'Edit Post'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Share your thoughts with the community'
              : 'Update your post content'}
          </DialogDescription>
        </DialogHeader>
        <PostForm
          mode={mode}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

import React from 'react';
import { PostHeader } from '@/components/PostHeader';
import { PostContent } from '@/components/PostContent';
import { PostActions } from '@/components/PostActions';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Post as PostType } from '@/types/post.types';

export interface PostProps {
  post: PostType;
  onLike: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onMenu?: (postId: number) => void;
  onEdit?: (post: PostType) => void;
  onDelete?: (post: PostType) => void;
  className?: string;
}

/**
 * Post component - Main card component composing all post elements
 * Represents a complete social media post with header, content, and actions
 */
export const Post: React.FC<PostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onMenu,
  onEdit,
  onDelete,
  className,
}) => {
  // If no user data, create a placeholder (shouldn't happen but defensive)
  const user = post.user || {
    id: post.userId,
    name: 'Unknown User',
    username: 'unknown',
    email: '',
  };

  return (
    <article className={cn('w-full', className)}>
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Header: Avatar, Name, Username, Timestamp, Menu */}
          <PostHeader
            user={user}
            createdAt={post.timestamp.toISOString()}
            onMenuClick={onMenu ? () => onMenu(post.id) : undefined}
          />

          <Separator />

          {/* Content: Text with hashtags, optional image */}
          <PostContent content={post.body} imageUrl={post.imageUrl} />

          <Separator />

          {/* Actions: Like, Comment, Share buttons + Engagement metrics */}
          <PostActions
            engagement={post.engagement}
            isLiked={post.isLiked}
            onLike={() => onLike(post.id)}
            onComment={onComment ? () => onComment(post.id) : undefined}
            onShare={onShare ? () => onShare(post.id) : undefined}
            onEdit={onEdit ? () => onEdit(post) : undefined}
            onDelete={onDelete ? () => onDelete(post) : undefined}
          />
        </CardContent>
      </Card>
    </article>
  );
};

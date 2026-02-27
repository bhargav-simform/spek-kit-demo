import React from 'react';
import { FileText } from 'lucide-react';
import { Post } from '@/components/Post';
import { cn } from '@/lib/utils';
import type { Post as PostType } from '@/types/post.types';

export interface PostGridProps {
  posts: PostType[];
  onLike: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onMenu?: (postId: number) => void;
  className?: string;
}

/**
 * PostGrid component - Responsive grid layout for displaying posts
 * 1 column on mobile, 2 on tablet, 3 on desktop
 */
export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  onLike,
  onComment,
  onShare,
  onMenu,
  className,
}) => {
  // Empty state
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <FileText className="h-16 w-16 text-gray-300 mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          No posts yet
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          Posts will appear here once they're available.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min',
        className
      )}
    >
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onMenu={onMenu}
        />
      ))}
    </div>
  );
};

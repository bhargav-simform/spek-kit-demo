import React from 'react';
import { MessageCircle, Share2 } from 'lucide-react';
import { LikeButton } from '@/components/LikeButton';
import { EngagementMetrics } from '@/components/EngagementMetrics';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Engagement } from '@/types/post.types';

export interface PostActionsProps {
  engagement: Engagement;
  isLiked: boolean;
  onLike: () => void;
  onComment?: () => void;
  onShare?: () => void;
  className?: string;
}

/**
 * PostActions component displays interactive buttons (like, comment, share)
 * and engagement metrics for a post
 */
export const PostActions: React.FC<PostActionsProps> = ({
  engagement,
  isLiked,
  onLike,
  onComment,
  onShare,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <LikeButton isLiked={isLiked} onClick={onLike} />

        <Button
          variant="ghost"
          size="sm"
          onClick={onComment}
          aria-label="Comment"
          className="text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          aria-label="Share"
          className="text-gray-500 hover:text-green-500 transition-colors"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      {/* Engagement metrics */}
      <EngagementMetrics engagement={engagement} />
    </div>
  );
};

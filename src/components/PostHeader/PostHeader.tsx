import React from 'react';
import { MoreVertical } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { PostTimestamp } from '@/components/PostTimestamp';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User } from '@/types/post.types';

export interface PostHeaderProps {
  user: User;
  createdAt: string;
  onMenuClick?: () => void;
  className?: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  createdAt,
  onMenuClick,
  className,
}) => {
  const date = new Date(createdAt);

  return (
    <header className={cn('flex items-start justify-between gap-3', className)}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <UserAvatar username={user.name} size="md" />

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
              @{user.username}
            </span>
          </div>

          <PostTimestamp date={date} />
        </div>
      </div>

      {onMenuClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          aria-label="Post options"
          className="flex-shrink-0 -mt-1 -mr-1"
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </header>
  );
};

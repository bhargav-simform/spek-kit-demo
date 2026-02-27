import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  onClick,
  disabled = false,
  className,
  ariaLabel,
}) => {
  const label = ariaLabel || (isLiked ? 'Unlike' : 'Like');

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isLiked}
      className={cn(
        'transition-colors',
        isLiked && 'text-red-500 hover:text-red-600',
        !isLiked && 'text-gray-500 hover:text-red-500',
        className
      )}
    >
      <Heart
        className={cn('h-5 w-5 transition-all', isLiked && 'fill-current')}
        aria-hidden="true"
      />
    </Button>
  );
};

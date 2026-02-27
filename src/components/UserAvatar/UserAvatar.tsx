import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  username: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Get initials from username
 */
function getInitials(name: string): string {
  // Split by spaces and hyphens
  const words = name
    .trim()
    .split(/[\s-]+/)
    .filter(word => word.length > 0);
  if (words.length === 0) {
    return '?';
  }
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  // Take first letter of first word and first letter of last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * UserAvatar component displays user profile picture with fallback to initials
 */
export function UserAvatar({
  username,
  imageUrl,
  size = 'md',
  className,
}: UserAvatarProps) {
  const initials = getInitials(username);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={`${username}'s avatar`} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

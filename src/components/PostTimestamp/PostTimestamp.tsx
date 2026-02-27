import { formatDistanceToNow, format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

export interface PostTimestampProps {
  date: Date;
  className?: string;
}

/**
 * PostTimestamp component displays relative or formatted time
 * Uses semantic HTML time element with datetime attribute
 */
export function PostTimestamp({ date, className }: PostTimestampProps) {
  // Handle invalid dates
  if (!isValid(date)) {
    return (
      <time className={cn('text-sm text-muted-foreground', className)}>
        Invalid date
      </time>
    );
  }

  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  // Show relative time for posts within last 7 days
  const displayText =
    diffInDays < 7
      ? formatDistanceToNow(date, { addSuffix: true })
      : format(date, 'MMM d, yyyy');

  return (
    <time
      dateTime={date.toISOString()}
      className={cn('text-sm text-muted-foreground', className)}
      title={format(date, 'PPpp')} // Full date on hover
    >
      {displayText}
    </time>
  );
}

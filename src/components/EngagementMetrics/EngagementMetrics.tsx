import { MessageCircle, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Engagement } from '@/types/post.types';

export interface EngagementMetricsProps {
  engagement: Engagement;
  className?: string;
}

/**
 * Format large numbers to K/M format
 */
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * EngagementMetrics component displays likes, comments, and shares counts
 */
export function EngagementMetrics({
  engagement,
  className,
}: EngagementMetricsProps) {
  const metrics = [
    {
      icon: Heart,
      count: engagement.likes,
      label: 'likes',
    },
    {
      icon: MessageCircle,
      count: engagement.comments,
      label: 'comments',
    },
    {
      icon: Share2,
      count: engagement.shares,
      label: 'shares',
    },
  ];

  return (
    <div
      className={cn(
        'flex items-center gap-4 text-sm text-muted-foreground',
        className
      )}
    >
      {metrics.map(({ icon: Icon, count, label }) => (
        <div
          key={label}
          className="flex items-center gap-1"
          aria-label={`${count} ${label}`}
        >
          <Icon className="h-4 w-4" />
          <span>{formatCount(count)}</span>
        </div>
      ))}
    </div>
  );
}

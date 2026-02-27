import React from 'react';
import { cn } from '@/lib/utils';

export interface PostContentProps {
  content: string;
  imageUrl?: string;
  className?: string;
}

/**
 * Render text content with highlighted hashtags
 * Splits text by hashtag pattern and wraps hashtags in styled spans
 */
function renderContentWithHashtags(content: string): React.ReactNode {
  if (!content) return null;

  // Match hashtags: # followed by alphanumeric characters or underscore
  const hashtagRegex = /(#\w+)/g;
  const parts = content.split(hashtagRegex);

  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <span
          key={index}
          className="text-blue-500 dark:text-blue-400 font-medium"
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * PostContent component displays post text with hashtag highlighting
 * and optional image attachments
 */
export const PostContent: React.FC<PostContentProps> = ({
  content,
  imageUrl,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {content && (
        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
          {renderContentWithHashtags(content)}
        </p>
      )}

      {imageUrl && (
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt="Post image"
            className="w-full h-auto max-h-96 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

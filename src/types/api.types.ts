/**
 * API Error interface
 */
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Loading state types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Sort options for posts
 */
export const SortOption = {
  NEWEST: 'newest',
  MOST_LIKED: 'mostLiked',
} as const;

export type SortOption = (typeof SortOption)[keyof typeof SortOption];

/**
 * Filter options for posts
 */
export const FilterOption = {
  ALL: 'all',
  LIKED: 'liked',
} as const;

export type FilterOption = (typeof FilterOption)[keyof typeof FilterOption];

/**
 * API response wrapper
 */
export interface APIResponse<T> {
  data: T | null;
  error: APIError | null;
  loading: boolean;
}

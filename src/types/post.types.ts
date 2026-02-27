/**
 * User interface matching JSONPlaceholder user structure
 */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

/**
 * Comment interface matching JSONPlaceholder comment structure
 */
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

/**
 * Engagement metrics for a post
 */
export interface Engagement {
  likes: number;
  comments: number;
  shares: number;
}

/**
 * Post interface combining JSONPlaceholder data with additional fields
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  user?: User;
  engagement: Engagement;
  isLiked: boolean;
  timestamp: Date;
  imageUrl?: string;
  hashtags: string[];
}

/**
 * JSONPlaceholder post response
 */
export interface JSONPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

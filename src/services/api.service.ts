import type {
  Post,
  User,
  Comment,
  JSONPlaceholderPost,
} from '@/types/post.types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Extract hashtags from text
 */
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  if (!matches) return [];
  return matches.map(tag => tag.slice(1)); // Remove # symbol
}

/**
 * Generate random engagement metrics
 */
function generateEngagement() {
  return {
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
  };
}

/**
 * Transform JSONPlaceholder post to our Post format
 */
function transformPost(post: JSONPlaceholderPost): Post {
  const fullText = `${post.title} ${post.body}`;
  const hashtags = extractHashtags(fullText);

  return {
    ...post,
    engagement: generateEngagement(),
    isLiked: false,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
    hashtags,
    imageUrl: undefined, // JSONPlaceholder doesn't provide images
  };
}

/**
 * Fetch all posts from JSONPlaceholder API
 */
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: JSONPlaceholderPost[] = await response.json();
  return data.map(transformPost);
}

/**
 * Fetch all users from JSONPlaceholder API
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch comments for a specific post
 */
export async function getComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

import { render, screen, waitFor, act } from '@testing-library/react';
import { PostsProvider, usePosts } from './PostsContext';
import * as apiService from '@/services/api.service';
import type { Post } from '@/types/post.types';

// Mock API service
jest.mock('@/services/api.service');

const mockPosts: Post[] = [
  {
    userId: 1,
    id: 1,
    title: 'Test Post 1',
    body: 'Test body 1',
    engagement: { likes: 10, comments: 5, shares: 2 },
    isLiked: false,
    timestamp: new Date(),
    hashtags: [],
  },
  {
    userId: 1,
    id: 2,
    title: 'Test Post 2',
    body: 'Test body 2',
    engagement: { likes: 20, comments: 10, shares: 5 },
    isLiked: false,
    timestamp: new Date(),
    hashtags: [],
  },
];

// Test component to access context
function TestComponent() {
  const { posts, loading, error, toggleLike } = usePosts();

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="posts-count">{posts.length}</div>
      {posts.map(post => (
        <div key={post.id} data-testid={`post-${post.id}`}>
          <div data-testid={`post-${post.id}-title`}>{post.title}</div>
          <div data-testid={`post-${post.id}-liked`}>
            {post.isLiked ? 'Liked' : 'Not Liked'}
          </div>
          <button onClick={() => toggleLike(post.id)}>Toggle Like</button>
        </div>
      ))}
    </div>
  );
}

describe('PostsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PostsProvider', () => {
    it('should provide initial state', () => {
      (apiService.getPosts as jest.Mock).mockResolvedValue(mockPosts);

      render(
        <PostsProvider>
          <TestComponent />
        </PostsProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
      expect(screen.getByTestId('posts-count')).toHaveTextContent('0');
    });

    it('should fetch posts on mount', async () => {
      (apiService.getPosts as jest.Mock).mockResolvedValue(mockPosts);

      render(
        <PostsProvider>
          <TestComponent />
        </PostsProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('posts-count')).toHaveTextContent('2');
      expect(screen.getByTestId('post-1-title')).toHaveTextContent(
        'Test Post 1'
      );
    });

    it('should handle loading state correctly', async () => {
      (apiService.getPosts as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockPosts), 100))
      );

      render(
        <PostsProvider>
          <TestComponent />
        </PostsProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
    });

    it('should handle error state', async () => {
      const errorMessage = 'Failed to fetch posts';
      (apiService.getPosts as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      render(
        <PostsProvider>
          <TestComponent />
        </PostsProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });

      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    it('should toggle like status', async () => {
      (apiService.getPosts as jest.Mock).mockResolvedValue(mockPosts);

      render(
        <PostsProvider>
          <TestComponent />
        </PostsProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('post-1-liked')).toHaveTextContent(
          'Not Liked'
        );
      });

      const toggleButton = screen.getAllByText('Toggle Like')[0];

      act(() => {
        toggleButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('post-1-liked')).toHaveTextContent('Liked');
      });

      // Toggle again
      act(() => {
        toggleButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('post-1-liked')).toHaveTextContent(
          'Not Liked'
        );
      });
    });
  });

  describe('usePosts hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('usePosts must be used within a PostsProvider');

      spy.mockRestore();
    });
  });
});

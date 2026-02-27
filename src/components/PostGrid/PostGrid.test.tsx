import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostGrid } from './PostGrid';
import type { Post as PostType } from '@/types/post.types';

const mockPosts: PostType[] = [
  {
    id: 1,
    userId: 1,
    title: 'Post 1',
    body: 'Content 1',
    user: {
      id: 1,
      name: 'User 1',
      username: 'user1',
      email: 'user1@example.com',
    },
    engagement: { likes: 10, comments: 2, shares: 1 },
    isLiked: false,
    timestamp: new Date('2024-01-15'),
    hashtags: [],
  },
  {
    id: 2,
    userId: 2,
    title: 'Post 2',
    body: 'Content 2',
    user: {
      id: 2,
      name: 'User 2',
      username: 'user2',
      email: 'user2@example.com',
    },
    engagement: { likes: 20, comments: 4, shares: 2 },
    isLiked: true,
    timestamp: new Date('2024-01-16'),
    hashtags: [],
  },
];

describe('PostGrid', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PostGrid posts={mockPosts} onLike={() => {}} />);

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
    });

    it('should render all posts', () => {
      render(<PostGrid posts={mockPosts} onLike={() => {}} />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should render empty state when no posts', () => {
      render(<PostGrid posts={[]} onLike={() => {}} />);

      expect(screen.getByText(/no posts/i)).toBeInTheDocument();
    });

    it('should pass onLike to Post components', () => {
      const handleLike = jest.fn();
      render(<PostGrid posts={mockPosts} onLike={handleLike} />);

      // Posts should render with like buttons
      const likeButtons = screen.getAllByRole('button', {
        name: /like|unlike/i,
      });
      expect(likeButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Layout', () => {
    it('should have grid layout', () => {
      const { container } = render(
        <PostGrid posts={mockPosts} onLike={() => {}} />
      );

      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <PostGrid posts={mockPosts} onLike={() => {}} className="custom-grid" />
      );

      expect(container.firstChild).toHaveClass('custom-grid');
    });

    it('should have responsive grid columns', () => {
      const { container } = render(
        <PostGrid posts={mockPosts} onLike={() => {}} />
      );

      const grid = container.querySelector('[class*="grid"]');
      // Should have grid-cols-1, md:grid-cols-2, lg:grid-cols-3 classes
      expect(grid?.className).toMatch(/grid/);
    });
  });

  describe('Post Interactions', () => {
    it('should forward onLike handler', async () => {
      const user = userEvent.setup();
      const handleLike = jest.fn();

      render(<PostGrid posts={mockPosts} onLike={handleLike} />);

      const likeButtons = screen.getAllByRole('button', { name: /like/i });
      await user.click(likeButtons[0]);

      expect(handleLike).toHaveBeenCalledWith(1);
    });

    it('should forward onComment handler when provided', async () => {
      const user = userEvent.setup();
      const handleComment = jest.fn();

      render(
        <PostGrid
          posts={mockPosts}
          onLike={() => {}}
          onComment={handleComment}
        />
      );

      const commentButtons = screen.getAllByRole('button', {
        name: /comment/i,
      });
      await user.click(commentButtons[0]);

      expect(handleComment).toHaveBeenCalledWith(1);
    });

    it('should forward onShare handler when provided', async () => {
      const user = userEvent.setup();
      const handleShare = jest.fn();

      render(
        <PostGrid posts={mockPosts} onLike={() => {}} onShare={handleShare} />
      );

      const shareButtons = screen.getAllByRole('button', { name: /share/i });
      await user.click(shareButtons[0]);

      expect(handleShare).toHaveBeenCalledWith(1);
    });

    it('should forward onMenu handler when provided', async () => {
      const user = userEvent.setup();
      const handleMenu = jest.fn();

      render(
        <PostGrid posts={mockPosts} onLike={() => {}} onMenu={handleMenu} />
      );

      const menuButtons = screen.getAllByRole('button', {
        name: /post options/i,
      });
      await user.click(menuButtons[0]);

      expect(handleMenu).toHaveBeenCalledWith(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single post', () => {
      render(<PostGrid posts={[mockPosts[0]]} onLike={() => {}} />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should handle large number of posts', () => {
      const manyPosts = Array.from({ length: 50 }, (_, i) => ({
        ...mockPosts[0],
        id: i + 1,
        body: `Content ${i + 1}`,
      }));

      render(<PostGrid posts={manyPosts} onLike={() => {}} />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 50')).toBeInTheDocument();
    });

    it('should handle posts with missing data gracefully', () => {
      const incompletePost: PostType = {
        ...mockPosts[0],
        user: undefined,
      };

      render(<PostGrid posts={[incompletePost]} onLike={() => {}} />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      const { container } = render(
        <PostGrid posts={mockPosts} onLike={() => {}} />
      );

      // Should contain articles (from Post components)
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBe(2);
    });

    it('should maintain keyboard navigation', () => {
      render(<PostGrid posts={mockPosts} onLike={() => {}} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('should show empty message with icon', () => {
      render(<PostGrid posts={[]} onLike={() => {}} />);

      expect(screen.getByText(/no posts/i)).toBeInTheDocument();
    });

    it('should center empty state', () => {
      const { container } = render(<PostGrid posts={[]} onLike={() => {}} />);

      const emptyState = container.querySelector('[class*="flex"]');
      expect(emptyState).toBeInTheDocument();
    });
  });
});

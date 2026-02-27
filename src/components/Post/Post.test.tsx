import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Post } from './Post';
import type { Post as PostType } from '@/types/post.types';

const mockPost: PostType = {
  id: 1,
  userId: 1,
  title: 'Test Post Title',
  body: 'This is a test post with #hashtag',
  user: {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
  },
  engagement: {
    likes: 150,
    comments: 23,
    shares: 5,
  },
  isLiked: false,
  timestamp: new Date('2024-01-15T10:30:00.000Z'),
  hashtags: ['#hashtag'],
};

describe('Post', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Post post={mockPost} onLike={() => {}} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/test post/i)).toBeInTheDocument();
    });

    it('should render PostHeader component', () => {
      render(<Post post={mockPost} onLike={() => {}} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    it('should render PostContent component', () => {
      render(<Post post={mockPost} onLike={() => {}} />);

      expect(screen.getByText(/test post/i)).toBeInTheDocument();
      expect(screen.getByText('#hashtag')).toBeInTheDocument();
    });

    it('should render PostActions component', () => {
      render(<Post post={mockPost} onLike={() => {}} />);

      expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /comment/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /share/i })
      ).toBeInTheDocument();
    });

    it('should render post with image', () => {
      const postWithImage = {
        ...mockPost,
        imageUrl: 'https://picsum.photos/600/400',
      };

      render(<Post post={postWithImage} onLike={() => {}} />);

      const img = screen.getByRole('img', { name: /post image/i });
      expect(img).toBeInTheDocument();
    });

    it('should render menu button when onMenu is provided', () => {
      render(<Post post={mockPost} onLike={() => {}} onMenu={() => {}} />);

      const menuButton = screen.getByRole('button', { name: /post options/i });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onLike when like button is clicked', async () => {
      const user = userEvent.setup();
      const handleLike = jest.fn();

      render(<Post post={mockPost} onLike={handleLike} />);

      const likeButton = screen.getByRole('button', { name: /like/i });
      await user.click(likeButton);

      expect(handleLike).toHaveBeenCalledTimes(1);
      expect(handleLike).toHaveBeenCalledWith(mockPost.id);
    });

    it('should call onComment when provided and comment button is clicked', async () => {
      const user = userEvent.setup();
      const handleComment = jest.fn();

      render(
        <Post post={mockPost} onLike={() => {}} onComment={handleComment} />
      );

      const commentButton = screen.getByRole('button', { name: /comment/i });
      await user.click(commentButton);

      expect(handleComment).toHaveBeenCalledTimes(1);
      expect(handleComment).toHaveBeenCalledWith(mockPost.id);
    });

    it('should call onShare when provided and share button is clicked', async () => {
      const user = userEvent.setup();
      const handleShare = jest.fn();

      render(<Post post={mockPost} onLike={() => {}} onShare={handleShare} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      expect(handleShare).toHaveBeenCalledTimes(1);
      expect(handleShare).toHaveBeenCalledWith(mockPost.id);
    });

    it('should call onMenu when provided and menu button is clicked', async () => {
      const user = userEvent.setup();
      const handleMenu = jest.fn();

      render(<Post post={mockPost} onLike={() => {}} onMenu={handleMenu} />);

      const menuButton = screen.getByRole('button', { name: /post options/i });
      await user.click(menuButton);

      expect(handleMenu).toHaveBeenCalledTimes(1);
      expect(handleMenu).toHaveBeenCalledWith(mockPost.id);
    });
  });

  describe('Like State', () => {
    it('should display unliked state', () => {
      const unlikedPost = { ...mockPost, isLiked: false };
      render(<Post post={unlikedPost} onLike={() => {}} />);

      const likeButton = screen.getByRole('button', { name: /like/i });
      expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should display liked state', () => {
      const likedPost = { ...mockPost, isLiked: true };
      render(<Post post={likedPost} onLike={() => {}} />);

      const likeButton = screen.getByRole('button', { name: /unlike/i });
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Layout', () => {
    it('should use Card component', () => {
      const { container } = render(<Post post={mockPost} onLike={() => {}} />);

      // Card should have proper structure
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Post post={mockPost} onLike={() => {}} className="custom-post" />
      );

      expect(container.firstChild).toHaveClass('custom-post');
    });

    it('should have proper spacing between sections', () => {
      render(<Post post={mockPost} onLike={() => {}} />);

      // Check that header, content, and actions are all present
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/test post/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle post without user data', () => {
      const postWithoutUser = {
        ...mockPost,
        user: undefined,
      };

      // Should not crash
      render(<Post post={postWithoutUser} onLike={() => {}} />);
      expect(screen.getByText(/test post/i)).toBeInTheDocument();
    });

    it('should handle post with very long content', () => {
      const longPost = {
        ...mockPost,
        body: 'A'.repeat(1000),
      };

      render(<Post post={longPost} onLike={() => {}} />);
      expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument();
    });

    it('should handle post with zero engagement', () => {
      const zeroEngagementPost = {
        ...mockPost,
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
        },
      };

      render(<Post post={zeroEngagementPost} onLike={() => {}} />);

      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic article element', () => {
      const { container } = render(<Post post={mockPost} onLike={() => {}} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('should have proper keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleLike = jest.fn();

      render(<Post post={mockPost} onLike={handleLike} />);

      // Tab to like button and press Enter
      await user.tab();
      await user.keyboard('{Enter}');

      expect(handleLike).toHaveBeenCalled();
    });
  });
});

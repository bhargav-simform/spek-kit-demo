import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostActions } from './PostActions';
import type { Engagement } from '@/types/post.types';

const mockEngagement: Engagement = {
  likes: 42,
  comments: 12,
  shares: 3,
};

describe('PostActions', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /comment/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /share/i })
      ).toBeInTheDocument();
    });

    it('should render LikeButton', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const likeButton = screen.getByRole('button', { name: /like/i });
      expect(likeButton).toBeInTheDocument();
    });

    it('should render comment button', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const commentButton = screen.getByRole('button', { name: /comment/i });
      expect(commentButton).toBeInTheDocument();
    });

    it('should render share button', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const shareButton = screen.getByRole('button', { name: /share/i });
      expect(shareButton).toBeInTheDocument();
    });

    it('should render EngagementMetrics', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      expect(screen.getByLabelText(/42 likes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/12 comments/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/3 shares/i)).toBeInTheDocument();
    });
  });

  describe('Like Functionality', () => {
    it('should show unliked state', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const likeButton = screen.getByRole('button', { name: /like/i });
      expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should show liked state', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={true}
          onLike={() => {}}
        />
      );

      const likeButton = screen.getByRole('button', { name: /unlike/i });
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should call onLike when like button is clicked', async () => {
      const user = userEvent.setup();
      const handleLike = jest.fn();

      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={handleLike}
        />
      );

      const likeButton = screen.getByRole('button', { name: /like/i });
      await user.click(likeButton);

      expect(handleLike).toHaveBeenCalledTimes(1);
    });
  });

  describe('Comment Functionality', () => {
    it('should call onComment when provided and button is clicked', async () => {
      const user = userEvent.setup();
      const handleComment = jest.fn();

      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
          onComment={handleComment}
        />
      );

      const commentButton = screen.getByRole('button', { name: /comment/i });
      await user.click(commentButton);

      expect(handleComment).toHaveBeenCalledTimes(1);
    });

    it('should not call onComment when not provided', async () => {
      const user = userEvent.setup();

      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const commentButton = screen.getByRole('button', { name: /comment/i });
      await user.click(commentButton);

      // Should not throw error
      expect(commentButton).toBeInTheDocument();
    });
  });

  describe('Share Functionality', () => {
    it('should call onShare when provided and button is clicked', async () => {
      const user = userEvent.setup();
      const handleShare = jest.fn();

      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
          onShare={handleShare}
        />
      );

      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      expect(handleShare).toHaveBeenCalledTimes(1);
    });

    it('should not call onShare when not provided', async () => {
      const user = userEvent.setup();

      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      // Should not throw error
      expect(shareButton).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have proper spacing between action buttons', () => {
      const { container } = render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const actionsContainer = container.firstChild;
      expect(actionsContainer).toHaveClass('flex');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all buttons', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /comment/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /share/i })
      ).toBeInTheDocument();
    });

    it('should have keyboard accessible buttons', async () => {
      const user = userEvent.setup();
      const handleLike = jest.fn();

      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={handleLike}
        />
      );

      const likeButton = screen.getByRole('button', { name: /like/i });
      likeButton.focus();
      await user.keyboard('{Enter}');

      expect(handleLike).toHaveBeenCalledTimes(1);
    });
  });

  describe('Engagement Display', () => {
    it('should display engagement metrics below actions', () => {
      render(
        <PostActions
          engagement={mockEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      // Metrics should be visible
      expect(screen.getByLabelText(/42 likes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/12 comments/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/3 shares/i)).toBeInTheDocument();
    });

    it('should handle zero engagement values', () => {
      const zeroEngagement: Engagement = {
        likes: 0,
        comments: 0,
        shares: 0,
      };

      render(
        <PostActions
          engagement={zeroEngagement}
          isLiked={false}
          onLike={() => {}}
        />
      );

      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(3);
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostHeader } from './PostHeader';
import type { User } from '@/types/post.types';

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
};

const mockDate = '2024-01-15T10:30:00.000Z';

describe('PostHeader', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    it('should render UserAvatar component', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      // Check for avatar fallback initials
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should render PostTimestamp component', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      const timestamp = screen.getByRole('time');
      expect(timestamp).toBeInTheDocument();
    });

    it('should render menu button', () => {
      render(
        <PostHeader
          user={mockUser}
          createdAt={mockDate}
          onMenuClick={() => {}}
        />
      );

      const menuButton = screen.getByRole('button', { name: /post options/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('should not render menu button when onMenuClick is not provided', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      const menuButton = screen.queryByRole('button', {
        name: /post options/i,
      });
      expect(menuButton).not.toBeInTheDocument();
    });
  });

  describe('User Information', () => {
    it('should display user full name', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display username with @ prefix', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    it('should handle long names gracefully', () => {
      const longNameUser: User = {
        ...mockUser,
        name: 'Alexander Christopher Montgomery Wellington',
      };

      render(<PostHeader user={longNameUser} createdAt={mockDate} />);

      expect(
        screen.getByText('Alexander Christopher Montgomery Wellington')
      ).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onMenuClick when menu button is clicked', async () => {
      const user = userEvent.setup();
      const handleMenuClick = jest.fn();

      render(
        <PostHeader
          user={mockUser}
          createdAt={mockDate}
          onMenuClick={handleMenuClick}
        />
      );

      const menuButton = screen.getByRole('button', { name: /post options/i });
      await user.click(menuButton);

      expect(handleMenuClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible for menu button', async () => {
      const user = userEvent.setup();
      const handleMenuClick = jest.fn();

      render(
        <PostHeader
          user={mockUser}
          createdAt={mockDate}
          onMenuClick={handleMenuClick}
        />
      );

      const menuButton = screen.getByRole('button', { name: /post options/i });
      menuButton.focus();
      await user.keyboard('{Enter}');

      expect(handleMenuClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(
        <PostHeader user={mockUser} createdAt={mockDate} />
      );

      // Check for header element
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <PostHeader
          user={mockUser}
          createdAt={mockDate}
          className="custom-header"
        />
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for menu button', () => {
      render(
        <PostHeader
          user={mockUser}
          createdAt={mockDate}
          onMenuClick={() => {}}
        />
      );

      const menuButton = screen.getByRole('button', { name: /post options/i });
      expect(menuButton).toHaveAttribute('aria-label', 'Post options');
    });

    it('should have proper semantic HTML', () => {
      render(<PostHeader user={mockUser} createdAt={mockDate} />);

      // Check for time element
      const timestamp = screen.getByRole('time');
      expect(timestamp).toHaveAttribute('datetime');
    });
  });
});

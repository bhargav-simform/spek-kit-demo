import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LikeButton } from './LikeButton';

describe('LikeButton', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<LikeButton isLiked={false} onClick={() => {}} />);

      const button = screen.getByRole('button', { name: /like/i });
      expect(button).toBeInTheDocument();
    });

    it('should show unliked state', () => {
      render(<LikeButton isLiked={false} onClick={() => {}} />);

      const button = screen.getByRole('button', { name: /like/i });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should show liked state', () => {
      render(<LikeButton isLiked={true} onClick={() => {}} />);

      const button = screen.getByRole('button', { name: /unlike/i });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<LikeButton isLiked={false} onClick={handleClick} />);

      const button = screen.getByRole('button', { name: /like/i });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<LikeButton isLiked={false} onClick={handleClick} />);

      const button = screen.getByRole('button', { name: /like/i });
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<LikeButton isLiked={false} onClick={handleClick} />);

      const button = screen.getByRole('button', { name: /like/i });
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<LikeButton isLiked={false} onClick={handleClick} disabled />);

      const button = screen.getByRole('button', { name: /like/i });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<LikeButton isLiked={false} onClick={() => {}} />);

      const button = screen.getByRole('button', { name: /like/i });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have aria-pressed attribute', () => {
      const { rerender } = render(
        <LikeButton isLiked={false} onClick={() => {}} />
      );

      let button = screen.getByRole('button', { name: /like/i });
      expect(button).toHaveAttribute('aria-pressed', 'false');

      rerender(<LikeButton isLiked={true} onClick={() => {}} />);

      button = screen.getByRole('button', { name: /unlike/i });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have disabled attribute when disabled', () => {
      render(<LikeButton isLiked={false} onClick={() => {}} disabled />);

      const button = screen.getByRole('button', { name: /like/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Props', () => {
    it('should apply custom className', () => {
      render(
        <LikeButton
          isLiked={false}
          onClick={() => {}}
          className="custom-class"
        />
      );

      const button = screen.getByRole('button', { name: /like/i });
      expect(button).toHaveClass('custom-class');
    });

    it('should accept aria-label override', () => {
      render(
        <LikeButton
          isLiked={false}
          onClick={() => {}}
          ariaLabel="Custom like button"
        />
      );

      const button = screen.getByRole('button', {
        name: /custom like button/i,
      });
      expect(button).toBeInTheDocument();
    });
  });
});

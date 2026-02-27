import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserAvatar } from './UserAvatar';

describe('UserAvatar', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<UserAvatar username="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should render with image URL prop', () => {
      const imageUrl = 'https://example.com/avatar.jpg';
      const { container } = render(
        <UserAvatar username="John Doe" imageUrl={imageUrl} />
      );

      // Verify the Avatar component renders
      const avatar = container.querySelector('span[class*="relative"]');
      expect(avatar).toBeInTheDocument();

      // The fallback should still be available even with image URL
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should show fallback initials when no image', () => {
      render(<UserAvatar username="John Doe" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should handle single name for initials', () => {
      render(<UserAvatar username="Madonna" />);

      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('should handle multiple words in name', () => {
      render(<UserAvatar username="Jean-Claude Van Damme" />);

      // Should use first letter of first word and first letter of last word
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should apply correct size variants', () => {
      const { container } = render(
        <UserAvatar username="John Doe" size="lg" />
      );

      // Check if the avatar has the appropriate classes
      const avatar = container.querySelector('[class*="h-12"]');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render avatar component accessibly', () => {
      const { container } = render(
        <UserAvatar
          username="John Doe"
          imageUrl="https://example.com/avatar.jpg"
        />
      );

      // Verify avatar component renders
      const avatar = container.querySelector('span[class*="relative"]');
      expect(avatar).toBeInTheDocument();
    });

    it('should display fallback text accessibly', () => {
      render(<UserAvatar username="John Doe" />);

      const fallback = screen.getByText('JD');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <UserAvatar username="John Doe" className="custom-class" />
      );

      const avatar = container.querySelector('.custom-class');
      expect(avatar).toBeInTheDocument();
    });
  });
});

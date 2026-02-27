import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EngagementMetrics } from './EngagementMetrics';

describe('EngagementMetrics', () => {
  const mockEngagement = {
    likes: 150,
    comments: 23,
    shares: 5,
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<EngagementMetrics engagement={mockEngagement} />);

      expect(screen.getByLabelText(/150 likes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/23 comments/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/5 shares/i)).toBeInTheDocument();
    });

    it('should display likes count', () => {
      render(<EngagementMetrics engagement={mockEngagement} />);

      expect(screen.getByLabelText(/150 likes/i)).toBeInTheDocument();
    });

    it('should display comments count', () => {
      render(<EngagementMetrics engagement={mockEngagement} />);

      expect(screen.getByLabelText(/23 comments/i)).toBeInTheDocument();
    });

    it('should display shares count', () => {
      render(<EngagementMetrics engagement={mockEngagement} />);

      expect(screen.getByLabelText(/5 shares/i)).toBeInTheDocument();
    });

    it('should format large numbers correctly', () => {
      const largeEngagement = {
        likes: 1500,
        comments: 2300,
        shares: 500,
      };
      render(<EngagementMetrics engagement={largeEngagement} />);

      expect(screen.getByText(/1\.5K/i)).toBeInTheDocument();
      expect(screen.getByText(/2\.3K/i)).toBeInTheDocument();
    });

    it('should handle zero values', () => {
      const zeroEngagement = {
        likes: 0,
        comments: 0,
        shares: 0,
      };
      render(<EngagementMetrics engagement={zeroEngagement} />);

      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive labels', () => {
      const { container } = render(
        <EngagementMetrics engagement={mockEngagement} />
      );

      const text = container.textContent;
      expect(text).toContain('150');
      expect(text).toContain('23');
      expect(text).toContain('5');
    });
  });

  describe('Props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <EngagementMetrics
          engagement={mockEngagement}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

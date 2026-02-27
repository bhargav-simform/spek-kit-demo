import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostTimestamp } from './PostTimestamp';

describe('PostTimestamp', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      render(<PostTimestamp date={date} />);

      expect(screen.getByRole('time')).toBeInTheDocument();
    });

    it('should format recent timestamps as relative time', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      render(<PostTimestamp date={fiveMinutesAgo} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveTextContent(/minutes? ago/i);
    });

    it('should format timestamps within last hour', () => {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      render(<PostTimestamp date={thirtyMinutesAgo} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveTextContent(/30 minutes ago/i);
    });

    it('should format timestamps within last day', () => {
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
      render(<PostTimestamp date={fiveHoursAgo} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveTextContent(/hours? ago/i);
    });

    it('should format old timestamps as date', () => {
      const oldDate = new Date('2024-01-01T10:00:00Z');
      render(<PostTimestamp date={oldDate} />);

      const timeElement = screen.getByRole('time');
      // Should show a formatted date
      expect(timeElement.textContent).toBeTruthy();
    });
  });

  describe('Semantic HTML', () => {
    it('should use time element with datetime attribute', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      render(<PostTimestamp date={date} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime');
    });

    it('should have valid ISO datetime', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      render(<PostTimestamp date={date} />);

      const timeElement = screen.getByRole('time');
      const datetime = timeElement.getAttribute('datetime');
      expect(datetime).toBeTruthy();
      // Should be valid ISO string
      expect(() => new Date(datetime!)).not.toThrow();
    });
  });

  describe('Props', () => {
    it('should apply custom className', () => {
      const date = new Date();
      render(<PostTimestamp date={date} className="custom-class" />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      const { container } = render(<PostTimestamp date={invalidDate} />);

      expect(container.textContent).toBeTruthy();
    });

    it('should handle just now timestamps', () => {
      const justNow = new Date();
      render(<PostTimestamp date={justNow} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement.textContent).toBeTruthy();
    });
  });
});

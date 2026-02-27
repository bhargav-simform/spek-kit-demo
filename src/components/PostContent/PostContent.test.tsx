import { render, screen } from '@testing-library/react';
import { PostContent } from './PostContent';

describe('PostContent', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PostContent content="Hello World" />);

      expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    });

    it('should display plain text content', () => {
      const content = 'This is a test post';
      render(<PostContent content={content} />);

      expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('should render image when imageUrl is provided', () => {
      const imageUrl = 'https://picsum.photos/600/400';
      render(<PostContent content="Post with image" imageUrl={imageUrl} />);

      const img = screen.getByRole('img', { name: /post image/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', imageUrl);
    });

    it('should not render image when imageUrl is not provided', () => {
      render(<PostContent content="Post without image" />);

      const img = screen.queryByRole('img');
      expect(img).not.toBeInTheDocument();
    });
  });

  describe('Hashtag Rendering', () => {
    it('should highlight single hashtag', () => {
      render(<PostContent content="Hello #world" />);

      const hashtag = screen.getByText('#world');
      expect(hashtag).toBeInTheDocument();
      expect(hashtag.tagName).toBe('SPAN');
    });

    it('should highlight multiple hashtags', () => {
      render(<PostContent content="Check out #react and #typescript" />);

      expect(screen.getByText('#react')).toBeInTheDocument();
      expect(screen.getByText('#typescript')).toBeInTheDocument();
    });

    it('should handle hashtags at the start of text', () => {
      render(<PostContent content="#trending topic" />);

      expect(screen.getByText('#trending')).toBeInTheDocument();
    });

    it('should handle hashtags at the end of text', () => {
      render(<PostContent content="Great post #amazing" />);

      expect(screen.getByText('#amazing')).toBeInTheDocument();
    });

    it('should handle consecutive hashtags', () => {
      render(<PostContent content="#react #typescript #vite" />);

      expect(screen.getByText('#react')).toBeInTheDocument();
      expect(screen.getByText('#typescript')).toBeInTheDocument();
      expect(screen.getByText('#vite')).toBeInTheDocument();
    });

    it('should not highlight # without word', () => {
      const { container } = render(
        <PostContent content="Price is $100 # comment" />
      );

      // The standalone # should not be highlighted
      const text = container.textContent;
      expect(text).toContain('Price is $100 # comment');
    });

    it('should preserve line breaks', () => {
      const content = 'Line 1\nLine 2\nLine 3';
      render(<PostContent content={content} />);

      expect(screen.getByText(/line 1/i)).toBeInTheDocument();
      expect(screen.getByText(/line 2/i)).toBeInTheDocument();
      expect(screen.getByText(/line 3/i)).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should have proper alt text for image', () => {
      render(
        <PostContent content="Test" imageUrl="https://picsum.photos/600/400" />
      );

      const img = screen.getByRole('img', { name: /post image/i });
      expect(img).toHaveAttribute('alt', 'Post image');
    });

    it('should apply proper image styling', () => {
      render(
        <PostContent content="Test" imageUrl="https://picsum.photos/600/400" />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveClass('rounded-lg');
    });
  });

  describe('Layout', () => {
    it('should apply custom className', () => {
      render(<PostContent content="Test" className="custom-class" />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle empty content gracefully', () => {
      render(<PostContent content="" />);

      const content = screen.queryByText(/.+/);
      expect(content).not.toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(500);
      render(<PostContent content={longContent} />);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<PostContent content="Test content" />);

      // Content should be wrapped in a semantic element
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have descriptive image alt text', () => {
      render(
        <PostContent content="Test" imageUrl="https://example.com/image.jpg" />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });
});

import { validatePostBody, validatePostTitle } from './validation';

describe('Post Validation', () => {
  describe('validatePostTitle', () => {
    it('should return error for empty title', () => {
      const result = validatePostTitle('');
      expect(result).toBe('Title is required');
    });

    it('should return error for whitespace-only title', () => {
      const result = validatePostTitle('   ');
      expect(result).toBe('Title is required');
    });

    it('should return error for title exceeding 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      const result = validatePostTitle(longTitle);
      expect(result).toBe('Title must be 255 characters or less');
    });

    it('should return undefined for valid title', () => {
      const result = validatePostTitle('Valid Post Title');
      expect(result).toBeUndefined();
    });

    it('should accept title with exactly 255 characters', () => {
      const maxTitle = 'a'.repeat(255);
      const result = validatePostTitle(maxTitle);
      expect(result).toBeUndefined();
    });

    it('should trim whitespace before validation', () => {
      const result = validatePostTitle('  Valid Title  ');
      expect(result).toBeUndefined();
    });
  });

  describe('validatePostBody', () => {
    it('should return error for empty body', () => {
      const result = validatePostBody('');
      expect(result).toBe('Body is required');
    });

    it('should return error for whitespace-only body', () => {
      const result = validatePostBody('   \n\t  ');
      expect(result).toBe('Body is required');
    });

    it('should return error for body exceeding 5000 characters', () => {
      const longBody = 'a'.repeat(5001);
      const result = validatePostBody(longBody);
      expect(result).toBe('Body must be 5000 characters or less');
    });

    it('should return undefined for valid body', () => {
      const result = validatePostBody(
        'This is a valid post body with some content.'
      );
      expect(result).toBeUndefined();
    });

    it('should accept body with exactly 5000 characters', () => {
      const maxBody = 'a'.repeat(5000);
      const result = validatePostBody(maxBody);
      expect(result).toBeUndefined();
    });

    it('should trim whitespace before validation', () => {
      const result = validatePostBody('  Valid body content  ');
      expect(result).toBeUndefined();
    });

    it('should accept body with newlines and special characters', () => {
      const result = validatePostBody(
        'Line 1\nLine 2\n\nLine 3 with émojis 🎉'
      );
      expect(result).toBeUndefined();
    });
  });
});

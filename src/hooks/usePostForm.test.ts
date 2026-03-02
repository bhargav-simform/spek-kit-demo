import { renderHook, act, waitFor } from '@testing-library/react';
import { usePostForm } from './usePostForm';

describe('usePostForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with default values for create mode', () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      expect(result.current.values).toEqual({
        title: '',
        body: '',
      });
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({
        title: false,
        body: false,
      });
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should initialize with provided values for edit mode', () => {
      const initialValues = {
        title: 'Existing Title',
        body: 'Existing Body',
      };

      const { result } = renderHook(() =>
        usePostForm({
          mode: 'edit',
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      expect(result.current.values).toEqual(initialValues);
    });
  });

  describe('field changes', () => {
    it('should update title value on change', () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'New Title' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.values.title).toBe('New Title');
    });

    it('should update body value on change', () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('body')({
          target: { value: 'New Body' },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.values.body).toBe('New Body');
    });
  });

  describe('field blur validation', () => {
    it('should mark field as touched and validate on blur', () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleBlur('title')();
      });

      expect(result.current.touched.title).toBe(true);
      expect(result.current.errors.title).toBe('Title is required');
    });

    it('should not show error for valid field on blur', () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Valid Title' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleBlur('title')();
      });

      expect(result.current.touched.title).toBe(true);
      expect(result.current.errors.title).toBeUndefined();
    });
  });

  describe('form submission', () => {
    it('should validate all fields on submit', async () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as unknown as React.FormEvent);
      });

      expect(result.current.errors.title).toBe('Title is required');
      expect(result.current.errors.body).toBe('Body is required');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with valid data', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Valid Title' },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleChange('body')({
          target: { value: 'Valid Body' },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as unknown as React.FormEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Valid Title',
        body: 'Valid Body',
      });
    });

    it('should set isSubmitting during submission', async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>(resolve => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Valid Title' },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleChange('body')({
          target: { value: 'Valid Body' },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      act(() => {
        result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as unknown as React.FormEvent);
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      await act(async () => {
        resolveSubmit!();
        await submitPromise;
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle submission errors', async () => {
      const error = new Error('Submission failed');
      mockOnSubmit.mockRejectedValue(error);

      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Valid Title' },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleChange('body')({
          target: { value: 'Valid Body' },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as unknown as React.FormEvent);
      });

      expect(result.current.errors.submit).toBe('Submission failed');
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should reset form after successful create', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Valid Title' },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleChange('body')({
          target: { value: 'Valid Body' },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as unknown as React.FormEvent);
      });

      expect(result.current.values).toEqual({
        title: '',
        body: '',
      });
    });

    it('should NOT reset form after successful edit', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        usePostForm({
          mode: 'edit',
          initialValues: {
            title: 'Original Title',
            body: 'Original Body',
          },
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Updated Title' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as unknown as React.FormEvent);
      });

      expect(result.current.values.title).toBe('Updated Title');
    });
  });

  describe('reset', () => {
    it('should reset form to initial state', () => {
      const { result } = renderHook(() =>
        usePostForm({
          mode: 'create',
          onSubmit: mockOnSubmit,
        })
      );

      act(() => {
        result.current.handleChange('title')({
          target: { value: 'Some Title' },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleBlur('title')();
      });

      expect(result.current.values.title).toBe('Some Title');
      expect(result.current.touched.title).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.values).toEqual({
        title: '',
        body: '',
      });
      expect(result.current.touched).toEqual({
        title: false,
        body: false,
      });
      expect(result.current.errors).toEqual({});
    });
  });
});

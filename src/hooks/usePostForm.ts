import { useState, useCallback } from 'react';
import { validatePostTitle, validatePostBody } from '../lib/validation';
import type { FormErrors, TouchedFields } from '../types/post.types';

export interface UsePostFormOptions {
  initialValues?: {
    title: string;
    body: string;
  };
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
  mode: 'create' | 'edit';
}

export interface UsePostFormReturn {
  values: {
    title: string;
    body: string;
  };
  errors: FormErrors;
  touched: TouchedFields;
  isSubmitting: boolean;
  handleChange: (
    field: 'title' | 'body'
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (field: 'title' | 'body') => () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

const defaultValues = {
  title: '',
  body: '',
};

export function usePostForm(options: UsePostFormOptions): UsePostFormReturn {
  const { initialValues = defaultValues, onSubmit, mode } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    title: false,
    body: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: 'title' | 'body', value: string) => {
      if (field === 'title') {
        return validatePostTitle(value);
      } else {
        return validatePostBody(value);
      }
    },
    []
  );

  const handleChange = useCallback(
    (field: 'title' | 'body') =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (touched[field] && errors[field]) {
          const error = validateField(field, value);
          setErrors(prev => ({ ...prev, [field]: error }));
        }
      },
    [touched, errors, validateField]
  );

  const handleBlur = useCallback(
    (field: 'title' | 'body') => () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const error = validateField(field, values[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    [values, validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const titleError = validatePostTitle(values.title);
      const bodyError = validatePostBody(values.body);

      const newErrors: FormErrors = {};
      if (titleError) newErrors.title = titleError;
      if (bodyError) newErrors.body = bodyError;

      setErrors(newErrors);
      setTouched({ title: true, body: true });

      // Don't submit if there are validation errors
      if (titleError || bodyError) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit({
          title: values.title.trim(),
          body: values.body.trim(),
        });

        // Reset form only in create mode
        if (mode === 'create') {
          setValues(defaultValues);
          setTouched({ title: false, body: false });
          setErrors({});
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to submit form';
        setErrors(prev => ({ ...prev, submit: errorMessage }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, mode]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({ title: false, body: false });
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

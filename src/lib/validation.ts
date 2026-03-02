/**
 * Validates post title field
 * @param title - The title to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validatePostTitle(title: string): string | undefined {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return 'Title is required';
  }

  if (trimmedTitle.length > 255) {
    return 'Title must be 255 characters or less';
  }

  return undefined;
}

/**
 * Validates post body field
 * @param body - The body content to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validatePostBody(body: string): string | undefined {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    return 'Body is required';
  }

  if (trimmedBody.length > 5000) {
    return 'Body must be 5000 characters or less';
  }

  return undefined;
}

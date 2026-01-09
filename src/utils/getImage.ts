// src/utils/imageUtils.ts

export const getImageUrl = (path: string | undefined, fallback: string): string => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('https')) return path;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // Normalize Windows backslashes to forward slashes
  const normalizedPath = path.replace(/\\/g, '/');

  // If path already starts with 'uploads/', avoid duplicating it
  if (normalizedPath.startsWith('uploads/')) {
    return `${baseUrl}/${normalizedPath}`;
  }

  // Otherwise, prepend '/uploads/'
  return `${baseUrl}/uploads/${normalizedPath}`;
};
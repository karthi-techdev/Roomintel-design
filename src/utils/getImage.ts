import { IMAGE_BASE_URL } from './urls';

export const getImageUrl = (path: string | undefined, fallback: string | undefined = undefined): string => {
  if (!path) return fallback || '';
  if (path.startsWith('http') || path.startsWith('https')) return path;

  // Normalize Windows backslashes to forward slashes
  const normalizedPath = path.replace(/\\/g, '/');

  // If path already starts with 'uploads/', use it as is
  if (normalizedPath.startsWith('uploads/')) {
    return `${IMAGE_BASE_URL}/${normalizedPath}`;
  }

  // If it doesn't start with uploads/ but is not empty, assume it needs the uploads prefix
  // Note: This matches legacy behavior where we might just have a filename
  // Ideally, valid paths from backend should imply the full relative path
  return `${IMAGE_BASE_URL}/uploads/${normalizedPath}`;
};
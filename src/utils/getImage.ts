import { IMAGE_BASE_URL } from './urls';

export const getImageUrl = (path: string | undefined, fallback: string | undefined = undefined): string => {
  if (!path) return fallback || '';
  if (path.startsWith('http') || path.startsWith('https')) return path;

  // Normalize Windows backslashes to forward slashes
  let normalizedPath = path.replace(/\\/g, '/');

  // Remove leading slash if present
  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.substring(1);
  }

  return `${IMAGE_BASE_URL}/${normalizedPath}`;
};
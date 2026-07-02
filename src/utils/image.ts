/**
 * Resolves any relative or absolute image URL correctly.
 * If the image path is relative (e.g. starting with '/images'), it prepends the backend host URL.
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  
  if (url?.startsWith("http://") || url?.startsWith("https://")) {
    return url;
  }
  
  // Extract base URL of backend (everything before /api)
  const apiUrl = import.meta.env.VITE_API_URL || "";
  const baseUrl = apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;
  
  return `${baseUrl}${url?.startsWith("/") ? "" : "/"}${url}`;
};

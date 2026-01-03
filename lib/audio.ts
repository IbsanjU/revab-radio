/**
 * Utility functions for audio stream handling
 */

/**
 * Transforms HTTP URLs to use the proxy API route for HTTPS compatibility
 * HTTPS URLs are returned as-is
 * 
 * @param originalUrl - The original stream URL
 * @returns The proxied URL if HTTP, or the original URL if HTTPS
 */
export function getProxiedStreamUrl(originalUrl: string): string {
  // Check if URL is HTTP (not HTTPS)
  if (originalUrl.startsWith('http://')) {
    // Encode the URL and route through proxy
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/proxy-stream?url=${encodedUrl}`;
  }
  // Return HTTPS URLs as-is
  return originalUrl;
}

/**
 * Checks if a stream URL is HTTP (insecure)
 * 
 * @param url - The stream URL to check
 * @returns true if the URL uses HTTP protocol
 */
export function isHttpStream(url: string): boolean {
  return url.startsWith('http://');
}

/**
 * Checks if a stream URL is HTTPS (secure)
 * 
 * @param url - The stream URL to check
 * @returns true if the URL uses HTTPS protocol
 */
export function isHttpsStream(url: string): boolean {
  return url.startsWith('https://');
}

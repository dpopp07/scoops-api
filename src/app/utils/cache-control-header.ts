import { config } from './configuration';

// Provide a header to the GET operations that tells the client whether or not
// to cache the response content. If caching is enabled, tell the client to
// cache for 1 day. Otherwise, tell the client not to cache.
export function cacheControlHeader() {
  const headerValue = config.CACHE_GET_RESPONSES
    ? 'public, max-age=86400'
    : 'no-cache';

  return {
    'Cache-Control': headerValue,
  };
}

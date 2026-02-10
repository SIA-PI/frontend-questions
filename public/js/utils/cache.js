/**
 * Simple in-memory cache for API requests.
 * Prevents redundant fetches for the same entity ID within a session.
 */

const requestCache = new Map();

/**
 * Wraps an async function with caching logic.
 * @param {Function} fn - The async function to cache (must accept an ID as first arg).
 * @param {string} namespace - Unique namespace for the cache keys (e.g., 'escola', 'city').
 * @returns {Function} - The wrapped function.
 */
export function withCache(fn, namespace) {
    return async function (id, ...args) {
        if (!id) return fn(id, ...args);

        const key = `${namespace}:${id}`;

        if (requestCache.has(key)) {
            return requestCache.get(key);
        }

        const promise = fn(id, ...args).catch(err => {
            // Remove from cache if request fails so it can be retried
            requestCache.delete(key);
            throw err;
        });

        requestCache.set(key, promise);

        return promise;
    };
}

/**
 * Clears the cache for a specific namespace or all if not provided.
 */
export function clearCache(namespace) {
    if (!namespace) {
        requestCache.clear();
        return;
    }
    for (const key of requestCache.keys()) {
        if (key.startsWith(`${namespace}:`)) {
            requestCache.delete(key);
        }
    }
}

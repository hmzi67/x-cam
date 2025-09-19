export function generateMfaCode() {
    // Generate a random 6-digit number
    const mfaCode = Math.floor(100000 + Math.random() * 900000);
    return mfaCode.toString();
  }

/**
     * Set data in the cache for 3 minutes
     */
export async function setCache(cache:any, key: any, value: any) {
    await cache.set(key, { value, expiresAt: Date.now() + 3 * 60 * 1000 }); // Store value with an expiration timestamp
    console.log(`Cache set for key "${key}"`);
}

/**
 * Get data from the cache if it hasn't expired
 */
export async function getCache(cache:any, key: any) {
    const cachedItem = await cache.get(key);
    if (!cachedItem) {
        console.log(`Cache missing for key "${key}"`);
        return undefined;
    }

    // Check expiration
    if (cachedItem.expiresAt < Date.now()) {
        console.log(`Cache expired for key "${key}"`);
        await cache.delete(key); // Remove expired key
        return undefined;
    }

    console.log(`Cache hit for key "${key}"`);
    return cachedItem.value;
}
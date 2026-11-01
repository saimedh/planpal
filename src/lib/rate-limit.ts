interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 30; // 30 requests per hour

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(userId) || { timestamps: [] };

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldest = entry.timestamps[0];
    const resetIn = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.timestamps.push(now);
  rateLimitMap.set(userId, entry);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.timestamps.length,
    resetIn: 0,
  };
}

// Cleanup stale entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
      if (entry.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

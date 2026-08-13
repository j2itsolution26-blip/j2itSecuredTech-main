/**
 * Fixed-window rate limiter backed by an in-process map.
 *
 * Sufficient for a single Vercel region / container. For multi-region
 * deployments swap `hit()` for a Redis (Upstash) INCR + EXPIRE pipeline —
 * the call signature is intentionally storage agnostic.
 */
type Bucket = { count: number; expiresAt: number };

const buckets = new Map<string, Bucket>();

/** Evict expired keys so the map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.expiresAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.expiresAt - now) / 1000),
    };
  }

  return { success: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/** Tuned windows per surface. Public forms are the strictest. */
export const RATE_LIMITS = {
  quoteRequest: { limit: 3, windowMs: 60 * 60 * 1000 },
  contactMessage: { limit: 5, windowMs: 60 * 60 * 1000 },
  adminMutation: { limit: 60, windowMs: 60 * 1000 },
  mediaUpload: { limit: 30, windowMs: 60 * 1000 },
} as const;

import "server-only";
import { redis } from "./redis";

export async function rateLimit(
  ip: string,
  { maxRequests = 5, windowSeconds = 60 } = {},
) {
  const key = `rate-limit:${ip}`;

  const count = await redis.incr(key);

  // Ustaw TTL tylko przy pierwszym requeście
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (count > maxRequests) {
    const ttl = await redis.ttl(key);
    return {
      success: false,
      remaining: 0,
      retryAfter: ttl > 0 ? ttl : windowSeconds,
    };
  }

  return {
    success: true,
    remaining: maxRequests - count,
  };
}

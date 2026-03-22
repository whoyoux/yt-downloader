import "server-only";

const redis = new Bun.RedisClient(
  process.env.REDIS_URL ?? "redis://localhost:6379",
);

export { redis };

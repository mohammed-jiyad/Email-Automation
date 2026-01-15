import IORedis from "ioredis";

export const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
  enableReadyCheck: false,    // REQUIRED for Render / Upstash
});

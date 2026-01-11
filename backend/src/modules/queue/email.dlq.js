import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis.js";

export const emailDLQ = new Queue("email-dlq", {
  connection: redisConnection,
});

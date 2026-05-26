import { Redis } from "ioredis";
import { env } from "./env.js";

const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
};

// Primary connection (for BullMQ workers)
export const redisConnection = new Redis(redisConfig);

// Separate subscriber connection (for pub/sub if needed)
export const redisSubscriber = new Redis(redisConfig);

redisConnection.on("connect", () => console.info("✅ Redis connected"));
redisConnection.on("error", (err: Error) => {
  console.error("Redis error:", err.message);
});

export async function connectRedis(): Promise<void> {
  try {
    // Only connect if not already connected/connecting — ioredis throws if you
    // call connect() on an instance that's already in connecting/ready state.
    const connectIfNeeded = (client: Redis) => {
      const status = client.status;
      if (status === "wait" || status === "close" || status === "end") {
        return client.connect();
      }
      return Promise.resolve();
    };
    await Promise.all([connectIfNeeded(redisConnection), connectIfNeeded(redisSubscriber)]);
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  await Promise.all([redisConnection.quit(), redisSubscriber.quit()]);
  console.info("Redis disconnected gracefully");
}

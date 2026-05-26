import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";
import type { GenerationJobData } from "@repo/types";

export const QUEUES = {
  ASSESSMENT_GENERATION: "assessment-generation",
} as const;

// ─── Queue Instances ──────────────────────────────────────────────────────────

export const assessmentGenerationQueue = new Queue<GenerationJobData>(
  QUEUES.ASSESSMENT_GENERATION,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
  },
);

assessmentGenerationQueue.on("error", (err: Error) => {
  console.error(`Queue [${QUEUES.ASSESSMENT_GENERATION}] error:`, err.message);
});

console.info(`✅ Queue "${QUEUES.ASSESSMENT_GENERATION}" initialized`);

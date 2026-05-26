import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis.js";

export const GENERATE_ASSESSMENT_QUEUE = "generate-assessment";

export interface GenerateAssessmentJobData {
  assignmentId: string;
}

export const generateAssessmentQueue = new Queue<GenerateAssessmentJobData>(
  GENERATE_ASSESSMENT_QUEUE,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false, // Keep failed jobs for debugging
    },
  }
);

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
      attempts: 1, // No retries — permanent errors (quota, auth) should not be retried
      removeOnComplete: true,
      removeOnFail: false, // Keep failed jobs for debugging
    },
  },
);

import { Worker, Job } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { AssignmentModel } from "./assignment.model.js";
import { GENERATE_ASSESSMENT_QUEUE, GenerateAssessmentJobData } from "./assignment.queue.js";
import { openaiService } from "./openai.service.js";
import { GeneratedPaperModel } from "./generated-paper.model.js";
import { publishAssignmentEvent } from "../../sockets/index.js";

const processor = async (job: Job<GenerateAssessmentJobData>) => {
  const { assignmentId } = job.data;
  console.info(`[Worker] Started processing assignment ${assignmentId}`);

  try {
    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }

    // Set status to processing
    assignment.status = "processing";
    await assignment.save();
    
    publishAssignmentEvent("generation:started", { assignmentId });
    
    // Call OpenAI to generate content safely
    console.info(`[Worker] Generating AI paper for assignment ${assignmentId}...`);
    const generatedContent = await openaiService.generateAssessment(assignment);
    
    // Save generated paper
    const paper = new GeneratedPaperModel({
      assignmentId: assignment._id,
      metadata: generatedContent.metadata,
      sections: generatedContent.sections,
    });
    await paper.save();

    // Set status to generated
    assignment.status = "generated";
    await assignment.save();
    
    publishAssignmentEvent("generation:completed", { assignmentId });
    
    console.info(`[Worker] Completed processing assignment ${assignmentId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Worker] Failed processing assignment ${assignmentId}:`, error);
    
    // Try to update status to failed
    try {
      await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "failed" });
      publishAssignmentEvent("generation:failed", { assignmentId });
    } catch (dbError) {
      console.error(`[Worker] Failed to update status to failed for ${assignmentId}:`, dbError);
    }
    
    throw error;
  }
};

export const generateAssessmentWorker = new Worker<GenerateAssessmentJobData>(
  GENERATE_ASSESSMENT_QUEUE,
  processor,
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 jobs simultaneously
  }
);

// Worker event listeners for logging
generateAssessmentWorker.on("completed", (job) => {
  console.info(`✅ Job ${job.id} completed successfully`);
});

generateAssessmentWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed with error: ${err.message}`);
});

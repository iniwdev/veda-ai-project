import { AssignmentModel, IAssignment } from "./assignment.model.js";
import type { CreateAssignmentInput } from "./assignment.schema.js";
import { AppError } from "../../middleware/errorHandler.js";

export class AssignmentService {
  async createAssignment(data: CreateAssignmentInput): Promise<IAssignment> {
    const assignment = new AssignmentModel({
      ...data,
      questionConfigurations: data.questions,
      status: "draft",
      // Explicit paper metadata fields \u2014 stored verbatim, passed to AI
      schoolName: data.schoolName,
      subject: data.subject,
      className: data.className,
      examType: data.examType,
      duration: data.duration,
    });

    return await assignment.save();
  }

  async getAssignments(): Promise<IAssignment[]> {
    return await AssignmentModel.find().sort({ createdAt: -1 });
  }

  async getAssignmentById(id: string): Promise<IAssignment> {
    const assignment = await AssignmentModel.findById(id);
    if (!assignment) {
      throw new AppError(404, "Assignment not found");
    }
    return assignment;
  }

  async deleteAssignment(id: string): Promise<void> {
    const result = await AssignmentModel.findByIdAndDelete(id);
    if (!result) {
      throw new AppError(404, "Assignment not found");
    }
  }

  async generateAssignment(id: string): Promise<void> {
    const assignment = await AssignmentModel.findById(id);
    if (!assignment) {
      throw new AppError(404, "Assignment not found");
    }

    // Delete any previously generated paper for this assignment to prevent
    // stale/duplicate documents being returned by getPaper after a regeneration.
    const { GeneratedPaperModel } = await import("./generated-paper.model.js");
    await GeneratedPaperModel.deleteMany({ assignmentId: id });

    // Set status to processing initially before enqueueing to prevent race conditions
    assignment.status = "processing";
    await assignment.save();

    const { generateAssessmentQueue } = await import("./assignment.queue.js");
    await generateAssessmentQueue.add("generate", { assignmentId: id });
  }

  async getPaper(assignmentId: string) {
    const { GeneratedPaperModel } = await import("./generated-paper.model.js");
    // Sort by newest first so that if any duplicate documents exist, we always get the latest
    const paper = await GeneratedPaperModel.findOne({ assignmentId }).sort({ createdAt: -1 });
    if (!paper) {
      throw new AppError(404, "Generated paper not found");
    }
    return paper;
  }
}

export const assignmentService = new AssignmentService();

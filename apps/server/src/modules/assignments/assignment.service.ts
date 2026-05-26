import { AssignmentModel, IAssignment } from "./assignment.model.js";
import type { CreateAssignmentInput } from "./assignment.schema.js";
import { AppError } from "../../middleware/errorHandler.js";

export class AssignmentService {
  async createAssignment(data: CreateAssignmentInput): Promise<IAssignment> {
    const assignment = new AssignmentModel({
      ...data,
      questionConfigurations: data.questions,
      status: "draft",
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
}

export const assignmentService = new AssignmentService();

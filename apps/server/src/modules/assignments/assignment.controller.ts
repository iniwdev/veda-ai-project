import { Request, Response, NextFunction } from "express";
import { assignmentService } from "./assignment.service.js";
import { createAssignmentSchema } from "./assignment.schema.js";

export class AssignmentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createAssignmentSchema.parse(req);
      const assignment = await assignmentService.createAssignment(validated.body);
      
      res.status(201).json({
        success: true,
        data: assignment,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assignments = await assignmentService.getAssignments();
      res.status(200).json({
        success: true,
        data: assignments,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const assignment = await assignmentService.getAssignmentById(id);
      
      res.status(200).json({
        success: true,
        data: assignment,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await assignmentService.deleteAssignment(id);
      
      res.status(200).json({
        success: true,
        message: "Assignment deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await assignmentService.generateAssignment(id);
      
      res.status(202).json({
        success: true,
        message: "Assignment generation job enqueued",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaper(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const paper = await assignmentService.getPaper(id);
      
      res.status(200).json({
        success: true,
        data: paper,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const assignmentController = new AssignmentController();

import { Router } from "express";
import { assignmentController } from "./assignment.controller.js";

const router: Router = Router();

router.post("/", assignmentController.create.bind(assignmentController));
router.get("/", assignmentController.getAll.bind(assignmentController));
router.get("/:id", assignmentController.getById.bind(assignmentController));
router.post("/:id/generate", assignmentController.generate.bind(assignmentController));
router.delete("/:id", assignmentController.delete.bind(assignmentController));

export default router;

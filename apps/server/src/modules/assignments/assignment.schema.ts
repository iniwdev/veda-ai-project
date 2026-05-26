import { z } from "zod";

export const QuestionTypeSchema = z.enum([
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True/False",
  "Fill in the Blanks",
]);

export const QuestionRowSchema = z.object({
  id: z.string(),
  type: QuestionTypeSchema,
  numQuestions: z.number().int().min(1),
  marks: z.number().min(1),
});

export const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    dueDate: z.string().min(1, "Due date is required"),
    instructions: z.string().optional(),
    questions: z.array(QuestionRowSchema).min(1, "At least one question type is required"),
    uploadedFile: z.string().optional(),
    totalMarks: z.number().min(1),
    // ── Explicit paper metadata (user-provided, injected verbatim into AI) ──
    schoolName: z.string().optional(),
    subject: z.string().optional(),
    className: z.string().optional(),
    examType: z.string().optional(),
    duration: z.string().optional(),
  }),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>["body"];

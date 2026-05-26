import * as z from "zod";
import type { QuestionType } from "@/types/assignment";

export const QUESTION_TYPE_OPTIONS: QuestionType[] = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True/False",
  "Fill in the Blanks",
];

export const QuestionRowSchema = z.object({
  id: z.string(),
  type: z.enum([
    "Multiple Choice Questions",
    "Short Questions",
    "Diagram/Graph-Based Questions",
    "Numerical Problems",
    "Long Answer Questions",
    "True/False",
    "Fill in the Blanks",
  ]),
  numQuestions: z.number().int().min(1, "Must have at least 1 question"),
  marks: z.number().min(1, "Marks must be greater than 0"),
});

export const CreateAssignmentSchema = z.object({
  assignmentTitle: z.string().min(1, "Assignment title is required").max(100, "Title is too long"),
  dueDate: z.string().min(1, "Due date is required"), // basic string validation for DD-MM-YYYY format or similar
  questions: z.array(QuestionRowSchema).min(1, "At least one question type is required"),
  instructions: z.string().optional(),
  file: z.any().optional(), // In a real app, this would be a File object
});

export type CreateAssignmentFormValues = z.infer<typeof CreateAssignmentSchema>;

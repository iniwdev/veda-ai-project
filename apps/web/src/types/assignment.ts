// ─── Assignment ───────────────────────────────────────────────────────────────

export type AssignmentView = "empty" | "list" | "create" | "view";

export type AssignmentStatus = "draft" | "processing" | "generated" | "failed";

export interface Assignment {
  id: string;
  title: string;
  assignedOn: string;
  dueDate?: string;
  status?: AssignmentStatus;
}

// ─── Question (Create Form) ───────────────────────────────────────────────────

export type QuestionType =
  | "Multiple Choice Questions"
  | "Short Questions"
  | "Diagram/Graph-Based Questions"
  | "Numerical Problems"
  | "Long Answer Questions"
  | "True/False"
  | "Fill in the Blanks";

export interface QuestionRow {
  id: string;
  type: QuestionType;
  numQuestions: number;
  marks: number;
}

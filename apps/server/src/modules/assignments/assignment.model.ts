import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionRow {
  id: string;
  type: string;
  numQuestions: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: string;
  instructions?: string;
  uploadedFile?: string;
  questionConfigurations: IQuestionRow[];
  totalMarks: number;
  status: "draft" | "processing" | "generated" | "failed";
  // ── Paper metadata (user-provided, verbatim in AI prompt) ───────────────
  schoolName?: string;
  subject?: string;
  className?: string;
  examType?: string;
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionRowSchema = new Schema<IQuestionRow>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  numQuestions: { type: Number, required: true, min: 1 },
  marks: { type: Number, required: true, min: 1 },
});

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, index: true },
    dueDate: { type: String, required: true },
    instructions: { type: String },
    uploadedFile: { type: String },
    questionConfigurations: { type: [QuestionRowSchema], required: true },
    totalMarks: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["draft", "processing", "generated", "failed"],
      default: "draft",
      index: true,
    },
    // ── Paper metadata fields ─────────────────────────────────
    schoolName: { type: String },
    subject: { type: String },
    className: { type: String },
    examType: { type: String },
    duration: { type: String },
  },
  {
    timestamps: true,
  },
);

export const AssignmentModel = mongoose.model<IAssignment>("Assignment", AssignmentSchema);

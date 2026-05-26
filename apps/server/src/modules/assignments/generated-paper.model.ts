import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGeneratedQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
}

export interface IGeneratedSection {
  title: string;
  instruction: string;
  questions: IGeneratedQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId;
  sections: IGeneratedSection[];
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedQuestionSchema = new Schema<IGeneratedQuestion>({
  question: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  marks: { type: Number, required: true },
});

const GeneratedSectionSchema = new Schema<IGeneratedSection>({
  title: { type: String, required: true },
  instruction: { type: String, default: "" },
  questions: { type: [GeneratedQuestionSchema], required: true },
});

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    sections: { type: [GeneratedSectionSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export const GeneratedPaperModel = mongoose.model<IGeneratedPaper>("GeneratedPaper", GeneratedPaperSchema);

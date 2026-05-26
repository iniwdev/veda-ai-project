import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGeneratedQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  answer: string;
  solution: string;
}

export interface IGeneratedSection {
  title: string;
  instruction: string;
  questions: IGeneratedQuestion[];
}

export interface IGeneratedPaperMetadata {
  schoolName: string;
  examTitle: string;
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
}

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId;
  metadata: IGeneratedPaperMetadata;
  sections: IGeneratedSection[];
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedQuestionSchema = new Schema<IGeneratedQuestion>({
  question: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  marks: { type: Number, required: true },
  answer: { type: String, required: true },
  solution: { type: String, required: true },
});

const GeneratedSectionSchema = new Schema<IGeneratedSection>({
  title: { type: String, required: true },
  instruction: { type: String, default: "" },
  questions: { type: [GeneratedQuestionSchema], required: true },
});

const GeneratedPaperMetadataSchema = new Schema<IGeneratedPaperMetadata>({
  schoolName: { type: String, required: true },
  examTitle: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  timeAllowed: { type: String, required: true },
  totalMarks: { type: Number, required: true },
}, { _id: false });

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    metadata: { type: GeneratedPaperMetadataSchema, required: true },
    sections: { type: [GeneratedSectionSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export const GeneratedPaperModel = mongoose.model<IGeneratedPaper>("GeneratedPaper", GeneratedPaperSchema);

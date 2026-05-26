import { z } from "zod";

export const aiQuestionSchema = z.object({
  question: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  marks: z.number().min(1),
  answer: z.string(),
  solution: z.string(),
});

export const aiSectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string(),
  questions: z.array(aiQuestionSchema).min(1),
});

export const aiPaperMetadataSchema = z.object({
  schoolName: z.string(),
  examTitle: z.string(),
  subject: z.string(),
  className: z.string(),
  timeAllowed: z.string(),
  totalMarks: z.number(),
});

export const aiGeneratedPaperSchema = z.object({
  metadata: aiPaperMetadataSchema,
  sections: z.array(aiSectionSchema).min(1),
});

export type AIGeneratedPaper = z.infer<typeof aiGeneratedPaperSchema>;

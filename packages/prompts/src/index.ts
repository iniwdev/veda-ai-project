import type { DifficultyLevel, QuestionType, GenerationJobData } from "@repo/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PromptContext {
  topic: string;
  subject: string;
  questionCount: number;
  difficulty: DifficultyLevel;
  questionTypes: QuestionType[];
  gradeLevel?: string;
  additionalInstructions?: string;
}

// ─── Prompt Builders ──────────────────────────────────────────────────────────

export function buildAssessmentGenerationPrompt(ctx: PromptContext): string {
  const typesList = ctx.questionTypes.join(", ");
  return `You are an expert educational assessment creator.

Generate ${ctx.questionCount.toString()} questions about "${ctx.topic}" for the subject "${ctx.subject}".
Difficulty level: ${ctx.difficulty}
Question types to include: ${typesList}
${ctx.gradeLevel ? `Grade level: ${ctx.gradeLevel}` : ""}
${ctx.additionalInstructions ? `Additional instructions: ${ctx.additionalInstructions}` : ""}

Return a JSON array of questions following this exact structure:
{
  "questions": [
    {
      "type": "mcq" | "true_false" | "short_answer" | "essay",
      "text": "Question text",
      "options": [{ "id": "a", "text": "Option", "isCorrect": false }],
      "correctAnswer": "The correct answer",
      "explanation": "Why this is correct",
      "difficulty": "${ctx.difficulty}",
      "points": 1,
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- For mcq: provide exactly 4 options with exactly 1 marked isCorrect: true
- For true_false: provide 2 options (True/False)
- For short_answer/essay: omit options, provide correctAnswer as a model answer
- Ensure questions are pedagogically sound and unambiguous
- Return ONLY valid JSON, no markdown fences`;
}

export function buildJobContextFromData(data: GenerationJobData): PromptContext {
  return {
    topic: data.topic,
    subject: data.subject,
    questionCount: data.questionCount,
    difficulty: data.difficulty,
    questionTypes: data.questionTypes,
  };
}

// ─── Re-exports ───────────────────────────────────────────────────────────────
export type { PromptContext as default };

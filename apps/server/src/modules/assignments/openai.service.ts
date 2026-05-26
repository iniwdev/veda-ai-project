import OpenAI from "openai";
import { env } from "../../config/env.js";
import type { IAssignment } from "./assignment.model.js";
import { aiGeneratedPaperSchema, type AIGeneratedPaper } from "./generated-paper.schema.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// ─── Permanent (non-retryable) OpenAI error codes ────────────────────────────
// These should never be retried — they won't resolve on their own.
const PERMANENT_ERROR_CODES = new Set([
  "insufficient_quota",     // 429 — no billing credits
  "invalid_api_key",        // 401 — wrong key
  "account_deactivated",    // 403 — account suspended
]);

// ─── Mock Paper Generator ─────────────────────────────────────────────────────
// Used automatically when OpenAI is unavailable (no credits, no key in dev, etc.)
// Produces realistic-looking paper data from the assignment's own configuration.

function generateMockPaper(assignment: IAssignment): AIGeneratedPaper {
  console.warn("[OpenAI] Falling back to mock paper generator (OpenAI unavailable)");

  const difficultyMap: Record<string, "easy" | "medium" | "hard"> = {};
  const sections = assignment.questionConfigurations.map((config) => {
    const questions = Array.from({ length: config.numQuestions }, (_, i) => {
      const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];
      const difficulty = difficulties[i % difficulties.length]!;

      let question: string;
      switch (config.type) {
        case "Multiple Choice Questions":
          question = `Q${i + 1}. Which of the following best describes a key concept from "${assignment.title}"?\n   (A) Option A  (B) Option B  (C) Option C  (D) Option D`;
          break;
        case "True/False":
          question = `Q${i + 1}. State whether the following statement related to "${assignment.title}" is True or False: [Statement ${i + 1}]`;
          break;
        case "Fill in the Blanks":
          question = `Q${i + 1}. Fill in the blank: The primary concept in "${assignment.title}" involves _______.`;
          break;
        case "Short Questions":
          question = `Q${i + 1}. Briefly explain one key aspect of "${assignment.title}" in 2–3 sentences.`;
          break;
        case "Long Answer Questions":
          question = `Q${i + 1}. Discuss in detail the core principles of "${assignment.title}" and their practical applications. Support your answer with relevant examples.`;
          break;
        case "Diagram/Graph-Based Questions":
          question = `Q${i + 1}. Draw and label a diagram that represents the main process or structure discussed in "${assignment.title}". Describe each component briefly.`;
          break;
        case "Numerical Problems":
          question = `Q${i + 1}. A numerical problem based on the quantitative aspects of "${assignment.title}": Given that X = ${(i + 1) * 5}, calculate Y if Y = 2X + ${(i + 1) * 3}. Show all working.`;
          break;
        default:
          question = `Q${i + 1}. Answer the following question related to "${assignment.title}": [Question ${i + 1}]`;
      }

      return { question, difficulty, marks: config.marks };
    });

    return {
      title: `Section ${String.fromCharCode(65 + assignment.questionConfigurations.indexOf(config))}: ${config.type}`,
      instruction: `Answer all ${config.numQuestions} question${config.numQuestions > 1 ? "s" : ""} in this section. Each question carries ${config.marks} mark${config.marks > 1 ? "s" : ""}.`,
      questions,
    };
  });

  void difficultyMap; // suppress unused warning
  return { sections };
}

// ─── OpenAI Service ───────────────────────────────────────────────────────────

export class OpenAIService {
  async generateAssessment(assignment: IAssignment): Promise<AIGeneratedPaper> {
    const questionConfig = assignment.questionConfigurations
      .map((q) => `- ${q.numQuestions} questions of type: ${q.type} (${q.marks} marks each)`)
      .join("\n");

    const systemPrompt = `You are an expert educator. Generate an assessment paper.
Respond ONLY with a valid JSON object. Do not wrap in markdown tags like \`\`\`json.

Required JSON structure:
{
  "sections": [
    {
      "title": "string",
      "instruction": "string",
      "questions": [
        {
          "question": "string",
          "difficulty": "easy" | "medium" | "hard",
          "marks": number
        }
      ]
    }
  ]
}`;

    const userPrompt = `
Title: ${assignment.title}
Instructions: ${assignment.instructions || "None"}
Total Marks: ${assignment.totalMarks}

Requirements:
${questionConfig}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content generated from OpenAI");
      }

      const parsed = JSON.parse(content);
      return aiGeneratedPaperSchema.parse(parsed);
    } catch (error: any) {
      // ── Permanent errors: fall back to mock instead of crashing ──────────
      const code: string = error?.code ?? error?.error?.code ?? "";
      const status: number = error?.status ?? 0;

      const isPermanent =
        PERMANENT_ERROR_CODES.has(code) ||
        status === 401 ||
        (status === 429 && code === "insufficient_quota");

      if (isPermanent) {
        console.warn(`[OpenAI] Permanent error (${code || status}) — using mock paper generator`);
        return generateMockPaper(assignment);
      }

      // ── Transient errors: re-throw so BullMQ can log the failure ─────────
      console.error("[OpenAI] Transient error generating assessment:", error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();

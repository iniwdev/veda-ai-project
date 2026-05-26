/**
 * ai.service — Assessment generation via Groq (llama-3.3-70b-versatile).
 *
 * The exported class and singleton name are intentionally kept identical to
 * the old OpenAI service so the BullMQ worker requires no changes at all.
 *
 * Groq free tier: https://console.groq.com — 14,400 req/day, no card required.
 * Model used: llama-3.3-70b-versatile (supports JSON mode, very fast).
 */

import Groq from "groq-sdk";
import { env } from "../../config/env.js";
import type { IAssignment } from "./assignment.model.js";
import { aiGeneratedPaperSchema, type AIGeneratedPaper } from "./generated-paper.schema.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// ─── Permanent (non-retryable) error codes ────────────────────────────────────

const PERMANENT_STATUS_CODES = new Set([401, 403]);

function isPermanentError(error: any): boolean {
  const status: number = error?.status ?? error?.statusCode ?? 0;
  const code: string = error?.code ?? error?.error?.code ?? "";
  return (
    PERMANENT_STATUS_CODES.has(status) ||
    code === "invalid_api_key" ||
    code === "account_deactivated" ||
    // Groq uses 429 for rate-limit (transient) but also for quota (permanent)
    (status === 429 && (code === "insufficient_quota" || code === "rate_limit_exceeded_for_free_tier"))
  );
}

// ─── Mock Paper Generator (development / quota-exceeded fallback) ─────────────

function generateMockPaper(assignment: IAssignment): AIGeneratedPaper {
  console.warn("[AI] Groq unavailable — using mock paper generator");

  let globalQuestionIndex = 1;

  const sections = assignment.questionConfigurations.map((config, sectionIdx) => {
    const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];

    const questions = Array.from({ length: config.numQuestions }, (_, i) => {
      const difficulty = difficulties[i % difficulties.length]!;
      const qNum = globalQuestionIndex++;
      let question: string;

      const analyzeVerbs = ["Analyze", "Evaluate", "Compare and contrast", "Discuss", "Explain", "Critique"];
      const randomVerb = analyzeVerbs[i % analyzeVerbs.length];
      const identifyVerbs = ["Define", "State", "Identify", "Outline"];
      const randomIdentify = identifyVerbs[i % identifyVerbs.length];

      switch (config.type) {
        case "Multiple Choice Questions":
          question = `${qNum}. In the context of ${assignment.title}, which of the following is the most accurate statement?\n   (A) It relies entirely on theoretical frameworks.\n   (B) It requires empirical validation to be considered effective.\n   (C) It is mutually exclusive to other paradigms.\n   (D) It serves as a foundational component without practical application.`;
          break;
        case "True/False":
          question = `${qNum}. True or False: The primary assumptions underlying ${assignment.title} can be universally applied across all disciplines without modification.`;
          break;
        case "Fill in the Blanks":
          question = `${qNum}. Fill in the blank: When approaching problems related to ${assignment.title}, the initial step often involves establishing a robust _______.`;
          break;
        case "Short Questions":
          question = `${qNum}. ${randomIdentify} the core elements of ${assignment.title} and briefly describe their immediate impact on the system.`;
          break;
        case "Long Answer Questions":
          question = `${qNum}. ${randomVerb} the theoretical and practical implications of ${assignment.title}. Support your arguments with real-world case studies and relevant academic literature.`;
          break;
        case "Diagram/Graph-Based Questions":
          question = `${qNum}. Draw a detailed schematic representing the workflow or core structure of ${assignment.title}. Clearly label all inputs, processes, and outputs.`;
          break;
        case "Numerical Problems":
          const val1 = (i + 1) * 15;
          const val2 = (i + 1) * 7.5;
          question = `${qNum}. A system modeled on ${assignment.title} has an initial state variable of ${val1}. If it undergoes a transformation applying a factor of ${val2}, calculate the final output. Show all intermediate steps and formulas used.`;
          break;
        default:
          question = `${qNum}. Regarding ${assignment.title}: Examine the key challenges and propose potential solutions based on current literature.`;
      }

      return { question, difficulty, marks: config.marks };
    });

    const sectionLetter = String.fromCharCode(65 + sectionIdx);
    return {
      title: `Section ${sectionLetter}: ${config.type}`,
      instruction: `Answer all ${config.numQuestions} question${config.numQuestions > 1 ? "s" : ""} in this section. Each question carries ${config.marks} mark${config.marks > 1 ? "s" : ""}.`,
      questions,
    };
  });

  return { sections };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class OpenAIService {
  async generateAssessment(assignment: IAssignment): Promise<AIGeneratedPaper> {
    const questionConfig = assignment.questionConfigurations
      .map((q) => `- ${q.numQuestions} ${q.type} (${q.marks} mark${q.marks > 1 ? "s" : ""} each)`)
      .join("\n");

    const systemPrompt = `You are a senior academic professor creating a high-quality, university-level examination paper.
You MUST respond with ONLY a valid JSON object — no markdown, no explanation, no code fences.

The JSON MUST match this exact structure:
{
  "sections": [
    {
      "title": "Section A: <question type>",
      "instruction": "Answer all questions in this section. Each question carries X marks.",
      "questions": [
        {
          "question": "<full question text, including numbering>",
          "difficulty": "easy" | "medium" | "hard",
          "marks": <number>
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. SECTIONS: Create EXACTLY ONE section per question type listed in the Requirements.
2. SECTION TITLES: Use clean titles like "Section A: Short Answer Questions". Do NOT duplicate the word "Section" (e.g. avoid "Section A: Section A:"). Use consecutive letters (A, B, C...).
3. QUESTION COUNTS & MARKS: You MUST generate the EXACT number of questions requested for each section. Each question MUST carry the EXACT marks specified.
4. NUMBERING: Number questions continuously across the ENTIRE paper (e.g., 1, 2, 3, 4, 5...) or within sections. Make sure the number is included in the question text.
5. ACADEMIC QUALITY:
   - Questions MUST be highly realistic, academic, and directly relevant to the topic.
   - DO NOT use repetitive placeholder phrasing like "Briefly explain...".
   - Vary question verbs based on difficulty (e.g., Define, Explain, Compare, Analyze, Evaluate, Solve, Synthesize).
   - For Multiple Choice Questions, provide 4 plausible academic options (A, B, C, D) formatted nicely.
   - For Numerical Problems, provide realistic numbers and scenarios to calculate.
   - For Diagram/Graph questions, ask the student to draw, label, or interpret a specific process or structure.
6. difficulty MUST be strictly one of: "easy", "medium", "hard" (lowercase).`;

    const userPrompt = `Create a realistic academic examination paper for:

Topic / Title: ${assignment.title}
${assignment.instructions ? `Special Instructions: ${assignment.instructions}` : ""}
Total Marks: ${assignment.totalMarks}

Requirements (one section per line):
${questionConfig}

Generate the highest quality academic questions covering diverse aspects of the topic.
Respond with ONLY the JSON object. Do not include any other text.`;

    try {
      console.info(`[AI] Calling Groq (${env.GROQ_MODEL}) for assignment "${assignment.title}"…`);

      const response = await groq.chat.completions.create({
        model: env.GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4096,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Groq returned empty content");
      }

      console.info(`[AI] Groq responded (${content.length} chars). Parsing…`);

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        console.error("[AI] Failed to JSON.parse Groq response:", content.slice(0, 300));
        throw new Error("Groq returned invalid JSON");
      }

      const validated = aiGeneratedPaperSchema.safeParse(parsed);
      if (!validated.success) {
        console.error("[AI] Zod validation failed:", validated.error.flatten());
        throw new Error("Groq JSON did not match expected schema");
      }

      console.info(`[AI] Paper generated successfully — ${validated.data.sections.length} sections`);
      return validated.data;
    } catch (error: any) {
      // ── Permanent errors → fall back to deterministic mock ────────────────
      if (isPermanentError(error)) {
        console.warn(`[AI] Permanent error (${error?.status ?? "unknown"}) — falling back to mock generator`);
        return generateMockPaper(assignment);
      }

      // ── Transient errors → re-throw (BullMQ logs it, job marked failed) ──
      console.error("[AI] Transient error:", error?.message ?? error);
      throw error;
    }
  }
}

// Singleton — same name as before so worker import is unchanged
export const openaiService = new OpenAIService();

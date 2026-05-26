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

  const sections = assignment.questionConfigurations.map((config, sectionIdx) => {
    const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];

    const questions = Array.from({ length: config.numQuestions }, (_, i) => {
      const difficulty = difficulties[i % difficulties.length]!;
      let question: string;
      let answer: string;
      let solution: string;

      const analyzeVerbs = ["Analyze", "Evaluate", "Compare and contrast", "Discuss", "Explain", "Critique"];
      const randomVerb = analyzeVerbs[i % analyzeVerbs.length];
      const identifyVerbs = ["Define", "State", "Identify", "Outline"];
      const randomIdentify = identifyVerbs[i % identifyVerbs.length];

      switch (config.type) {
        case "Multiple Choice Questions":
          question = `In the context of ${assignment.title}, which of the following is the most accurate statement?\n(A) It relies entirely on theoretical frameworks.\n(B) It requires empirical validation to be considered effective.\n(C) It is mutually exclusive to other paradigms.\n(D) It serves as a foundational component without practical application.`;
          answer = "(B) It requires empirical validation to be considered effective.";
          solution = "Option B is correct because empirical validation is a core requirement for establishing effectiveness in modern applications of this topic. Theoretical frameworks alone (A) are insufficient.";
          break;
        case "True/False":
          question = `True or False: The primary assumptions underlying ${assignment.title} can be universally applied across all disciplines without modification.`;
          answer = "False";
          solution = "The assumptions cannot be universally applied; they must be adapted based on context and discipline-specific constraints.";
          break;
        case "Fill in the Blanks":
          question = `Fill in the blank: When approaching problems related to ${assignment.title}, the initial step often involves establishing a robust _______.`;
          answer = "framework";
          solution = "Establishing a robust framework provides the necessary structure to approach complex problems methodically.";
          break;
        case "Short Questions":
          question = `${randomIdentify} the core elements of ${assignment.title} and briefly describe their immediate impact on the system.`;
          answer = "The core elements include structural integrity, dynamic adaptability, and efficiency.";
          solution = "These elements immediately impact the system by increasing resilience to external shocks and improving overall throughput.";
          break;
        case "Long Answer Questions":
          question = `${randomVerb} the theoretical and practical implications of ${assignment.title}. Support your arguments with real-world case studies and relevant academic literature.`;
          answer = "Theoretical implications involve shifting paradigms in understanding complex systems, while practical implications include improved implementation strategies in industry.";
          solution = "A complete answer should discuss the historical context, cite at least two case studies (e.g., the 2021 Implementation Study), and critically evaluate the long-term benefits versus initial costs.";
          break;
        case "Diagram/Graph-Based Questions":
          question = `Draw a detailed schematic representing the workflow or core structure of ${assignment.title}. Clearly label all inputs, processes, and outputs.`;
          answer = "The diagram should include 3 main components: Input layer, Processing node, and Output interface.";
          solution = "Award marks as follows: 2 marks for correct structure, 2 marks for clear labeling of inputs/outputs, 1 mark for overall neatness and flow arrows.";
          break;
        case "Numerical Problems":
          const val1 = (i + 1) * 15;
          const val2 = (i + 1) * 7.5;
          question = `A system modeled on ${assignment.title} has an initial state variable of ${val1}. If it undergoes a transformation applying a factor of ${val2}, calculate the final output. Show all intermediate steps and formulas used.`;
          answer = `${val1 * val2}`;
          solution = `Step 1: Identify formula Output = Initial × Factor.\nStep 2: Substitute values: Output = ${val1} × ${val2}.\nStep 3: Calculate final result = ${val1 * val2}.`;
          break;
        default:
          question = `Regarding ${assignment.title}: Examine the key challenges and propose potential solutions based on current literature.`;
          answer = "Key challenges include resource limitation and scalability.";
          solution = "Solutions proposed in literature focus on distributed processing and optimized resource allocation algorithms.";
      }

      return { question, difficulty, marks: config.marks, answer, solution };
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
          "question": "<full question text, do NOT include question numbers here>",
          "difficulty": "easy" | "medium" | "hard",
          "marks": <number>,
          "answer": "<direct, concise correct answer>",
          "solution": "<detailed step-by-step solution, explanation, or marking rubric>"
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. SECTIONS: Create EXACTLY ONE section per question type listed in the Requirements.
2. SECTION TITLES: Use clean titles like "Section A: Short Answer Questions". Do NOT duplicate the word "Section" (e.g. avoid "Section A: Section A:"). Use consecutive letters (A, B, C...).
3. QUESTION COUNTS & MARKS: You MUST generate the EXACT number of questions requested for each section. Each question MUST carry the EXACT marks specified.
4. DO NOT NUMBER QUESTIONS: Leave the numbering out of the question string (e.g. use "Explain the..." instead of "1. Explain the..."). The frontend handles numbering.
5. ACADEMIC QUALITY:
   - Questions MUST be highly realistic, academic, and directly relevant to the topic and any additional instructions.
   - DO NOT use repetitive placeholder phrasing like "Briefly explain...".
   - Vary question verbs based on difficulty (e.g., Define, Explain, Compare, Analyze, Evaluate, Solve, Synthesize).
   - For Multiple Choice Questions, provide 4 plausible academic options (A, B, C, D) formatted cleanly in the question string.
   - For Numerical Problems, provide realistic numbers and scenarios.
   - For Diagram/Graph questions, ask the student to draw, label, or interpret a specific process or structure.
6. ANSWER KEY & SOLUTIONS:
   - "answer" must be the final direct answer.
   - "solution" must contain detailed steps (for numericals), conceptual explanations (for theory), or a marking rubric (for diagrams/long answers).
7. difficulty MUST be strictly one of: "easy", "medium", "hard" (lowercase).
8. ADHERE STRICTLY to any Special Instructions provided.`;

    const userPrompt = `Create a realistic academic examination paper for:

Topic / Title: ${assignment.title}
${assignment.instructions ? `Special Instructions (MUST FOLLOW): ${assignment.instructions}` : ""}
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
      if (isPermanentError(error)) {
        console.warn(`[AI] Permanent error (${error?.status ?? "unknown"}) — falling back to mock generator`);
        return generateMockPaper(assignment);
      }
      console.error("[AI] Transient error:", error?.message ?? error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();

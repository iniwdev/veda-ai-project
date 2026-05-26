/**
 * ai.service — Assessment generation via Groq (llama-3.3-70b-versatile).
 *
 * Architecture: SECTION-BY-SECTION generation.
 * Balances rate limits (30 RPM) and LLM template repetition.
 * Each section gets its own API call with strict diversity rules.
 *
 * Fallback: If Groq rate limits or fails, it automatically falls back
 * to OpenAI (gpt-4o-mini) to ensure generation always succeeds.
 */

import Groq from "groq-sdk";
import OpenAI from "openai";
import { env } from "../../config/env.js";
import type { IAssignment } from "./assignment.model.js";
import { type AIGeneratedPaper } from "./generated-paper.schema.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeneratedQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  answer: string;
  solution: string;
}

interface ResolvedMeta {
  schoolName: string | null;
  examTitle: string | null;
  subject: string | null;
  className: string | null;
  timeAllowed: string | null;
  totalMarks: number;
}

// ─── Error Classification ─────────────────────────────────────────────────────

function isPermanentAuthError(error: any): boolean {
  const status: number = error?.status ?? error?.statusCode ?? 0;
  const code: string = error?.code ?? error?.error?.code ?? "";
  return (
    status === 401 || status === 403 || code === "invalid_api_key" || code === "account_deactivated"
  );
}

function isRateLimitError(error: any): boolean {
  const status: number = error?.status ?? error?.statusCode ?? 0;
  return status === 429;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Garbage Detection ────────────────────────────────────────────────────────

const GARBAGE_PATTERNS = [
  /\bmodule\s*\d/i,
  /\bfactor\s*\d/i,
  /\baspect\s*\d/i,
  /\bscenario\s*\d/i,
  /\bperspective\s*\d/i,
  /\bcore\s+structure/i,
  /\bcore\s+elements/i,
  /\bworkflow/i,
  /\bmethodology\s+of/i,
  /\bfundamentals\s+of\s+(quiz|test|exam|assignment)/i,
  /\bquiz\s+of\b/i,
  /\binitial\s+state\s+variable/i,
  /\bapplication\s+domain\s*\d/i,
  /\bcase\s+study\s*\d/i,
];

/** Returns true if any question in the array looks like template garbage. */
function hasGarbageQuestion(questions: GeneratedQuestion[]): boolean {
  return questions.some((q) => GARBAGE_PATTERNS.some((rx) => rx.test(q.question)));
}

// ─── Duplicate Detection ──────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the",
  "is",
  "at",
  "which",
  "on",
  "a",
  "an",
  "and",
  "or",
  "what",
  "how",
  "why",
  "who",
  "when",
  "where",
  "to",
  "in",
  "of",
  "for",
  "with",
  "as",
  "by",
  "are",
  "do",
  "does",
  "did",
  "can",
  "could",
  "would",
  "should",
  "its",
  "it",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "this",
  "that",
  "these",
  "those",
  "from",
  "not",
  "but",
  "all",
  "each",
  "every",
  "any",
  "some",
  "such",
  "than",
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function contentWords(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((w) => !STOP_WORDS.has(w) && w.length > 2);
}

function jaccardSimilarity(a: string, b: string): number {
  const w1 = new Set(contentWords(a));
  const w2 = new Set(contentWords(b));
  if (w1.size === 0 || w2.size === 0) return 0;
  let intersection = 0;
  for (const w of w1) if (w2.has(w)) intersection++;
  const union = w1.size + w2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Check if any question in candidate array is too similar to global pool */
function hasDuplicate(candidates: GeneratedQuestion[], pool: string[]): boolean {
  for (const q of candidates) {
    const norm = normalize(q.question);
    for (const existing of pool) {
      if (normalize(existing) === norm) return true;
      if (jaccardSimilarity(q.question, existing) > 0.45) return true;
    }
  }
  return false;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class OpenAIService {
  async generateAssessment(assignment: IAssignment): Promise<AIGeneratedPaper> {
    const meta: ResolvedMeta = {
      schoolName: assignment.schoolName?.trim() || null,
      examTitle: assignment.examType?.trim() || null,
      subject: assignment.subject?.trim() || null,
      className: assignment.className?.trim() || null,
      timeAllowed: assignment.duration?.trim() || null,
      totalMarks: assignment.questionConfigurations.reduce(
        (sum, q) => sum + q.numQuestions * q.marks,
        0,
      ),
    };

    const resolvedSubject = meta.subject || this.inferSubject(assignment.title);
    console.info(`[AI] ═══ Starting paper generation for "${assignment.title}" ═══`);

    const globalPool: string[] = [];
    const sections: AIGeneratedPaper["sections"] = [];

    for (let si = 0; si < assignment.questionConfigurations.length; si++) {
      const config = assignment.questionConfigurations[si]!;
      const sectionLetter = String.fromCharCode(65 + si);
      const sectionTitle = `Section ${sectionLetter}: ${config.type}`;

      console.info(`[AI] ── ${sectionTitle}: generating ${config.numQuestions} question(s) ──`);

      const sectionQuestions = await this.generateSection({
        topic: assignment.title,
        subject: resolvedSubject,
        className: meta.className || "",
        instructions: assignment.instructions || "",
        sectionType: config.type,
        numQuestions: config.numQuestions,
        marks: config.marks,
        globalPool,
      });

      // Add generated questions to global pool for future sections
      for (const q of sectionQuestions) {
        globalPool.push(q.question);
      }

      sections.push({
        title: sectionTitle,
        instruction: `Answer all ${config.numQuestions} question${config.numQuestions > 1 ? "s" : ""}. Each carries ${config.marks} mark${config.marks > 1 ? "s" : ""}.`,
        questions: sectionQuestions,
      });
    }

    return {
      metadata: {
        schoolName: meta.schoolName ?? "Delhi Public School",
        examTitle: meta.examTitle ?? "Examination",
        subject: resolvedSubject,
        className: meta.className ?? "X",
        timeAllowed: meta.timeAllowed ?? `${Math.round(meta.totalMarks * 1.5)} Minutes`,
        totalMarks: meta.totalMarks,
      },
      sections,
    };
  }

  private async generateSection(ctx: {
    topic: string;
    subject: string;
    className: string;
    instructions: string;
    sectionType: string;
    numQuestions: number;
    marks: number;
    globalPool: string[];
  }): Promise<GeneratedQuestion[]> {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const questions = await this.callLLMWithRetry(ctx, attempt);

      if (hasGarbageQuestion(questions)) {
        console.warn(`[AI]   ⚠ Attempt ${attempt}: garbage template detected, retrying section`);
        if (attempt === maxAttempts) return questions;
        continue;
      }

      if (hasDuplicate(questions, ctx.globalPool)) {
        console.warn(
          `[AI]   ⚠ Attempt ${attempt}: duplicates detected against previous sections, retrying`,
        );
        if (attempt === maxAttempts) return questions;
        continue;
      }

      return questions;
    }
    throw new Error("Failed to generate section after max attempts");
  }

  private async callLLMWithRetry(
    ctx: {
      topic: string;
      subject: string;
      className: string;
      instructions: string;
      sectionType: string;
      numQuestions: number;
      marks: number;
      globalPool: string[];
    },
    qualityAttempt: number,
  ): Promise<GeneratedQuestion[]> {
    const maxRetries = 3;
    let lastErr: any = null;

    // First try Groq
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        return await this.callGroqForSection(ctx, qualityAttempt);
      } catch (err: any) {
        lastErr = err;
        if (isPermanentAuthError(err)) {
          console.error(`[AI] ✗ Permanent Groq auth error.`);
          break; // Break Groq loop, try OpenAI
        }
        if (isRateLimitError(err)) {
          const waitMs = Math.min(2000 * Math.pow(2, retry), 8000);
          console.warn(
            `[AI]   Groq rate limited (429). Waiting ${waitMs}ms before retry ${retry + 1}/${maxRetries}…`,
          );
          await sleep(waitMs);
          continue;
        }
        if (retry < 1) {
          console.warn(`[AI]   Groq Error: ${err.message}. Retrying…`);
          await sleep(1000);
          continue;
        }
        break; // Break Groq loop, try OpenAI
      }
    }

    // Fallback to OpenAI if configured
    if (openai) {
      console.warn(`[AI] ⚠ Groq failed after retries. Falling back to OpenAI (gpt-4o-mini)…`);
      for (let retry = 0; retry < 2; retry++) {
        try {
          return await this.callOpenAIForSection(ctx, qualityAttempt);
        } catch (err: any) {
          console.warn(`[AI]   OpenAI Error: ${err.message}. Retrying…`);
          await sleep(1500);
        }
      }
    }

    throw new Error(`AI generation failed. Last Groq error: ${lastErr?.message || "Unknown"}`);
  }

  private buildPromptsForSection(
    ctx: {
      topic: string;
      subject: string;
      className: string;
      instructions: string;
      sectionType: string;
      numQuestions: number;
      marks: number;
      globalPool: string[];
    },
    qualityAttempt: number,
  ): { systemPrompt: string; userPrompt: string } {
    const {
      topic,
      subject,
      className,
      instructions,
      sectionType,
      numQuestions,
      marks,
      globalPool,
    } = ctx;

    const exclusionBlock =
      globalPool.length > 0
        ? `\n══ ALREADY GENERATED (you MUST NOT repeat any of these topics) ══\n${globalPool.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n`
        : "";

    const typeGuide: Record<string, string> = {
      "Multiple Choice Questions":
        "MCQs with 4 options labeled (A), (B), (C), (D) in the question text. Only ONE correct answer. Distractors must be plausible.",
      "Short Questions": "Concise theory/application questions answerable in 2-5 sentences.",
      "Long Answer Questions": "Detailed questions requiring a multi-paragraph response.",
      "Numerical Problems":
        "Calculation problems with specific numbers, units, and a step-by-step mathematical solution.",
      "True/False":
        "Clear factual statements to evaluate as True or False. Include the statement in the question text.",
      "Fill in the Blanks":
        "Statements with exactly one blank (use _______) testing a key technical term or concept.",
      "Diagram/Graph-Based Questions":
        "Ask the student to draw, label, or interpret a REAL diagram or graph relevant to the subject.",
    };

    const systemPrompt = `You are an experienced ${subject} teacher setting a real school examination paper${className ? ` for ${className}` : ""}.

CRITICAL IDENTITY RULES:
- You generate REAL exam questions that test ACTUAL ${subject} concepts (laws, theorems, formulas, real-world applications).
- You write questions that would appear in a genuine school board exam.
- You NEVER generate generic filler like "core elements of", "methodology of", "workflow", "module 1", "factor 1".

BANNED PATTERNS (if your output contains any of these, it will be REJECTED):
- "module [number]", "factor [number]", "aspect [number]"
- "core structure", "core elements", "workflow", "methodology of"
- "fundamentals of quiz", "application domain [number]"

DIVERSITY RULE:
You are generating ${numQuestions} questions for this section.
EVERY SINGLE QUESTION MUST TEST A COMPLETELY DIFFERENT SUB-TOPIC AND CONCEPT.
DO NOT REPEAT VERBS ("Define", "State", "Explain").

Respond with ONLY a JSON object containing an array of questions:
{
  "questions": [
    {
      "question": "<real ${subject} exam question>",
      "difficulty": "easy" | "medium" | "hard",
      "marks": ${marks},
      "answer": "<direct correct answer>",
      "solution": "<step-by-step solution or explanation>"
    }
  ]
}`;

    const userPrompt = `Generate EXACTLY ${numQuestions} questions for the "${sectionType}" section.

Subject: ${subject}
Topic: ${topic}
${instructions ? `Teacher's specific instructions: ${instructions}` : ""}
Marks per question: ${marks}

Format Guidelines:
${typeGuide[sectionType] || `Generate high-quality ${subject} exam questions.`}
${exclusionBlock}
${qualityAttempt > 1 ? `\n⚠ IMPORTANT: This is retry #${qualityAttempt}. Generate COMPLETELY DIFFERENT questions.` : ""}`;

    return { systemPrompt, userPrompt };
  }

  private async callGroqForSection(
    ctx: {
      topic: string;
      subject: string;
      className: string;
      instructions: string;
      sectionType: string;
      numQuestions: number;
      marks: number;
      globalPool: string[];
    },
    qualityAttempt: number,
  ): Promise<GeneratedQuestion[]> {
    const { numQuestions, marks } = ctx;
    const { systemPrompt, userPrompt } = this.buildPromptsForSection(ctx, qualityAttempt);

    const response = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: Math.min(0.85 + qualityAttempt * 0.05, 1.0),
      max_tokens: 2048,
    });

    return this.parseLLMResponse(response.choices[0]?.message?.content, numQuestions, marks);
  }

  private async callOpenAIForSection(
    ctx: {
      topic: string;
      subject: string;
      className: string;
      instructions: string;
      sectionType: string;
      numQuestions: number;
      marks: number;
      globalPool: string[];
    },
    qualityAttempt: number,
  ): Promise<GeneratedQuestion[]> {
    if (!openai) throw new Error("OpenAI client not initialized");

    const { numQuestions, marks } = ctx;
    const { systemPrompt, userPrompt } = this.buildPromptsForSection(ctx, qualityAttempt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: Math.min(0.85 + qualityAttempt * 0.05, 1.0),
      max_tokens: 2048,
    });

    return this.parseLLMResponse(response.choices[0]?.message?.content, numQuestions, marks);
  }

  private parseLLMResponse(
    content: string | undefined | null,
    numQuestions: number,
    marks: number,
  ): GeneratedQuestion[] {
    if (!content) throw new Error("Empty LLM response");

    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.questions)) {
      throw new Error("Invalid JSON structure: expected 'questions' array");
    }

    const questions: GeneratedQuestion[] = [];
    for (const q of parsed.questions.slice(0, numQuestions)) {
      questions.push({
        question: String(q.question || "").trim(),
        difficulty: (["easy", "medium", "hard"].includes(q.difficulty)
          ? q.difficulty
          : "medium") as GeneratedQuestion["difficulty"],
        marks: Number(q.marks) || marks,
        answer: String(q.answer || ""),
        solution: String(q.solution || ""),
      });
    }

    if (questions.length < numQuestions) {
      throw new Error(`LLM returned ${questions.length} questions, expected ${numQuestions}`);
    }

    return questions;
  }

  private inferSubject(title: string): string {
    const t = title.toLowerCase();
    if (/math|algebra|calculus|geometry|trigonometry|equation/.test(t)) return "Mathematics";
    if (/physics|mechanics|wave|optics|electr|magnetism|force/.test(t)) return "Physics";
    if (/chem|reaction|bond|element|mole|acid|base/.test(t)) return "Chemistry";
    if (/bio|cell|enzyme|genetics|ecology|evolution|respiration/.test(t)) return "Biology";
    if (/history|revolution|empire|civilization|war|dynasty/.test(t)) return "History";
    if (/english|grammar|literature|essay|poem|prose/.test(t)) return "English";
    if (/computer|programming|algorithm|data|software/.test(t)) return "Computer Science";
    return "General Studies";
  }
}

export const openaiService = new OpenAIService();

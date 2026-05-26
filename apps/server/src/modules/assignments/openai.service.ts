import OpenAI from "openai";
import { env } from "../../config/env.js";
import type { IAssignment } from "./assignment.model.js";
import { aiGeneratedPaperSchema, type AIGeneratedPaper } from "./generated-paper.schema.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2, // Keep it deterministic
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    try {
      const parsed = JSON.parse(content);
      return aiGeneratedPaperSchema.parse(parsed);
    } catch (error) {
      console.error("Failed to parse or validate AI JSON:", error);
      throw new Error("Invalid AI generated content");
    }
  }
}

export const openaiService = new OpenAIService();

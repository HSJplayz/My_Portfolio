import "server-only";

import { groq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

/**
 * Groq-only provider (Google quota exhausted).
 * Uses Groq Llama 3.3 70B (30 RPM free tier).
 */

let cachedModel: LanguageModel | null = null;

function createGroqModel(model: string): LanguageModel {
  const apiKey = process.env.GROQ_API_KEY;
  return groq(model, apiKey ? { apiKey } : undefined);
}

export function getModel(): LanguageModel {
  if (cachedModel) {
    return cachedModel;
  }

  const modelName = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const groqModel = createGroqModel(modelName);
  console.log("[LLM] Using Groq:", modelName);
  cachedModel = groqModel;
  return groqModel;
}

export function buildSystemPrompt(knowledge: string): string {
  return [
    `You are the personal portfolio assistant for Hrushikesh Jagtap.`,
    `Answer questions ONLY about Hrushikesh: his background, education, skills, projects, experience, certifications, and how to contact him.`,
    `Base every answer on the knowledge base below. If the answer is not in the knowledge base, say you don't know and suggest asking him directly (hrushijagtap333@gmail.com).`,
    `Keep answers friendly, concise, and in plain text. Do not invent facts.`,
    ``,
    `=== KNOWLEDGE BASE ===`,
    knowledge,
  ].join("\n");
}

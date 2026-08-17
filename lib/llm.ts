import "server-only";

import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

let cachedModel: LanguageModel | null = null;

export function getModel(): LanguageModel {
  if (cachedModel) return cachedModel;

  const provider = (process.env.LLM_PROVIDER ?? "google") as
    | "google"
    | "groq";

  if (provider === "groq") {
    const key = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
    if (!key) throw new Error("GROQ_API_KEY is not set");
    cachedModel = groq(model);
    return cachedModel;
  }

  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const model = process.env.LLM_MODEL ?? "gemini-2.0-flash";
  if (!key) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
  cachedModel = google(model);
  return cachedModel;
}

export async function getModelWithFallback(): Promise<LanguageModel> {
  try {
    return getModel();
  } catch {
    const provider = process.env.LLM_PROVIDER ?? "google";
    if (provider === "google") {
      const key = process.env.GROQ_API_KEY;
      if (!key) throw new Error("Both Google and Groq API keys are missing");
      const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
      cachedModel = groq(model);
      return cachedModel;
    }
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) throw new Error("Both Groq and Google API keys are missing");
    const model = process.env.LLM_MODEL ?? "gemini-2.0-flash";
    cachedModel = google(model);
    return cachedModel;
  }
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

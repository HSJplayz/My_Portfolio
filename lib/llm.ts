import "server-only";

import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

/**
 * Provider abstraction.
 *
 * Switch backends by changing LLM_PROVIDER in .env.local:
 *  - "google"  (default) → Google Gemini (needs GOOGLE_GENERATIVE_AI_API_KEY)
 *  - "groq"    → npm i @ai-sdk/groq, then add the case below (needs GROQ_API_KEY)
 *  - "ollama"  → local learning track (needs a running Ollama server)
 *
 * See README.md → "Chatbot" for the full learning notes.
 */
export function getModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER ?? "google";
  const model = process.env.LLM_MODEL ?? "gemini-3.5-flash";

  switch (provider) {
    case "google":
      return google(model);
    // case "groq": {
    //   const { groq } = await import("@ai-sdk/groq");
    //   return groq(process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile");
    // }
    // case "ollama": {
    //   const { createOllama } = await import("ollama-ai-provider");
    //   const ollama = createOllama({ baseURL: "http://localhost:11434/api" });
    //   return ollama(process.env.OLLAMA_MODEL ?? "llama3.2");
    // }
    default:
      return google(model);
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

import "server-only";

import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

/**
 * Provider abstraction with automatic fallback.
 *
 * Switch backends by changing LLM_PROVIDER in .env.local:
 *  - "google"  (default) → Google Gemini (needs GOOGLE_GENERATIVE_AI_API_KEY)
 *  - "groq"    → npm i @ai-sdk/groq, then add the case below (needs GROQ_API_KEY)
 *  - "ollama"  → local learning track (needs a running Ollama server)
 *
 * Automatic fallback: if Google quota is exhausted, falls back to Groq.
 *
 * See README.md → "Chatbot" for the full learning notes.
 */

let cachedModel: LanguageModel | null = null;
let lastProvider: "google" | "groq" | null = null;

function createGoogleModel(model: string): LanguageModel {
  return google(model);
}

function createGroqModel(model: string): LanguageModel {
  return groq(process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile");
}

function isQuotaError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("quota") || 
           msg.includes("rate limit") || 
           msg.includes("429") ||
           msg.includes("resource exhausted") ||
           msg.includes("exceeded");
  }
  return false;
}

export async function getModel(): Promise<LanguageModel> {
  if (cachedModel && lastProvider) {
    return cachedModel;
  }

  const preferredProvider = (process.env.LLM_PROVIDER ?? "google") as "google" | "groq";
  const googleModel = process.env.LLM_MODEL ?? "gemini-3.5-flash";
  const groqModel = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const tryProvider = async (provider: "google" | "groq"): Promise<LanguageModel> => {
    if (provider === "google") {
      return createGoogleModel(googleModel);
    }
    return createGroqModel(groqModel);
  };

  // Try preferred provider first
  const primaryModel = await tryProvider(preferredProvider);
  
  // Test if the primary provider works (Google has quota limits)
  if (preferredProvider === "google") {
    try {
      // Quick test to see if Google API works
      const { streamText } = await import("ai");
      await streamText({
        model: primaryModel,
        prompt: "test",
        maxTokens: 1,
      }).consume();
      console.log("[LLM] Using Google Gemini");
      cachedModel = primaryModel;
      lastProvider = "google";
      return primaryModel;
    } catch (error) {
      if (isQuotaError(error)) {
        console.log("[LLM] Google quota exhausted, falling back to Groq");
        // Fall through to Groq
      } else {
        // Some other error, still try Groq
        console.log("[LLM] Google error, trying Groq:", error);
      }
    }
  }

  // Fallback to Groq
  try {
    const groqModelInstance = await tryProvider("groq");
    const { streamText } = await import("ai");
    await streamText({
      model: groqModelInstance,
      prompt: "test",
      maxTokens: 1,
    }).consume();
    console.log("[LLM] Using Groq (fallback)");
    cachedModel = groqModelInstance;
    lastProvider = "groq";
    return groqModelInstance;
  } catch (error) {
    console.error("[LLM] Both providers failed:", error);
    throw error;
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

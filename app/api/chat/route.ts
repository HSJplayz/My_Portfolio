import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { getModelWithFallback, buildSystemPrompt } from "@/lib/llm";
import { getKnowledgeBase } from "@/lib/knowledge";

export const runtime = "nodejs";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: UIMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) {
      return Response.json(
        { error: "No messages provided." },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    const knowledge = await getKnowledgeBase();
    const system = buildSystemPrompt(knowledge);
    const model = await getModelWithFallback();

    const result = streamText({
      model,
      system,
      messages: await convertToModelMessages(messages),
    });

    const response = createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });

    for (const [key, value] of Object.entries(corsHeaders(request))) {
      response.headers.set(key, value);
    }

    return response;
  } catch (error) {
    console.error("Chat error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: message },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { getModel, buildSystemPrompt } from "@/lib/llm";
import { getKnowledgeBase } from "@/lib/knowledge";

export const runtime = "nodejs";

const CORS_ORIGINS = [
  "https://hsjplayz.github.io",
  "http://localhost:3000",
  "http://localhost:3001",
];

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allow = CORS_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow || "null",
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

    const result = streamText({
      model: getModel(),
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
    return Response.json(
      { error: "Something went wrong processing your message." },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

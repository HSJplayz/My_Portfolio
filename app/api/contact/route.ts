import { Resend } from "resend";

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
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Contact form is not configured yet." },
        { status: 503, headers: corsHeaders(request) },
      );
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };
    const name = (body.name ?? "").trim().slice(0, 120);
    const email = (body.email ?? "").trim().slice(0, 200);
    const message = (body.message ?? "").trim().slice(0, 5000);

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email and message are required." },
        { status: 400, headers: corsHeaders(request) },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM ?? "My Portfolio <onboarding@resend.dev>";
    const to = process.env.RESEND_TO ?? "hrushijagtap333@gmail.com";

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Could not send your message. Please email me directly instead." },
        { status: 500, headers: corsHeaders(request) },
      );
    }

    return Response.json(
      { ok: true },
      { status: 200, headers: corsHeaders(request) },
    );
  } catch (error) {
    console.error("Contact error:", error);
    return Response.json(
      { error: "Something went wrong. Please email me directly instead." },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

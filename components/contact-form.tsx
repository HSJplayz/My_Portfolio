"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/data/profile";

const CONTACT_API = process.env.NEXT_PUBLIC_CONTACT_API || "/api/contact";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");

    try {
      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setState("error");
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setState("done");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setState("error");
      setError("Could not reach the server. Please use the email link below.");
    }
  }

  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio message from ${name || "a visitor"}`,
  )}&body=${encodeURIComponent(message || "")}`;

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
              Name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-cream px-3.5 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-cream px-3.5 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
            Message
          </span>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-line bg-cream px-3.5 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            placeholder="Tell me about your project, role, or question…"
          />
        </label>

        {state === "error" && (
          <p className="text-sm text-accent">{error}</p>
        )}
        {state === "done" && (
          <p className="text-sm text-[#4d6b3a]">
            Message sent — thank you! I&apos;ll get back to you soon.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={state === "sending"}
            className="h-11 rounded-full bg-ink px-6 text-sm text-paper transition-colors hover:bg-accent disabled:opacity-50"
          >
            {state === "sending" ? "Sending…" : "Send message"}
          </button>
          <a
            href={mailtoHref}
            onClick={(e) => {
              if (!navigator.clipboard) return;
              e.preventDefault();
              copyEmail();
            }}
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {copied ? "Email copied ✓" : "or email me directly"}
          </a>
        </div>
      </form>
    </div>
  );
}

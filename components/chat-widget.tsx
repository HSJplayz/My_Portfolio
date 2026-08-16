"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

const ChatBot = dynamic(() => import("@/components/chat-bot").then((m) => m.ChatBot), {
  ssr: false,
});

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API || "/api/chat";

const GREETING = {
  id: "greeting",
  role: "assistant" as const,
  parts: [
    {
      type: "text" as const,
      text: "Hi! I'm an assistant that knows all about Hrushikesh — his projects, skills, experience and more. Ask me anything about him!",
    },
  ],
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: CHAT_API }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const allMessages = [GREETING, ...messages];
  const busy = status === "submitted" || status === "streaming";
  const mode: "idle" | "typing" | "thinking" | "speaking" =
    status === "submitted"
      ? "thinking"
      : status === "streaming"
        ? "speaking"
        : input.trim()
          ? "typing"
          : "idle";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-[#faf3e3] to-paper shadow-2xl shadow-ink/15"
          >
            <div className="flex items-center justify-between border-b border-line bg-gradient-to-r from-accent/10 via-cream-2 to-accent-2/15 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 shrink-0">
                  <ChatBot mode={mode} />
                </div>
                <div>
                  <p className="font-display text-lg text-ink">
                    Ask me about Hrushikesh
                  </p>
                  <p className="text-xs text-muted">
                    {busy ? "thinking…" : "usually replies in seconds"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {allMessages.map((m) => {
                const text = m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {isUser ? (
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-sm leading-relaxed text-paper">
                        {text}
                      </div>
                    ) : (
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-accent/15 bg-cream px-3.5 py-2.5 text-sm leading-relaxed text-ink [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-line [&_code]:px-1 [&_code]:py-0.5 [&_strong]:font-semibold [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:mb-1.5 [&_h2]:mb-1.5 [&_h3]:mb-1.5 [&_hr]:my-2 [&_hr]:border-line">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
              {busy && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-cream px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                        className="h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim() || busy) return;
                sendMessage({ text: input });
                setInput("");
              }}
              className="flex items-center gap-2 border-t border-line px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about his projects, skills…"
                className="h-10 flex-1 rounded-full border border-line bg-cream px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-paper transition-opacity disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M15 1L1 7.5l5 1.5m9-8l-4.5 13-2.5-5.5m7-7.5L7.5 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-xl shadow-ink/25 transition-colors hover:bg-accent"
        aria-label="Open chat"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3c-5 0-9 3.6-9 8 0 1.9.7 3.6 1.8 4.9L3.7 21l4.6-1.8c1.1.4 2.4.6 3.7.6 5 0 9-3.6 9-8s-4-8-9-8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="11" r="0.8" fill="currentColor" />
            <circle cx="12" cy="11" r="0.8" fill="currentColor" />
            <circle cx="15.5" cy="11" r="0.8" fill="currentColor" />
          </svg>
        )}
      </motion.button>
    </>
  );
}

# Hrushikesh Jagtap — Portfolio

A minimal, editorial-style portfolio for **Hrushikesh Jagtap** — B.Tech Computer Engineering student at PCCOE Pune. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Motion** (Framer Motion).

Includes a **Gemini-powered chat widget** that answers questions about Hrushikesh (grounded in `content/bio.md`) and a **Resend-powered contact form**.

## Features

- Multi-page: `/`, `/projects`, `/projects/[slug]`, `/about`, `/experience`, `/contact`
- Minimalist typography-first cover, marquee, scroll reveals, and floating accents
- AI chat widget (Vercel AI SDK v7 + Google Gemini)
- Contact form delivered to your inbox via Resend
- Resume download (`/Hrushikesh-Jagtap-Resume.docx`)
- Deployable to **Vercel** (primary) and **GitHub Pages** (static backup)

## Getting Started

```bash
npm install        # or: npm ci
npm run dev        # http://localhost:3000
```

Build + lint:

```bash
npm run build
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

| Variable | Purpose |
| --- | --- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini key for the chat widget |
| `RESEND_API_KEY` | Resend key for the contact form |
| `RESEND_FROM` | Sender email (default `onboarding@resend.dev`) |
| `RESEND_TO` | Recipient email (default `hrushijagtap333@gmail.com`) |
| `NEXT_PUBLIC_CHAT_API` | Full URL to `/api/chat` when served from GitHub Pages (default `/api/chat`) |
| `NEXT_PUBLIC_CONTACT_API` | Full URL to `/api/contact` when served from GitHub Pages (default `/api/contact`) |

> **Resend:** the default sender `onboarding@resend.dev` only sends to your own verified account email. Add and verify a domain in Resend and set `RESEND_FROM` to send to arbitrary recipients.

## Chatbot Provider (Learning Track)

The chatbot uses a provider abstraction in `lib/llm.ts`. It defaults to Google Gemini, but contains commented-out wiring for **Groq** (free fast models) and a local **Ollama** setup — swap providers without touching the API route:

```env
LLM_PROVIDER=groq        # requires GROQ_API_KEY
LLM_MODEL=llama-3.3-70b-versatile

LLM_PROVIDER=ollama      # requires a local ollama server
LLM_MODEL=llama3.2
```

Edit `content/bio.md` and the files in `data/` to change what the chatbot knows and what the site shows.

## Deployment

### Vercel (primary)

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Add env vars: `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY` (and `RESEND_FROM`/`RESEND_TO` if changed).
3. Deploy. The chat + contact API routes live here.

### GitHub Pages (static backup)

The API routes only run on Vercel, so the Pages build points the widget at your Vercel deployment via `NEXT_PUBLIC_CHAT_API` / `NEXT_PUBLIC_CONTACT_API`.

1. Create a static export locally to verify: `BUILD_STATIC=true npm run build` (outputs to `out/`, base path `/My_Portfolio`).
2. Push to `master` — the `.github/workflows/pages.yml` action builds and deploys `out/` to the `gh-pages` branch.
3. In the workflow, update `NEXT_PUBLIC_CHAT_API` and `NEXT_PUBLIC_CONTACT_API` to your real Vercel URL.
4. Set **Settings → Pages** to deploy from the `gh-pages` branch, then visit `https://hsjplayz.github.io/My_Portfolio/`.

## Project Structure

```
app/          # pages + API routes (chat, contact)
components/   # nav, footer, marquee, chat widget, contact form, motion helpers
data/         # profile, skills, projects, experience, certifications
content/      # bio.md — chatbot knowledge base
lib/          # llm.ts (provider abstraction), knowledge.ts (bio loading)
public/       # resume + favicon
```

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Motion · Vercel AI SDK v7 · @ai-sdk/google · Resend · Turbopack

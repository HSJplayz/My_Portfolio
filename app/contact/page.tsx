import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:py-28">
      <Reveal>
        <p className="mb-4 font-mono text-sm text-accent">( Contact )</p>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          Let&apos;s talk
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Open to internships, robotics & vision work, full-stack projects, or
          just a conversation about algorithms and robots.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6 rounded-2xl border border-line bg-cream-2/50 p-7">
            <div>
              <p className="mb-1.5 font-mono text-xs uppercase tracking-widest text-accent">
                Email
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="text-lg text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {profile.email}
              </a>
            </div>

            <div>
              <p className="mb-1.5 font-mono text-xs uppercase tracking-widest text-accent">
                GitHub
              </p>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                @HSJplayz
              </a>
            </div>

            <div>
              <p className="mb-1.5 font-mono text-xs uppercase tracking-widest text-accent">
                LeetCode
              </p>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {profile.leetcodeName}
              </a>
            </div>

            <div className="border-t border-line pt-6">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                Resume
              </p>
              <a
                href={profile.resume}
                download
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm text-paper transition-colors hover:bg-accent"
              >
                Download resume ↓
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

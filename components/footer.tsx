import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-2/50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl tracking-tight text-ink">
            {profile.name}
          </p>
          <p className="mt-1 text-sm text-muted">
            {profile.role}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {profile.email}
          </a>
          <div className="flex gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              GitHub
            </a>
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              LeetCode
            </a>
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Instagram
            </a>
            <Link
              href="/contact"
              className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {profile.name} · Built with Next.js
      </div>
    </footer>
  );
}

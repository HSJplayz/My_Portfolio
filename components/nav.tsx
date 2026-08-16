"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { profile } from "@/data/profile";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-coral via-gold via-sky via-violet to-teal"
      />
      <nav className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          {profile.firstName}
          <span className="text-accent">.</span>
          <span className="hidden font-mono text-[0.68rem] font-normal uppercase tracking-[0.22em] text-muted lg:inline">
            AI · Robotics · Web
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm tracking-wide transition-colors ${
                isActive(link.href)
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-line/70 hover:text-ink"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-accent"
                />
              )}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <motion.span
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="h-px w-6 bg-ink"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="h-px w-6 bg-ink"
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line bg-cream md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6 pt-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 font-display text-2xl ${
                    isActive(link.href) ? "bg-accent/10 text-accent" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

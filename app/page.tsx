"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem, FloatingObject, heroVariants } from "@/components/motion";
import { Marquee } from "@/components/marquee";
import { ProjectCard } from "@/components/project-card";
import { profile } from "@/data/profile";
import { marqueeSkills } from "@/data/skills";
import { projects } from "@/data/projects";

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* ── Hero cover ─────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
        {/* floating ambient shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 animate-drift rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-96 w-96 animate-drift rounded-full bg-accent-2/15 blur-3xl [animation-delay:-5s]" />
          <FloatingObject className="absolute right-[12%] top-[18%] hidden lg:block">
            <span className="font-display text-7xl italic text-accent/25">✦</span>
          </FloatingObject>
          <FloatingObject className="absolute bottom-[14%] left-[10%] hidden lg:block" duration={9}>
            <span className="font-display text-6xl italic text-accent/20">✦</span>
          </FloatingObject>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-cream" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-5 py-24">
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={heroVariants}
            className="mb-6 text-sm uppercase tracking-[0.3em] text-accent"
          >
            {profile.location}
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={heroVariants}
            className="font-display text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.95] tracking-tight text-ink"
          >
            {profile.name.split(" ")[0]}
            <br />
            <span className="italic text-accent">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={heroVariants}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
          >
            {profile.role}. {profile.bio[0]}
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={heroVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/projects"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm text-paper transition-colors hover:bg-accent"
            >
              View my work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-ink/20 px-7 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Contact me
            </Link>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px bg-ink/40"
          />
        </motion.div>
      </section>

      <Marquee items={marqueeSkills} />

      {/* ── Featured projects ─────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-5 py-24">
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-sm text-accent">( Selected Work )</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Featured projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline sm:block"
            >
              All projects →
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} index={i} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            All projects →
          </Link>
        </div>
      </section>

      {/* ── About preview ──────────────────────── */}
      <section className="border-t border-line bg-cream-2/50">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-24 sm:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-accent">( About )</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">
              Engineer. Builder. <span className="italic text-accent">Roboticist.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-muted">{profile.bio.join(" ")}</p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm text-accent underline-offset-4 hover:underline"
            >
              Read the full story →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

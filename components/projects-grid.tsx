"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectCard } from "@/components/project-card";
import { projects, type Project } from "@/data/projects";

export function ProjectsGrid() {
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState("All");
  const visible = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div className="mt-14 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === cat
                ? "border-accent bg-accent text-paper"
                : "border-line bg-paper text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project: Project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

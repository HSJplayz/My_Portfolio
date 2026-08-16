export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string[];
  stack: string[];
  highlights?: string[];
  links: {
    github?: string;
    live?: string;
  };
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "portfolio-website",
    name: "Portfolio Website",
    category: "Web · Next.js",
    summary:
      "This very site — a minimal, editorial-style portfolio with a Gemini-powered chat widget and a Resend contact form.",
    description: [
      "A minimal, editorial-style portfolio built with Next.js 16, TypeScript, Tailwind CSS v4 and Motion (Framer Motion), deployed to Vercel with a GitHub Pages fallback.",
      "It features an AI chat widget powered by the Vercel AI SDK and Google Gemini that answers questions about Hrushikesh, grounded on a local knowledge base so it only talks about real facts.",
      "The contact form delivers messages straight to his inbox via Resend, and the whole site is static-exportable — the same codebase ships to Vercel (with serverless APIs) and GitHub Pages.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "AI SDK", "Gemini"],
    highlights: [
      "Gemini-powered chatbot grounded on a personal knowledge base",
      "Resend contact form with serverless API routes",
      "Dual deploy: Vercel + static GitHub Pages export",
    ],
    links: {
      github: "https://github.com/HSJplayz/My_Portfolio",
      live: "https://my-portfolio-kappa-teal-10.vercel.app",
    },
    accent: "#7b4b94",
  },
  {
    slug: "placement360",
    name: "Placement360",
    category: "Full-Stack · DSA Platform",
    summary:
      "A LeetCode-style placement preparation platform where students practice company-specific problems while teachers review and guide them.",
    description: [
      "Placement360 is a full-stack placement preparation web platform inspired by LeetCode, built for students preparing for campus placements.",
      "It organizes DSA problem sets by company so students can drill the exact patterns asked by specific recruiters.",
      "Teachers can review submitted work, track progress, and provide personal guidance — closing the loop between practice, feedback, and improvement.",
    ],
    stack: ["JavaScript", "Node.js", "Express", "MySQL", "REST APIs"],
    highlights: [
      "Company-tagged DSA problem sets",
      "Submission review & personal teacher guidance",
      "Progress tracking dashboards",
    ],
    links: {
      github: "https://github.com/HSJplayz/Cep_website",
    },
    accent: "#a94a2c",
  },
  {
    slug: "reciperoute",
    name: "RecipeRoute",
    category: "DBMS · Web App",
    summary:
      "A recipe discovery website where users can browse thousands of recipes, add their own, upload photos, rate dishes, and log in.",
    description: [
      "RecipeRoute is a recipe discovery and analytics web application built as a Database Management Systems project.",
      "A relational MySQL database indexes thousands of recipes, with structured SQL joins enabling dynamic filtering by ingredients, prep duration, and dietary categories.",
      "Users can sign in, browse recipes with photos, rate dishes, and add their own creations to the collection.",
    ],
    stack: ["MySQL", "Python", "JavaScript", "DBMS", "Kaggle Datasets"],
    highlights: [
      "SQL join queries over thousands of recipe records",
      "Filter by ingredients, duration & diet",
      "Login, photos & ratings",
    ],
    links: {
      github: "https://github.com/HSJplayz/DBMS_FA",
    },
    accent: "#4d6b3a",
  },
  {
    slug: "word-prediction-engine",
    name: "Real-Time Word Prediction Engine",
    category: "C++ · Data Structures & Algorithms",
    summary:
      "A word predictor and autocorrect system built on Trie and HashMap data structures with sub-millisecond latency.",
    description: [
      "An auto-complete, next-word suggestion, and autocorrect system implemented in C++ using Trie data structures and prefix-tree traversal.",
      "The engine achieves O(K) time complexity for lookups (K = word length) and sub-millisecond query latency over large vocabularies.",
      "A HashMap-backed frequency layer powers ranking and smarter corrections.",
    ],
    stack: ["C++", "Python", "Trie", "HashMap", "DSA"],
    highlights: [
      "O(K) prefix lookup",
      "Sub-millisecond latency",
      "Autocorrect + next-word suggestions",
    ],
    links: {
      github: "https://github.com/HSJplayz/ADS_FA",
    },
    accent: "#31546e",
  },
  {
    slug: "carbon-footprint-tracker",
    name: "Carbon Footprint Tracker",
    category: "Hackathon (SIH) · Python",
    summary:
      "A Smart India Hackathon project that tracks a user's carbon footprint and visualizes its environmental impact.",
    description: [
      "Built during Smart India Hackathon (SIH), this tool tracks a user's carbon footprint and shows how daily habits affect the environment.",
      "Python automation integrates the Google Sheets API for cloud logging, the Pixela API for habit visualization, and the Twilio API for SMS alerts.",
      "The team presented the concept of translating personal emissions data into clear, motivating environmental impact.",
    ],
    stack: ["Python", "Pixela API", "Google Sheets API", "Twilio API"],
    highlights: [
      "SIH national hackathon project",
      "Cloud logging + habit tracking + SMS alerts",
      "Emissions visualized as environmental impact",
    ],
    links: {},
    accent: "#5b6d8c",
  },
  {
    slug: "unity-2d-game",
    name: "Terraria-Style 2D Game",
    category: "Unity · Game Dev",
    summary:
      "A 2D sandbox game in Unity inspired by Terraria — dig, build, and explore a procedurally varied world.",
    description: [
      "A 2D sandbox game built with Unity and C#, taking inspiration from Terraria's crafting and exploration loops.",
      "Players mine terrain, place blocks, and explore a procedurally structured world with day cycles and dynamic interactions.",
      "An ongoing project used to deepen skills in game loops, physics, and C# architecture.",
    ],
    stack: ["Unity 2D", "C#"],
    highlights: [
      "Dig, build & explore sandbox loop",
      "C# game architecture",
      "In progress — worlds to expand",
    ],
    links: {},
    accent: "#7a5c3e",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

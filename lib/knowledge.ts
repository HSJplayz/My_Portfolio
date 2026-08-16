import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

const BIO_PATH = path.join(process.cwd(), "content", "bio.md");

const FALLBACK_BIO = `Hrushikesh Jagtap is a third-year B.Tech Computer Engineering student at PCCOE Pune, graduating 2028, specializing in Software Development, Machine Learning, and Computer Vision.

Experience: Junior Engineer (Computer Vision) at Team Automatons, PCCOE robotics team (1 year) — trained a custom YOLO pipeline to 90% accuracy, integrated OpenCV with Arduino/ESP32, competed in IRC and ABU Robocon 2026. Content & Media Specialist at PCCOE R&D Club (4 months).

Projects: Placement360 (LeetCode-style placement platform), RecipeRoute (MySQL recipe discovery app), Real-Time Word Prediction Engine (C++ Trie, O(K) lookups), Carbon Footprint Tracker (SIH hackathon), and a Terraria-style Unity 2D game.

Skills: C, C++, Python, Java, JavaScript, SQL, React, Node.js, Express, MySQL, YOLO, OpenCV, Arduino, ESP32, Raspberry Pi, Unity 2D, Git.

Contact: hrushijagtap333@gmail.com, GitHub HSJplayz, LeetCode Hrushikesh_Jagtap.`;

let cached: string | null = null;

export async function getKnowledgeBase(): Promise<string> {
  if (cached) return cached;
  try {
    cached = await fs.readFile(BIO_PATH, "utf8");
  } catch {
    cached = FALLBACK_BIO;
  }
  return cached;
}

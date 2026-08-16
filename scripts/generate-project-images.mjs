import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "projects");
mkdirSync(outDir, { recursive: true });

const MONO = `font-family="Consolas, Menlo, monospace"`;
const SERIF = `font-family="Georgia, 'Times New Roman', serif"`;

function chrome(url, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<rect width="1280" height="720" rx="16" fill="#151311"/>
<g>
  <circle cx="30" cy="22" r="7" fill="#ff5f57"/>
  <circle cx="54" cy="22" r="7" fill="#febc2e"/>
  <circle cx="78" cy="22" r="7" fill="#28c840"/>
  <rect x="460" y="9" width="360" height="26" rx="13" fill="#211d1a"/>
  <rect x="478" y="17" width="10" height="8" rx="2" fill="#6b6559"/>
  <path d="M476 20v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#6b6559" stroke-width="2"/>
  <text x="498" y="26" ${MONO} font-size="12" fill="#8a8378">${url}</text>
</g>
<line x1="0" y1="44" x2="1280" y2="44" stroke="#211d1a" stroke-width="2"/>
${inner}
</svg>`;
}

const bar = (x, y, w, h, fill, rx = 4, opacity = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" opacity="${opacity}"/>`;

const txt = (x, y, size, fill, text, style = "", weight = "400", family = MONO) =>
  `<text x="${x}" y="${y}" ${family} font-size="${size}" fill="${fill}" font-weight="${weight}" style="${style}">${text}</text>`;

const pill = (x, y, w, h, fill, opacity = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" opacity="${opacity}"/>`;

/* 1. portfolio-website — light editorial page, mirroring the real site */
{
  const accent = "#7b4b94";
  const inner = `
<rect width="1280" height="676" y="44" fill="#f6f1e7"/>
<text x="84" y="92" ${SERIF} font-size="24" fill="#2a2520" font-weight="600">Hrushikesh<tspan fill="${accent}" font-style="italic">.</tspan></text>
${txt(920, 92, 15, "#8a8174", "Work")}
${txt(984, 92, 15, "#8a8174", "About")}
${txt(1048, 92, 15, "#8a8174", "Experience")}
${txt(1120, 92, 15, "#8a8174", "Contact")}
${txt(90, 150, 13, accent, "AKURDI, PUNE, MH, INDIA", "letter-spacing:6px")}
<text x="88" y="210" ${SERIF} font-size="64" fill="#2a2520" font-weight="600">Hrushikesh</text>
<text x="88" y="280" ${SERIF} font-size="64" font-style="italic" fill="${accent}" font-weight="600">Jagtap</text>
${bar(90, 310, 470, 9, "#cfc7b8")}
${bar(90, 328, 400, 9, "#cfc7b8")}
${bar(90, 346, 320, 9, "#cfc7b8")}
${pill(90, 380, 150, 44, "#2a2520")}
${txt(148, 408, 15, "#f6f1e7", "View my work")}
<rect x="254" y="380" width="150" height="44" rx="22" fill="none" stroke="#b4a99a"/>
${txt(318, 408, 15, "#2a2520", "Contact me")}
<g>
  <rect x="700" y="120" width="420" height="420" rx="10" fill="#ffffff"/>
  <rect x="716" y="136" width="388" height="330" rx="6" fill="${accent}" opacity="0.28"/>
  <rect x="716" y="486" width="220" height="12" rx="3" fill="#cfc7b8"/>
  <rect x="716" y="504" width="150" height="10" rx="3" fill="#dcd5c8"/>
  <rect x="988" y="502" width="116" height="14" rx="3" fill="#e8e2d6"/>
</g>
`;
  writeFileSync(join(outDir, "portfolio-website.svg"), chrome("hrushijagtap.vercel.app", inner));
}

/* 2. placement360 — LeetCode-style problem list */
{
  const accent = "#a94a2c";
  const diff = [
    ["Easy", "#2e7d32"],
    ["Medium", "#b26a00"],
    ["Hard", "#c62828"],
  ];
  const rows = [
    ["1. Two Sum", 0],
    ["2. Add Two Numbers", 1],
    ["3. Merge Intervals", 2],
    ["4. Min Stack", 1],
    ["5. LRU Cache", 2],
  ]
    .map(([t, d], i) => {
      const y0 = 176 + i * 74;
      const y1 = y0 + 35;
      const y2 = y0 + 13;
      const y3 = y0 + 31;
      return `
<rect x="440" y="${y0}" width="780" height="58" rx="10" fill="#ffffff" stroke="#e6dfd2"/>
${txt(466, y1, 15, "#5b544a", `${i + 1}.`)}
${txt(506, y1, 16, "#2a2520", t)}
${pill(1180, y2, 72, 26, diff[d][1], 0.14)}
${txt(1196, y3, 13, diff[d][1], diff[d][0])}
${txt(1100, y1, 13, "#2e7d32", "✓", "font-weight:700")}`;
    })
    .join("");
  const inner = `
<rect width="1280" height="676" y="44" fill="#faf7f0"/>
<rect x="0" y="44" width="200" height="676" fill="${accent}"/>
${txt(34, 96, 20, "#ffffff", "Placement360", "font-weight:700")}
${txt(34, 160, 15, "#f3c3b2", "Dashboard")}
${txt(34, 198, 15, "#ffffff", "Problems")}
${txt(34, 236, 15, "#f3c3b2", "Submissions")}
${txt(34, 274, 15, "#f3c3b2", "Analytics")}
${pill(440, 76, 460, 34, "#eae4d6")}
${txt(466, 98, 14, "#a29a8a", "Search company problems…")}
${txt(920, 98, 14, "#8a8174", "John Doe")}
${txt(440, 150, 22, "#2a2520", "Company-tagged problems", "font-weight:600", "400", SERIF)}
<rect x="640" y="76" width="90" height="34" rx="17" fill="none" stroke="#a94a2c"/>
${txt(660, 98, 14, accent, "AC: 12")}
${rows}
`;
  writeFileSync(join(outDir, "placement360.svg"), chrome("placement360.vercel.app", inner));
}

/* 3. reciperoute — recipe card grid */
{
  const accent = "#4d6b3a";
  const cards = [
    ["Paneer Butter Masala", 4.7, 35],
    ["Vegan Buddha Bowl", 4.5, 25],
    ["Chocolate Lava Cake", 4.9, 45],
    ["Tomato Basil Soup", 4.3, 20],
    ["Mango Lassi", 4.6, 5],
    ["Dal Tadka", 4.8, 40],
  ];
  const grid = cards
    .map((c, i) => {
      const x = 440 + (i % 3) * 270;
      const y = 300 + Math.floor(i / 3) * 170;
      return `
<g>
  <rect x="${x}" y="${y}" width="240" height="150" rx="12" fill="#ffffff" stroke="#e6dfd2"/>
  <rect x="${x}" y="${y}" width="240" height="86" rx="12" fill="${accent}" opacity="${0.25 + (i % 4) * 0.12}"/>
  <rect x="${x}" y="${y + 22 + (i % 2) * 22}" width="${80 + (i % 3) * 30}" height="10" rx="3" fill="${accent}" opacity="0.5"/>
  ${txt(x + 16, y + 120, 14, "#2a2520", c[0], "font-weight:600")}
  ${txt(x + 16, y + 138, 12, "#d97951", `★ ${c[1]}   ·   ${c[2]} min`)}
</g>`;
    })
    .join("");
  const inner = `
<rect width="1280" height="676" y="44" fill="#faf7f0"/>
${txt(440, 92, 20, accent, "RecipeRoute", "font-weight:700")}
${pill(650, 72, 400, 34, "#eae4d6")}
${txt(674, 94, 14, "#a29a8a", "Search recipes…")}
${txt(1070, 92, 14, "#8a8174", "Browse · Upload · Login")}
${pill(440, 120, 92, 28, "#eae4d6")}
${txt(466, 139, 13, "#5b544a", "Vegetarian")}
${pill(542, 120, 66, 28, "#eae4d6")}
${txt(558, 139, 13, "#5b544a", "Quick")}
${pill(618, 120, 60, 28, "#eae4d6")}
${txt(634, 139, 13, "#5b544a", "Sweet")}
${txt(440, 175, 24, "#2a2520", "Popular this week", "font-weight:600", "400", SERIF)}
${grid}
${bar(440, 640, 780, 8, "#cfc7b8")}
`;
  writeFileSync(join(outDir, "reciperoute.svg"), chrome("reciperoute.example.dev", inner));
}

/* 4. word-prediction-engine — dark editor with autocomplete suggestions */
{
  const accent = "#31546e";
  const code = [
    `<tspan fill="#c586c0">string</tspan> <tspan fill="#9cdcfe">predict</tspan><tspan fill="#d4d4d4">(</tspan><tspan fill="#9cdcfe">prefix</tspan><tspan fill="#d4d4d4">) {</tspan>`,
    `  <tspan fill="#c586c0">auto</tspan> <tspan fill="#9cdcfe">node</tspan> <tspan fill="#d4d4d4">= trie-&gt;find(</tspan><tspan fill="#ce9178">"pre"</tspan><tspan fill="#d4d4d4">);</tspan>`,
    `  <tspan fill="#c586c0">vector</tspan><tspan fill="#d4d4d4">&lt;</tspan><tspan fill="#c586c0">string</tspan><tspan fill="#d4d4d4">&gt; sug = node-&gt;</tspan><tspan fill="#dcdcaa">rankTop</tspan><tspan fill="#d4d4d4">();</tspan>`,
    `  <tspan fill="#4ec9b0">return</tspan> <tspan fill="#d4d4d4">sug;   </tspan><tspan fill="#6a9955">// O(K) lookup</tspan>`,
    `<tspan fill="#d4d4d4">}</tspan>`,
  ];
  const codeBlock = code
    .map((l, i) => txt(80, 90 + i * 36, 16, "#d4d4d4", l))
    .join("");
  const chips = [
    ["predict", true],
    ["prefix", false],
    ["prune", false],
    ["preorder", false],
  ]
    .map(([w, active], i) => {
      const x = 80 + i * 160;
      const activeFill = active ? accent : "#26221d";
      const stroke = active ? "none" : "#3a352f";
      return `<rect x="${x}" y="330" width="140" height="34" rx="17" fill="${activeFill}" stroke="${stroke}"/>${txt(x + 30, 352, 14, active ? "#ffffff" : "#9a9286", w, "font-weight:600")}`;
    })
    .join("");
  const inner = `
<rect width="1280" height="676" y="44" fill="#161310"/>
<rect x="0" y="44" width="1280" height="36" fill="#1f1b18"/>
${txt(80, 68, 13, "#9a9286", "predictor.cpp — Real-Time Word Prediction Engine")}
${codeBlock}
${txt(80, 300, 16, "#9a9286", "$ ", "font-weight:700")}
${txt(98, 300, 16, "#e8e2d6", "pr", "font-weight:700")}
<rect x="128" y="288" width="9" height="19" fill="${accent}"/>
${txt(80, 334, 12, "#6b6559", "suggestions")}
${chips}
${bar(80, 400, 300, 7, "#26221d")}
${bar(80, 414, 250, 7, "#26221d")}
${bar(80, 428, 180, 7, "#26221d")}
`;
  writeFileSync(join(outDir, "word-prediction-engine.svg"), chrome("localhost:8080", inner));
}

/* 5. carbon-footprint-tracker — dashboard with bar chart */
{
  const accent = "#5b6d8c";
  const bars = [42, 55, 38, 62, 48, 70, 58];
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const chart = bars
    .map((h, i) => {
      const x = 560 + i * 90;
      const y = 470 - h * 2.4;
      const fill = i % 2 === 0 ? accent : "#8ea2bf";
      return `
<rect x="${x}" y="${y}" width="52" height="${h * 2.4}" rx="8" fill="${fill}"/>
${txt(x + 26, 488, 13, "#8a8174", labels[i])}`;
    })
    .join("");
  const inner = `
<rect width="1280" height="676" y="44" fill="#f4f6f9"/>
${txt(440, 92, 22, "#22324a", "Carbon Footprint", "font-weight:700", "400", SERIF)}
${txt(1000, 92, 14, "#8a8174", "May 2026")}
<g>
  <rect x="440" y="120" width="230" height="110" rx="14" fill="#ffffff" stroke="#e3e8ef"/>
  ${txt(462, 160, 13, "#8a8174", "This week")}
  <text x="462" y="200" ${SERIF} font-size="34" fill="#22324a" font-weight="600">18.4 kg</text>
</g>
<g>
  <rect x="690" y="120" width="230" height="110" rx="14" fill="#ffffff" stroke="#e3e8ef"/>
  ${txt(712, 160, 13, "#8a8174", "Best day")}
  <text x="712" y="200" ${SERIF} font-size="34" fill="#4d6b3a" font-weight="600">Wed</text>
</g>
<g>
  <rect x="940" y="120" width="230" height="110" rx="14" fill="#ffffff" stroke="#e3e8ef"/>
  ${txt(962, 160, 13, "#8a8174", "SMS alerts")}
  ${pill(962, 182, 54, 24, "#2e7d32", 0.16)}
  ${txt(976, 199, 12, "#2e7d32", "ON")}
</g>
${txt(440, 275, 22, "#22324a", "Weekly footprint", "font-weight:600", "400", SERIF)}
${chart}
${txt(440, 535, 13, "#8a8174", "Translated to: 3.1 km of driving · 0.9 trees to offset")}
${bar(440, 575, 300, 7, "#d7dee7")}
${bar(440, 589, 240, 7, "#d7dee7")}
`;
  writeFileSync(join(outDir, "carbon-footprint-tracker.svg"), chrome("eco-habits.vercel.app", inner));
}

/* 6. unity-2d-game — pixel terrain scene */
{
  const terrain = Array.from({ length: 12 })
    .map((_, i) => {
      const x = i * 110 + 20;
      const h = 80 - (i % 3) * 22;
      const y = 470 + (i % 3) * 22;
      return `<rect x="${x}" y="${y}" width="${60 + (i % 4) * 10}" height="${h}" rx="4" fill="#3d5c30" opacity="0.9"/>`;
    })
    .join("");
  const inner = `
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a4a6b"/>
    <stop offset="0.7" stop-color="#d97951"/>
  </linearGradient>
</defs>
<rect width="1280" height="676" y="44" fill="url(#sky)"/>
<circle cx="360" cy="150" r="44" fill="#ffe9a8"/>
<g fill="#ffffff" opacity="0.85">
  <rect x="560" y="120" width="120" height="24" rx="12"/>
  <rect x="700" y="170" width="90" height="20" rx="10"/>
  <rect x="500" y="210" width="70" height="16" rx="8"/>
</g>
<g>
  <rect x="0" y="560" width="1280" height="160" fill="#7a5c3e"/>
  <rect x="0" y="540" width="1280" height="34" fill="#4d6b3a"/>
  <rect x="0" y="574" width="1280" height="8" fill="#5d8a48"/>
  ${terrain}
  <rect x="360" y="486" width="96" height="54" rx="5" fill="#6e5642"/>
  <rect x="448" y="508" width="72" height="32" rx="5" fill="#6e5642"/>
</g>
<g>
  <rect x="820" y="452" width="40" height="108" rx="6" fill="#2a2520"/>
  <rect x="806" y="560" width="68" height="6" fill="#3b342d"/>
  <rect x="862" y="560" width="68" height="6" fill="#3b342d"/>
  <rect x="928" y="500" width="180" height="6" rx="3" fill="#3b342d"/>
</g>
${txt(1040, 610, 20, "#ffe9a8", "✦ dig · build · explore", "font-weight:700")}
`;
  writeFileSync(join(outDir, "unity-2d-game.svg"), chrome("unity-build · dev", inner));
}

console.log("Generated", 6, "project mockups in", outDir);

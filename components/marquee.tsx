const dotColors = [
  "bg-violet",
  "bg-teal",
  "bg-coral",
  "bg-rose",
  "bg-sky",
  "bg-gold",
];

export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-pause relative overflow-hidden border-y border-line bg-gradient-to-r from-coral/10 via-violet/10 to-teal/10 py-4">
      <div className="flex w-max animate-marquee gap-3 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-1.5 font-display text-sm italic tracking-wide text-ink-2 shadow-sm"
          >
            {item}
            <span
              aria-hidden
              className={`h-2 w-2 shrink-0 rounded-full ${dotColors[i % dotColors.length]}`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

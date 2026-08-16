export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-pause relative overflow-hidden border-y border-line bg-cream-2/60 py-4">
      <div className="flex w-max animate-marquee gap-3 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-1.5 font-display text-sm italic tracking-wide text-ink-2"
          >
            {item}
            <span className="not-italic text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

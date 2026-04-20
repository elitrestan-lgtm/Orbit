"use client";

interface Props {
  warmth: number;
  compact?: boolean;
}

export default function WarmthBadge({ warmth, compact = false }: Props) {
  const clamped = Math.max(1, Math.min(5, warmth));
  const dots = Array.from({ length: 5 }, (_, i) => i < clamped);
  if (compact) {
    return (
      <span className="flex items-center gap-0.5" title={`Warmth ${clamped}/5`}>
        {dots.map((on, i) => (
          <span
            key={i}
            className={
              "h-1.5 w-1.5 rounded-full " +
              (on ? "bg-orbit-warm" : "bg-orbit-border")
            }
          />
        ))}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-orbit-border bg-orbit-bg px-2 py-0.5 text-xs text-slate-300">
      Warmth
      <span className="flex items-center gap-0.5">
        {dots.map((on, i) => (
          <span
            key={i}
            className={
              "h-2 w-2 rounded-full " + (on ? "bg-orbit-warm" : "bg-orbit-border")
            }
          />
        ))}
      </span>
      <span className="tabular-nums text-slate-400">{clamped}/5</span>
    </span>
  );
}

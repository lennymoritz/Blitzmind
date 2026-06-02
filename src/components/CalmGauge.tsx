"use client";

import { useEffect, useState } from "react";

/**
 * CalmGauge — radial progress gauge displaying a "Calm Score" that drifts
 * around a base value. Wide stroke, single accent. The number inside
 * lives on the same drift cycle as the arc so they visually sync.
 *
 * Sized via `size` prop. Designed for the hero — but reusable.
 */
export function CalmGauge({ size = 280 }: { size?: number }) {
  const [pct, setPct] = useState(78);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        const step = (Math.random() - 0.5) * 3;
        const next = p + step - (p - 78) * 0.12;
        // Keep within 0..100, clamp at the edges
        return Math.max(20, Math.min(96, next));
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // We draw 270° of arc (3/4 circle) starting from bottom-left
  const arcLen = c * 0.75;
  const offset = arcLen - (arcLen * pct) / 100;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`Calm score ${Math.round(pct)} percent`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-[225deg]"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-line-soft)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${c}`}
        />
        {/* Filled portion */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${c}`}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 8px rgba(255,59,59,0.35))",
          }}
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.24em] text-fg-mute">
          Calm Score
        </span>
        <div className="mt-1 font-display text-7xl leading-none tabular-nums tracking-tight">
          {Math.round(pct)}
          <span className="text-2xl text-fg-dim align-top ml-1">%</span>
        </div>
        <span className="mt-2 text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
          updating · live
        </span>
      </div>
    </div>
  );
}

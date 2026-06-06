"use client";

import { useEffect, useId, useState } from "react";

/**
 * CalmGauge — radial 270° gauge for the live Calm Score. The number drifts
 * around a base value; arc + number share the drift cycle so they sync.
 *
 * Scales cleanly: the number is sized relative to `size`, so the gauge reads
 * well at 120px (dashboard chip) and 320px (marketing hero) alike. Pass
 * `showLabels={false}` when the surrounding panel already has a header, to
 * avoid duplicate "Calm Score / live" text crowding the number.
 */
export function CalmGauge({
  size = 280,
  showLabels = true,
}: {
  size?: number;
  showLabels?: boolean;
}) {
  const [pct, setPct] = useState(78);
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        const step = (Math.random() - 0.5) * 3;
        const next = p + step - (p - 78) * 0.12;
        return Math.max(20, Math.min(96, next));
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const stroke = Math.max(6, size * 0.03);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arcLen = c * 0.75;
  const offset = arcLen - (arcLen * pct) / 100;

  const numFont = size * 0.3;
  const pctFont = size * 0.11;

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
        <defs>
          <linearGradient id={`calm-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="#ff6b63" />
          </linearGradient>
        </defs>
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
          stroke={`url(#calm-${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${c}`}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 6px rgba(255,59,59,0.3))",
          }}
        />
      </svg>

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLabels && (
          <span className="text-[10px] uppercase tracking-[0.24em] text-fg-mute mb-1">
            Calm Score
          </span>
        )}
        <div
          className="font-display leading-none tabular-nums tracking-tight flex items-start"
          style={{ fontSize: numFont }}
        >
          {Math.round(pct)}
          <span
            className="text-fg-dim font-mono"
            style={{ fontSize: pctFont, marginTop: numFont * 0.08, marginLeft: 2 }}
          >
            %
          </span>
        </div>
        {showLabels && (
          <span className="mt-2 text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
            updating · live
          </span>
        )}
      </div>
    </div>
  );
}

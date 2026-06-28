"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * MiniChart — small inline data-viz primitives for the app surfaces.
 *
 *  - Sparkline:        compact line+area trend (7-day series, etc.)
 *  - CalmOutcomeBars:  per-match calm% bars coloured by win/loss — the
 *                      visual statement of BlitzMind's core thesis
 *                      (calm correlates with winning).
 *  - CalmBar:          a single thin horizontal calm meter for list rows.
 *
 * All respect prefers-reduced-motion (no grow/draw animation when set).
 */

export function Sparkline({
  data,
  color = "var(--color-app-accent)",
  height = 36,
  fill = true,
}: {
  data: readonly number[];
  color?: string;
  height?: number;
  fill?: boolean;
}) {
  const W = 120;
  const H = height;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = (W - pad * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => ({
    x: pad + i * stepX,
    y: pad + (1 - (v - min) / span) * (H - pad * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const last = pts[pts.length - 1];
  const gid = `sl-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last.x} cy={last.y} r="2.2" fill={color} />
    </svg>
  );
}

export function CalmOutcomeBars({
  items,
}: {
  items: { calmPercent: number; result: "victory" | "defeat"; label: string }[];
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <div className="flex items-end gap-2 h-40">
      {items.map((m, i) => {
        const color = m.result === "victory" ? "var(--color-calm)" : "var(--color-app-accent)";
        const h = `${Math.max(8, m.calmPercent)}%`;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <span className="text-[9px] tabular-nums tabular-nums text-fg-mute">{m.calmPercent}</span>
            <motion.div
              className="w-full rounded-t-sm"
              style={{ background: color, opacity: 0.85 }}
              initial={{ height: reduce ? h : 0 }}
              whileInView={{ height: h }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="text-[8px] uppercase tracking-[0.12em] tabular-nums text-fg-mute whitespace-nowrap">
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CalmBar({
  value,
  result,
}: {
  value: number;
  result: "victory" | "defeat";
}) {
  const color = result === "victory" ? "var(--color-calm)" : "var(--color-app-accent)";
  return (
    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-app-line)" }}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

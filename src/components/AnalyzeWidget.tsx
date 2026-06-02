"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

/**
 * AnalyzeWidget — the post-game analytics view. Right side: an SVG HRV
 * timeline chart showing one game's worth of biometric data, with stress
 * events annotated. Left side: contextual stats and the "headline insight"
 * pulled from the data.
 *
 * The data is hand-crafted to tell a story: player starts strong, mid-game
 * stress spike during a stressful in-game moment (Gulag fight), recovers,
 * peaks again at end. The annotations call out moments players would
 * recognize from the game.
 *
 * Why no chart library: keeps bundle lean, total visual control, the chart
 * matches the rest of the site's aesthetic exactly. We're not doing complex
 * interactivity — just hover-to-reveal-detail.
 */

// Time-series in 60 samples. Calm score over a 30-min ranked match.
// Crafted to have: warmup dip, mid-game stress event, recovery, late-game pressure.
const HRV_DATA = [
  82, 80, 79, 78, 77, 76, 75, 74, 76, 78, 80, 82, 83, 82, 80,
  78, 75, 71, 66, 58, 48, 42, 45, 51, 58, 64, 70, 74, 76, 77,
  78, 79, 80, 81, 79, 76, 72, 68, 64, 62, 60, 58, 55, 51, 47,
  45, 48, 53, 60, 66, 70, 72, 70, 67, 63, 59, 55, 52, 50, 48,
];

// Annotated events. Position is the data index.
const EVENTS = [
  { idx: 20, label: "Gulag fight", type: "stress" as const },
  { idx: 42, label: "Final circle", type: "stress" as const },
  { idx: 32, label: "Peak focus window", type: "peak" as const },
];

export function AnalyzeWidget() {
  const [hovered, setHovered] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(700);

  // Measure chart container so the SVG scales to whatever space it gets
  useEffect(() => {
    if (!chartRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setChartWidth(entry.contentRect.width);
    });
    ro.observe(chartRef.current);
    return () => ro.disconnect();
  }, []);

  const w = chartWidth;
  const h = 280;
  const pad = { top: 30, right: 16, bottom: 30, left: 16 };

  const max = 100;
  const min = 0;
  const dx = (w - pad.left - pad.right) / (HRV_DATA.length - 1);
  const xy = (i: number, v: number) => ({
    x: pad.left + i * dx,
    y: pad.top + (1 - (v - min) / (max - min)) * (h - pad.top - pad.bottom),
  });

  // Build path
  const pathPoints = HRV_DATA.map((v, i) => xy(i, v));
  const linePath = pathPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  // Area path (same line, closed at bottom)
  const areaPath = `${linePath} L ${pathPoints[pathPoints.length - 1].x} ${h - pad.bottom} L ${pathPoints[0].x} ${h - pad.bottom} Z`;

  // Threshold line at 60% calm
  const threshold = xy(0, 60).y;

  return (
    <div className="rounded-2xl border border-line bg-surface/40 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr]">
        {/* LEFT: contextual readout */}
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-line">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono whitespace-nowrap">
              Session 12.04.26
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute whitespace-nowrap">
              Warzone · Ranked
            </div>
          </div>

          <h3 className="mt-4 font-display text-3xl tracking-tight leading-tight">
            The match,<br />
            read out loud.
          </h3>

          <div className="mt-10 space-y-6">
            <StatLine
              label="Avg HRV"
              value="64ms"
              delta="−7%"
              deltaDirection="down"
              note="vs. last session"
            />
            <StatLine
              label="Peak stress"
              value="42ms"
              note="t+20m, Gulag fight"
              accent
            />
            <StatLine
              label="Recovery time"
              value="2m 14s"
              note="back to baseline"
            />
            <StatLine
              label="Calm score"
              value="68%"
              delta="−4% below forecast"
              deltaDirection="down"
            />
          </div>

          {/* Headline insight — the "so what" */}
          <div className="mt-10 pt-6 border-t border-line">
            <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute mb-3">
              The takeaway
            </div>
            <p className="text-fg-dim text-sm leading-relaxed">
              Your reaction time was{" "}
              <span className="text-accent">22% slower</span> during the stress
              spike at t+20m. Same map, same opponent type — but your body told
              the story before the scoreboard did.
            </p>
          </div>
        </div>

        {/* RIGHT: chart */}
        <div ref={chartRef} className="p-8 lg:p-10 relative">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
                Calm score · 30 min match
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">
              <span className="inline-block w-2 h-px bg-accent align-middle mr-1.5" />
              Stress event
            </div>
          </div>

          <svg
            width={w}
            height={h}
            className="overflow-visible"
            role="img"
            aria-label="Calm score timeline chart with annotated events"
            onMouseLeave={() => setHovered(null)}
            onMouseMove={(e) => {
              const rect = (e.target as SVGElement).getBoundingClientRect();
              const x = e.clientX - rect.left - pad.left;
              const idx = Math.round(x / dx);
              if (idx >= 0 && idx < HRV_DATA.length) setHovered(idx);
            }}
          >
            {/* Grid lines — subtle */}
            {[20, 40, 60, 80, 100].map((v) => {
              const p = xy(0, v);
              return (
                <g key={v}>
                  <line
                    x1={pad.left}
                    x2={w - pad.right}
                    y1={p.y}
                    y2={p.y}
                    stroke="var(--color-line)"
                    strokeWidth="1"
                    strokeDasharray={v === 60 ? "4 4" : ""}
                  />
                  <text
                    x={pad.left - 4}
                    y={p.y + 3}
                    fontSize="9"
                    fill="var(--color-fg-mute)"
                    textAnchor="end"
                    fontFamily="var(--font-mono)"
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Area gradient */}
            <defs>
              <linearGradient id="hrvFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#hrvFill)" />

            {/* Threshold zone shaded — below 60 is "stressed" */}
            <rect
              x={pad.left}
              y={threshold}
              width={w - pad.left - pad.right}
              height={h - pad.bottom - threshold}
              fill="var(--color-accent)"
              opacity="0.04"
            />

            {/* The main line */}
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-fg)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Event markers */}
            {EVENTS.map((ev) => {
              const p = xy(ev.idx, HRV_DATA[ev.idx]);
              const isStress = ev.type === "stress";
              const color = isStress
                ? "var(--color-accent)"
                : "var(--color-calm)";
              return (
                <g key={ev.idx}>
                  {/* vertical guide */}
                  <line
                    x1={p.x}
                    x2={p.x}
                    y1={pad.top}
                    y2={h - pad.bottom}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    opacity="0.5"
                  />
                  {/* point */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="var(--color-bg)"
                    stroke={color}
                    strokeWidth="2"
                  />
                  {/* label */}
                  <text
                    x={p.x}
                    y={isStress ? h - pad.bottom + 18 : pad.top - 10}
                    fontSize="9"
                    fill={color}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.05em"
                  >
                    {ev.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Hover indicator */}
            {hovered !== null && (
              <g>
                <line
                  x1={xy(hovered, 0).x}
                  x2={xy(hovered, 0).x}
                  y1={pad.top}
                  y2={h - pad.bottom}
                  stroke="var(--color-fg)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <circle
                  cx={xy(hovered, HRV_DATA[hovered]).x}
                  cy={xy(hovered, HRV_DATA[hovered]).y}
                  r="4"
                  fill="var(--color-fg)"
                />
              </g>
            )}
          </svg>

          {/* Hover tooltip */}
          {hovered !== null && (
            <div
              className="absolute pointer-events-none px-3 py-2 rounded bg-surface border border-line-soft text-xs font-mono shadow-xl"
              style={{
                left: Math.min(
                  Math.max(xy(hovered, 0).x + pad.left + 8, 40),
                  w - 100
                ),
                top: pad.top + 8,
              }}
            >
              <div className="text-fg-mute">
                t+{Math.round((hovered / (HRV_DATA.length - 1)) * 30)}m
              </div>
              <div className="text-fg tabular-nums">
                Calm{" "}
                <span className="text-accent">
                  {HRV_DATA[hovered]}%
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between text-[10px] font-mono text-fg-mute">
            <span>t+0m</span>
            <span>t+15m</span>
            <span>t+30m</span>
          </div>

          {/* Session highlights — small annotated event cards below the chart.
              Fills the right-column vertical space with content that
              reinforces the chart's narrative. */}
          <div className="mt-10 pt-6 border-t border-line grid grid-cols-3 gap-px bg-line">
            <HighlightCard
              time="t+12m"
              label="Warmup peak"
              detail="Reaction time best of the session"
              type="peak"
            />
            <HighlightCard
              time="t+20m"
              label="Gulag fight"
              detail="HRV crashed 30% in 90 seconds"
              type="stress"
            />
            <HighlightCard
              time="t+27m"
              label="Final circle"
              detail="Stress event during decisive engagement"
              type="stress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatLine({
  label,
  value,
  delta,
  deltaDirection,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  note?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-3">
        <span
          className="font-display text-3xl tabular-nums tracking-tight"
          style={{ color: accent ? "var(--color-accent)" : "var(--color-fg)" }}
        >
          {value}
        </span>
        {delta && (
          <span
            className={`text-xs font-mono ${
              deltaDirection === "down" ? "text-accent" : "text-calm"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      {note && (
        <div className="mt-1 text-xs text-fg-mute font-mono">{note}</div>
      )}
    </div>
  );
}

function HighlightCard({
  time,
  label,
  detail,
  type,
}: {
  time: string;
  label: string;
  detail: string;
  type: "peak" | "stress";
}) {
  const color = type === "stress" ? "var(--color-accent)" : "var(--color-calm)";
  return (
    <div className="bg-bg p-4">
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span
          className="block w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
        />
        <span className="text-fg-mute uppercase tracking-[0.18em]">{time}</span>
      </div>
      <div className="mt-2 text-fg text-sm">{label}</div>
      <div className="mt-1 text-fg-mute text-xs leading-snug">{detail}</div>
    </div>
  );
}

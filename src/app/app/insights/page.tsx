"use client";

import { useState } from "react";
import { AppHeader, SecondaryButton } from "../_components/AppHeader";
import { ResearchNote } from "../_components/ResearchNote";
import { StaggerChildren } from "../_components/StaggerChildren";
import { matches, aggregates, maps, weapons } from "../_lib/mockData";

/**
 * Insights — /app/insights.
 *
 * Cross-session pattern analysis. This is the longitudinal view: the
 * screen that shows BlitzMind isn't just a real-time tool but a data
 * platform that gets smarter with use.
 *
 * Layout:
 *   1. Hero metrics — peak performance window, fatigue cliff, win-rate
 *      delta when calm vs stressed
 *   2. Weekly performance heatmap — 7-day × 24-hour grid showing where
 *      the player plays best
 *   3. Map-level stress correlation — which maps spike HRV vs which
 *      keep player calm
 *   4. Weapon-class performance under stress — bar chart showing how
 *      each class degrades when stress hits
 *   5. Research note explaining the platform thesis
 *
 * The visual moment: the heatmap. Recruiter looks at it and sees the
 * "Tue 8-10pm" claim from the home dashboard rendered as actual data.
 */

type Timeframe = "7d" | "30d" | "90d";

export default function InsightsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");

  return (
    <>
      <AppHeader
        eyebrow="Pattern analysis"
        title="Insights"
        subtitle="Cross-session trends · biometric × performance"
        actions={
          <>
            <TimeframeSwitcher value={timeframe} onChange={setTimeframe} />
            <SecondaryButton>Export</SecondaryButton>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] space-y-10">
        {/* ============ HERO METRICS ============ */}
        <section>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HeroMetric
              label="Peak performance window"
              value={aggregates.peakPerformanceWindow}
              hint="When your KDA + calm score are both highest"
              trendValue="+34%"
              trendDirection="up"
              trendLabel="win rate during this window"
            />
            <HeroMetric
              label="Fatigue cliff"
              value="After 2h 40m"
              hint="Where your performance starts degrading"
              trendValue="−18%"
              trendDirection="down"
              trendLabel="HRV drop past this point"
            />
            <HeroMetric
              label="Calm vs stress impact"
              value={`+${1.6}× KDA`}
              hint="When calm score is above 65%"
              trendValue="3:1"
              trendDirection="neutral"
              trendLabel="performance ratio"
            />
          </StaggerChildren>
        </section>

        {/* ============ PERFORMANCE HEATMAP ============ */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="text-lg font-display font-medium tracking-tight">When you play your best</h3>
              <p className="text-xs text-fg-mute mt-0.5">
                Match-weighted average calm score by day × hour
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
              <Legend color="var(--color-app-accent)" label="Stressed" />
              <Legend color="var(--color-warn)" label="Elevated" />
              <Legend color="var(--color-calm)" label="Calm" />
            </div>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <PerformanceHeatmap />
          </div>
        </section>

        {/* ============ MAP STRESS RANKING ============ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-display font-medium tracking-tight mb-1">Maps by stress impact</h3>
            <p className="text-xs text-fg-mute mb-4">
              Where your HRV holds up vs where it crashes
            </p>
            <MapStressRanking />
          </div>
          <div>
            <h3 className="text-lg font-display font-medium tracking-tight mb-1">Weapon class under stress</h3>
            <p className="text-xs text-fg-mute mb-4">
              How accuracy degrades when calm score drops below 50%
            </p>
            <WeaponDegradation />
          </div>
        </section>

        {/* ============ WEEK-OVER-WEEK TREND ============ */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="text-lg font-display font-medium tracking-tight">7-day trend</h3>
              <p className="text-xs text-fg-mute mt-0.5">
                HRV, calm score, and win rate vs the previous week
              </p>
            </div>
          </div>
          <WeeklyTrend />
        </section>

        {/* ============ RESEARCH NOTE ============ */}
        <section className="pt-4 border-t" style={{ borderColor: "var(--color-app-line)" }}>
          <ResearchNote
            note={{
              source: "Pivot",
              title: "From real-time alerts to longitudinal insights",
              body: "The original prototype focused entirely on in-the-moment feedback. Interviews revealed players were more receptive to retrospective insights — patterns they could act on between sessions, not during them. Insights as a destination (not a notification) gives players the agency to make their own competitive adjustments.",
            }}
          />
        </section>
      </div>
    </>
  );
}

// ============================================================
// Hero metrics
// ============================================================

function HeroMetric({
  label,
  value,
  hint,
  trendValue,
  trendDirection,
  trendLabel,
}: {
  label: string;
  value: string;
  hint: string;
  trendValue: string;
  trendDirection: "up" | "down" | "neutral";
  trendLabel: string;
}) {
  const trendColor =
    trendDirection === "up"
      ? "var(--color-calm)"
      : trendDirection === "down"
      ? "var(--color-app-accent)"
      : "var(--color-fg-mute)";
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">
        {label}
      </div>
      <div className="mt-3 text-3xl font-display tabular-nums tracking-tight text-fg">
        {value}
      </div>
      <div className="mt-1 text-xs text-fg-mute leading-relaxed">{hint}</div>
      <div
        className="mt-4 pt-3 border-t flex items-baseline gap-2"
        style={{ borderColor: "var(--color-app-line)" }}
      >
        <span
          className="text-base font-mono tabular-nums"
          style={{ color: trendColor }}
        >
          {trendValue}
        </span>
        <span className="text-xs text-fg-mute">{trendLabel}</span>
      </div>
    </div>
  );
}

function TimeframeSwitcher({
  value,
  onChange,
}: {
  value: Timeframe;
  onChange: (v: Timeframe) => void;
}) {
  return (
    <div
      className="inline-flex rounded border overflow-hidden"
      style={{ borderColor: "var(--color-app-line-strong)" }}
    >
      {(["7d", "30d", "90d"] as const).map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className="px-3 py-1.5 text-xs transition-colors border-l first:border-l-0"
          style={{
            background:
              value === tf
                ? "var(--color-app-surface-3)"
                : "var(--color-app-surface-2)",
            color: value === tf ? "var(--color-fg)" : "var(--color-fg-dim)",
            borderColor: "var(--color-app-line-strong)",
          }}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="block w-3 h-2 rounded-sm"
        style={{ background: color }}
      />
      <span>{label}</span>
    </div>
  );
}

// ============================================================
// Performance heatmap — 7d × 24h grid
// ============================================================

function PerformanceHeatmap() {
  // Generate deterministic data — calm score 0-100 for each (day, hour)
  // Hot spot at Tue 8-10pm, cool spot at late nights weekdays
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const calmAt = (day: number, hour: number): number => {
    // Strong peak Tue (1) 20-22, secondary Sat (5) 14-18
    const tueDist = Math.sqrt((day - 1) ** 2 + ((hour - 21) * 0.4) ** 2);
    const satDist = Math.sqrt((day - 5) ** 2 + ((hour - 16) * 0.4) ** 2);
    const tuePeak = Math.max(0, 85 - tueDist * 12);
    const satPeak = Math.max(0, 70 - satDist * 10);
    // Late-night fatigue dip
    const lateNightPenalty = hour >= 0 && hour < 6 ? 25 : 0;
    // Early morning never played
    const noPlayPenalty = hour >= 5 && hour < 11 ? 20 : 0;
    // Base level
    const base = 45;
    return Math.max(
      0,
      Math.min(100, base + tuePeak + satPeak * 0.6 - lateNightPenalty - noPlayPenalty)
    );
  };

  const matchesAt = (day: number, hour: number): number => {
    // Match count — denser at peak hours
    const calm = calmAt(day, hour);
    if (calm > 70) return Math.floor(2 + Math.random() * 3);
    if (calm > 55) return Math.floor(1 + Math.random() * 2);
    if (calm > 40) return Math.random() < 0.5 ? 1 : 0;
    return 0;
  };

  const cellColor = (calm: number, matches: number) => {
    if (matches === 0) return "var(--color-app-surface-2)";
    if (calm < 50) return "rgba(255, 51, 68, 0.45)";
    if (calm < 65) return "rgba(251, 191, 36, 0.5)";
    if (calm < 78) return "rgba(110, 231, 183, 0.5)";
    return "rgba(110, 231, 183, 0.9)";
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px]">
        {/* Hour labels */}
        <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-px mb-1">
          <div />
          {hours.map((h) => (
            <div
              key={h}
              className="text-[9px] font-mono text-fg-mute text-center"
              style={{ height: "14px" }}
            >
              {h % 4 === 0 ? `${h}` : ""}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {days.map((day, di) => (
          <div
            key={day}
            className="grid grid-cols-[40px_repeat(24,1fr)] gap-px mb-px"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute flex items-center">
              {day}
            </div>
            {hours.map((h) => {
              const calm = calmAt(di, h);
              const cellMatches = matchesAt(di, h);
              return (
                <div
                  key={h}
                  className="aspect-square rounded-[2px] relative group cursor-pointer transition-transform hover:z-10 hover:scale-125"
                  style={{
                    background: cellColor(calm, cellMatches),
                    border:
                      di === 1 && h >= 20 && h <= 22
                        ? "1px solid var(--color-app-accent)"
                        : "none",
                  }}
                  title={
                    cellMatches > 0
                      ? `${day} ${h}:00 · ${cellMatches} matches · ${Math.round(calm)}% avg calm`
                      : `${day} ${h}:00 · no matches`
                  }
                />
              );
            })}
          </div>
        ))}

        {/* Footer indicator */}
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
            ← Hours (24h)
          </div>
          <div className="text-[10px] font-mono text-app-accent flex items-center gap-1.5">
            <span
              className="block w-3 h-3 rounded-[2px] border"
              style={{ borderColor: "var(--color-app-accent)" }}
            />
            Peak window
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Map stress ranking — horizontal bar chart
// ============================================================

function MapStressRanking() {
  // Build deterministic stress impact per map
  const ranked = maps.map((m, i) => {
    // Stress impact 0-100. Small maps are higher stress.
    const baseStress =
      m.size === "Small" ? 65 : m.size === "Medium" ? 50 : 35;
    const variance = ((m.name.length * 7) % 22) - 11;
    return {
      ...m,
      stressImpact: Math.max(20, Math.min(85, baseStress + variance)),
      matchesPlayed: 12 - i,
    };
  }).sort((a, b) => b.stressImpact - a.stressImpact);

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      {ranked.slice(0, 7).map((m, i) => {
        const stressed = m.stressImpact > 60;
        const calm = m.stressImpact < 45;
        return (
          <div
            key={m.id}
            className="px-4 py-3 grid grid-cols-[1fr_auto] gap-4 items-center"
            style={{
              borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)",
            }}
          >
            <div className="min-w-0">
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-sm text-fg truncate">{m.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
                    {m.size}
                  </span>
                </div>
                <span
                  className="text-xs font-mono tabular-nums whitespace-nowrap"
                  style={{
                    color: stressed
                      ? "var(--color-app-accent)"
                      : calm
                      ? "var(--color-calm)"
                      : "var(--color-warn)",
                  }}
                >
                  {Math.round(m.stressImpact)}%
                </span>
              </div>
              {/* Bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--color-app-line)" }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${m.stressImpact}%`,
                    background: stressed
                      ? "var(--color-app-accent)"
                      : calm
                      ? "var(--color-calm)"
                      : "var(--color-warn)",
                  }}
                />
              </div>
            </div>
            <div className="text-[10px] font-mono text-fg-mute text-right">
              {m.matchesPlayed} matches
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Weapon degradation — class-level bars
// ============================================================

function WeaponDegradation() {
  // Group weapons by class, compute "accuracy under stress" vs "accuracy when calm"
  const classes = [
    { name: "Assault Rifle", calm: 78, stress: 64 },
    { name: "SMG", calm: 72, stress: 65 },
    { name: "Sniper", calm: 88, stress: 56 },
    { name: "Marksman", calm: 82, stress: 67 },
    { name: "Shotgun", calm: 60, stress: 55 },
    { name: "Sidearm", calm: 62, stress: 50 },
    { name: "LMG", calm: 70, stress: 58 },
  ];

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute"
        style={{ borderColor: "var(--color-app-line)" }}
      >
        <span>Class</span>
        <span>Calm → Stressed</span>
      </div>
      {classes.map((c, i) => {
        const drop = c.calm - c.stress;
        const isSevereDrop = drop >= 18;
        return (
          <div
            key={c.name}
            className="px-4 py-3"
            style={{
              borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)",
            }}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-fg">{c.name}</span>
              <span
                className="text-xs font-mono tabular-nums"
                style={{
                  color: isSevereDrop
                    ? "var(--color-app-accent)"
                    : "var(--color-warn)",
                }}
              >
                −{drop}%
              </span>
            </div>
            {/* Dual bar — calm baseline + stress shows where it drops to */}
            <div className="relative h-2 rounded-full overflow-hidden"
              style={{ background: "var(--color-app-line)" }}
            >
              <div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${c.calm}%`,
                  background: "var(--color-calm)",
                  opacity: 0.5,
                }}
              />
              <div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${c.stress}%`,
                  background: "var(--color-app-accent)",
                }}
              />
            </div>
            <div className="mt-1 flex items-baseline justify-between text-[10px] font-mono text-fg-mute">
              <span style={{ color: "var(--color-app-accent)" }}>
                {c.stress}% stressed
              </span>
              <span style={{ color: "var(--color-calm)" }}>
                {c.calm}% calm
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Weekly trend chart
// ============================================================

function WeeklyTrend() {
  // 14 days of data points: current week + prior week
  // Show HRV, calm, and a binary win indicator
  const points = Array.from({ length: 14 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const noise = (seed / 233280 - 0.5);
    return {
      day: i,
      hrv: 62 + noise * 12 + (i >= 7 ? -3 : 0), // trending slightly down
      calm: 65 + noise * 18 + (i >= 7 ? -4 : 0),
      win: i % 3 !== 0,
    };
  });

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      <WeeklyTrendChart points={points} />
    </div>
  );
}

function WeeklyTrendChart({
  points,
}: {
  points: { day: number; hrv: number; calm: number; win: boolean }[];
}) {
  const w = 1200;
  const h = 220;
  const pad = { x: 40, y: 30 };
  const innerW = w - pad.x * 2;
  const innerH = h - pad.y * 2;
  const dx = innerW / (points.length - 1);

  const yMin = 30;
  const yMax = 100;
  const toX = (i: number) => pad.x + i * dx;
  const toY = (v: number) =>
    pad.y + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  const hrvPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.hrv)}`)
    .join(" ");
  const calmPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.calm)}`)
    .join(" ");

  // Split between weeks
  const splitX = toX(6.5);

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
        <div className="flex items-center gap-1.5">
          <span className="block w-3 h-0.5" style={{ background: "var(--color-fg)" }} />
          <span>HRV (ms)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="block w-3 h-0.5" style={{ background: "var(--color-app-accent)" }} />
          <span>Calm score (%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="block w-2 h-2 rounded-full" style={{ background: "var(--color-calm)" }} />
          <span>Win</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="block w-2 h-2 rounded-full" style={{ background: "var(--color-app-accent)" }} />
          <span>Loss</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" aria-label="Weekly trend chart">
        {/* Grid lines */}
        {[40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line
              x1={pad.x}
              x2={w - pad.x}
              y1={toY(v)}
              y2={toY(v)}
              stroke="var(--color-app-line)"
              strokeWidth="0.5"
              strokeDasharray="2 4"
            />
            <text
              x={pad.x - 6}
              y={toY(v) + 3}
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill="var(--color-fg-mute)"
              textAnchor="end"
            >
              {v}
            </text>
          </g>
        ))}
        {/* Week divider */}
        <line
          x1={splitX}
          x2={splitX}
          y1={pad.y}
          y2={h - pad.y}
          stroke="var(--color-fg-mute)"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <text x={splitX - 5} y={pad.y - 8} fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-fg-mute)" textAnchor="end">
          Prior week
        </text>
        <text x={splitX + 5} y={pad.y - 8} fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-fg-mute)">
          This week
        </text>

        {/* HRV line */}
        <path d={hrvPath} fill="none" stroke="var(--color-fg)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Calm line */}
        <path d={calmPath} fill="none" stroke="var(--color-app-accent)" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Win/loss dots on x-axis */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={toX(i)}
            cy={h - pad.y + 14}
            r="3"
            fill={p.win ? "var(--color-calm)" : "var(--color-app-accent)"}
          />
        ))}

        {/* X axis day labels */}
        {points.map((_, i) => (
          <text
            key={i}
            x={toX(i)}
            y={h - 4}
            fontSize="9"
            fontFamily="var(--font-mono)"
            fill="var(--color-fg-mute)"
            textAnchor="middle"
          >
            {i < 7 ? `-${7 - i}` : `+${i - 6}`}
          </text>
        ))}
      </svg>
    </div>
  );
}

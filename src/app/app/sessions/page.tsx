"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppHeader, SecondaryButton } from "../_components/AppHeader";
import { TweenedNumber } from "../_components/TweenedNumber";
import { StaggerChildren } from "../_components/StaggerChildren";
import { matches, aggregates } from "../_lib/mockData";

/**
 * Sessions — the match list view.
 *
 * Shows all of the player's recent matches with rich at-a-glance data:
 * result, mode, map, KDA, calm trajectory mini-spark, stress events count,
 * and a short story snippet. Each row is clickable and routes to the
 * detail view at /app/sessions/[id].
 *
 * Filtering: top bar lets the user filter by mode and by result. The
 * aggregate stats above the list update to reflect the filtered set.
 *
 * The design intent: this is the player's "what happened" view. They
 * scan a list, see the patterns (which modes they lose, which maps
 * spike their stress), and drill into a specific match for the deep
 * report.
 */

type ResultFilter = "all" | "victory" | "defeat";
type ModeFilter = string;

export default function SessionsPage() {
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (resultFilter !== "all" && m.result !== resultFilter) return false;
      if (modeFilter !== "all" && m.mode !== modeFilter) return false;
      return true;
    });
  }, [resultFilter, modeFilter]);

  const stats = useMemo(() => {
    if (filtered.length === 0) {
      return { wins: 0, losses: 0, winRate: 0, avgCalm: 0, totalStress: 0 };
    }
    const wins = filtered.filter((m) => m.result === "victory").length;
    const losses = filtered.length - wins;
    const winRate = Math.round((wins / filtered.length) * 100);
    const avgCalm = Math.round(
      filtered.reduce((sum, m) => sum + m.calmPercent, 0) / filtered.length
    );
    const totalStress = filtered.reduce((sum, m) => sum + m.stressEvents, 0);
    return { wins, losses, winRate, avgCalm, totalStress };
  }, [filtered]);

  const uniqueModes = Array.from(new Set(matches.map((m) => m.mode)));

  return (
    <>
      <AppHeader
        eyebrow="Past matches"
        title="Sessions"
        subtitle={`${matches.length} total · last 7 days`}
        actions={
          <>
            <SecondaryButton>Export</SecondaryButton>
            <SecondaryButton>Filter</SecondaryButton>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px]">
        <section className="mb-8">
          <StaggerChildren
            className="rounded-lg border grid grid-cols-2 md:grid-cols-5 gap-px overflow-hidden"
            style={{
              background: "var(--color-app-line)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <AggregateCard
              label="Matches"
              value={filtered.length.toString()}
              numericValue={filtered.length}
              hint={
                filtered.length === matches.length
                  ? "vs last 7d"
                  : filtered.length === 0
                  ? "filters too narrow"
                  : `${matches.length - filtered.length} hidden`
              }
              trend={{
                series: aggregates.trends.matches.series,
                delta: aggregates.trends.matches.delta,
                deltaSuffix: aggregates.trends.matches.deltaSuffix,
                positiveIsGood: true,
              }}
            />
            <AggregateCard
              label="Win rate"
              value={`${stats.winRate}%`}
              numericValue={stats.winRate}
              format={(v) => `${Math.round(v)}%`}
              hint={`${stats.wins}W · ${stats.losses}L`}
              status={stats.winRate >= 60 ? "calm" : stats.winRate >= 50 ? "neutral" : "warn"}
              trend={{
                series: aggregates.trends.winRate.series,
                delta: aggregates.trends.winRate.delta,
                deltaSuffix: aggregates.trends.winRate.deltaSuffix,
                positiveIsGood: true,
              }}
            />
            <AggregateCard
              label="Avg calm"
              value={`${stats.avgCalm}%`}
              numericValue={stats.avgCalm}
              format={(v) => `${Math.round(v)}%`}
              hint={
                filtered.length === 0
                  ? "no data"
                  : stats.avgCalm > aggregates.avgCalm
                  ? `+${stats.avgCalm - aggregates.avgCalm} vs baseline`
                  : stats.avgCalm < aggregates.avgCalm
                  ? `${stats.avgCalm - aggregates.avgCalm} vs baseline`
                  : "at baseline"
              }
              status={stats.avgCalm >= 70 ? "calm" : stats.avgCalm >= 55 ? "neutral" : "warn"}
              trend={{
                series: aggregates.trends.avgCalm.series,
                delta: aggregates.trends.avgCalm.delta,
                deltaSuffix: aggregates.trends.avgCalm.deltaSuffix,
                positiveIsGood: true,
              }}
            />
            <AggregateCard
              label="Stress events"
              value={stats.totalStress.toString()}
              numericValue={stats.totalStress}
              hint={`${(stats.totalStress / Math.max(filtered.length, 1)).toFixed(1)}/match avg`}
              status={stats.totalStress / Math.max(filtered.length, 1) > 5 ? "warn" : "neutral"}
              trend={{
                series: aggregates.trends.stressEvents.series,
                delta: aggregates.trends.stressEvents.delta,
                deltaSuffix: aggregates.trends.stressEvents.deltaSuffix,
                positiveIsGood: false, // more stress = bad
              }}
            />
            <AggregateCard
              label="Peak window"
              value="Tue 8–10"
              hint="Best perf. hours"
              status="calm"
            />
          </StaggerChildren>
        </section>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <FilterPills<ResultFilter>
            label="Result"
            value={resultFilter}
            onChange={setResultFilter}
            options={[
              { id: "all", label: "All" },
              { id: "victory", label: "Wins" },
              { id: "defeat", label: "Losses" },
            ]}
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">
              Mode
            </span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-8 rounded text-xs border outline-none cursor-pointer"
              style={{
                background: "var(--color-app-surface-2)",
                borderColor: "var(--color-app-line-strong)",
                color: "var(--color-fg)",
              }}
            >
              <option value="all">All modes</option>
              {uniqueModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: "var(--color-app-line)" }}
        >
          <div
            className="px-5 py-3 border-b grid items-center gap-6"
            style={{
              gridTemplateColumns: "4px 2.2fr 70px 70px 70px 70px 90px",
              borderColor: "var(--color-app-line)",
              background: "var(--color-app-surface)",
            }}
          >
            <div />
            <Heading>Mode / Map</Heading>
            <Heading center>KDA</Heading>
            <Heading center>HS%</Heading>
            <Heading center>Calm</Heading>
            <Heading center>Stress</Heading>
            <div className="text-right">
              <Heading>When</Heading>
            </div>
          </div>

          {filtered.length === 0 && (
            <div
              className="px-5 py-16"
              style={{ background: "var(--color-app-surface)" }}
            >
              <div className="max-w-sm mx-auto text-center">
                {/* Empty-state illustration — a faded HRV-style flat line */}
                <svg
                  width="140"
                  height="48"
                  viewBox="0 0 140 48"
                  className="mx-auto mb-5"
                  aria-hidden
                >
                  <line
                    x1="8"
                    x2="132"
                    y1="24"
                    y2="24"
                    stroke="var(--color-app-line-strong)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx="70"
                    cy="24"
                    r="3"
                    fill="var(--color-app-line-strong)"
                  />
                </svg>
                <div className="text-sm text-fg">
                  No matches in this filter.
                </div>
                <p className="mt-2 text-xs text-fg-mute leading-relaxed">
                  {resultFilter !== "all" && modeFilter !== "all"
                    ? `No ${resultFilter} in ${modeFilter} during the last 7 days.`
                    : resultFilter !== "all"
                    ? `No ${resultFilter} in the last 7 days.`
                    : modeFilter !== "all"
                    ? `No matches in ${modeFilter} during the last 7 days.`
                    : "Try widening your filters or playing a match."}
                </p>
                <button
                  onClick={() => {
                    setResultFilter("all");
                    setModeFilter("all");
                  }}
                  className="mt-5 text-xs px-3 py-1.5 rounded border transition-colors hover:bg-app-surface-2"
                  style={{
                    borderColor: "var(--color-app-line-strong)",
                    color: "var(--color-fg-dim)",
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {filtered.map((match, i) => (
            <Link
              key={match.id}
              href={`/app/sessions/${match.id}`}
              className="block transition-colors group relative"
              style={{
                background: "var(--color-app-surface)",
                borderTop:
                  i === 0 ? "none" : "1px solid var(--color-app-line)",
              }}
            >
              {/* Ambient calm trace — fills the row at ~12% opacity, sits behind content */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center"
                aria-hidden
                style={{
                  paddingLeft: "200px",
                  paddingRight: "100px",
                  opacity: 0.18,
                }}
              >
                <AmbientCalmTrace
                  calmPercent={match.calmPercent}
                  stressEvents={match.stressEvents}
                />
              </div>

              <div
                className="relative px-5 py-4 grid items-center gap-6 group-hover:bg-app-surface-2 transition-colors"
                style={{
                  gridTemplateColumns:
                    "4px 2.2fr 70px 70px 70px 70px 90px",
                }}
              >
                <div
                  className="w-1 h-10 rounded-full"
                  style={{
                    background:
                      match.result === "victory"
                        ? "var(--color-calm)"
                        : "var(--color-app-accent)",
                  }}
                />
                <div className="min-w-0">
                  <div className="text-sm text-fg truncate">
                    {match.mode}{" "}
                    <span className="text-fg-mute font-mono text-xs">·</span>{" "}
                    <span className="text-fg-dim">{match.map}</span>
                  </div>
                  <div className="text-xs text-fg-mute mt-0.5 truncate">
                    {match.highlight}
                  </div>
                </div>
                <Stat value={match.kda.toString()} accent={match.kda >= 2} />
                <Stat
                  value={`${match.hsPercent}%`}
                  accent={match.hsPercent >= 45}
                />
                <Stat
                  value={`${match.calmPercent}%`}
                  warn={match.calmPercent < 50}
                />
                <Stat
                  value={match.stressEvents.toString()}
                  warn={match.stressEvents >= 5}
                />
                <div className="text-right">
                  <div className="text-xs text-fg-mute font-mono whitespace-nowrap">
                    {match.date}
                  </div>
                  <div className="text-xs text-fg-mute font-mono whitespace-nowrap mt-0.5">
                    {match.duration}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="h-16" />
      </div>
    </>
  );
}

function AggregateCard({
  label,
  value,
  numericValue,
  format,
  hint,
  status = "neutral",
  trend,
}: {
  label: string;
  /** Pre-formatted string. Used as fallback if numericValue is not provided. */
  value: string;
  /** Numeric value to tween. If provided, will be animated. */
  numericValue?: number;
  /** Format the numeric value into a display string. */
  format?: (v: number) => string;
  hint: string;
  status?: "calm" | "warn" | "neutral";
  /** Optional 7-day sparkline + delta. Omitted for categorical metrics
   *  like Peak Window where a numeric trend doesn't apply. */
  trend?: {
    /** 7 numeric values, oldest to newest. */
    series: readonly number[];
    /** Numeric change vs prior period (sign matters). */
    delta: number;
    /** e.g. "%" or "" — appended to the delta display. */
    deltaSuffix?: string;
    /** Whether a positive delta is good (true) or bad (false).
     *  e.g. winRate up = good; stressEvents up = bad. */
    positiveIsGood?: boolean;
  };
}) {
  const valueColor =
    status === "calm"
      ? "var(--color-calm)"
      : status === "warn"
      ? "var(--color-app-accent)"
      : "var(--color-fg)";

  // Determine delta color: respect positiveIsGood semantics
  let deltaColor = "var(--color-fg-mute)";
  if (trend) {
    const isPositive = trend.delta > 0;
    const goodDirection = trend.positiveIsGood ?? true;
    const isGood = isPositive === goodDirection;
    if (trend.delta !== 0) {
      deltaColor = isGood
        ? "var(--color-calm)"
        : "var(--color-app-accent)";
    }
  }

  const sparkColor =
    status === "calm"
      ? "var(--color-calm)"
      : status === "warn"
      ? "var(--color-app-accent)"
      : "var(--color-fg-mute)";

  return (
    <div
      className="relative px-5 pt-4 pb-6 overflow-hidden"
      style={{ background: "var(--color-app-surface)" }}
    >
      {/* Label row */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">
        <span
          className="block w-1 h-1 rounded-full"
          style={{ background: sparkColor }}
        />
        {label}
      </div>

      {/* Value + trend delta */}
      <div className="mt-3 flex items-baseline gap-2">
        <div
          className="text-2xl font-display tabular-nums tracking-tight leading-none"
          style={{ color: valueColor }}
        >
          {numericValue !== undefined ? (
            <TweenedNumber value={numericValue} format={format} />
          ) : (
            value
          )}
        </div>
        {trend && trend.delta !== 0 && (
          <div
            className="text-[11px] font-mono tabular-nums"
            style={{ color: deltaColor }}
          >
            {trend.delta > 0 ? "+" : ""}
            {trend.delta}
            {trend.deltaSuffix ?? ""}
          </div>
        )}
      </div>

      {/* Hint line */}
      <div className="mt-1.5 text-[11px] text-fg-mute font-mono">{hint}</div>

      {/* Sparkline along the bottom edge */}
      {trend && trend.series.length >= 2 && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 14, opacity: 0.35 }}
          aria-hidden
        >
          <Sparkline values={trend.series} color={sparkColor} />
        </div>
      )}
    </div>
  );
}

/**
 * Sparkline — flat, no fill. Stretches edge-to-edge of its container.
 * Lives at the bottom of each AggregateCard. Width 100%, height 100%
 * via preserveAspectRatio="none" so the line scales to the card width.
 */
function Sparkline({
  values,
  color,
}: {
  values: readonly number[];
  color: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const w = 100;
  const h = 18;
  const padY = 2;
  const dx = w / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * dx;
      const y = padY + (1 - (v - min) / range) * (h - padY * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Heading({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute"
      style={{ textAlign: center ? "center" : "left" }}
    >
      {children}
    </div>
  );
}

function Stat({
  value,
  accent = false,
  warn = false,
}: {
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className="text-sm font-mono tabular-nums"
        style={{
          color: warn
            ? "var(--color-app-accent)"
            : accent
            ? "var(--color-calm)"
            : "var(--color-fg)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FilterPills<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">
        {label}
      </span>
      <div
        className="inline-flex rounded border overflow-hidden"
        style={{ borderColor: "var(--color-app-line-strong)" }}
      >
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="px-3 py-1.5 text-xs transition-colors border-l first:border-l-0"
            style={{
              background:
                value === opt.id
                  ? "var(--color-app-surface-3)"
                  : "var(--color-app-surface-2)",
              color:
                value === opt.id ? "var(--color-fg)" : "var(--color-fg-dim)",
              borderColor: "var(--color-app-line-strong)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniCalmTrace({
  calmPercent,
  stressEvents,
}: {
  calmPercent: number;
  stressEvents: number;
}) {
  const points: number[] = [];
  const baseline = calmPercent;
  for (let i = 0; i < 20; i++) {
    const seed = (i * 9301 + calmPercent * 49297) % 233280;
    const noise = (seed / 233280 - 0.5) * 15;
    let value = baseline + noise;
    if (stressEvents > 0) {
      const dipInterval = Math.floor(20 / Math.min(stressEvents, 5));
      if (i % dipInterval === 0 && i > 0) {
        value -= 15;
      }
    }
    points.push(Math.max(20, Math.min(95, value)));
  }
  const w = 80;
  const h = 24;
  const pad = 2;
  const dx = (w - pad * 2) / (points.length - 1);
  const min = 20;
  const max = 95;
  const toY = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * dx} ${toY(v)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke={
          calmPercent < 50
            ? "var(--color-app-accent)"
            : calmPercent < 70
            ? "var(--color-warn)"
            : "var(--color-calm)"
        }
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * AmbientCalmTrace — the wide, low-opacity trace that lives behind each
 * Sessions row. Renders the same data as MiniCalmTrace but stretched
 * across the available width, used as a background element.
 *
 * Includes a subtle gradient fill under the line so the trace reads as
 * a "calm surface" rather than just a line — the area below the curve
 * is shaded slightly to anchor it visually.
 */
function AmbientCalmTrace({
  calmPercent,
  stressEvents,
}: {
  calmPercent: number;
  stressEvents: number;
}) {
  const sampleCount = 40;
  const points: number[] = [];
  const baseline = calmPercent;
  for (let i = 0; i < sampleCount; i++) {
    const seed = (i * 9301 + calmPercent * 49297) % 233280;
    const noise = (seed / 233280 - 0.5) * 12;
    let value = baseline + noise;
    if (stressEvents > 0) {
      const dipInterval = Math.floor(sampleCount / Math.min(stressEvents, 8));
      if (dipInterval > 0 && i % dipInterval === 0 && i > 0) {
        value -= 18;
      }
    }
    points.push(Math.max(20, Math.min(95, value)));
  }

  // We render this in a relative container with absolute positioning;
  // use viewBox 0-100 wide so it scales to any width.
  const w = 100;
  const h = 24;
  const pad = 1;
  const dx = (w - pad * 2) / (points.length - 1);
  const min = 20;
  const max = 95;
  const toY = (v: number) =>
    pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const linePath = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * dx} ${toY(v)}`)
    .join(" ");
  // Area path = line + close to bottom
  const areaPath = `${linePath} L ${pad + (points.length - 1) * dx} ${h} L ${pad} ${h} Z`;

  const stroke =
    calmPercent < 50
      ? "var(--color-app-accent)"
      : calmPercent < 70
      ? "var(--color-warn)"
      : "var(--color-calm)";

  // Generate unique gradient id per match to avoid SVG conflicts
  const gradientId = `calm-trace-gradient-${calmPercent}-${stressEvents}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.6" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

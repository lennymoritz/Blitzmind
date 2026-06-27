"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader, SecondaryButton } from "../../_components/AppHeader";
import { ResearchNote } from "../../_components/ResearchNote";
import { matches, MatchSession } from "../../_lib/mockData";

/**
 * Session detail — /app/sessions/[id].
 *
 * The deep post-game report. Renders one match's data in full:
 *   - Hero: match metadata (mode/map/result/duration) + the highlight story
 *   - HRV timeline: full match-length chart with stress events as annotated
 *     marker pins, calm-zone shaded region, and key moments labeled
 *   - Performance breakdown: combat stats vs biometric stats side-by-side
 *   - Correlation insights: "your KDA was 2.3 while calm, 0.4 when stressed"
 *     style callouts that connect physiology to outcome
 *   - Adaptive Control firings: what BlitzMind did during this match
 *   - Research note explaining design pattern
 *
 * This is the screen that demonstrates the post-match analysis pattern
 * end-to-end — and earns the marketing site's Analyze widget claim.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SessionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const match = matches.find((m) => m.id === id);

  if (!match) {
    notFound();
  }

  // Build a 60-point HRV timeline for the match. Use the avgHrv as the
  // baseline and inject `stressEvents` distinct dips at story-meaningful
  // positions (mid-match, late-match, final-circle depending on mode).
  const timeline = useMemo(() => buildTimeline(match), [match]);

  // Compute "calm vs stressed" performance splits so we can show the
  // KDA-when-calm vs KDA-when-stressed insight that's the soul of this view
  const correlation = useMemo(() => buildCorrelation(match), [match]);

  return (
    <>
      <AppHeader
        eyebrow={
          <>
            <Link
              href="/app/sessions"
              className="hover:text-fg transition-colors"
            >
              Sessions
            </Link>
            {" › "}
            <span>{match.id}</span>
          </>
        }
        title="Match report"
        subtitle={`${match.mode} · ${match.map} · ${match.duration}`}
        actions={
          <>
            <SecondaryButton>Share</SecondaryButton>
            <SecondaryButton>Export PDF</SecondaryButton>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px]">
        {/* ============ HERO: result + highlight ============ */}
        <section className="mb-10">
          <div className="flex items-start gap-6">
            <div
              className="w-1.5 h-24 rounded-full shrink-0"
              style={{
                background:
                  match.result === "victory"
                    ? "var(--color-calm)"
                    : "var(--color-app-accent)",
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[10px] uppercase tracking-[0.24em] font-mono px-2 py-0.5 rounded"
                  style={{
                    background:
                      match.result === "victory"
                        ? "rgba(110, 231, 183, 0.12)"
                        : "rgba(255, 51, 68, 0.12)",
                    color:
                      match.result === "victory"
                        ? "var(--color-calm)"
                        : "var(--color-app-accent)",
                  }}
                >
                  {match.result === "victory" ? "Victory" : "Defeat"}
                </span>
                <span className="text-xs text-fg-mute font-mono">
                  {match.date}
                </span>
              </div>
              <h2 className="mt-3 text-3xl font-display tracking-tight leading-tight max-w-3xl">
                {match.highlight}
              </h2>
            </div>
          </div>
        </section>

        {/* ============ HRV TIMELINE ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="text-lg font-display font-medium tracking-tight">HRV timeline</h3>
              <p className="text-xs text-fg-mute mt-0.5">
                Full match · {timeline.points.length} samples · {match.stressEvents} stress events flagged
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-mono">
              <div className="flex items-center gap-2">
                <span
                  className="block w-2 h-px"
                  style={{ background: "var(--color-fg)" }}
                />
                <span className="text-fg-dim">HRV</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{ background: "var(--color-app-accent)" }}
                />
                <span className="text-fg-dim">Stress event</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="block w-3 h-2"
                  style={{ background: "rgba(110,231,183,0.15)" }}
                />
                <span className="text-fg-dim">Calm zone</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <HrvTimeline timeline={timeline} avgHrv={match.avgHrv} />
          </div>
        </section>

        {/* ============ TWO-COLUMN: COMBAT + BIOMETRIC ============ */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatPanel title="Combat">
            <StatRow label="KDA" value={match.kda.toString()} />
            <StatRow label="Score" value={match.score.toLocaleString()} />
            <StatRow label="Headshot %" value={`${match.hsPercent}%`} />
            <StatRow label="Damage dealt" value={match.damage.toLocaleString()} />
            <StatRow label="Duration" value={match.duration} />
          </StatPanel>

          <StatPanel title="Biometric">
            <StatRow
              label="Avg BPM"
              value={match.avgBpm.toString()}
              status={match.avgBpm > 95 ? "warn" : "calm"}
            />
            <StatRow
              label="Peak BPM"
              value={match.peakBpm.toString()}
              status={match.peakBpm > 130 ? "warn" : "calm"}
            />
            <StatRow
              label="Avg HRV"
              value={`${match.avgHrv} ms`}
              status={match.avgHrv >= 60 ? "calm" : "warn"}
            />
            <StatRow
              label="Lowest HRV"
              value={`${match.peakStress} ms`}
              status={match.peakStress < 40 ? "warn" : "calm"}
            />
            <StatRow
              label="Calm %"
              value={`${match.calmPercent}%`}
              status={match.calmPercent >= 65 ? "calm" : "warn"}
            />
          </StatPanel>
        </section>

        {/* ============ CORRELATION INSIGHTS ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="text-lg font-display font-medium tracking-tight">Correlation insights</h3>
              <p className="text-xs text-fg-mute mt-0.5">
                Where physiology met outcome
              </p>
            </div>
            <ResearchNote
              note={{
                source: "Pivot",
                title: "Why we surface correlations, not raw data",
                body: "Players told us they didn't want HRV numbers — they wanted to know what those numbers meant for their performance. The correlation panel translates physiology into competitive outcome, which is the only framing the 5 interviewees actually engaged with.",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CorrelationCard
              label="KDA when calm"
              value={correlation.calmKda.toFixed(1)}
              comparison={`vs ${correlation.stressedKda.toFixed(1)} when stressed`}
              delta={correlation.calmKda - correlation.stressedKda}
              suffix=""
            />
            <CorrelationCard
              label="Reaction time"
              value={`${correlation.reactionCalm}ms`}
              comparison={`+${correlation.reactionDelta}ms slower under stress`}
              delta={-correlation.reactionDelta}
              suffix=""
              inverted
            />
            <CorrelationCard
              label="Accuracy"
              value={`${correlation.accuracyCalm}%`}
              comparison={`-${correlation.accuracyDelta}% during stress`}
              delta={correlation.accuracyDelta}
              suffix=""
              inverted
            />
          </div>
        </section>

        {/* ============ ADAPTIVE CONTROL FIRINGS ============ */}
        <section className="mb-10">
          <h3 className="text-lg font-display font-medium tracking-tight mb-4">
            Adaptive Control firings
          </h3>
          <p className="text-xs text-fg-mute mb-4">
            What BlitzMind did during this match. Click a firing to see its trigger.
          </p>
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--color-app-line)" }}
          >
            {timeline.firings.map((f, i) => (
              <div
                key={i}
                className="px-5 py-3.5 grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center"
                style={{
                  background: "var(--color-app-surface)",
                  borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)",
                }}
              >
                <div
                  className="w-1.5 h-6 rounded-full"
                  style={{ background: f.accent }}
                />
                <div>
                  <div className="text-sm text-fg">{f.action}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-fg-mute mt-0.5">
                    {f.system}
                  </div>
                </div>
                <div className="text-xs text-fg-mute font-mono">
                  Trigger: {f.trigger}
                </div>
                <div className="text-xs text-fg-mute font-mono whitespace-nowrap">
                  {f.timestamp}
                </div>
              </div>
            ))}
            {timeline.firings.length === 0 && (
              <div
                className="px-5 py-8 text-center text-xs text-fg-mute"
                style={{ background: "var(--color-app-surface)" }}
              >
                No adaptations fired during this match.
              </div>
            )}
          </div>
        </section>

        {/* ============ NAVIGATION ============ */}
        <section className="flex items-center justify-between pt-6 border-t" style={{ borderColor: "var(--color-app-line)" }}>
          <Link
            href="/app/sessions"
            className="text-sm text-fg-dim hover:text-fg transition-colors inline-flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M7 2 L3 6 L7 10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Back to sessions
          </Link>
          <div className="flex items-center gap-3">
            <PrevNextLink match={match} direction="prev" />
            <PrevNextLink match={match} direction="next" />
          </div>
        </section>
      </div>
    </>
  );
}

// ============================================================
// Helpers — timeline + correlations
// ============================================================

interface TimelineData {
  points: { x: number; hrv: number }[];
  events: { x: number; label: string; ms: number }[];
  calmZone: { min: number; max: number };
  firings: {
    timestamp: string;
    system: string;
    action: string;
    trigger: string;
    accent: string;
  }[];
}

function buildTimeline(match: MatchSession): TimelineData {
  const sampleCount = 60;
  const points: { x: number; hrv: number }[] = [];
  const baseline = match.avgHrv;

  // Predetermined "story" positions for stress events based on mode
  const storyPositions = getStoryPositions(match.mode, match.stressEvents);

  for (let i = 0; i < sampleCount; i++) {
    const x = i / (sampleCount - 1);
    const seed = (i * 9301 + match.avgHrv * 49297 + match.peakBpm * 17) % 233280;
    const noise = (seed / 233280 - 0.5) * 6;

    // Slow drift over the match
    const slowWave = Math.sin(i * 0.15 + match.avgHrv * 0.1) * 4;

    let value = baseline + noise + slowWave;

    // Dip near each stress event
    for (const pos of storyPositions) {
      const distance = Math.abs(x - pos.x);
      if (distance < 0.04) {
        const intensity = 1 - distance / 0.04;
        value -= (baseline - pos.dipTo) * intensity;
      }
    }

    points.push({ x, hrv: Math.max(25, Math.min(95, value)) });
  }

  const events = storyPositions.map((p) => ({
    x: p.x,
    label: p.label,
    ms: Math.round(p.dipTo),
  }));

  // Firings: derived from stress event count, with adaptive system actions
  const firings: TimelineData["firings"] = [];
  const systems = [
    {
      system: "Video",
      action: "Focus Mode engaged — HUD clutter reduced",
      trigger: "Calm < 50%",
      accent: "var(--color-app-accent)",
    },
    {
      system: "Audio",
      action: "Toxic teammate muted automatically",
      trigger: "Stress > 60%",
      accent: "var(--color-warn)",
    },
    {
      system: "Device",
      action: "Stick sensitivity reduced by 12%",
      trigger: "Stress > 65%",
      accent: "var(--color-app-accent)",
    },
    {
      system: "Weapons",
      action: "Loadout swapped to Stable set",
      trigger: "Calm < 45%",
      accent: "var(--color-app-action)",
    },
  ];

  for (let i = 0; i < Math.min(match.stressEvents, 4); i++) {
    const pos = storyPositions[i] ?? storyPositions[storyPositions.length - 1];
    if (!pos) break;
    firings.push({
      ...systems[i % systems.length],
      timestamp: formatTimestamp(pos.x, match.duration),
    });
  }

  return {
    points,
    events,
    calmZone: { min: 60, max: 80 },
    firings,
  };
}

function getStoryPositions(
  mode: string,
  stressEvents: number
): { x: number; label: string; dipTo: number }[] {
  // Different modes have different stress narratives
  const isBr = mode.includes("Battle Royale");
  const isRanked = mode === "Ranked";
  const isSd = mode === "Search & Destroy";

  if (stressEvents === 0) return [];

  const positions: { x: number; label: string; dipTo: number }[] = [];

  // First event: early-game contact
  if (stressEvents >= 1) {
    positions.push({ x: 0.18, label: "First contact", dipTo: 52 });
  }

  // Mid-match event
  if (stressEvents >= 2) {
    positions.push({
      x: 0.42,
      label: isSd ? "Bomb plant pressure" : isBr ? "Loot zone fight" : "Mid-round push",
      dipTo: 44,
    });
  }

  // Late mid
  if (stressEvents >= 3) {
    positions.push({ x: 0.58, label: "Multi-team engagement", dipTo: 42 });
  }

  // Pre-endgame
  if (stressEvents >= 4) {
    positions.push({
      x: 0.72,
      label: isRanked ? "Match point" : isBr ? "Top 10" : "Late round",
      dipTo: 38,
    });
  }

  // Endgame
  if (stressEvents >= 5) {
    positions.push({
      x: 0.86,
      label: isBr ? "Final circle" : "Final round",
      dipTo: 35,
    });
  }

  // Multiple endgame events
  for (let i = 5; i < stressEvents; i++) {
    positions.push({
      x: 0.9 + i * 0.015,
      label: `Stress spike ${i + 1}`,
      dipTo: 34 - i,
    });
  }

  return positions;
}

function formatTimestamp(x: number, duration: string): string {
  // Parse "28m 14s" → total seconds → return as MM:SS at position x
  const m = duration.match(/(\d+)m\s*(\d+)s/);
  if (!m) return "—";
  const total = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const at = Math.round(total * x);
  const mins = Math.floor(at / 60);
  const secs = at % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function buildCorrelation(match: MatchSession) {
  // Synthesize a realistic-looking calm-vs-stressed performance split
  const stressFactor = match.stressEvents >= 5 ? 0.55 : 0.7;
  const calmKda = Math.min(5, match.kda * 1.4);
  const stressedKda = Math.max(0.2, match.kda * stressFactor);
  const reactionCalm = 215 + Math.round((70 - match.avgHrv) * 2);
  const reactionDelta = 35 + match.stressEvents * 8;
  const accuracyCalm = Math.min(95, match.hsPercent + 18);
  const accuracyDelta = Math.min(40, match.stressEvents * 4 + 8);
  return {
    calmKda,
    stressedKda,
    reactionCalm,
    reactionDelta,
    accuracyCalm,
    accuracyDelta,
  };
}

// ============================================================
// Sub-components
// ============================================================

function HrvTimeline({
  timeline,
  avgHrv,
}: {
  timeline: TimelineData;
  avgHrv: number;
}) {
  const w = 1200;
  const h = 240;
  const pad = { x: 32, y: 24 };
  const innerW = w - pad.x * 2;
  const innerH = h - pad.y * 2;
  const minHrv = 30;
  const maxHrv = 90;

  const toX = (x: number) => pad.x + x * innerW;
  const toY = (hrv: number) =>
    pad.y + (1 - (hrv - minHrv) / (maxHrv - minHrv)) * innerH;

  const path =
    timeline.points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.x)} ${toY(p.hrv)}`)
      .join(" ") || "";

  // Area fill under the line
  const areaPath =
    path +
    ` L ${toX(timeline.points[timeline.points.length - 1].x)} ${pad.y + innerH}` +
    ` L ${toX(timeline.points[0].x)} ${pad.y + innerH} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      preserveAspectRatio="none"
      aria-label="HRV timeline over the full match"
    >
      <defs>
        <linearGradient id="hrv-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,51,68,0.16)" />
          <stop offset="100%" stopColor="rgba(255,51,68,0)" />
        </linearGradient>
      </defs>

      {/* Calm zone band */}
      <rect
        x={pad.x}
        y={toY(timeline.calmZone.max)}
        width={innerW}
        height={toY(timeline.calmZone.min) - toY(timeline.calmZone.max)}
        fill="rgba(110,231,183,0.06)"
      />
      {/* Calm zone labels */}
      <text
        x={pad.x + 6}
        y={toY(timeline.calmZone.max) + 11}
        fontSize="9"
        fontFamily="var(--font-mono)"
        fill="rgba(110,231,183,0.6)"
      >
        CALM ZONE
      </text>

      {/* Grid lines */}
      {[40, 50, 60, 70, 80].map((v) => (
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

      {/* Time-axis markers (0%, 25%, 50%, 75%, 100% of match) */}
      {[0, 0.25, 0.5, 0.75, 1].map((x) => (
        <g key={x}>
          <line
            x1={toX(x)}
            x2={toX(x)}
            y1={h - pad.y}
            y2={h - pad.y + 4}
            stroke="var(--color-app-line-strong)"
            strokeWidth="0.8"
          />
          <text
            x={toX(x)}
            y={h - pad.y + 14}
            fontSize="9"
            fontFamily="var(--font-mono)"
            fill="var(--color-fg-mute)"
            textAnchor="middle"
          >
            {x === 0 ? "0:00" : x === 1 ? "End" : `${Math.round(x * 100)}%`}
          </text>
        </g>
      ))}

      {/* Avg line */}
      <line
        x1={pad.x}
        x2={w - pad.x}
        y1={toY(avgHrv)}
        y2={toY(avgHrv)}
        stroke="var(--color-fg-dim)"
        strokeWidth="0.6"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Area + line */}
      <path d={areaPath} fill="url(#hrv-area)" />
      <path
        d={path}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Stress event markers */}
      {timeline.events.map((e, i) => {
        const cx = toX(e.x);
        const cy = toY(e.ms);
        return (
          <g key={i}>
            {/* Vertical line up from x-axis */}
            <line
              x1={cx}
              x2={cx}
              y1={cy + 4}
              y2={h - pad.y}
              stroke="var(--color-app-accent)"
              strokeWidth="0.6"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            {/* Dot */}
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill="var(--color-app-accent)"
              stroke="var(--color-app-bg)"
              strokeWidth="1.5"
            />
            {/* Label above */}
            <g>
              <rect
                x={cx - e.label.length * 2.7}
                y={cy - 22}
                width={e.label.length * 5.4}
                height="14"
                rx="2"
                fill="var(--color-app-surface-2)"
                stroke="var(--color-app-accent)"
                strokeWidth="0.5"
                opacity="0.95"
              />
              <text
                x={cx}
                y={cy - 12}
                fontSize="9"
                fontFamily="var(--font-mono)"
                fill="var(--color-app-accent)"
                textAnchor="middle"
              >
                {e.label.toUpperCase()}
              </text>
            </g>
          </g>
        );
      })}

      {/* Y-axis label */}
      <text
        x={pad.x - 24}
        y={h / 2}
        fontSize="9"
        fontFamily="var(--font-mono)"
        fill="var(--color-fg-mute)"
        textAnchor="middle"
        transform={`rotate(-90, ${pad.x - 24}, ${h / 2})`}
      >
        HRV (ms)
      </text>
    </svg>
  );
}

function StatPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      <div
        className="px-5 py-3 border-b"
        style={{ borderColor: "var(--color-app-line)" }}
      >
        <h4 className="text-sm font-medium text-fg">{title}</h4>
      </div>
      <div className="px-5 py-2 divide-y" style={{ borderColor: "var(--color-app-line)" }}>
        {children}
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "calm" | "warn";
}) {
  return (
    <div
      className="py-3 flex items-center justify-between gap-4 border-t first:border-t-0"
      style={{ borderColor: "var(--color-app-line)" }}
    >
      <span className="text-sm text-fg-dim">{label}</span>
      <span
        className="text-sm font-mono tabular-nums"
        style={{
          color:
            status === "warn"
              ? "var(--color-app-accent)"
              : status === "calm"
              ? "var(--color-calm)"
              : "var(--color-fg)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function CorrelationCard({
  label,
  value,
  comparison,
  delta,
  suffix,
  inverted = false,
}: {
  label: string;
  value: string;
  comparison: string;
  delta: number;
  suffix: string;
  inverted?: boolean;
}) {
  const isPositive = inverted ? delta < 0 : delta > 0;
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
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-display tabular-nums tracking-tight text-fg">
          {value}
        </span>
        <span className="text-xs font-mono text-fg-mute">{suffix}</span>
      </div>
      <div
        className="mt-2 text-xs"
        style={{
          color: isPositive ? "var(--color-calm)" : "var(--color-app-accent)",
        }}
      >
        {comparison}
      </div>
    </div>
  );
}

function PrevNextLink({
  match,
  direction,
}: {
  match: MatchSession;
  direction: "prev" | "next";
}) {
  const i = matches.findIndex((m) => m.id === match.id);
  const target =
    direction === "prev"
      ? i + 1 < matches.length
        ? matches[i + 1]
        : null
      : i > 0
      ? matches[i - 1]
      : null;

  if (!target) {
    return (
      <span className="text-xs text-fg-mute font-mono">
        {direction === "prev" ? "Oldest" : "Newest"}
      </span>
    );
  }

  return (
    <Link
      href={`/app/sessions/${target.id}`}
      className="text-xs text-fg-dim hover:text-fg transition-colors font-mono"
    >
      {direction === "prev" ? "← Older" : "Newer →"}
    </Link>
  );
}

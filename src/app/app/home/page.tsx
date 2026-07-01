"use client";

import Link from "next/link";
import Image from "next/image";
import { AppHeader, PrimaryButton, SecondaryButton } from "../_components/AppHeader";
import { profile, aggregates, matches, games } from "../_lib/mockData";
import { LiveValue } from "../../../components/LiveValue";
import { EcgLine } from "../../../components/EcgLine";
import { Sparkline, CalmBar } from "../../../components/MiniChart";

/**
 * Home — a gamer's launcher, not an analytics report.
 *
 * Priority order on landing: (1) is my gear working + where am I ranked
 * [status command bar], (2) what am I jumping into [game launcher with
 * Launch + options], (3) what should I know [last session + a single
 * recommendation], (4) the insights that make this product different.
 *
 * Heavy stat tables (K/D, HS%, ADR…) live on Sessions/Insights — they don't
 * belong shouting on the home screen.
 */

const RANK_PCT = Math.round((profile.rankPoints / profile.rankPointsNext) * 100);
const RP_TO_NEXT = profile.rankPointsNext - profile.rankPoints;

export default function HomePage() {
  const lastMatch = matches[0];

  return (
    <>
      <AppHeader
        eyebrow={`Logged in as ${profile.handle}`}
        title="Home"
        subtitle={`${profile.tier} · ${profile.region}`}
        actions={
          <>
            <SecondaryButton>Pair sensor</SecondaryButton>
            <Link href="/app/live">
              <PrimaryButton>Start session</PrimaryButton>
            </Link>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px]">
        {/* ============ IDENTITY + LIVE STATUS — the only thing above the fold ============ */}
        <section className="mb-8">
          <div
            className="rounded-2xl overflow-hidden p-5 sm:p-6 lg:p-7 relative"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 90% 0%, rgba(255,51,68,0.07) 0%, transparent 55%), linear-gradient(180deg, var(--color-app-surface-2) 0%, var(--color-app-surface) 100%)",
              border: "1px solid var(--color-app-line)",
            }}
          >
            {/* Decorative controller — bleeds off the right edge, low opacity,
                masked so it dissolves into the card. Hidden on small screens
                where it would collide with the content. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden md:block select-none"
              style={{ width: "48%" }}
            >
              <img
                src="/marketing/controller-three-quarter.png"
                alt=""
                className="absolute h-[150%] w-auto max-w-none"
                style={{
                  top: "50%",
                  right: "-8%",
                  transform: "translateY(-50%) rotate(-8deg)",
                  opacity: 0.14,
                  WebkitMaskImage:
                    "linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                }}
              />
            </div>

            {/* Foreground content wrapper — sits above the decorative layer */}
            <div className="relative z-10">
            {/* Identity meta row — small handle on left, live state on right */}
            <div className="flex items-center justify-between gap-4 mb-4 text-sm">
              <div className="text-fg-dim min-w-0 truncate">
                Logged in as{" "}
                <span className="text-fg" style={{ fontWeight: 500 }}>
                  {profile.handle}
                </span>
                <span className="hidden sm:inline">
                  {" "}· {profile.tier} · {profile.region} ·{" "}
                  <span className="tabular-nums">{profile.rankPoints.toLocaleString()} RP</span>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: "var(--color-calm)" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: "var(--color-calm)" }}
                  />
                </span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-fg-dim" style={{ fontWeight: 500 }}>
                  Live
                </span>
              </div>
            </div>

            {/* Welcoming display */}
            <h2
              className="text-fg"
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              Welcome back,{" "}
              <span className="text-fg-dim" style={{ fontWeight: 400 }}>
                Harnit.
              </span>
            </h2>
            <p className="mt-2 text-sm text-fg-dim max-w-xl leading-relaxed">
              Coming off a {lastMatch.result === "victory" ? "win" : "tough match"} on{" "}
              <span className="text-fg">{lastMatch.map}</span>. Sensor&rsquo;s reading clean
              and your peak window opens at{" "}
              <span className="text-fg">{aggregates.peakPerformanceWindow}</span>.
            </p>

            {/* Vitals strip — borderless, 5-col, whitespace separates */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              <Stat label="HRV" value={<LiveValue base={72} amplitude={3} />} unit="ms" tag="stable" tagColor="var(--color-calm)" />
              <Stat label="HR" value={<LiveValue base={68} amplitude={4} />} unit="bpm" tag="resting" tagColor="var(--color-calm)" />
              <Stat label="Calm" value="65" unit="%" tag="active" tagColor="var(--color-fg-dim)" />
              <Stat label="Battery" value="84" unit="%" tag="ok" tagColor="var(--color-fg-dim)" />
              <Stat label="Link" value="60" unit="Hz" tag="BLE" tagColor="var(--color-fg-dim)" />
            </div>

            {/* ECG line — subtle, just a thin signal trace */}
            <div className="mt-5 h-6 -mx-2">
              <EcgLine
                stroke="var(--color-calm)"
                strokeWidth={1}
                amplitude={0.5}
                speed={18}
                className="w-full h-full opacity-60"
              />
            </div>

            {/* Action row */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/app/live"
                className="px-5 py-2 rounded-md text-sm text-white transition-transform hover:-translate-y-px"
                style={{ background: "var(--color-app-action)", fontWeight: 500 }}
              >
                Launch Crucible Ops
              </Link>
              <Link
                href="/app/library"
                className="px-5 py-2 rounded-md text-sm text-fg-dim hover:text-fg transition-colors"
                style={{ fontWeight: 500 }}
              >
                Browse library
              </Link>
            </div>
            </div>{/* /z-10 content wrapper */}
          </div>
        </section>

        {/* ============ ACTIVE GAMES — launcher ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2
              className="text-fg"
              style={{
                fontSize: "clamp(18px, 1.8vw, 22px)",
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              Active games
            </h2>
            <Link href="/app/library" className="text-xs text-fg-dim hover:text-fg transition-colors">
              Open library →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.map((g) => (
              <GameLauncher key={g.id} game={g} featured={g.id === profile.primaryGame} />
            ))}
          </div>
        </section>

        {/* ============ THIS WEEK + LAST SESSION ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2
              className="text-fg"
              style={{
                fontSize: "clamp(18px, 1.8vw, 22px)",
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              This week
            </h2>
            <Link href="/app/insights" className="text-xs text-fg-dim hover:text-fg transition-colors">
              Open insights →
            </Link>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--color-app-surface-2)",
              border: "1px solid var(--color-app-line-strong)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* KPI strip — three metrics inline, compact */}
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--color-app-line)" }}>
              <MiniKPI
                label="Avg calm"
                value={`${aggregates.avgCalm}%`}
                delta={`${aggregates.calmDelta}%`}
                series={aggregates.trends.avgCalm.series}
                positive={aggregates.calmDelta >= 0}
              />
              <MiniKPI
                label="Stress events"
                value={aggregates.trends.stressEvents.series.at(-1)!.toString()}
                delta={`+${aggregates.trends.stressEvents.delta}`}
                series={aggregates.trends.stressEvents.series}
                positive={false}
              />
              <MiniKPI
                label="Win rate"
                value={`${aggregates.winRate}%`}
                delta={`+${aggregates.trends.winRate.delta}%`}
                series={aggregates.trends.winRate.series}
                positive={true}
              />
            </div>

            {/* Slim footer — peak window + last session on one line */}
            <div
              className="px-5 py-3.5 border-t flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
              style={{ borderColor: "var(--color-app-line)", background: "var(--color-app-bg)" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] uppercase tracking-[0.18em] text-fg-dim shrink-0">Peak</span>
                <span className="text-fg tabular-nums truncate" style={{ fontWeight: 500 }}>
                  {aggregates.peakPerformanceWindow}
                </span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] uppercase tracking-[0.18em] text-fg-dim shrink-0">Last</span>
                <span className="text-fg truncate" style={{ fontWeight: 500 }}>{lastMatch.map}</span>
                <span
                  className="text-[10px] uppercase tracking-[0.16em] tabular-nums px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: lastMatch.result === "victory" ? "rgba(110, 231, 183, 0.12)" : "rgba(255, 51, 68, 0.12)",
                    color: lastMatch.result === "victory" ? "var(--color-calm)" : "var(--color-app-accent)",
                    fontWeight: 600,
                  }}
                >
                  {lastMatch.result === "victory" ? "Win" : "Loss"}
                </span>
                <span className="text-fg-dim tabular-nums shrink-0">KDA {lastMatch.kda}</span>
              </div>
              <Link
                href={`/app/sessions/${lastMatch.id}`}
                className="ml-auto text-xs text-fg-dim hover:text-fg transition-colors shrink-0"
              >
                Match report →
              </Link>
            </div>
          </div>
        </section>

        {/* ============ RECENT MATCHES ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2
              className="text-fg"
              style={{
                fontSize: "clamp(18px, 1.8vw, 22px)",
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              Recent matches
            </h2>
            <Link href="/app/sessions" className="text-xs text-fg-dim hover:text-fg transition-colors">View all →</Link>
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-app-line)" }}>
            {matches.slice(0, 5).map((match, i) => (
              <Link
                key={match.id}
                href={`/app/sessions/${match.id}`}
                className="block transition-colors hover:bg-app-surface-2"
                style={{ background: "var(--color-app-surface)", borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)" }}
              >
                <div className="px-4 sm:px-5 py-4 flex items-center gap-4 sm:gap-6">
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ background: match.result === "victory" ? "var(--color-calm)" : "var(--color-app-accent)" }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-fg truncate">{match.mode}</div>
                    <div className="text-xs text-fg-dim tabular-nums mt-0.5 truncate">{match.map} · {match.duration}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6">
                    <MatchStat label="KDA" value={match.kda.toString()} />
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-[0.18em] tabular-nums text-fg-dim">Calm</div>
                      <div className="mt-1 flex items-center gap-2 justify-end">
                        <CalmBar value={match.calmPercent} result={match.result} />
                        <span className="text-sm tabular-nums tabular-nums text-fg w-9 text-right">{match.calmPercent}%</span>
                      </div>
                    </div>
                    <MatchStat label="Stress" value={match.stressEvents.toString()} accent={match.stressEvents > 5} />
                  </div>
                  <div className="text-xs text-fg-dim tabular-nums whitespace-nowrap shrink-0">{match.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

// ============================================================
// Pieces
// ============================================================

function GameLauncher({
  game,
  featured,
}: {
  game: (typeof games)[number];
  featured?: boolean;
}) {
  return (
    <div
      className="glass-card relative overflow-hidden p-5"
      data-selected={featured ? "true" : undefined}
    >
      {/* Cover art — low opacity, scrim for legibility */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={game.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 440px"
          className="object-cover"
          style={{ opacity: 0.38 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(19,19,24,0.78) 0%, rgba(19,19,24,0.15) 42%, rgba(19,19,24,0.92) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center w-11 h-11 rounded-lg text-base shrink-0"
            style={{ background: game.accent, color: "#0a0a0b", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            {game.icon}
          </span>
          <div className="min-w-0">
            <div className="text-fg font-medium truncate flex items-center gap-2">
              {game.name}
              {featured && (
                <span
                  className="text-[8px] uppercase tracking-[0.16em] tabular-nums px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(255,51,68,0.14)", color: "var(--color-app-accent)" }}
                >
                  Primary
                </span>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] tabular-nums text-fg-dim mt-1">
              {game.genre}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] tabular-nums uppercase tracking-[0.16em] text-fg-dim">
          <span>Last played</span>
          <span className="text-fg-dim">{game.lastPlayed}</span>
        </div>

        <div className="flex gap-2 mt-2">
          <Link
            href="/app/live"
            className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-app-action transition-transform hover:-translate-y-px"
          >
            Launch
          </Link>
          <Link
            href="/app/adaptive"
            className="px-4 py-1.5 rounded-md text-sm border border-app-line-strong text-fg-dim hover:text-fg hover:border-fg-mute transition-colors"
          >
            Options
          </Link>
        </div>
      </div>
    </div>
  );
}



function CardLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.24em] tabular-nums text-fg-dim">{children}</div>;
}

/**
 * Stat — a single cell in the horizontal vitals strip at the top of the
 * dashboard. Borderless, whitespace-separated. Uppercase label · big
 * tabular value · unit · small status tag underneath.
 */
function Stat({
  label,
  value,
  unit,
  tag,
  tagColor,
}: {
  label: string;
  value: React.ReactNode;
  unit: string;
  tag: string;
  tagColor: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-fg-dim mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-fg tabular-nums"
          style={{
            fontSize: "clamp(22px, 2.4vw, 28px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          {value}
        </span>
        <span className="text-xs text-fg-dim tabular-nums">{unit}</span>
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: tagColor, fontWeight: 500 }}>
        {tag}
      </div>
    </div>
  );
}

/**
 * MiniKPI — one compact metric cell in the This Week strip.
 * Label · value + delta · a short row of 7 tiny day-bars beneath.
 * Vertical + tight so three fit in one screen-width row at low height.
 */
function MiniKPI({
  label,
  value,
  delta,
  series,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  series: readonly number[];
  positive: boolean;
}) {
  const color = positive ? "var(--color-calm)" : "var(--color-app-accent)";
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = max - min || 1;
  return (
    <div className="px-4 sm:px-5 py-4" style={{ borderColor: "var(--color-app-line)" }}>
      <div className="text-[10px] uppercase tracking-[0.2em] text-fg-dim mb-2 truncate">
        {label}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className="text-fg tabular-nums"
          style={{ fontSize: "clamp(20px, 2.2vw, 26px)", letterSpacing: "-0.02em", fontWeight: 500 }}
        >
          {value}
        </span>
        <span className="text-[11px] tabular-nums" style={{ color, fontWeight: 500 }}>
          {delta}
        </span>
      </div>
      <div className="h-5 flex items-end gap-0.5">
        {series.map((v, i) => {
          const height = ((v - min) / span) * 100;
          const isLast = i === series.length - 1;
          return (
            <div
              key={i}
              className="flex-1 rounded-[1px]"
              style={{
                height: `${Math.max(16, height)}%`,
                background: color,
                opacity: isLast ? 1 : 0.28,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function MicroStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] tabular-nums text-fg-dim">{label}</div>
      <div className="mt-1 text-lg tabular-nums" style={{ color: accent ? "var(--color-app-accent)" : "var(--color-fg)", letterSpacing: "-0.02em", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function MatchStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <div className="text-[9px] uppercase tracking-[0.18em] tabular-nums text-fg-dim">{label}</div>
      <div className="mt-0.5 text-sm tabular-nums" style={{ color: accent ? "var(--color-app-accent)" : "var(--color-fg)", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

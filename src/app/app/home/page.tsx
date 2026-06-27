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
        {/* ============ HERO ============ */}
        <section className="mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] font-mono text-fg-mute mb-2">
              Wednesday afternoon · NA-East
            </div>
            <h2 className="text-3xl font-display tracking-tight text-fg">
              Good to see you back, Harnit.
            </h2>
            <p className="mt-2 text-sm text-fg-dim max-w-xl">
              Sensor paired. Your last session ended {lastMatch.date.toLowerCase()}. Here&rsquo;s where you&rsquo;re at.
            </p>
          </div>
        </section>

        {/* ============ STATUS CARDS ============ */}
        <section className="mb-10">
          <div
            className="rounded-lg border grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden"
            style={{ background: "var(--color-app-line)", borderColor: "var(--color-app-line)" }}
          >
            {/* Controller */}
            <div className="p-5" style={{ background: "var(--color-app-surface)" }}>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--color-calm)" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--color-calm)" }} />
                </span>
                Controller
              </div>
              <div className="mt-3 text-2xl font-display tracking-tight" style={{ color: "var(--color-calm)" }}>
                Connected
              </div>
              <div className="mt-3 space-y-1.5 text-[11px] font-mono text-fg-mute">
                <div className="flex justify-between"><span>Device</span><span className="text-fg-dim">DV.01</span></div>
                <div className="flex justify-between"><span>Battery</span><span className="text-fg-dim">84%</span></div>
                <div className="flex justify-between"><span>Link</span><span className="text-fg-dim">BLE · 60Hz</span></div>
              </div>
            </div>

            {/* Vitals */}
            <div className="p-5" style={{ background: "var(--color-app-surface)" }}>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">
                <span className="block w-1.5 h-1.5 rounded-full heartbeat" style={{ background: "var(--color-calm)" }} />
                Vitals
              </div>
              <div className="mt-3 flex items-end gap-6">
                <div>
                  <div className="text-3xl font-display tabular-nums tracking-tight text-fg">
                    <LiveValue base={72} amplitude={3} />
                  </div>
                  <div className="text-[10px] font-mono text-fg-mute mt-0.5">bpm</div>
                </div>
                <div>
                  <div className="text-3xl font-display tabular-nums tracking-tight text-fg">
                    <LiveValue base={68} amplitude={4} />
                  </div>
                  <div className="text-[10px] font-mono text-fg-mute mt-0.5">hrv · ms</div>
                </div>
              </div>
              <div className="mt-3 h-5">
                <EcgLine stroke="var(--color-calm)" strokeWidth={1} amplitude={0.5} speed={16} className="w-full h-full opacity-60" />
              </div>
            </div>

            {/* Rank */}
            <div className="p-5" style={{ background: "var(--color-app-surface)" }}>
              <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">Rank</div>
              <div className="mt-3 text-2xl font-display tracking-tight text-fg">{profile.tier}</div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-app-line)" }}>
                <div className="h-full rounded-full" style={{ width: `${RANK_PCT}%`, background: "var(--color-app-accent)" }} />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-mono text-fg-mute">
                <span>{RP_TO_NEXT} RP to next</span>
                <span className="text-fg-dim">{profile.rankPoints.toLocaleString()} / {profile.rankPointsNext.toLocaleString()}</span>
              </div>
            </div>

            {/* This week */}
            <div className="p-5" style={{ background: "var(--color-app-surface)" }}>
              <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">This week</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-display tabular-nums tracking-tight">{aggregates.winRate}%</span>
                <span className="text-xs font-mono" style={{ color: "var(--color-calm)" }}>+{aggregates.trends.winRate.delta}%</span>
              </div>
              <div className="text-[10px] font-mono text-fg-mute mt-1">win rate</div>
              <div className="mt-3">
                <Sparkline data={aggregates.trends.winRate.series} color="var(--color-calm)" height={28} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ YOUR GAMES — launcher ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg font-display font-medium tracking-tight">Your games</h3>
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

        {/* ============ LAST SESSION + RECOMMENDED (2 cards) ============ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          {/* Last session takeaway */}
          <div className="glass-panel p-5">
            <div className="flex items-start justify-between">
              <CardLabel>Last session takeaway</CardLabel>
              <span
                className="text-[10px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: lastMatch.result === "victory" ? "rgba(110, 231, 183, 0.12)" : "rgba(255, 51, 68, 0.12)",
                  color: lastMatch.result === "victory" ? "var(--color-calm)" : "var(--color-app-accent)",
                }}
              >
                {lastMatch.result === "victory" ? "Victory" : "Defeat"}
              </span>
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
              {lastMatch.mode} · {lastMatch.map}
            </div>
            <p className="mt-3 text-sm text-fg leading-relaxed">{lastMatch.highlight}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t" style={{ borderColor: "var(--color-app-line)" }}>
              <MicroStat label="KDA" value={lastMatch.kda.toString()} />
              <MicroStat label="Calm" value={`${lastMatch.calmPercent}%`} />
              <MicroStat label="Stress events" value={lastMatch.stressEvents.toString()} accent={lastMatch.stressEvents > 5} />
            </div>
            <Link href={`/app/sessions/${lastMatch.id}`} className="mt-4 inline-flex items-center gap-1.5 text-xs text-fg-dim hover:text-fg transition-colors">
              Open match report →
            </Link>
          </div>

          {/* Recommended — slim, action-first */}
          <div className="glass-panel p-5" style={{ boxShadow: "0 0 0 1px rgba(255,51,68,0.18), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            <CardLabel>Recommended</CardLabel>
            <div className="mt-3 text-base text-fg leading-snug font-medium">
              Skip ranked for the next 2 hours.
            </div>
            <p className="mt-2 text-sm text-fg-dim leading-relaxed">
              Your HRV trended down {Math.abs(aggregates.hrvDelta)}% over the last 7 sessions, and you&rsquo;ve played 4 ranked matches today. The data says you perform best when calm — and you&rsquo;re not there right now.
            </p>
            <div className="mt-4 flex gap-2">
              <SecondaryButton onClick={() => {}}>Open Training</SecondaryButton>
              <SecondaryButton onClick={() => {}}>Snooze 1h</SecondaryButton>
            </div>
          </div>
        </section>

        {/* ============ PERFORMANCE INSIGHT ============ */}
        <section className="mb-10">
          <h3 className="text-lg font-display font-medium tracking-tight mb-4">Performance insight</h3>

          <Link
            href="/app/insights"
            className="group block glass-panel p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: "var(--color-app-line)" }}
          >
            <div className="flex items-center justify-between mb-7">
              <CardLabel>7-day trends</CardLabel>
              <span className="inline-flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 border border-line text-fg-dim transition-all duration-200 group-hover:text-white group-hover:border-transparent group-hover:bg-app-accent">
                Open insights
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-end">
              <TrendRow
                label="Avg calm"
                value={`${aggregates.avgCalm}%`}
                delta={`${aggregates.calmDelta}%`}
                series={aggregates.trends.avgCalm.series}
                positive={aggregates.calmDelta >= 0}
              />
              <TrendRow
                label="Stress events"
                value={aggregates.trends.stressEvents.series.at(-1)!.toString()}
                delta={`+${aggregates.trends.stressEvents.delta}`}
                series={aggregates.trends.stressEvents.series}
                positive={false}
              />
              <div>
                <div className="text-xs text-fg-mute mb-1">Peak window</div>
                <div className="text-2xl font-display tracking-tight text-fg">
                  {aggregates.peakPerformanceWindow}
                </div>
                <div className="text-[10px] font-mono text-fg-mute mt-1.5">
                  Your best ranked results land here
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ============ RECENT MATCHES ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg font-display font-medium tracking-tight">Recent matches</h3>
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
                    <div className="text-xs text-fg-mute font-mono mt-0.5 truncate">{match.map} · {match.duration}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6">
                    <MatchStat label="KDA" value={match.kda.toString()} />
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-[0.18em] font-mono text-fg-mute">Calm</div>
                      <div className="mt-1 flex items-center gap-2 justify-end">
                        <CalmBar value={match.calmPercent} result={match.result} />
                        <span className="text-sm font-mono tabular-nums text-fg w-9 text-right">{match.calmPercent}%</span>
                      </div>
                    </div>
                    <MatchStat label="Stress" value={match.stressEvents.toString()} accent={match.stressEvents > 5} />
                  </div>
                  <div className="text-xs text-fg-mute font-mono whitespace-nowrap shrink-0">{match.date}</div>
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
            className="grid place-items-center w-11 h-11 rounded-lg font-display text-base shrink-0"
            style={{ background: game.accent, color: "#0a0a0b" }}
          >
            {game.icon}
          </span>
          <div className="min-w-0">
            <div className="text-fg font-medium truncate flex items-center gap-2">
              {game.name}
              {featured && (
                <span
                  className="text-[8px] uppercase tracking-[0.16em] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(255,51,68,0.14)", color: "var(--color-app-accent)" }}
                >
                  Primary
                </span>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] font-mono text-fg-mute mt-1">
              {game.genre}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-fg-mute">
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
  return <div className="text-[10px] uppercase tracking-[0.24em] font-mono text-fg-mute">{children}</div>;
}

function MicroStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] font-mono text-fg-mute">{label}</div>
      <div className="mt-1 text-lg font-display tabular-nums tracking-tight" style={{ color: accent ? "var(--color-app-accent)" : "var(--color-fg)" }}>{value}</div>
    </div>
  );
}

function MatchStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <div className="text-[9px] uppercase tracking-[0.18em] font-mono text-fg-mute">{label}</div>
      <div className="mt-0.5 text-sm font-mono tabular-nums" style={{ color: accent ? "var(--color-app-accent)" : "var(--color-fg)" }}>{value}</div>
    </div>
  );
}

function TrendRow({ label, value, delta, series, positive }: { label: string; value: string; delta: string; series: readonly number[]; positive: boolean }) {
  const color = positive ? "var(--color-calm)" : "var(--color-app-accent)";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs text-fg-mute">{label}</span>
        <span className="flex items-baseline gap-2">
          <span className="text-sm font-mono tabular-nums text-fg">{value}</span>
          <span className="text-[10px] font-mono" style={{ color }}>{delta}</span>
        </span>
      </div>
      <Sparkline data={series} color={color} height={28} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { AppHeader, PrimaryButton, SecondaryButton } from "../_components/AppHeader";
import { ResearchNote } from "../_components/ResearchNote";
import { StaggerChildren } from "../_components/StaggerChildren";
import { profile, aggregates, matches } from "../_lib/mockData";
import { LiveValue } from "../../../components/LiveValue";

/**
 * Home — the dashboard the user lands on when opening the app.
 *
 * Structure: greeting + live state hero, then 3-column grid of snapshot
 * cards (Today's biometrics, Last session takeaway, Recommended action),
 * then a recent matches strip at the bottom.
 *
 * The goal of this screen: in 5 seconds, the player knows their state and
 * what to do next. No tab-switching required.
 */

export default function HomePage() {
  const lastMatch = matches[0];
  const lastWin = matches.find((m) => m.result === "victory");

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

      <div className="px-8 py-8 max-w-[1400px]">
        {/* ============ HERO: GREETING + LIVE STATE ============ */}
        <section className="mb-10">
          <div className="flex items-end justify-between gap-8 mb-6">
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
          </div>

          {/* Live state strip — current biometrics */}
          <StaggerChildren
            className="rounded-lg border grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden"
            style={{
              background: "var(--color-app-line)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <LiveStateCard
              label="Resting BPM"
              value={<LiveValue base={72} amplitude={3} />}
              suffix="bpm"
              status="calm"
              note="Within baseline"
            />
            <LiveStateCard
              label="HRV"
              value={<LiveValue base={68} amplitude={4} />}
              suffix="ms"
              status="calm"
              note="Steady"
            />
            <LiveStateCard
              label="Readiness"
              value="High"
              status="calm"
              note="Cleared for ranked"
            />
            <LiveStateCard
              label="Last play"
              value={lastMatch.date}
              status="neutral"
              note={lastMatch.result === "victory" ? "Win" : "Loss"}
            />
          </StaggerChildren>
        </section>

        {/* ============ 3-CARD GRID: PERFORMANCE / TAKEAWAY / RECOMMENDED ============ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {/* Card 1: Weekly performance summary */}
          <Card>
            <CardLabel>This week</CardLabel>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-display tabular-nums tracking-tight">
                {aggregates.winRate}%
              </span>
              <span className="text-xs font-mono text-fg-mute">win rate</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <Stat label="K/D ratio" value={aggregates.kda.toString()} />
              <Stat label="HS%" value={`${aggregates.hsPercent}%`} />
              <Stat label="Avg damage" value={aggregates.adr.toString()} />
              <Stat
                label="Hours played"
                value={`${aggregates.hoursThisWeek}h`}
                delta={`${aggregates.hoursThisWeek - aggregates.hoursLastWeek > 0 ? "+" : ""}${(aggregates.hoursThisWeek - aggregates.hoursLastWeek).toFixed(1)}h`}
              />
            </div>
            <Link
              href="/app/sessions"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-fg-dim hover:text-fg transition-colors"
            >
              View all sessions →
            </Link>
          </Card>

          {/* Card 2: Last session takeaway */}
          <Card>
            <div className="flex items-start justify-between">
              <CardLabel>Last session takeaway</CardLabel>
              <span
                className="text-[10px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background:
                    lastMatch.result === "victory"
                      ? "rgba(110, 231, 183, 0.12)"
                      : "rgba(255, 51, 68, 0.12)",
                  color:
                    lastMatch.result === "victory"
                      ? "var(--color-calm)"
                      : "var(--color-app-accent)",
                }}
              >
                {lastMatch.result === "victory" ? "Victory" : "Defeat"}
              </span>
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
              {lastMatch.mode} · {lastMatch.map}
            </div>
            <p className="mt-3 text-sm text-fg leading-relaxed">
              {lastMatch.highlight}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t" style={{ borderColor: "var(--color-app-line)" }}>
              <MicroStat label="KDA" value={lastMatch.kda.toString()} />
              <MicroStat label="Calm" value={`${lastMatch.calmPercent}%`} />
              <MicroStat
                label="Stress events"
                value={lastMatch.stressEvents.toString()}
                accent={lastMatch.stressEvents > 5}
              />
            </div>
            <Link
              href={`/app/sessions/${lastMatch.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-fg-dim hover:text-fg transition-colors"
            >
              Open match report →
            </Link>
          </Card>

          {/* Card 3: Recommendation engine — the "what to do next" */}
          <Card accent>
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

            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-app-line)" }}>
              <ResearchNote
                note={{
                  source: "Interview",
                  title: "Why we recommend instead of restrict",
                  body: "All 5 interviewees said they would ignore a hard restriction on ranked play. But they engaged with a recommendation framed as performance optimization. The pivot from emotional feedback to mechanical advantage shows up here.",
                }}
              />
            </div>
          </Card>
        </section>

        {/* ============ RECENT MATCHES ============ */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg font-medium tracking-tight">Recent matches</h3>
            <Link
              href="/app/sessions"
              className="text-xs text-fg-dim hover:text-fg transition-colors"
            >
              View all →
            </Link>
          </div>

          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--color-app-line)" }}
          >
            {matches.slice(0, 5).map((match, i) => (
              <Link
                key={match.id}
                href={`/app/sessions/${match.id}`}
                className="block transition-colors hover:bg-app-surface-2"
                style={{
                  background:
                    i === 0 ? "var(--color-app-surface)" : "var(--color-app-surface)",
                  borderTop:
                    i === 0 ? "none" : "1px solid var(--color-app-line)",
                }}
              >
                <div className="px-5 py-4 grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-6">
                  {/* Result indicator */}
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{
                      background:
                        match.result === "victory"
                          ? "var(--color-calm)"
                          : "var(--color-app-accent)",
                    }}
                  />
                  {/* Mode + map */}
                  <div className="min-w-0">
                    <div className="text-sm text-fg truncate">{match.mode}</div>
                    <div className="text-xs text-fg-mute font-mono mt-0.5 truncate">
                      {match.map} · {match.duration}
                    </div>
                  </div>
                  {/* Stats */}
                  <MatchStat label="KDA" value={match.kda.toString()} />
                  <MatchStat label="Calm" value={`${match.calmPercent}%`} />
                  <MatchStat
                    label="Stress"
                    value={match.stressEvents.toString()}
                    accent={match.stressEvents > 5}
                  />
                  <div className="text-xs text-fg-mute font-mono whitespace-nowrap">
                    {match.date}
                  </div>
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
// Small composable bits used throughout the dashboard
// ============================================================

function Card({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        background: accent ? "var(--color-app-surface-2)" : "var(--color-app-surface)",
        borderColor: accent ? "var(--color-app-line-strong)" : "var(--color-app-line)",
      }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.24em] font-mono text-fg-mute">
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-fg-mute">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-fg tabular-nums">{value}</span>
        {delta && (
          <span
            className="text-xs font-mono"
            style={{
              color: delta.startsWith("+")
                ? "var(--color-calm)"
                : "var(--color-app-accent)",
            }}
          >
            {delta}
          </span>
        )}
      </span>
    </div>
  );
}

function MicroStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] font-mono text-fg-mute">
        {label}
      </div>
      <div
        className="mt-1 text-lg font-display tabular-nums tracking-tight"
        style={{
          color: accent ? "var(--color-app-accent)" : "var(--color-fg)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MatchStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-right">
      <div className="text-[9px] uppercase tracking-[0.18em] font-mono text-fg-mute">
        {label}
      </div>
      <div
        className="mt-0.5 text-sm font-mono tabular-nums"
        style={{
          color: accent ? "var(--color-app-accent)" : "var(--color-fg)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function LiveStateCard({
  label,
  value,
  suffix,
  status,
  note,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
  status: "calm" | "warn" | "neutral";
  note: string;
}) {
  const statusColor =
    status === "calm"
      ? "var(--color-calm)"
      : status === "warn"
      ? "var(--color-app-accent)"
      : "var(--color-fg-mute)";

  return (
    <div
      className="p-5"
      style={{ background: "var(--color-app-surface)" }}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-mono text-fg-mute">
        <span
          className="block w-1.5 h-1.5 rounded-full heartbeat"
          style={{ background: statusColor }}
        />
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-display tabular-nums tracking-tight text-fg">
          {value}
        </span>
        {suffix && (
          <span className="text-xs text-fg-mute font-mono">{suffix}</span>
        )}
      </div>
      <div
        className="mt-2 text-xs font-mono"
        style={{ color: statusColor }}
      >
        {note}
      </div>
    </div>
  );
}

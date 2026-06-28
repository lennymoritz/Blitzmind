"use client";

import { useState } from "react";
import { AppHeader, PrimaryButton, SecondaryButton } from "../_components/AppHeader";
import { ResearchNote } from "../_components/ResearchNote";
import { profile } from "../_lib/mockData";

/**
 * Settings — /app/settings.
 *
 * Account and product configuration. Five sections:
 *   1. Profile — handle, avatar, region, tier (read-mostly)
 *   2. Sensor — pairing status, re-pair, calibration history
 *   3. Game integrations — connected games + their status
 *   4. Tournament mode — the integrity feature (analytics-only)
 *   5. Data — export, history, retention
 *
 * Tournament Mode is the headline feature here. It's the answer to
 * "isn't this cheating?" — when on, BlitzMind records but does not
 * adapt, so a player can use it during sanctioned play to gather
 * data without altering gameplay.
 */

export default function SettingsPage() {
  const [tournamentMode, setTournamentMode] = useState(false);
  const [recordEverything, setRecordEverything] = useState(true);
  const [shareAnonymizedData, setShareAnonymizedData] = useState(false);
  const [dataSavedToast, setDataSavedToast] = useState(false);

  const integrations = [
    { id: "crucible", name: "Crucible Ops", connected: true, lastSync: "Just now" },
    { id: "rift", name: "Rift Runners", connected: true, lastSync: "12h ago" },
    { id: "vector", name: "Vector Strike", connected: false, lastSync: "—" },
    { id: "steam", name: "Steam", connected: true, lastSync: "2d ago" },
    { id: "discord", name: "Discord", connected: false, lastSync: "—" },
  ];

  return (
    <>
      <AppHeader
        eyebrow="Account"
        title="Settings"
        subtitle={profile.handle}
        actions={
          <>
            <SecondaryButton>Sign out</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setDataSavedToast(true);
                setTimeout(() => setDataSavedToast(false), 2200);
              }}
            >
              {dataSavedToast ? "Saved ✓" : "Save changes"}
            </PrimaryButton>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1100px] space-y-10">
        {/* ============ PROFILE ============ */}
        <Section number="01" title="Profile" description="How you appear to teammates and on leaderboards.">
          <div
            className="rounded-lg border p-5"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-full grid place-items-center font-display text-xl"
                style={{
                  background: "var(--color-app-surface-3)",
                  color: "var(--color-fg-dim)",
                }}
              >
                HK
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg text-fg font-medium">{profile.handle}</div>
                <div className="text-xs text-fg-mute tabular-nums mt-1">
                  {profile.tier} · {profile.region} · {profile.membership}
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <div className="flex-1 max-w-md">
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: "var(--color-app-line)" }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${(profile.rankPoints / profile.rankPointsNext) * 100}%`,
                          background: "var(--color-app-accent)",
                        }}
                      />
                    </div>
                    <div className="mt-1 flex items-baseline justify-between text-[10px] tabular-nums text-fg-mute">
                      <span>{profile.rankPoints} RP</span>
                      <span>{profile.rankPointsNext - profile.rankPoints} to next tier</span>
                    </div>
                  </div>
                </div>
              </div>
              <SecondaryButton>Edit profile</SecondaryButton>
            </div>
          </div>
        </Section>

        {/* ============ SENSOR ============ */}
        <Section
          number="02"
          title="Sensor"
          description="Your BlitzMind controller and biometric capture settings."
        >
          <div
            className="rounded-lg border"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <div className="px-5 py-4 flex items-center gap-4 border-b" style={{ borderColor: "var(--color-app-line)" }}>
              <div
                className="w-10 h-10 rounded grid place-items-center shrink-0"
                style={{ background: "var(--color-app-surface-3)" }}
              >
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
                  <path
                    d="M5 8 Q5 6 8 6 L14 6 Q17 6 17 8 L17 11 Q17 14 14 14 L13 14 L11 16 L9 14 L8 14 Q5 14 5 11 Z"
                    stroke="var(--color-fg-dim)"
                    strokeWidth="1.2"
                    fill="var(--color-app-surface-2)"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-fg font-medium">
                    BlitzMind Controller
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] tabular-nums px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(110, 231, 183, 0.15)",
                      color: "var(--color-calm)",
                    }}
                  >
                    Paired
                  </span>
                </div>
                <div className="mt-1 text-xs text-fg-mute tabular-nums">
                  CTRL-7421 · BLE · −62 dBm · battery 84%
                </div>
              </div>
              <SecondaryButton>Re-pair</SecondaryButton>
            </div>

            <div className="px-5 py-4">
              <Toggle
                label="Record everything"
                description="Capture HRV, grip pressure, and IMU data during every session"
                checked={recordEverything}
                onChange={setRecordEverything}
              />
              <Toggle
                label="Share anonymized data"
                description="Help improve BlitzMind's adaptive triggers — strips identifiers before sending"
                checked={shareAnonymizedData}
                onChange={setShareAnonymizedData}
              />
            </div>

            <div
              className="px-5 py-4 border-t flex items-baseline justify-between"
              style={{ borderColor: "var(--color-app-line)" }}
            >
              <div className="text-xs text-fg-mute">
                Last calibration: Yesterday · Baseline HRV 71ms
              </div>
              <button
                className="text-xs text-fg-dim hover:text-fg transition-colors underline underline-offset-4"
              >
                Re-calibrate baseline
              </button>
            </div>
          </div>
        </Section>

        {/* ============ TOURNAMENT MODE ============ */}
        <Section
          number="03"
          title="Tournament mode"
          description="The integrity feature. When on, BlitzMind only records — it never adapts your gameplay."
        >
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              background: tournamentMode
                ? "var(--color-app-surface-2)"
                : "var(--color-app-surface)",
              borderColor: tournamentMode
                ? "var(--color-warn)"
                : "var(--color-app-line)",
            }}
          >
            <div className="px-5 py-5 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded grid place-items-center shrink-0"
                style={{ background: "var(--color-app-surface-3)" }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                  <path
                    d="M11 2 L13 7 L18 7.5 L14 11 L15 17 L11 14 L7 17 L8 11 L4 7.5 L9 7 Z"
                    stroke="var(--color-warn)"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                    fill={tournamentMode ? "rgba(251, 191, 36, 0.18)" : "none"}
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base text-fg font-medium">
                  {tournamentMode ? "Tournament mode is ON" : "Tournament mode is OFF"}
                </div>
                <p className="mt-1.5 text-xs text-fg-dim leading-relaxed max-w-2xl">
                  {tournamentMode ? (
                    <>
                      BlitzMind is currently recording but <strong>not adapting</strong> your gameplay. Visuals, audio, weapons, and controller settings will not change in response to your physiology. Use this for sanctioned competitive play.
                    </>
                  ) : (
                    <>
                      Adaptive Control is active. BlitzMind may modify your visuals, audio, loadouts, or controller behavior in response to your physiology. Switch to Tournament Mode before entering sanctioned tournaments.
                    </>
                  )}
                </p>
                {tournamentMode && (
                  <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 rounded text-[10px] uppercase tracking-[0.18em] tabular-nums"
                    style={{
                      background: "rgba(251, 191, 36, 0.12)",
                      color: "var(--color-warn)",
                    }}>
                    <span className="block w-1.5 h-1.5 rounded-full heartbeat" style={{ background: "var(--color-warn)" }} />
                    Recording only · No adaptations
                  </div>
                )}
              </div>
              <ToggleSwitch checked={tournamentMode} onChange={setTournamentMode} />
            </div>
          </div>

          <div className="mt-3">
            <ResearchNote
              note={{
                source: "Pivot",
                title: "Why we built Tournament Mode at all",
                body: "Early survey respondents flagged competitive integrity as a hard blocker. The pivot from emotional feedback to adaptive control made this question urgent — if BlitzMind modifies gameplay, it can't be used in sanctioned events without an off switch. Tournament Mode is the off switch. It also unlocks the analytics-only use case (esports teams analyzing their players during competition without affecting the match).",
              }}
            />
          </div>
        </Section>

        {/* ============ GAME INTEGRATIONS ============ */}
        <Section
          number="04"
          title="Game integrations"
          description="Connected games BlitzMind reads match data from."
        >
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            {integrations.map((int, i) => (
              <div
                key={int.id}
                className="px-5 py-4 grid grid-cols-[1fr_auto_auto] gap-4 items-center"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--color-app-line)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded grid place-items-center tabular-nums text-[10px] shrink-0"
                    style={{
                      background: int.connected
                        ? "var(--color-app-surface-3)"
                        : "var(--color-app-surface-2)",
                      color: int.connected
                        ? "var(--color-fg-dim)"
                        : "var(--color-fg-mute)",
                    }}
                  >
                    {int.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-fg">{int.name}</div>
                    <div className="text-[10px] tabular-nums text-fg-mute mt-0.5">
                      {int.connected ? `Last sync · ${int.lastSync}` : "Not connected"}
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] tabular-nums px-1.5 py-0.5 rounded"
                    style={{
                      background: int.connected
                        ? "rgba(110, 231, 183, 0.12)"
                        : "var(--color-app-surface-3)",
                      color: int.connected
                        ? "var(--color-calm)"
                        : "var(--color-fg-mute)",
                    }}
                  >
                    {int.connected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <button
                  className="text-xs text-fg-dim hover:text-fg transition-colors underline underline-offset-4"
                >
                  {int.connected ? "Manage" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ DATA ============ */}
        <Section
          number="05"
          title="Data"
          description="Export, retention, account deletion."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DataAction
              title="Export all sessions"
              hint="CSV — all matches, biometric data, firings"
              action="Export"
            />
            <DataAction
              title="Retention"
              hint="Sessions older than 90 days are auto-archived"
              action="Manage"
            />
            <DataAction
              title="Delete account"
              hint="Permanent. All session data is purged."
              action="Delete"
              destructive
            />
          </div>
        </Section>
      </div>
    </>
  );
}

// ============================================================
// Sub-components
// ============================================================

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <div className="flex items-baseline gap-3">
          <span
            className="text-[10px] uppercase tracking-[0.24em] tabular-nums"
            style={{ color: "var(--color-app-accent)" }}
          >
            {number}
          </span>
          <h3 className="text-lg font-display font-medium tracking-tight text-fg">{title}</h3>
        </div>
        <p className="text-xs text-fg-mute mt-1 leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="py-3 flex items-start justify-between gap-6 border-b last:border-b-0" style={{ borderColor: "var(--color-app-line)" }}>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-fg">{label}</div>
        <div className="text-xs text-fg-mute mt-0.5 leading-relaxed">{description}</div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors shrink-0"
      style={{
        background: checked
          ? "var(--color-app-action)"
          : "var(--color-app-surface-3)",
      }}
      role="switch"
      aria-checked={checked}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
        style={{ left: checked ? "18px" : "2px" }}
      />
    </button>
  );
}

function DataAction({
  title,
  hint,
  action,
  destructive = false,
}: {
  title: string;
  hint: string;
  action: string;
  destructive?: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        background: "var(--color-app-surface)",
        borderColor: destructive
          ? "var(--color-app-accent)"
          : "var(--color-app-line)",
      }}
    >
      <div className="text-sm text-fg font-medium">{title}</div>
      <div className="mt-1 text-xs text-fg-mute leading-relaxed">{hint}</div>
      <button
        className="mt-4 px-3 py-1.5 rounded text-xs border transition-colors"
        style={{
          background: "transparent",
          color: destructive ? "var(--color-app-accent)" : "var(--color-fg-dim)",
          borderColor: destructive
            ? "var(--color-app-accent)"
            : "var(--color-app-line-strong)",
        }}
      >
        {action}
      </button>
    </div>
  );
}

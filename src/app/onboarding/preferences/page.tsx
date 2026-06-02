"use client";

import { useState } from "react";
import { OnboardingShell } from "../../app/_components/OnboardingShell";
import { ResearchNote } from "../../app/_components/ResearchNote";
import { games } from "../../app/_lib/mockData";

/**
 * Step 4 — Preferences.
 *
 * Three configurations to set before launching into the app:
 *   1. Primary game (which game's data shows on the dashboard)
 *   2. Default adaptation aggressiveness (Conservative / Balanced / Aggressive)
 *   3. Tournament mode awareness (just informs the user — actual toggling
 *      happens later in Settings)
 *
 * After this step, the app is fully configured and "Enter dashboard" routes
 * to /app/home.
 */

type Aggressiveness = "conservative" | "balanced" | "aggressive";

export default function PreferencesPage() {
  const [primaryGame, setPrimaryGame] = useState<string>(games[0].id);
  const [aggressiveness, setAggressiveness] = useState<Aggressiveness>("balanced");

  return (
    <OnboardingShell
      step={{
        stepNumber: 4,
        totalSteps: 4,
        backHref: "/onboarding/calibrate",
        continueHref: "/app/home",
        continueLabel: "Enter dashboard",
      }}
    >
      <div className="text-center mb-12">
        <div className="text-[10px] uppercase tracking-[0.32em] font-mono text-fg-mute">
          Step 4 · Preferences
        </div>
        <h2 className="mt-4 text-3xl font-display tracking-tight">
          Set your defaults.
        </h2>
        <p className="mt-3 text-fg-dim text-sm">
          You can change any of these anytime from Settings or Adaptive Control.
        </p>
      </div>

      <div className="space-y-8">
        {/* ============ 1. PRIMARY GAME ============ */}
        <PrefSection
          number="01"
          title="Primary game"
          description="Which game's data shows on your dashboard by default. You can switch anytime."
        >
          <div className="grid grid-cols-3 gap-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                selected={primaryGame === game.id}
                onSelect={() => setPrimaryGame(game.id)}
              />
            ))}
          </div>
        </PrefSection>

        {/* ============ 2. ADAPTATION AGGRESSIVENESS ============ */}
        <PrefSection
          number="02"
          title="Adaptation aggressiveness"
          description="How sensitive the system is to your physiological signals."
        >
          <div className="grid grid-cols-3 gap-3">
            {(["conservative", "balanced", "aggressive"] as const).map((level) => (
              <AggressivenessOption
                key={level}
                level={level}
                selected={aggressiveness === level}
                onSelect={() => setAggressiveness(level)}
              />
            ))}
          </div>
          <div className="mt-4">
            <ResearchNote
              note={{
                source: "Survey",
                title: "Default chosen by 68% of survey respondents",
                body: "We defaulted to Balanced because in 30 surveys, 68% of competitive players preferred 'noticeable but not aggressive' adaptations. Conservative was 18% (mostly Diamond+ tier who already self-regulate), Aggressive was 14% (mostly Bronze-Gold tier who wanted maximum help).",
              }}
            />
          </div>
        </PrefSection>

        {/* ============ 3. TOURNAMENT MODE AWARENESS ============ */}
        <PrefSection
          number="03"
          title="Tournament mode"
          description="When enabled, BlitzMind only records — never adapts. Required for sanctioned competitive play."
        >
          <div
            className="rounded-lg border p-4 flex items-center gap-4"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <div
              className="w-10 h-10 rounded-md grid place-items-center shrink-0"
              style={{
                background: "var(--color-app-surface-3)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M10 2 L12 7 L17 8 L13 12 L14 17 L10 14 L6 17 L7 12 L3 8 L8 7 Z"
                  stroke="var(--color-warn)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 text-sm">
              <div className="text-fg font-medium">
                You&rsquo;re in Training mode by default.
              </div>
              <div className="mt-1 text-fg-dim text-xs leading-relaxed">
                BlitzMind will adapt your visuals, audio, loadouts, and HUD based on your physiology. To enter a sanctioned tournament, switch to Tournament mode in Settings.
              </div>
            </div>
          </div>
        </PrefSection>
      </div>
    </OnboardingShell>
  );
}

// ============================================================
// Sub-components
// ============================================================

function PrefSection({
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
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[10px] uppercase tracking-[0.24em] font-mono" style={{ color: "var(--color-app-accent)" }}>
          {number}
        </span>
        <h3 className="text-lg font-medium text-fg tracking-tight">{title}</h3>
      </div>
      <p className="text-xs text-fg-mute mb-4 leading-relaxed">{description}</p>
      {children}
    </section>
  );
}

function GameCard({
  game,
  selected,
  onSelect,
}: {
  game: typeof games[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="rounded-lg border p-4 text-left transition-all"
      style={{
        background: selected
          ? "var(--color-app-surface-2)"
          : "var(--color-app-surface)",
        borderColor: selected
          ? "var(--color-app-accent)"
          : "var(--color-app-line)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded grid place-items-center font-display text-base font-medium"
          style={{
            background: selected ? game.accent : "var(--color-app-surface-3)",
            color: selected ? "var(--color-app-bg)" : "var(--color-fg-dim)",
          }}
        >
          {game.icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-fg font-medium truncate">{game.name}</div>
          <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
            {game.genre}
          </div>
        </div>
      </div>
    </button>
  );
}

function AggressivenessOption({
  level,
  selected,
  onSelect,
}: {
  level: Aggressiveness;
  selected: boolean;
  onSelect: () => void;
}) {
  const data = {
    conservative: {
      label: "Conservative",
      desc: "Only adapt when stress is severe.",
      detail: "Triggers at calm < 35%",
    },
    balanced: {
      label: "Balanced",
      desc: "Adapt at clear stress signals.",
      detail: "Triggers at calm < 50%",
    },
    aggressive: {
      label: "Aggressive",
      desc: "Adapt at the first sign of tension.",
      detail: "Triggers at calm < 65%",
    },
  }[level];

  return (
    <button
      onClick={onSelect}
      className="rounded-lg border p-4 text-left transition-all"
      style={{
        background: selected
          ? "var(--color-app-surface-2)"
          : "var(--color-app-surface)",
        borderColor: selected
          ? "var(--color-app-accent)"
          : "var(--color-app-line)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-fg">{data.label}</div>
        <div
          className="w-4 h-4 rounded-full border-2 grid place-items-center transition-all"
          style={{
            borderColor: selected
              ? "var(--color-app-accent)"
              : "var(--color-app-line-strong)",
          }}
        >
          {selected && (
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-app-accent)" }}
            />
          )}
        </div>
      </div>
      <div className="text-xs text-fg-dim leading-relaxed">{data.desc}</div>
      <div className="mt-2 text-[10px] font-mono text-fg-mute uppercase tracking-[0.18em]">
        {data.detail}
      </div>
    </button>
  );
}

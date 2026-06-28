"use client";

import { OnboardingShell } from "../../app/_components/OnboardingShell";
import { ResearchNote } from "../../app/_components/ResearchNote";

/**
 * Step 1 — Welcome screen.
 *
 * Sets the player's expectation for what BlitzMind does and what it
 * doesn't do. Explicitly addresses the "we're not your therapist" pivot
 * from the research, because that's the question every player will have
 * coming in.
 *
 * Three quick value-prop tiles below the main statement so users can
 * scan if they don't want to read paragraphs.
 */

export default function WelcomePage() {
  return (
    <OnboardingShell
      step={{
        stepNumber: 1,
        totalSteps: 4,
        continueHref: "/onboarding/pair",
        continueLabel: "Start setup",
      }}
    >
      <div className="text-center max-w-2xl mx-auto">
        <div className="ob-rise text-[10px] uppercase tracking-[0.32em] tabular-nums text-fg-mute">
          Welcome to BlitzMind
        </div>
        <h1
          className="ob-rise mt-6 text-3xl sm:text-4xl md:text-5xl font-display tracking-[-0.02em] leading-[1.05]"
          style={{ animationDelay: "0.06s" }}
        >
          Read your body.<br />
          <span className="italic font-light text-fg-dim">Adapt the game.</span>
        </h1>
        <p
          className="ob-rise mt-8 text-fg-dim text-base leading-relaxed"
          style={{ animationDelay: "0.12s" }}
        >
          BlitzMind reads your physiology — heart rate variability, grip pressure, focus signals — and adjusts your game in real time. Not to slow you down. To keep you competitive when your body starts working against you.
        </p>
      </div>

      <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        <ValueTile
          i={0}
          letter="A"
          title="Sense"
          body="HRV through the grips. Grip pressure on every input. Sampled 60Hz, processed on-device."
        />
        <ValueTile
          i={1}
          letter="B"
          title="Adapt"
          body="When your physiology crosses your thresholds, the game responds — brightness, HUD, loadouts, audio."
        />
        <ValueTile
          i={2}
          letter="C"
          title="Analyze"
          body="Every match becomes data. See where stress hits, what your peak performance window is. Then adjust."
        />
      </div>

      <div className="mt-12 flex items-center justify-center">
        <ResearchNote
          note={{
            source: "Pivot",
            title: "Why this isn't a wellness app",
            body: "After 30 surveys and 5 interviews, every competitive player rejected mid-game emotional alerts. They didn't want to be told to calm down — they wanted to perform. BlitzMind treats stress as a signal that drives adaptation, not as a problem to flag.",
          }}
        />
      </div>
    </OnboardingShell>
  );
}

function ValueTile({
  i,
  letter,
  title,
  body,
}: {
  i: number;
  letter: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="glass-card ob-rise group p-6"
      style={{ animationDelay: `${0.24 + i * 0.1}s` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="grid place-items-center w-9 h-9 rounded-lg tabular-nums text-sm shrink-0 transition-colors"
          style={{
            border: "1px solid var(--color-app-line-strong)",
            color: "var(--color-app-accent)",
            background:
              "linear-gradient(180deg, rgba(255,51,68,0.1), transparent)",
          }}
        >
          {letter}
        </span>
        <span className="font-display text-lg tracking-tight text-fg">
          {title}
        </span>
      </div>
      <p className="text-sm text-fg-dim leading-relaxed">{body}</p>
    </div>
  );
}

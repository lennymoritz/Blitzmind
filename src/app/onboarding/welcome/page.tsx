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
        <div className="text-[10px] uppercase tracking-[0.32em] font-mono text-fg-mute">
          Welcome to BlitzMind
        </div>
        <h1 className="mt-6 text-5xl font-display tracking-[-0.02em] leading-[1.05]">
          Read your body.<br />
          <span className="italic font-light text-fg-dim">Adapt the game.</span>
        </h1>
        <p className="mt-8 text-fg-dim text-base leading-relaxed">
          BlitzMind reads your physiology — heart rate variability, grip pressure, focus signals — and adjusts your game in real time. Not to slow you down. To keep you competitive when your body starts working against you.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-4">
        <ValueTile
          letter="A"
          title="Sense"
          body="HRV through the grips. Grip pressure on every input. Sampled 60Hz, processed on-device."
        />
        <ValueTile
          letter="B"
          title="Adapt"
          body="When your physiology crosses your thresholds, the game responds — brightness, HUD, loadouts, audio."
        />
        <ValueTile
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
  letter,
  title,
  body,
}: {
  letter: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="p-5 rounded-lg border"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.24em] font-mono mb-3"
        style={{ color: "var(--color-app-accent)" }}
      >
        {letter} · {title}
      </div>
      <p className="text-sm text-fg-dim leading-relaxed">{body}</p>
    </div>
  );
}

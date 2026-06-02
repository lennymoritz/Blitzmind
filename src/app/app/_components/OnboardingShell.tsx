"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * OnboardingShell — wraps each onboarding step with:
 *  - Top bar: BlitzMind wordmark + step indicator (1 / 4) + skip link
 *  - Content slot (the step itself)
 *  - Bottom bar: back/continue buttons
 *
 * Used by all 4 onboarding screens. Steps:
 *   1. Welcome / overview
 *   2. Pair sensor
 *   3. Baseline calibration
 *   4. Preferences (game, mode, default triggers)
 */

export interface OnboardingStep {
  stepNumber: 1 | 2 | 3 | 4;
  totalSteps: 4;
  backHref?: string;
  continueHref?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  onContinue?: () => void;
}

export function OnboardingShell({
  step,
  children,
}: {
  step: OnboardingStep;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleContinue = () => {
    if (step.onContinue) step.onContinue();
    if (step.continueHref) router.push(step.continueHref);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header
        className="h-16 px-8 flex items-center justify-between border-b shrink-0"
        style={{ borderColor: "var(--color-app-line)" }}
      >
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80">
          <div
            className="w-7 h-7 rounded grid place-items-center font-display text-base"
            style={{
              background: "var(--color-app-accent)",
              color: "var(--color-app-bg)",
            }}
          >
            B
          </div>
          <span className="font-display text-lg leading-none tracking-tight">
            BlitzMind
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: step.totalSteps }).map((_, i) => {
              const n = i + 1;
              const isActive = n === step.stepNumber;
              const isComplete = n < step.stepNumber;
              return (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full grid place-items-center text-[10px] font-mono transition-all"
                    style={{
                      background: isComplete
                        ? "var(--color-app-accent)"
                        : isActive
                        ? "var(--color-app-surface-3)"
                        : "transparent",
                      border: isActive
                        ? "1px solid var(--color-app-accent)"
                        : isComplete
                        ? "1px solid var(--color-app-accent)"
                        : "1px solid var(--color-app-line)",
                      color: isComplete
                        ? "var(--color-app-bg)"
                        : isActive
                        ? "var(--color-fg)"
                        : "var(--color-fg-mute)",
                    }}
                  >
                    {isComplete ? "✓" : n}
                  </div>
                  {n < step.totalSteps && (
                    <span
                      className="block w-6 h-px"
                      style={{
                        background: isComplete
                          ? "var(--color-app-accent)"
                          : "var(--color-app-line)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Link
            href="/app/home"
            className="text-xs uppercase tracking-[0.18em] font-mono text-fg-mute hover:text-fg-dim transition-colors"
          >
            Skip setup
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl">{children}</div>
      </main>

      {/* Bottom bar */}
      <footer
        className="h-20 px-8 flex items-center justify-between border-t shrink-0"
        style={{ borderColor: "var(--color-app-line)" }}
      >
        <div>
          {step.backHref && (
            <Link
              href={step.backHref}
              className="inline-flex items-center gap-2 text-sm text-fg-dim hover:text-fg transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M7 2 L3 6 L7 10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Back
            </Link>
          )}
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">
          Step {step.stepNumber} of {step.totalSteps}
        </div>
        <div>
          <button
            onClick={handleContinue}
            disabled={step.continueDisabled}
            className="px-5 py-2.5 rounded text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: step.continueDisabled
                ? "var(--color-app-surface-3)"
                : "var(--color-app-action)",
              color: step.continueDisabled
                ? "var(--color-fg-mute)"
                : "white",
            }}
          >
            {step.continueLabel || "Continue"}
            {!step.continueDisabled && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
                className="inline-block ml-1.5 -mt-px"
              >
                <path d="M5 2 L9 6 L5 10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { OnboardingShell } from "../../app/_components/OnboardingShell";
import { ResearchNote } from "../../app/_components/ResearchNote";

/**
 * Step 3 — Baseline calibration.
 *
 * Captures the player's resting biometrics for ~30 seconds (we simulate
 * 15s for demo). User clicks "Start", sits still, the page draws a live
 * HRV trace, then computes their baseline.
 *
 * Why this matters: every BlitzMind metric (Calm Score, HRV delta, stress
 * events) is relative to *this player's* baseline, not a population norm.
 * Without baseline, the adaptive triggers fire on the wrong values.
 *
 * The design intent here is to make the calibration feel meaningful — not
 * skippable busywork. The live trace gives the player something to watch.
 */

type CalibrationState = "idle" | "running" | "complete";

const DURATION_MS = 15000; // 15 seconds for demo

export default function CalibratePage() {
  const [state, setState] = useState<CalibrationState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [trace, setTrace] = useState<number[]>([]);
  const startTime = useRef<number>(0);

  // Capture loop — runs when state === "running"
  useEffect(() => {
    if (state !== "running") return;

    startTime.current = Date.now();
    setElapsed(0);
    setTrace([]);

    const interval = setInterval(() => {
      const now = Date.now();
      const e = now - startTime.current;
      setElapsed(e);

      // Simulate HRV reading — slow drift around baseline of 70ms
      // Real HRV has higher-frequency components (RR variability), so we
      // mix two sine-wave-ish noises to make it look realistic
      const baseline = 70;
      const slow = Math.sin(e / 1800) * 4;
      const fast = Math.sin(e / 250) * 2.5;
      const noise = (Math.random() - 0.5) * 3;
      const value = baseline + slow + fast + noise;

      setTrace((prev) => [...prev, value]);

      if (e >= DURATION_MS) {
        clearInterval(interval);
        setState("complete");
      }
    }, 120);

    return () => clearInterval(interval);
  }, [state]);

  const progress = state === "complete" ? 100 : (elapsed / DURATION_MS) * 100;
  const secondsLeft = Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000));

  // Computed stats — shown when complete
  const avgHrv = trace.length > 0 ? trace.reduce((a, b) => a + b, 0) / trace.length : 0;
  const minHrv = trace.length > 0 ? Math.min(...trace) : 0;
  const maxHrv = trace.length > 0 ? Math.max(...trace) : 0;

  return (
    <OnboardingShell
      step={{
        stepNumber: 3,
        totalSteps: 4,
        backHref: "/onboarding/pair",
        continueHref: "/onboarding/preferences",
        continueDisabled: state !== "complete",
        continueLabel:
          state === "complete" ? "Continue" : "Calibrate first",
      }}
    >
      <div className="text-center mb-12">
        <div className="text-[10px] uppercase tracking-[0.32em] tabular-nums text-fg-mute">
          Step 3 · Baseline calibration
        </div>
        <h2 className="mt-4 text-3xl font-display tracking-tight">
          Hold the controller. Breathe normally.
        </h2>
        <p className="mt-3 text-fg-dim text-sm max-w-md mx-auto">
          We&rsquo;ll read your resting HRV for 15 seconds. This becomes the baseline every future metric is measured against.
        </p>
      </div>

      {/* Live trace + readouts */}
      <div className="glass-panel p-6">
        {/* Top row: status + countdown */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] tabular-nums">
            {state === "idle" && (
              <>
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--color-fg-mute)" }}
                />
                <span className="text-fg-mute">Ready</span>
              </>
            )}
            {state === "running" && (
              <>
                <span
                  className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat"
                />
                <span style={{ color: "var(--color-app-accent)" }}>
                  Capturing baseline
                </span>
              </>
            )}
            {state === "complete" && (
              <>
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--color-calm)" }}
                />
                <span style={{ color: "var(--color-calm)" }}>
                  Baseline established
                </span>
              </>
            )}
          </div>
          <div className="text-[10px] tabular-nums text-fg-mute">
            {state === "running" ? `${secondsLeft}s remaining` : `${DURATION_MS / 1000}s capture`}
          </div>
        </div>

        {/* Live trace SVG */}
        <div className="relative h-32 overflow-hidden">
          <TraceChart trace={trace} state={state} />
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: "var(--color-app-line)" }}>
          <div
            className="h-full transition-all"
            style={{
              width: `${progress}%`,
              background:
                state === "complete"
                  ? "var(--color-calm)"
                  : "var(--color-app-accent)",
            }}
          />
        </div>

        {/* Result row */}
        <div
          className="mt-6 pt-6 border-t grid grid-cols-3 gap-6"
          style={{ borderColor: "var(--color-app-line)" }}
        >
          <ResultStat
            label="Avg HRV"
            value={state === "complete" ? `${avgHrv.toFixed(0)} ms` : "—"}
            active={state === "complete"}
          />
          <ResultStat
            label="Range"
            value={
              state === "complete"
                ? `${minHrv.toFixed(0)}–${maxHrv.toFixed(0)} ms`
                : "—"
            }
            active={state === "complete"}
          />
          <ResultStat
            label="Quality"
            value={state === "complete" ? "Excellent" : "—"}
            active={state === "complete"}
          />
        </div>

        {/* Start button */}
        {state === "idle" && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setState("running")}
              className="px-5 py-2.5 rounded text-sm font-medium"
              style={{
                background: "var(--color-app-action)",
                color: "white",
              }}
            >
              Start calibration
            </button>
            <p className="mt-3 text-xs text-fg-mute">
              Sit comfortably. Don&rsquo;t move the controller during capture.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <ResearchNote
          note={{
            source: "Testing",
            title: "Why 15 seconds, not 5 minutes",
            body: "Clinical HRV captures run 5+ minutes. Our in-school testing showed players abandoned the flow after 30 seconds. We use a shorter capture with a 30-day rolling baseline that refines as the player uses BlitzMind — better adherence, comparable accuracy after 3 sessions.",
          }}
        />
      </div>
    </OnboardingShell>
  );
}

function TraceChart({
  trace,
  state,
}: {
  trace: number[];
  state: CalibrationState;
}) {
  // Render an SVG line of the captured values
  const width = 600;
  const height = 120;
  const padding = 8;

  if (trace.length === 0) {
    return (
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <line
          x1={padding}
          x2={width - padding}
          y1={height / 2}
          y2={height / 2}
          stroke="var(--color-app-line)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x={width / 2}
          y={height / 2 - 10}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--tabular-nums)"
          fill="var(--color-fg-mute)"
        >
          AWAITING SIGNAL
        </text>
      </svg>
    );
  }

  // Scale trace values to chart coords
  const minV = 55;
  const maxV = 85;
  const xStep = (width - padding * 2) / Math.max(trace.length - 1, 1);
  const points = trace.map((v, i) => ({
    x: padding + i * xStep,
    y: padding + (1 - (v - minV) / (maxV - minV)) * (height - padding * 2),
  }));

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Right edge of the trace
  const lastPoint = points[points.length - 1];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {/* Baseline reference line */}
      <line
        x1={padding}
        x2={width - padding}
        y1={height / 2}
        y2={height / 2}
        stroke="var(--color-app-line)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* The trace itself */}
      <path
        d={path}
        fill="none"
        stroke={
          state === "complete"
            ? "var(--color-calm)"
            : "var(--color-app-accent)"
        }
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Leading-edge pulse dot (only during capture) */}
      {state === "running" && lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="3"
          fill="var(--color-app-accent)"
          className="heartbeat"
        />
      )}
    </svg>
  );
}

function ResultStat({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] tabular-nums text-fg-mute">
        {label}
      </div>
      <div
        className="mt-1 text-lg font-display tabular-nums tracking-tight transition-colors"
        style={{
          color: active ? "var(--color-fg)" : "var(--color-fg-mute)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

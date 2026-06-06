"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TriggerConfig, TriggerValue } from "../../_components/TriggerConfig";
import { ResearchNote } from "../../_components/ResearchNote";
import { Panel, Setting, Divider, Toggle } from "../video/page";

/**
 * Adaptive Control / Controller.
 *
 * The hardware itself is the centerpiece — uses the actual product render
 * (front + back views from the Figma source) instead of an abstract SVG.
 *
 * Configuration the user controls:
 *   - Stick sensitivity (with adaptive curve preview)
 *   - Haptic intensity (drops when stressed for less distraction)
 *   - Deadzone (inner + outer)
 *   - Grip calibration profile (default / low-grip / high-grip)
 *
 * Live visualization: pulsing dots overlaid on the back-view render
 * showing where grip pressure is detected (left grip, right grip) and
 * what the current pressure reading is. The dots animate to make the
 * tab feel alive.
 */

export default function ControllerTab() {
  const [trigger, setTrigger] = useState<TriggerValue>({
    metric: "stress",
    threshold: 60,
  });

  const [sensitivity, setSensitivity] = useState(50);
  const [hapticIntensity, setHapticIntensity] = useState(70);
  const [adaptiveHaptics, setAdaptiveHaptics] = useState(true);
  const [deadzoneInner, setDeadzoneInner] = useState(8);
  const [deadzoneOuter, setDeadzoneOuter] = useState(92);
  const [gripProfile, setGripProfile] = useState<"default" | "low" | "high">("default");

  // Live grip pressure — drifts around base values
  const [leftGrip, setLeftGrip] = useState(72);
  const [rightGrip, setRightGrip] = useState(78);

  useEffect(() => {
    const id = setInterval(() => {
      setLeftGrip((p) => Math.max(20, Math.min(95, p + (Math.random() - 0.5) * 8 - (p - 72) * 0.15)));
      setRightGrip((p) => Math.max(20, Math.min(95, p + (Math.random() - 0.5) * 8 - (p - 78) * 0.15)));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px]">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-8">
        {/* ============ LEFT: configuration ============ */}
        <div className="space-y-6">
          <Panel title="Trigger" subtitle="When device adaptations fire">
            <TriggerConfig value={trigger} onChange={setTrigger} />
          </Panel>

          <Panel
            title="Stick sensitivity"
            subtitle="Adaptive — drops slightly when stress is detected to make aim more forgiving"
          >
            <Setting label="Base sensitivity" hint={`${sensitivity}`}>
              <div className="w-48">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="bm-range w-full"
                />
              </div>
            </Setting>

            <Divider />

            {/* Sensitivity curve preview */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute mb-2">
                Adaptation curve
              </div>
              <SensitivityCurve sensitivity={sensitivity} threshold={trigger.threshold} />
              <div className="mt-2 text-xs text-fg-mute">
                Under stress, sensitivity smoothly drops by ~12% to reduce overshoot.
              </div>
            </div>
          </Panel>

          <Panel
            title="Haptics"
            subtitle="Vibration intensity for in-game feedback"
          >
            <Setting label="Base intensity" hint={`${hapticIntensity}%`}>
              <div className="w-48">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hapticIntensity}
                  onChange={(e) => setHapticIntensity(Number(e.target.value))}
                  className="bm-range w-full"
                />
              </div>
            </Setting>
            <Divider />
            <Setting
              label="Adaptive haptics"
              hint="Reduce intensity during stress to avoid sensory overload"
            >
              <Toggle checked={adaptiveHaptics} onChange={setAdaptiveHaptics} />
            </Setting>
          </Panel>

          <Panel
            title="Deadzones"
            subtitle="Inner deadzone filters drift; outer caps maximum stick reach"
          >
            <Setting label="Inner deadzone" hint={`${deadzoneInner}%`}>
              <div className="w-48">
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={deadzoneInner}
                  onChange={(e) => setDeadzoneInner(Number(e.target.value))}
                  className="bm-range w-full"
                />
              </div>
            </Setting>
            <Divider />
            <Setting label="Outer deadzone" hint={`${deadzoneOuter}%`}>
              <div className="w-48">
                <input
                  type="range"
                  min={75}
                  max={100}
                  value={deadzoneOuter}
                  onChange={(e) => setDeadzoneOuter(Number(e.target.value))}
                  className="bm-range w-full"
                />
              </div>
            </Setting>
            <Divider />
            <DeadzoneVisualization inner={deadzoneInner} outer={deadzoneOuter} />
          </Panel>

          <Panel
            title="Grip calibration profile"
            subtitle="How the FSR pressure sensors interpret your grip"
          >
            <div className="grid grid-cols-3 gap-2">
              {(["default", "low", "high"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setGripProfile(p)}
                  className="px-3 py-3 rounded text-left border transition-all"
                  style={{
                    background:
                      gripProfile === p
                        ? "var(--color-app-surface-3)"
                        : "var(--color-app-surface-2)",
                    borderColor:
                      gripProfile === p
                        ? "var(--color-app-accent)"
                        : "var(--color-app-line-strong)",
                  }}
                >
                  <div className="text-sm text-fg capitalize">{p === "default" ? "Default" : `${p} grip`}</div>
                  <div className="text-[10px] text-fg-mute font-mono mt-1">
                    {p === "default"
                      ? "Balanced sensitivity"
                      : p === "low"
                      ? "Lighter touch needed"
                      : "Firmer grip rewarded"}
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* ============ RIGHT: live hardware view ============ */}
        <div className="xl:sticky xl:top-32 self-start space-y-4">
          {/* Front view — calibration status */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <div
              className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "var(--color-app-line)" }}
            >
              <h3 className="text-sm font-medium text-fg">BlitzMind Controller</h3>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono">
                <span className="block w-1.5 h-1.5 rounded-full bg-calm heartbeat" />
                <span style={{ color: "var(--color-calm)" }}>Sensor live</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] bg-app-bg">
              <Image
                src="/controller-front.png"
                alt="BlitzMind Controller — front view"
                fill
                style={{ objectFit: "contain" }}
                sizes="(min-width: 1280px) 50vw, 100vw"
                priority
              />
            </div>
            <div
              className="px-5 py-3 border-t grid grid-cols-3 gap-4 text-center"
              style={{ borderColor: "var(--color-app-line)" }}
            >
              <HwStatus label="HRV signal" value="−62 dBm" status="ok" />
              <HwStatus label="IMU" value="Aligned" status="ok" />
              <HwStatus label="Battery" value="84%" status="ok" />
            </div>
          </div>

          {/* Back view — live grip pressure overlay */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            <div
              className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "var(--color-app-line)" }}
            >
              <div>
                <h3 className="text-sm font-medium text-fg">Live grip pressure</h3>
                <p className="text-xs text-fg-mute mt-0.5">FSR strips across each handle</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
                {gripProfile} profile
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-app-bg">
              <Image
                src="/controller-back.png"
                alt="BlitzMind Controller — back view with grip sensors"
                fill
                style={{ objectFit: "contain" }}
                sizes="(min-width: 1280px) 50vw, 100vw"
              />
              {/* Live pressure markers — left grip */}
              <PressureMarker
                position="left"
                pressure={leftGrip}
              />
              <PressureMarker
                position="right"
                pressure={rightGrip}
              />
            </div>
            <div
              className="px-5 py-3 border-t grid grid-cols-2 gap-4"
              style={{ borderColor: "var(--color-app-line)" }}
            >
              <GripReading side="Left" pressure={leftGrip} />
              <GripReading side="Right" pressure={rightGrip} />
            </div>
          </div>

          <div>
            <ResearchNote
              note={{
                source: "Testing",
                title: "Why pressure, not just heart rate",
                body: "During in-school testing, grip pressure spikes preceded HRV changes by 4-7 seconds on average. Pressure is a faster signal because it's a direct motor response — the body tenses before the heart catches up. Using both gives BlitzMind earlier detection than HRV alone.",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function SensitivityCurve({
  sensitivity,
  threshold,
}: {
  sensitivity: number;
  threshold: number;
}) {
  // Show two curves overlaid: base sensitivity and adapted sensitivity.
  // X axis: stick deflection 0-100%
  // Y axis: aim speed 0-100%
  const width = 600;
  const height = 100;
  const pad = 8;

  const toX = (input: number) => pad + (input / 100) * (width - pad * 2);
  const toY = (output: number) =>
    pad + (1 - output / 100) * (height - pad * 2);

  // Base curve — accelerating
  const baseExponent = 1 + (1 - sensitivity / 100);
  const adaptedExponent = baseExponent + 0.15;

  const buildPath = (exp: number) => {
    const points = [];
    for (let x = 0; x <= 100; x += 5) {
      const normalized = x / 100;
      const y = Math.pow(normalized, exp) * 100 * (sensitivity / 50);
      points.push(`${x === 0 ? "M" : "L"} ${toX(x)} ${toY(Math.min(100, y))}`);
    }
    return points.join(" ");
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      aria-label="Sensitivity adaptation curve"
    >
      {/* Grid */}
      {[25, 50, 75].map((g) => (
        <line
          key={g}
          x1={toX(g)}
          x2={toX(g)}
          y1={pad}
          y2={height - pad}
          stroke="var(--color-app-line)"
          strokeWidth="0.5"
        />
      ))}
      {/* Trigger threshold marker */}
      <line
        x1={toX(threshold)}
        x2={toX(threshold)}
        y1={pad}
        y2={height - pad}
        stroke="var(--color-app-accent)"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      {/* Base curve */}
      <path
        d={buildPath(baseExponent)}
        stroke="var(--color-fg)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Adapted curve (dashed, accent color) */}
      <path
        d={buildPath(adaptedExponent)}
        stroke="var(--color-app-accent)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        fill="none"
      />
      {/* Legend */}
      <g>
        <line x1={pad} x2={pad + 12} y1={height - 4} y2={height - 4} stroke="var(--color-fg)" strokeWidth="1.5" />
        <text x={pad + 16} y={height - 1} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-fg-mute)">
          BASE
        </text>
        <line x1={pad + 60} x2={pad + 72} y1={height - 4} y2={height - 4} stroke="var(--color-app-accent)" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x={pad + 76} y={height - 1} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-app-accent)">
          ADAPTED (UNDER STRESS)
        </text>
      </g>
    </svg>
  );
}

function DeadzoneVisualization({ inner, outer }: { inner: number; outer: number }) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          {/* Outer reach circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="var(--color-app-line)"
            strokeWidth="1"
          />
          {/* Outer deadzone — the "max" ring */}
          <circle
            cx="50"
            cy="50"
            r={48 * (outer / 100)}
            fill="none"
            stroke="var(--color-app-accent)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* Inner deadzone — the center filled */}
          <circle
            cx="50"
            cy="50"
            r={48 * (inner / 100)}
            fill="var(--color-app-surface-3)"
            stroke="var(--color-fg-mute)"
            strokeWidth="0.8"
          />
          {/* Center crosshair */}
          <line x1="50" y1="46" x2="50" y2="54" stroke="var(--color-fg-mute)" strokeWidth="0.5" />
          <line x1="46" y1="50" x2="54" y2="50" stroke="var(--color-fg-mute)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="text-xs text-fg-mute space-y-2 leading-relaxed">
        <div>
          <span className="font-mono uppercase tracking-[0.15em] text-fg-dim">Inner</span> filters {inner}% of small stick movements as drift.
        </div>
        <div>
          <span className="font-mono uppercase tracking-[0.15em] text-fg-dim">Outer</span> caps at {outer}% — beyond this is treated as max.
        </div>
      </div>
    </div>
  );
}

function HwStatus({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "ok" | "warn";
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">{label}</div>
      <div
        className="mt-1 text-xs font-mono"
        style={{
          color:
            status === "ok" ? "var(--color-calm)" : "var(--color-app-accent)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PressureMarker({
  position,
  pressure,
}: {
  position: "left" | "right";
  pressure: number;
}) {
  const intensity = pressure / 100;
  const size = 24 + intensity * 28;
  const alpha = 0.3 + intensity * 0.5;
  return (
    <div
      className="absolute pointer-events-none flex items-center justify-center"
      style={{
        // Approximate grip positions on the back-view render
        left: position === "left" ? "20%" : "auto",
        right: position === "right" ? "20%" : "auto",
        top: "55%",
        width: `${size}px`,
        height: `${size}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="absolute inset-0 rounded-full heartbeat"
        style={{
          background: `radial-gradient(circle, rgba(255, 51, 68, ${alpha}) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-2.5 h-2.5 rounded-full"
        style={{
          background: "var(--color-app-accent)",
          boxShadow: `0 0 ${8 + intensity * 12}px var(--color-app-accent)`,
        }}
      />
    </div>
  );
}

function GripReading({ side, pressure }: { side: string; pressure: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">{side} grip</span>
        <span className="text-sm font-mono text-fg tabular-nums">
          {Math.round(pressure)}<span className="text-fg-mute text-xs">%</span>
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--color-app-line)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${pressure}%`,
            background:
              pressure > 85
                ? "var(--color-app-accent)"
                : pressure > 65
                ? "var(--color-warn)"
                : "var(--color-calm)",
          }}
        />
      </div>
    </div>
  );
}

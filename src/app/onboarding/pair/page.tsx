"use client";

import { useState, useEffect } from "react";
import { OnboardingShell } from "../../app/_components/OnboardingShell";

/**
 * Step 2 — Sensor pairing.
 *
 * Simulates the device discovery flow:
 *   - On mount: shows "Searching..." with a scanning animation
 *   - After 2s: a "BlitzMind Controller (CTRL-7421)" device appears
 *   - User clicks Pair: shows handshake animation
 *   - After 1.5s: device is paired, continue button enables
 *
 * Why simulate this in onboarding: every biometric product has this flow,
 * and it's the one part of the experience that proves the product is
 * actually device-connected, not just an app skin.
 */

type PairState = "scanning" | "found" | "pairing" | "paired";

export default function PairPage() {
  const [state, setState] = useState<PairState>("scanning");

  // Auto-advance from scanning to found after 2s
  useEffect(() => {
    if (state === "scanning") {
      const t = setTimeout(() => setState("found"), 2200);
      return () => clearTimeout(t);
    }
    if (state === "pairing") {
      const t = setTimeout(() => setState("paired"), 1800);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <OnboardingShell
      step={{
        stepNumber: 2,
        totalSteps: 4,
        backHref: "/onboarding/welcome",
        continueHref: "/onboarding/calibrate",
        continueDisabled: state !== "paired",
        continueLabel: state === "paired" ? "Continue" : "Pair first",
      }}
    >
      <div className="text-center mb-12">
        <div className="text-[10px] uppercase tracking-[0.32em] font-mono text-fg-mute">
          Step 2 · Pair your sensor
        </div>
        <h2 className="mt-4 text-3xl font-display tracking-tight">
          Connect your BlitzMind controller.
        </h2>
        <p className="mt-3 text-fg-dim text-sm">
          Make sure your controller is powered on and within 3 meters. We&rsquo;ll find it automatically.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Scanning visualization */}
        <div className="relative h-64 mb-8">
          {/* Scan rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${(i + 1) * 80}px`,
                  height: `${(i + 1) * 80}px`,
                  borderColor: "var(--color-app-line-strong)",
                  opacity:
                    state === "scanning" || state === "pairing" ? 0.4 - i * 0.1 : 0.15,
                  animation:
                    state === "scanning"
                      ? `pulse-ring 2s ease-out ${i * 0.6}s infinite`
                      : undefined,
                }}
              />
            ))}
            {/* Center BlitzMind logo */}
            <div
              className="relative z-10 w-16 h-16 rounded-full grid place-items-center font-display text-2xl"
              style={{
                background:
                  state === "paired"
                    ? "var(--color-calm)"
                    : "var(--color-app-accent)",
                color: "var(--color-app-bg)",
                transition: "background 400ms",
              }}
            >
              {state === "paired" ? "✓" : "B"}
            </div>
          </div>
        </div>

        {/* Device card — appears when found */}
        {(state === "found" || state === "pairing" || state === "paired") && (
          <DeviceCard
            state={state}
            onPair={() => setState("pairing")}
          />
        )}

        {state === "scanning" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-fg-dim">
              <span
                className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat"
              />
              Scanning for BlitzMind devices…
            </div>
            <div className="mt-2 text-[10px] font-mono text-fg-mute uppercase tracking-[0.2em]">
              BLE range · scanning every 250ms
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </OnboardingShell>
  );
}

function DeviceCard({
  state,
  onPair,
}: {
  state: PairState;
  onPair: () => void;
}) {
  const isPaired = state === "paired";
  const isPairing = state === "pairing";

  return (
    <div
      className="glass-panel p-5 transition-all"
      style={{
        borderColor: isPaired ? "var(--color-calm)" : undefined,
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-md grid place-items-center"
          style={{
            background: "var(--color-app-surface-3)",
          }}
        >
          {/* Tiny controller silhouette */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M5 8 Q5 6 8 6 L14 6 Q17 6 17 8 L17 11 Q17 14 14 14 L13 14 L11 16 L9 14 L8 14 Q5 14 5 11 Z"
              stroke="var(--color-fg-dim)"
              strokeWidth="1.2"
              fill="var(--color-app-surface-2)"
            />
            <circle cx="9" cy="10" r="1" fill="var(--color-fg-dim)" />
            <circle cx="13" cy="10" r="1" fill="var(--color-fg-dim)" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-fg font-medium">
              BlitzMind Controller
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: isPaired
                  ? "rgba(110, 231, 183, 0.15)"
                  : "var(--color-app-surface-3)",
                color: isPaired ? "var(--color-calm)" : "var(--color-fg-mute)",
              }}
            >
              {isPaired ? "Paired" : isPairing ? "Pairing…" : "Available"}
            </span>
          </div>
          <div className="mt-1 text-xs text-fg-mute font-mono">
            CTRL-7421 · BLE · −62 dBm · battery 84%
          </div>
        </div>
        {!isPaired && (
          <button
            onClick={onPair}
            disabled={isPairing}
            className="px-3.5 py-1.5 rounded text-sm font-medium transition-all disabled:opacity-60"
            style={{
              background: "var(--color-app-action)",
              color: "white",
            }}
          >
            {isPairing ? "Pairing…" : "Pair"}
          </button>
        )}
      </div>

      {isPaired && (
        <div
          className="mt-4 pt-4 border-t grid grid-cols-3 gap-3"
          style={{ borderColor: "var(--color-app-line)" }}
        >
          <SensorStatus label="HRV" status="ok" />
          <SensorStatus label="Grip" status="ok" />
          <SensorStatus label="IMU" status="ok" />
        </div>
      )}
    </div>
  );
}

function SensorStatus({
  label,
  status,
}: {
  label: string;
  status: "ok" | "warn";
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="block w-1.5 h-1.5 rounded-full"
        style={{
          background:
            status === "ok"
              ? "var(--color-calm)"
              : "var(--color-app-accent)",
        }}
      />
      <span className="text-xs text-fg-dim">
        {label} <span className="text-fg-mute">· online</span>
      </span>
    </div>
  );
}

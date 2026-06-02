"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * AdaptWidget — the centerpiece of the site. Demonstrates how the product
 * actually behaves. Two halves:
 *
 *   LEFT: Trigger configuration. User picks a calm-score threshold (slider).
 *         A live (drifting) "current calm" value is shown above the slider.
 *         When current < threshold, the system is in "Adapting" state.
 *
 *   RIGHT: A mocked gameplay HUD that visibly responds when adaptation is
 *          active — brightness dims, HUD elements fade, loadout swaps to
 *          the player's "stable" loadout. A red telemetry strip at the top
 *          shows the trigger firing.
 *
 * The point is to make the abstract pivot ("stress as a performance signal,
 * not an interrupt") feel concrete and tangible in 5 seconds of interaction.
 */
export function AdaptWidget() {
  const [threshold, setThreshold] = useState(60);
  const [calm, setCalm] = useState(78);

  // Drift the calm score. Same wander pattern as elsewhere, but with a
  // periodic dip every ~20s to make sure visitors see adaptation fire even
  // if they don't touch the slider.
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      setCalm((c) => {
        // Stress event every ~22 ticks (each tick ~700ms ≈ 15s)
        const stressEvent = t % 22 < 4 ? -18 : 0;
        const step = (Math.random() - 0.5) * 4;
        const next = c + step - (c - (78 + stressEvent)) * 0.18;
        return Math.max(15, Math.min(96, next));
      });
    }, 700);
    return () => clearInterval(id);
  }, []);

  const adapting = calm < threshold;

  return (
    <div className="rounded-2xl border border-line bg-surface/40 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
        {/* ============ LEFT: TRIGGER CONFIG ============ */}
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-line">
          {/* Section label */}
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
              Trigger / 01
            </div>
            <StatusPill adapting={adapting} />
          </div>

          {/* Title */}
          <h3 className="mt-4 font-display text-3xl tracking-tight leading-tight">
            Set the threshold.<br />
            We handle the rest.
          </h3>

          {/* Current calm display */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-[0.24em] text-fg-mute">
                Current calm
              </span>
              <span className="font-mono text-xs text-fg-mute">live</span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className="font-display text-6xl tabular-nums tracking-tight"
                style={{
                  color: adapting ? "var(--color-accent)" : "var(--color-fg)",
                  transition: "color 250ms",
                }}
              >
                {Math.round(calm)}
              </span>
              <span className="text-fg-mute text-xl">%</span>
            </div>
            {/* Calm bar — visualizes calm vs. threshold */}
            <div className="mt-4 relative h-1 bg-line-soft rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 transition-all duration-700"
                style={{
                  width: `${calm}%`,
                  background: adapting
                    ? "var(--color-accent)"
                    : "var(--color-calm)",
                }}
              />
              {/* Threshold marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-fg"
                style={{ left: `${threshold}%` }}
              />
            </div>
          </div>

          {/* Threshold slider */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="threshold"
                className="text-[10px] uppercase tracking-[0.24em] text-fg-mute cursor-pointer"
              >
                Adapt when calm drops below
              </label>
              <span className="font-mono text-sm">
                {threshold}<span className="text-fg-mute">%</span>
              </span>
            </div>
            <input
              id="threshold"
              type="range"
              min={20}
              max={90}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="bm-range mt-4 w-full"
            />
            <div className="mt-2 flex justify-between text-[10px] font-mono text-fg-mute">
              <span>20%</span>
              <span>90%</span>
            </div>
          </div>

          {/* What adapts checklist */}
          <div className="mt-10 space-y-2">
            <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute mb-3">
              When triggered
            </div>
            {[
              "Brightness dims to 60%",
              "HUD clutter hidden",
              "Loadout swaps to Stable",
              "Audio shifts to focus mix",
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-3 text-sm text-fg-dim"
              >
                <div
                  className="w-3 h-3 rounded-sm border transition-all"
                  style={{
                    borderColor: adapting
                      ? "var(--color-accent)"
                      : "var(--color-line-soft)",
                    background: adapting ? "var(--color-accent)" : "transparent",
                  }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ============ RIGHT: MOCK GAMEPLAY HUD ============ */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[560px] overflow-hidden bg-black">
          <MockGameplay adapting={adapting} calm={calm} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ adapting }: { adapting: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-[0.2em] font-mono transition-colors"
      style={{
        borderColor: adapting
          ? "var(--color-accent)"
          : "var(--color-line-soft)",
        color: adapting ? "var(--color-accent)" : "var(--color-fg-mute)",
        background: adapting ? "var(--color-accent-dim)" : "transparent",
      }}
    >
      <span
        className="block w-1.5 h-1.5 rounded-full"
        style={{
          background: adapting
            ? "var(--color-accent)"
            : "var(--color-fg-mute)",
        }}
      />
      {adapting ? "Adapting" : "Standby"}
    </div>
  );
}

/**
 * MockGameplay — the right-side panel. Faked first-person HUD that visibly
 * responds when `adapting` is true. We don't have actual game footage in
 * this build (and licensing would be a nightmare); instead we render a
 * stylized scene with SVG: skybox gradient, distant buildings, a crosshair,
 * minimap, weapon HUD, kill feed. All elements transition on adaptation.
 */
function MockGameplay({ adapting, calm }: { adapting: boolean; calm: number }) {
  return (
    <div
      className="absolute inset-0 transition-all duration-500"
      style={{
        filter: adapting
          ? "brightness(0.62) saturate(0.7)"
          : "brightness(1) saturate(1)",
      }}
    >
      {/* Faked scene background — distant skyline gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #2a1d12 0%, #463327 28%, #5b4232 55%, #3a2a1f 78%, #1c130c 100%)",
        }}
      />

      {/* Distant horizon silhouette */}
      <svg
        className="absolute inset-x-0 bottom-1/3 w-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,200 L0,140 L60,140 L60,80 L120,80 L120,120 L180,120 L180,60 L240,60 L240,100 L320,100 L320,40 L380,40 L380,90 L460,90 L460,70 L540,70 L540,110 L620,110 L620,50 L700,50 L700,90 L760,90 L760,130 L800,130 L800,200 Z"
          fill="#1a110a"
          opacity="0.85"
        />
      </svg>

      {/* Foreground weapon — abstract */}
      <svg
        className="absolute bottom-0 left-0 w-full h-1/2"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          d="M250 400 L 280 220 L 320 200 L 380 195 L 480 200 L 540 220 L 580 400 Z"
          fill="#1a1612"
        />
        <path
          d="M380 195 L 440 150 L 460 152 L 460 200 L 380 200 Z"
          fill="#231d18"
        />
      </svg>

      {/* Telemetry strip — top */}
      <AnimatePresence>
        {adapting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 inset-x-0 px-4 py-2 bg-accent/15 border-b border-accent/40 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-accent font-mono">
              <div className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
                Stress event detected
              </div>
              <div className="text-accent-soft">
                Adapting interface · calm {Math.round(calm)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crosshair */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
        style={{
          opacity: adapting ? 1 : 0.85,
          transform: `translate(-50%, -50%) scale(${adapting ? 0.85 : 1})`,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
          <circle
            cx="20"
            cy="20"
            r="1.5"
            fill={adapting ? "#ff3b3b" : "#ffffff"}
          />
          <path
            d="M20 6 V12 M20 28 V34 M6 20 H12 M28 20 H34"
            stroke={adapting ? "#ff3b3b" : "#ffffff"}
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Minimap — top-left */}
      <div
        className="absolute top-6 left-6 w-28 h-28 border border-white/30 bg-black/30 backdrop-blur-sm transition-opacity duration-500"
        style={{ opacity: adapting ? 0.35 : 1 }}
        aria-hidden
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <rect x="10" y="20" width="20" height="15" fill="rgba(255,255,255,0.2)" />
          <rect x="40" y="15" width="25" height="20" fill="rgba(255,255,255,0.2)" />
          <rect x="20" y="55" width="30" height="22" fill="rgba(255,255,255,0.2)" />
          <rect x="60" y="50" width="22" height="28" fill="rgba(255,255,255,0.2)" />
          <circle cx="50" cy="50" r="3" fill="#3effa3" />
        </svg>
      </div>

      {/* Kill feed — top-right — hidden during adaptation */}
      <AnimatePresence>
        {!adapting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-6 right-6 text-right space-y-1.5 font-mono text-[10px]"
          >
            <div className="text-white/80">
              powderytoad1 <span className="text-accent/80">[AK-47]</span> WaVy_K
            </div>
            <div className="text-white/60">
              N0BL3 <span className="text-accent/80">[Snipe]</span> __dropshot
            </div>
            <div className="text-white/40">
              Sw1ftz <span className="text-accent/80">[Glock]</span> Marrow
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weapon / loadout — bottom-right */}
      <div className="absolute bottom-6 right-6 text-right font-mono">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          Loadout
        </div>
        <div className="mt-1 text-white">
          <AnimatePresence mode="wait">
            <motion.span
              key={adapting ? "stable" : "primary"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="block text-base"
            >
              {adapting ? "M4 · Recoil-low" : "AK-47 · Standard"}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="mt-3 text-white text-2xl tabular-nums">
          53<span className="text-white/40 text-sm ml-1">/ 210</span>
        </div>
      </div>

      {/* HRV pulse — bottom-left, visible always */}
      <div className="absolute bottom-6 left-6 font-mono">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          Real-time HRV
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat"
          />
          <span className="text-white tabular-nums">
            {Math.round(calm)}{" "}
            <span className="text-white/40 text-xs">CALM</span>
          </span>
        </div>
      </div>
    </div>
  );
}

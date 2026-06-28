"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * GameplayPreview — the composed scene that lives inside Adaptive Control's
 * Video sub-tab. Visually responds to brightness, color temperature, and
 * focus-mode settings so the user can see what their config will look like
 * during real gameplay.
 *
 * Stylized SVG/CSS scene (no licensed game assets) — distant skyline,
 * weapon silhouette in foreground, minimap, kill feed, ammo HUD,
 * crosshair, BlitzMind side-rail.
 *
 * When focus mode is ON, the non-critical HUD elements (minimap, kill
 * feed) fade out. When brightness slider moves, the whole scene dims.
 * When color temperature changes, a tint overlay shifts.
 */

export interface PreviewSettings {
  brightness: number;          // 0-100
  colorTemperature: "neutral" | "softWarm" | "eveningComfort" | "reliefMode";
  focusMode: boolean;
  hrvOverlay: boolean;
  stressMinimalHud: boolean;
  criticalInfoHighlight: boolean;
}

export function GameplayPreview({ settings }: { settings: PreviewSettings }) {
  const temperatureOverlay = {
    neutral: "transparent",
    softWarm: "rgba(255, 168, 90, 0.10)",
    eveningComfort: "rgba(255, 130, 50, 0.18)",
    reliefMode: "rgba(255, 90, 30, 0.28)",
  }[settings.colorTemperature];

  // Brightness as a 0-1 factor where 60% = "normal" (1.0)
  const brightnessFactor = 0.4 + (settings.brightness / 100) * 0.8;

  return (
    <div
      className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border"
      style={{ borderColor: "var(--color-app-line)" }}
    >
      {/* Base scene — sky + horizon */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a1418 0%, #3a2625 30%, #4d3024 55%, #2a1810 80%, #0d0608 100%)",
          filter: `brightness(${brightnessFactor})`,
          transition: "filter 250ms",
        }}
      />

      {/* Color temperature overlay */}
      <div
        className="absolute inset-0 mix-blend-soft-light pointer-events-none transition-colors duration-300"
        style={{ background: temperatureOverlay }}
      />

      {/* Distant skyline */}
      <svg
        className="absolute inset-x-0 top-[30%] w-full"
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
        style={{
          filter: `brightness(${brightnessFactor})`,
          transition: "filter 250ms",
        }}
        aria-hidden
      >
        <path
          d="M0,260 L0,150 L80,150 L80,90 L150,90 L150,130 L220,130 L220,70 L300,70 L300,110 L380,110 L380,50 L460,50 L460,100 L540,100 L540,80 L640,80 L640,120 L720,120 L720,60 L820,60 L820,100 L900,100 L900,140 L1000,140 L1000,90 L1080,90 L1080,150 L1200,150 L1200,260 Z"
          fill="#15090b"
          opacity="0.9"
        />
        {/* Building windows */}
        {[100, 180, 250, 320, 400, 480, 560, 670, 780, 870, 970, 1050].map(
          (x, i) => (
            <rect
              key={x}
              x={x}
              y={110 + (i % 3) * 15}
              width="3"
              height="3"
              fill="#ff8866"
              opacity={0.4 + (i % 3) * 0.15}
            />
          )
        )}
      </svg>

      {/* Weapon silhouette */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMax slice"
        style={{
          filter: `brightness(${brightnessFactor})`,
          transition: "filter 250ms",
        }}
        aria-hidden
      >
        <path
          d="M380 400 L 420 240 L 480 215 L 580 208 L 720 215 L 800 245 L 850 400 Z"
          fill="#0a0606"
        />
        <path
          d="M580 208 L 660 150 L 690 152 L 690 215 L 580 215 Z"
          fill="#161012"
        />
      </svg>

      {/* Crosshair — pulse-highlighted if criticalInfoHighlight is on */}
      <div className="absolute top-[44%] left-[42%] -translate-x-1/2 -translate-y-1/2">
        <svg
          width={settings.criticalInfoHighlight ? 56 : 44}
          height={settings.criticalInfoHighlight ? 56 : 44}
          viewBox="0 0 56 56"
          aria-hidden
          style={{ transition: "all 250ms" }}
        >
          <circle
            cx="28"
            cy="28"
            r="1.5"
            fill={settings.criticalInfoHighlight ? "#ff3344" : "#ffffff"}
          />
          <path
            d="M28 10 V18 M28 38 V46 M10 28 H18 M38 28 H46"
            stroke={
              settings.criticalInfoHighlight ? "#ff3344" : "#ffffff"
            }
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Minimap — top-left — hidden in focus mode */}
      <AnimatePresence>
        {!settings.focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-6 left-6 w-28 h-28 border border-white/30 bg-black/40 backdrop-blur-sm"
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" aria-hidden>
              <circle
                cx="55"
                cy="48"
                r="35"
                fill="none"
                stroke="#ff6b6b"
                strokeWidth="0.6"
                strokeDasharray="2 1"
              />
              <rect x="10" y="20" width="20" height="15" fill="rgba(255,255,255,0.15)" />
              <rect x="40" y="15" width="25" height="20" fill="rgba(255,255,255,0.15)" />
              <rect x="22" y="55" width="30" height="22" fill="rgba(255,255,255,0.15)" />
              <rect x="60" y="50" width="22" height="28" fill="rgba(255,255,255,0.15)" />
              <circle cx="50" cy="50" r="3" fill="#3effa3" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kill feed — hidden in focus mode or when stressMinimalHud is on */}
      <AnimatePresence>
        {!settings.focusMode && !settings.stressMinimalHud && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-6 right-[180px] text-right space-y-1.5 tabular-nums text-[10px]"
          >
            <div className="text-white/80">
              powderytoad1 <span className="text-accent/80">[KR-77]</span> Marrow
            </div>
            <div className="text-white/60">
              N0BL3 <span className="text-accent/80">[L-220]</span> __dropshot
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ammo — bottom-right, critical info, always shown */}
      <div className="absolute bottom-5 right-5 text-right tabular-nums">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          Ammo
        </div>
        <div
          className="mt-0.5 tabular-nums transition-all"
          style={{
            fontSize: settings.criticalInfoHighlight ? "32px" : "26px",
            color: settings.criticalInfoHighlight ? "#ff3344" : "white",
          }}
        >
          53<span className="text-white/40 text-sm ml-1">/ 210</span>
        </div>
      </div>

      {/* BlitzMind side-rail — when HRV overlay is on */}
      <AnimatePresence>
        {settings.hrvOverlay && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-6 right-6 w-[140px]"
          >
            <div className="rounded border border-accent/30 bg-black/55 backdrop-blur-sm overflow-hidden">
              <div className="px-2.5 py-1.5 border-b border-accent/20 flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-[0.2em] text-accent tabular-nums">
                  BlitzMind
                </span>
                <span className="block w-1 h-1 rounded-full bg-accent heartbeat" />
              </div>
              <div className="px-2.5 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[8px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                    HRV
                  </span>
                  <span className="text-[10px] tabular-nums text-white">
                    72ms
                  </span>
                </div>
                <svg viewBox="0 0 120 30" className="mt-1 w-full h-6" aria-hidden>
                  <polyline
                    points="0,22 8,20 16,24 24,12 30,2 36,26 44,18 52,20 60,22 68,16 76,20 84,22 92,12 100,2 108,24 116,18"
                    fill="none"
                    stroke="#ff3344"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-left status — only when focus mode is on, shows that focus is active */}
      <AnimatePresence>
        {settings.focusMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-5 left-5 px-2.5 py-1.5 rounded bg-accent/15 border border-accent/30"
          >
            <div className="flex items-center gap-1.5">
              <span className="block w-1 h-1 rounded-full bg-accent heartbeat" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-accent tabular-nums">
                Focus Mode · Critical info only
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "motion/react";

/**
 * InGameFrame — composed gameplay scene with a BlitzMind sidebar overlay
 * on the right edge. Designed to communicate: the overlay is slim, lives
 * at the edge, doesn't block the action.
 *
 * Three annotation callouts point from the sidebar elements to short
 * descriptions on the right side of the frame.
 *
 * Scene is intentionally stylized (red-tinted, low contrast) to suggest
 * "high-stress moment" — pairs with the rest of the page's red accent.
 */
export function InGameFrame() {
  return (
    <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-line">
      {/* Scene */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #2a1014 0%, #4a1f1f 32%, #5a2926 56%, #2e1410 84%, #0d0608 100%)",
        }}
      />

      {/* Red-tint distant skyline */}
      <svg
        className="absolute inset-x-0 top-[28%] w-full"
        viewBox="0 0 1200 280"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,280 L0,160 L80,160 L80,90 L150,90 L150,130 L220,130 L220,70 L300,70 L300,110 L380,110 L380,50 L460,50 L460,100 L540,100 L540,80 L640,80 L640,120 L720,120 L720,60 L820,60 L820,100 L900,100 L900,140 L1000,140 L1000,90 L1080,90 L1080,150 L1200,150 L1200,280 Z"
          fill="#1f0a0c"
          opacity="0.9"
        />
        {/* Building windows — sparse, slightly glowing */}
        {[100, 180, 250, 320, 400, 480, 560, 670, 780, 870, 970, 1050].map(
          (x, i) => (
            <rect
              key={x}
              x={x}
              y={120 + (i % 3) * 15}
              width="3"
              height="3"
              fill="#ff8866"
              opacity={0.4 + (i % 3) * 0.15}
            />
          )
        )}
      </svg>

      {/* Atmospheric haze */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(255,90,60,0.12), transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(0,0,0,0.4), transparent 60%)",
        }}
      />

      {/* Weapon silhouette — bottom */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          d="M380 400 L 420 240 L 480 215 L 580 208 L 720 215 L 800 245 L 850 400 Z"
          fill="#0c0708"
        />
        <path
          d="M580 208 L 660 150 L 690 152 L 690 215 L 580 215 Z"
          fill="#181012"
        />
        <ellipse cx="660" cy="200" rx="35" ry="6" fill="#332024" />
      </svg>

      {/* Crosshair */}
      <div className="absolute top-[44%] left-[42%] -translate-x-1/2 -translate-y-1/2">
        <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="1.5" fill="#ffffff" />
          <path
            d="M24 8 V14 M24 34 V40 M8 24 H14 M34 24 H40"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Minimap — top-left */}
      <div className="absolute top-6 left-6 w-32 h-32 border border-white/40 bg-black/40 backdrop-blur-sm">
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-hidden>
          {/* shrinking circle */}
          <circle cx="55" cy="48" r="35" fill="none" stroke="#ff6b6b" strokeWidth="0.6" strokeDasharray="2 1" />
          <rect x="10" y="20" width="20" height="15" fill="rgba(255,255,255,0.15)" />
          <rect x="40" y="15" width="25" height="20" fill="rgba(255,255,255,0.15)" />
          <rect x="22" y="55" width="30" height="22" fill="rgba(255,255,255,0.15)" />
          <rect x="60" y="50" width="22" height="28" fill="rgba(255,255,255,0.15)" />
          {/* Player */}
          <circle cx="50" cy="50" r="3" fill="#3effa3" />
          {/* Teammates */}
          <circle cx="42" cy="58" r="2" fill="#3effa3" opacity="0.6" />
          <circle cx="58" cy="45" r="2" fill="#3effa3" opacity="0.6" />
          {/* Enemy ping */}
          <circle cx="72" cy="35" r="2" fill="#ff3b3b" />
        </svg>
      </div>

      {/* Ammo bottom-right */}
      <div className="absolute bottom-6 right-6 tabular-nums text-right">
        <div className="text-white tabular-nums text-3xl">
          53<span className="text-white/40 text-sm ml-1.5">/ 210</span>
        </div>
      </div>

      {/* Player marker bottom-left */}
      <div className="absolute bottom-6 left-6 tabular-nums">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          Gametag
        </div>
        <div className="text-white text-sm mt-0.5">HarnitK#7421</div>
      </div>

      {/* ============ BLITZMIND SIDEBAR — the centerpiece ============ */}
      <div className="absolute top-6 right-6 bottom-6 w-[260px] flex flex-col gap-3">
        {/* State pill — sits above the panel */}
        <div className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30">
          <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-accent tabular-nums">
            Adapting · calm 64%
          </span>
        </div>

        <div className="rounded border border-accent/30 bg-black/55 backdrop-blur-md overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-accent/20 flex items-center justify-between">
            <div className="text-[9px] uppercase tracking-[0.22em] text-accent tabular-nums">
              BlitzMind
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                Live
              </span>
            </div>
          </div>

          {/* HRV mini-chart */}
          <div className="px-4 py-4 border-b border-line">
            <div className="flex items-baseline justify-between">
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                Real-time HRV
              </span>
              <span className="text-[10px] tabular-nums text-white/80">
                89 BPM
              </span>
            </div>
            <svg viewBox="0 0 220 40" className="mt-2 w-full h-10" aria-hidden>
              <polyline
                points="0,28 10,26 20,30 30,18 36,4 42,32 50,24 60,26 70,28 80,22 90,26 100,28 110,18 116,2 122,30 130,24 140,26 150,28 160,24 170,26 180,28 190,22 200,28 210,26 220,28"
                fill="none"
                stroke="#ff3b3b"
                strokeWidth="1.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Adaptive toggles */}
          <div className="px-4 py-4 space-y-3">
            <ToggleRow label="Adaptive UI" on />
            <ToggleRow label="Brightness" on />
            <ToggleRow label="Loadout" on />
            <ToggleRow label="Adaptive settings" on />
          </div>
        </div>

        {/* Spacer for visual breathing */}
        <div className="flex-1" />
      </div>

      {/* ============ ANNOTATION CALLOUTS ============ */}
      {/* These point from off-frame labels to elements in the sidebar.
          Positioned to avoid the minimap (top-left), the gametag (bottom-left),
          and the ammo HUD (bottom-right). All sit in the empty horizon
          region of the scene. */}
      <AnnotationCallout
        anchorClass="top-[12%] left-[42%]"
        label="Slim rail, screen-edge"
        sub="Never blocks your sightlines"
      />
      <AnnotationCallout
        anchorClass="top-[55%] left-[28%]"
        label="Live HRV"
        sub="Read through the grip, continuously"
      />
      <AnnotationCallout
        anchorClass="top-[70%] left-[42%]"
        label="Set once, forget"
        sub="The toggles do the work"
      />
    </div>
  );
}

function ToggleRow({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/90">{label}</span>
      <span
        className={`block w-7 h-3.5 rounded-full relative transition-colors ${
          on ? "bg-accent" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${
            on ? "left-3.5" : "left-0.5"
          }`}
        />
      </span>
    </div>
  );
}

function AnnotationCallout({
  anchorClass,
  label,
  sub,
}: {
  anchorClass: string;
  label: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`absolute ${anchorClass} max-w-[200px] pointer-events-none`}
    >
      {/* Pointer line going right toward sidebar */}
      <div className="flex items-center gap-2">
        <div className="block w-16 h-px bg-white/40" />
        <span className="block w-1.5 h-1.5 rounded-full bg-white" />
      </div>
      <div className="mt-1.5 tabular-nums">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white">
          {label}
        </div>
        <div className="text-[10px] text-white/60 mt-0.5">{sub}</div>
      </div>
    </motion.div>
  );
}

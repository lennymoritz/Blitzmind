"use client";

import { motion } from "motion/react";

/**
 * HardwareRender — stylized top-down SVG controller silhouette with
 * annotated sensor positions. Designed to read as an industrial-design
 * diagram, not a product photo. The diagram aesthetic is intentional —
 * makes the hardware feel engineered, not styled.
 *
 * Callouts use a "technical drawing" line + dot pattern, similar to what
 * you'd see in a patent diagram or product spec sheet.
 */
export function HardwareRender() {
  return (
    <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-line bg-surface/40">
      {/* Subtle grid backdrop — gives it the "blueprint" feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft radial behind the controller */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,59,59,0.08), transparent 60%)",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 540"
        preserveAspectRatio="xMidYMid meet"
        aria-label="BlitzMind controller, top-down view with sensor positions annotated"
      >
        <defs>
          {/* Controller body fill — subtle gradient */}
          <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28282e" />
            <stop offset="50%" stopColor="#1f1f24" />
            <stop offset="100%" stopColor="#17171c" />
          </linearGradient>
          <linearGradient id="gripFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e2e34" />
            <stop offset="100%" stopColor="#191920" />
          </linearGradient>
          {/* Pulse ring for sensor markers */}
          <radialGradient id="sensorGlow">
            <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============ CONTROLLER BODY ============ */}
        {/* Top crescent — main shell */}
        <path
          d="M 80 200
             Q 80 130, 160 130
             L 240 130
             Q 320 130, 320 200
             L 320 240
             Q 320 280, 300 295
             L 270 310
             Q 250 318, 230 318
             L 170 318
             Q 150 318, 130 310
             L 100 295
             Q 80 280, 80 240 Z"
          fill="url(#bodyFill)"
          stroke="#3a3a44"
          strokeWidth="0.8"
        />

        {/* Grips — left + right */}
        <path
          d="M 80 240
             Q 60 280, 70 340
             Q 80 400, 130 420
             Q 165 425, 145 380
             Q 135 350, 130 310
             Q 110 305, 95 295 Z"
          fill="url(#gripFill)"
          stroke="#3a3a44"
          strokeWidth="0.8"
        />
        <path
          d="M 320 240
             Q 340 280, 330 340
             Q 320 400, 270 420
             Q 235 425, 255 380
             Q 265 350, 270 310
             Q 290 305, 305 295 Z"
          fill="url(#gripFill)"
          stroke="#3a3a44"
          strokeWidth="0.8"
        />

        {/* Grip texture lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity="0.4">
            <line
              x1={88 + i * 6}
              x2={94 + i * 6}
              y1={350 + i * 4}
              y2={380 + i * 4}
              stroke="#4a4a54"
              strokeWidth="0.6"
            />
            <line
              x1={306 - i * 6}
              x2={312 - i * 6}
              y1={350 + i * 4}
              y2={380 + i * 4}
              stroke="#4a4a54"
              strokeWidth="0.6"
            />
          </g>
        ))}

        {/* D-pad */}
        <g transform="translate(125, 220)">
          <rect x="-3" y="-12" width="6" height="24" rx="1" fill="#0e0e12" stroke="#3a3a44" strokeWidth="0.4" />
          <rect x="-12" y="-3" width="24" height="6" rx="1" fill="#0e0e12" stroke="#3a3a44" strokeWidth="0.4" />
        </g>

        {/* Right face buttons (Y/X/A/B layout) */}
        {[
          [275, 205, "#ff6b6b"],
          [260, 220, "#fbbf24"],
          [290, 220, "#6ee7b7"],
          [275, 235, "#7fb1ff"],
        ].map(([x, y, c], i) => (
          <circle
            key={i}
            cx={x as number}
            cy={y as number}
            r="5"
            fill="#0e0e12"
            stroke={c as string}
            strokeWidth="0.8"
            opacity="0.85"
          />
        ))}

        {/* Sticks */}
        <g transform="translate(165, 265)">
          <circle r="14" fill="#0e0e12" stroke="#3a3a44" strokeWidth="0.8" />
          <circle r="9" fill="#1a1a20" />
          <circle r="4" cx="0" cy="0" fill="#28282e" />
        </g>
        <g transform="translate(235, 265)">
          <circle r="14" fill="#0e0e12" stroke="#3a3a44" strokeWidth="0.8" />
          <circle r="9" fill="#1a1a20" />
          <circle r="4" cx="0" cy="0" fill="#28282e" />
        </g>

        {/* Light bar across the top */}
        <rect x="140" y="135" width="120" height="2" rx="1" fill="#ff3b3b" opacity="0.45" />
        <rect x="140" y="135" width="120" height="2" rx="1" fill="#ff3b3b" opacity="0.65" className="flicker" />

        {/* Center logo dot */}
        <text
          x="200"
          y="296"
          fontSize="8"
          fontFamily="var(--font-mono)"
          fill="#6a6a74"
          textAnchor="middle"
          letterSpacing="0.25em"
        >
          BLITZMIND
        </text>

        {/* ============ SENSOR MARKERS WITH CALLOUT LINES ============ */}
        {/* Each marker: pulsing dot + line to off-controller label */}

        {/* Marker: PPG / HRV — on the right grip top */}
        <SensorMarker
          dotX={290}
          dotY={310}
          lineEndX={395}
          lineEndY={310}
          labelX={395}
          labelY={310}
          label="01 · PPG"
          sub="HRV"
          anchor="end"
        />

        {/* Marker: Grip pressure — left grip middle */}
        <SensorMarker
          dotX={108}
          dotY={355}
          lineEndX={5}
          lineEndY={355}
          labelX={5}
          labelY={355}
          label="02 · FSR"
          sub="Grip pressure"
          anchor="start"
        />

        {/* Marker: IMU — top center under light bar */}
        <SensorMarker
          dotX={200}
          dotY={155}
          lineEndX={200}
          lineEndY={55}
          labelX={200}
          labelY={60}
          label="03 · BNO055"
          sub="9-axis IMU"
          anchor="middle"
        />

        {/* Marker: ESP32 — center bottom */}
        <SensorMarker
          dotX={200}
          dotY={285}
          lineEndX={200}
          lineEndY={510}
          labelX={200}
          labelY={518}
          label="04 · ESP32"
          sub="Compute · BLE"
          anchor="middle"
        />
      </svg>

      {/* Bottom-right footer label */}
      <div className="absolute bottom-4 right-4 text-[9px] uppercase tracking-[0.22em] font-mono text-fg-mute">
        Top view · DV.01
      </div>
      <div className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.22em] font-mono text-fg-mute">
        BlitzMind controller
      </div>
    </div>
  );
}

function SensorMarker({
  dotX,
  dotY,
  lineEndX,
  lineEndY,
  labelX,
  labelY,
  label,
  sub,
  anchor,
}: {
  dotX: number;
  dotY: number;
  lineEndX: number;
  lineEndY: number;
  labelX: number;
  labelY: number;
  label: string;
  sub: string;
  anchor: "start" | "middle" | "end";
}) {
  // Approximate the label position offset based on anchor
  const labelDx = anchor === "middle" ? 0 : anchor === "end" ? -4 : 4;
  // Label sits next to the line end; sub goes underneath
  return (
    <g>
      {/* Pulse glow */}
      <circle cx={dotX} cy={dotY} r="8" fill="url(#sensorGlow)" className="heartbeat" />
      {/* Dot */}
      <circle cx={dotX} cy={dotY} r="2" fill="#ff3b3b" />
      <circle cx={dotX} cy={dotY} r="3.5" fill="none" stroke="#ff3b3b" strokeWidth="0.6" opacity="0.7" />
      {/* Line to label */}
      <line
        x1={dotX}
        y1={dotY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="#5a5a64"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      {/* End cap */}
      <circle cx={lineEndX} cy={lineEndY} r="1.5" fill="#ff3b3b" />
      {/* Labels — drawn just past the line end */}
      <text
        x={labelX + labelDx}
        y={labelY - 4}
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="#ededee"
        textAnchor={anchor}
        letterSpacing="0.1em"
      >
        {label.toUpperCase()}
      </text>
      <text
        x={labelX + labelDx}
        y={labelY + 7}
        fontSize="7"
        fontFamily="var(--font-mono)"
        fill="#a3a3aa"
        textAnchor={anchor}
        letterSpacing="0.06em"
      >
        {sub}
      </text>
    </g>
  );
}

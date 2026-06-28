"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * HardwareRender — the real controller render (public/controller-front.png)
 * with an engineered markup overlay calling out the four sensor positions.
 *
 * The photo reads as a product; the overlay reads as a spec sheet. Callout
 * leads draw in on a staggered timeline (Linear-style reveal); the PPG node
 * carries a live heartbeat ping so the hardware feels like it's sensing.
 * Everything resolves to a clean static state under prefers-reduced-motion.
 *
 * Overlay coordinate space matches the image's natural size (900×594), and
 * the container shares that aspect ratio, so markup positions map 1:1 to the
 * render at any width.
 */

const ACCENT = "var(--color-accent)";
const CALM = "var(--color-calm)";

export function HardwareRender() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative aspect-[900/594] w-full rounded-lg overflow-hidden border border-line bg-surface/40">
      {/* Real product render */}
      <Image
        src="/controller-front.png"
        alt="BlitzMind controller, front view"
        fill
        sizes="(max-width: 1024px) 100vw, 600px"
        className="object-cover"
        priority={false}
      />

      {/* faint top accent wash to seat the render into the section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -8%, rgba(255,59,59,0.07), transparent 55%)",
        }}
      />

      {/* Markup overlay — shares the image's 900×594 space */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 900 594"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* 01 · PPG — right grip, live */}
        <Callout
          i={0}
          reduce={reduce}
          color={CALM}
          live
          line="M 652 398 L 836 398"
          dot={[652, 398]}
          end={[836, 398]}
          anchor="start"
          tx={840}
          numY={394}
          subY={411}
          num="01 · PPG"
          sub="HRV"
        />
        {/* 02 · FSR — left grip */}
        <Callout
          i={1}
          reduce={reduce}
          color={ACCENT}
          line="M 250 398 L 64 398"
          dot={[250, 398]}
          end={[64, 398]}
          anchor="end"
          tx={60}
          numY={394}
          subY={411}
          num="02 · FSR"
          sub="Grip pressure"
        />
        {/* 03 · BNO055 — top centre, near light bar */}
        <Callout
          i={2}
          reduce={reduce}
          color={ACCENT}
          line="M 450 168 L 450 80"
          dot={[450, 168]}
          end={[450, 80]}
          anchor="middle"
          tx={450}
          numY={62}
          subY={76}
          num="03 · BNO055"
          sub="9-axis IMU"
        />
        {/* 04 · ESP32 — centre body */}
        <Callout
          i={3}
          reduce={reduce}
          color={ACCENT}
          line="M 450 348 L 450 524"
          dot={[450, 348]}
          end={[450, 524]}
          anchor="middle"
          tx={450}
          numY={544}
          subY={560}
          num="04 · ESP32"
          sub="Compute · BLE"
        />
      </svg>

      {/* Corner labels */}
      <div className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.22em] tabular-nums text-fg-mute">
        BlitzMind controller
      </div>
      <div className="absolute bottom-4 right-4 text-[9px] uppercase tracking-[0.22em] tabular-nums text-fg-mute">
        Front · DV.01
      </div>
    </div>
  );
}

function Callout({
  i,
  reduce,
  color,
  live = false,
  line,
  dot,
  end,
  anchor,
  tx,
  numY,
  subY,
  num,
  sub,
}: {
  i: number;
  reduce: boolean;
  color: string;
  live?: boolean;
  line: string;
  dot: [number, number];
  end: [number, number];
  anchor: "start" | "middle" | "end";
  tx: number;
  numY: number;
  subY: number;
  num: string;
  sub: string;
}) {
  const delay = reduce ? 0 : 0.5 + i * 0.16;

  return (
    <motion.g
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      style={{ cursor: "default" }}
      whileHover="hover"
    >
      {/* connector lead */}
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.8}
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        variants={{ hover: { strokeOpacity: 1, strokeWidth: 1.6 } }}
      />
      {/* end dot */}
      <circle cx={end[0]} cy={end[1]} r={2.4} fill={color} />

      {/* sensor node */}
      <circle cx={dot[0]} cy={dot[1]} r={10} fill="none" stroke={color} strokeOpacity={0.3} />
      {live && !reduce && (
        <motion.circle
          cx={dot[0]}
          cy={dot[1]}
          r={6}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          initial={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${dot[0]}px ${dot[1]}px` }}
        />
      )}
      <motion.circle
        cx={dot[0]}
        cy={dot[1]}
        r={4}
        fill={color}
        variants={{ hover: { scale: 1.4 } }}
        style={{ transformOrigin: `${dot[0]}px ${dot[1]}px` }}
      />

      {/* labels */}
      <text
        x={tx}
        y={numY}
        textAnchor={anchor}
        fontFamily="var(--tabular-nums)"
        fontSize="14"
        letterSpacing="1"
        fontWeight={600}
        fill="var(--color-fg)"
      >
        {num}
      </text>
      <text
        x={tx}
        y={subY}
        textAnchor={anchor}
        fontFamily="var(--tabular-nums)"
        fontSize="11"
        letterSpacing="0.5"
        fill="var(--color-fg-mute)"
      >
        {sub}
      </text>
    </motion.g>
  );
}

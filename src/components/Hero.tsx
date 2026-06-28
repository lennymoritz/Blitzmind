"use client";

import { motion } from "motion/react";
import { CalmGauge } from "./CalmGauge";
import { EcgLine } from "./EcgLine";
import { LiveValue } from "./LiveValue";
import { ParallaxController } from "./ParallaxController";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* Controller drifting behind the hero, anchored to the gauge side */}
      <ParallaxController align="right" opacity={0.1} scale={1.25} distance={60} />

      {/* Background atmospheric — soft radial behind the gauge */}
      <div
        className="absolute right-0 top-0 w-[60vw] h-[80vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(255,59,59,0.06), transparent 60%)",
        }}
      />

      {/* ECG running through the section, behind everything */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[140px] opacity-30 pointer-events-none">
        <EcgLine
          className="w-[300%] h-full text-accent -translate-x-[20%]"
          speed={14}
          amplitude={1.1}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">
        {/* Left — wordmark, headline, CTA */}
        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-fg-mute"
          >
            <span className="block w-2 h-2 rounded-full bg-accent heartbeat" />
            <span className="tabular-nums">Adaptive Controller / Thesis Project</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 font-display tracking-[-0.025em] leading-[0.95] text-[clamp(3rem,8.5vw,7.5rem)]"
          >
            A controller that<br />
            knows you&rsquo;re<br />
            <span className="italic font-light text-fg-dim">tilted</span>
            {" "}<span className="text-accent">—</span> before<br />
            you do.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 max-w-xl text-lg text-fg-dim leading-relaxed"
          >
            BlitzMind reads your physiology in real time and adapts the game around
            you. Not to interrupt. To keep you competitive when your body starts
            working against you.
          </motion.p>

          {/* Sub-meta row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-md pr-4"
          >
            <Metric label="HRV" value={<LiveValue base={72} amplitude={4} suffix=" ms" />} />
            <Metric label="Engagement" value={<LiveValue base={78} amplitude={3} suffix="%" />} />
            <Metric label="Grip" value={<LiveValue base={84} amplitude={2} suffix="%" />} />
          </motion.div>
        </div>

        {/* Right — Calm gauge floating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Corner brackets — gives the gauge a "scope reticle" feel */}
          <div className="relative">
            <CornerBracket position="top-left" />
            <CornerBracket position="top-right" />
            <CornerBracket position="bottom-left" />
            <CornerBracket position="bottom-right" />
            <div className="p-10">
              <CalmGauge size={320} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-l border-line-soft pl-3">
      <div className="text-[9px] uppercase tracking-[0.2em] text-fg-mute">
        {label}
      </div>
      <div className="mt-1 text-lg text-fg tabular-nums">{value}</div>
    </div>
  );
}

function CornerBracket({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const map = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };
  return (
    <svg
      className={`absolute ${map[position]} text-fg-mute`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M0 8 V0 H8"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

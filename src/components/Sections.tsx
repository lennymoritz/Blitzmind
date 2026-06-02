"use client";

import { LiveValue } from "./LiveValue";
import { InGameFrame } from "./InGameFrame";
import { HardwareRender } from "./HardwareRender";

// ============================================================
// Shared atoms
// ============================================================

export function SectionLabel({
  num,
  children,
}: {
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-fg-mute font-mono">
      <span className="text-accent">{num}</span>
      <span className="block w-8 h-px bg-line-soft" />
      <span>{children}</span>
    </div>
  );
}

// ============================================================
// PROBLEM SECTION
// One-screen statement. Big serif quote, biometric tickers underneath.
// ============================================================

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative py-32 lg:py-44 border-t border-line"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <SectionLabel num="01">The problem</SectionLabel>

        <h2 className="mt-12 font-display tracking-[-0.02em] leading-[1.02] text-[clamp(2.25rem,6vw,5rem)] max-w-5xl">
          Your hands sweat. Your grip tightens. Your aim drifts.{" "}
          <span className="text-fg-mute italic font-light">
            And the game has no idea.
          </span>
        </h2>

        <p className="mt-12 max-w-2xl text-fg-dim text-lg leading-relaxed">
          Competitive players already pay the cost of stress — slower reaction time, worse decisions, missed shots. They don&rsquo;t need another wellness app telling them to breathe. They need the game to respond to the body that&rsquo;s playing it.
        </p>

        {/* Stat row — biometric callouts as if pulled from a live session */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line">
          <StatCard
            label="Reaction time, stressed"
            value={<>260<span className="text-fg-mute text-3xl ml-1">ms</span></>}
            sub="Best: 210 ms · Worst: 320 ms"
          />
          <StatCard
            label="HRV drop, late round"
            value={<>−7<span className="text-fg-mute text-3xl ml-1">%</span></>}
            sub="From session average"
          />
          <StatCard
            label="Peak stress event"
            value={<>42<span className="text-fg-mute text-3xl ml-1">ms</span></>}
            sub="During Gulag fight (Warzone)"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="bg-bg p-8">
      <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute">
        {label}
      </div>
      <div className="mt-3 font-display text-5xl tracking-tight tabular-nums">
        {value}
      </div>
      <div className="mt-2 text-xs text-fg-mute font-mono">{sub}</div>
    </div>
  );
}

// ============================================================
// SYSTEM INTRO — header that frames the three pillars before the
// adapt widget renders. Sense / Adapt / Analyze.
// ============================================================

export function SystemIntro() {
  return (
    <section
      id="system"
      className="relative pt-32 lg:pt-44 pb-16 border-t border-line"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <SectionLabel num="02">The system</SectionLabel>

        <h2 className="mt-12 font-display tracking-[-0.02em] leading-[1.02] text-[clamp(2.25rem,6vw,5rem)] max-w-4xl">
          Three loops, one controller.
        </h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-px bg-line border border-line">
          <PillarCard
            num="Sense"
            title="Read the body."
            description="HRV through the grips. Skin response across the contact surface. Grip pressure on every input. Sampled continuously, processed on-device."
          />
          <PillarCard
            num="Adapt"
            title="Shape the game."
            description="When physiology crosses your thresholds, the game responds. Brightness, HUD, loadouts, audio — adjusted to keep you in control of the moment."
          />
          <PillarCard
            num="Analyze"
            title="Learn the patterns."
            description="Every session becomes data. See where stress hits, which maps cost you, what your peak performance window looks like. Then adjust."
          />
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  num,
  title,
  description,
}: {
  num: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-bg p-8 lg:p-10">
      <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-mono">
        {num}
      </div>
      <h3 className="mt-6 font-display text-2xl tracking-tight">
        {title}
      </h3>
      <p className="mt-4 text-fg-dim leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================================
// ADAPT SECTION WRAPPER — wraps AdaptWidget with context copy.
// ============================================================

export function AdaptSectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative pb-32 lg:pb-44">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        {/* Inline label above the widget */}
        <div className="mb-8 flex items-baseline justify-between">
          <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
            ADAPT / Live demonstration
          </div>
          <div className="text-xs text-fg-mute font-mono hidden sm:block">
            Drag the threshold ↘
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

// ============================================================
// ANALYZE SECTION WRAPPER — wraps AnalyzeWidget with context.
// Separate section so it can have its own intro copy.
// ============================================================

export function AnalyzeSectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative pb-32 lg:pb-44 border-t border-line pt-24 lg:pt-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="mb-8 flex items-baseline justify-between">
          <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
            ANALYZE / Post-session
          </div>
          <div className="text-xs text-fg-mute font-mono hidden sm:block">
            Hover the chart ↘
          </div>
        </div>

        <h3 className="mb-12 font-display tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,5vw,3.5rem)] max-w-3xl">
          Every match becomes data.{" "}
          <span className="text-fg-mute italic font-light">Including the bad ones.</span>
        </h3>

        {children}
      </div>
    </section>
  );
}

// ============================================================
// IN-GAME SECTION — composed frame showing the in-game overlay
// ============================================================

export function InGameSection() {
  return (
    <section
      id="in-game"
      className="relative py-32 lg:py-44 border-t border-line bg-surface/30"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel num="03">In the game</SectionLabel>

        <h2 className="mt-12 font-display tracking-[-0.02em] leading-[1.02] text-[clamp(2.25rem,6vw,5rem)] max-w-4xl">
          The overlay you don&rsquo;t have to look at.
        </h2>

        <p className="mt-10 max-w-2xl text-fg-dim text-lg leading-relaxed">
          A slim rail on the edge of your screen. Real-time HRV. Adaptive toggles you set once and forget. It stays out of your way until your body asks for help.
        </p>

        <div className="mt-16">
          <InGameFrame />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HARDWARE SECTION — controller render + sensor stack
// ============================================================

export function HardwareSection() {
  return (
    <section
      id="hardware"
      className="relative py-32 lg:py-44 border-t border-line"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <SectionLabel num="04">The hardware</SectionLabel>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <h2 className="font-display tracking-[-0.02em] leading-[1.02] text-[clamp(2.25rem,5vw,4rem)]">
              Built, not just designed.
            </h2>
            <p className="mt-8 text-fg-dim text-lg leading-relaxed">
              The BlitzMind controller pairs a working sensor stack with a custom industrial design. The grip surface houses HRV pickup, grip-pressure sensing, and skin response — all integrated where your hands already are.
            </p>

            {/* Sensor stack list */}
            <div className="mt-12 space-y-3">
              {[
                ["HRV", "AFE4900 — medical-grade PPG"],
                ["Motion", "Bosch BNO055 IMU"],
                ["Grip pressure", "FSR strip across each handle"],
                ["Compute", "ESP32 + on-device ML inference"],
                ["Link", "Bluetooth Low Energy"],
              ].map(([label, detail]) => (
                <div
                  key={label}
                  className="flex items-baseline gap-4 border-b border-line py-3"
                >
                  <span className="w-28 shrink-0 text-[10px] uppercase tracking-[0.2em] text-fg-mute font-mono">
                    {label}
                  </span>
                  <span className="text-fg-dim text-sm font-mono">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real controller render with annotated sensor positions */}
          <HardwareRender />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COMPETITIVE INTEGRITY — single short section. Addresses the
// obvious objection: "wouldn't this get banned?"
// ============================================================

export function IntegritySection() {
  return (
    <section
      id="integrity"
      className="relative py-32 lg:py-44 border-t border-line bg-surface/20"
    >
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        <SectionLabel num="05">Integrity</SectionLabel>

        <h2 className="mt-12 font-display tracking-[-0.02em] leading-[1.02] text-[clamp(2rem,5vw,4rem)] max-w-3xl">
          Two modes. One built for training. One built for tournament.
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          <ModeCard
            mode="Training"
            tagline="Full adaptation."
            body="Visuals, HUD, audio, loadout — every adjustment available. Optimized for solo grinds, scrim sessions, and rank climbs."
          />
          <ModeCard
            mode="Sanctioned"
            tagline="Analytics only."
            body="No in-game adjustments. The system records — it doesn&rsquo;t alter. Compatible with league rules that prohibit performance-aiding hardware."
            muted
          />
        </div>

        <p className="mt-12 max-w-2xl text-fg-mute text-sm leading-relaxed">
          We treat competitive fairness as a constraint, not an afterthought. If a tournament organizer needs a specific mode, the controller supports it at the firmware level — no setting to forget, no profile to switch.
        </p>
      </div>
    </section>
  );
}

function ModeCard({
  mode,
  tagline,
  body,
  muted = false,
}: {
  mode: string;
  tagline: string;
  body: string;
  muted?: boolean;
}) {
  return (
    <div className="bg-bg p-8 lg:p-10">
      <div
        className="text-[10px] uppercase tracking-[0.24em] font-mono"
        style={{
          color: muted ? "var(--color-fg-mute)" : "var(--color-accent)",
        }}
      >
        {mode}
      </div>
      <h3 className="mt-6 font-display text-3xl tracking-tight">{tagline}</h3>
      <p className="mt-4 text-fg-dim leading-relaxed">{body}</p>
    </div>
  );
}

// ============================================================
// STORY — three cards. The pivot. This is the personal/process
// section that makes it clear how the project evolved.
// ============================================================

export function StorySection() {
  return (
    <section
      id="story"
      className="relative py-32 lg:py-44 border-t border-line"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <SectionLabel num="06">The story</SectionLabel>

        <h2 className="mt-12 font-display tracking-[-0.02em] leading-[1.02] text-[clamp(2.25rem,6vw,5rem)] max-w-4xl">
          We almost built a wellness app.{" "}
          <span className="text-fg-mute italic font-light">Then we asked the players.</span>
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
          <StoryCard
            phase="01 — Origin"
            title="Born from game rage"
            body="The first concept was about emotional regulation — a controller that warned you when you were stressed. We thought the problem was the rage. Players told us the problem was that the rage cost them games."
          />
          <StoryCard
            phase="02 — Research"
            title="30 surveys. 5 interviews. One verdict."
            body="Direct stress alerts mid-game felt like a backseat driver telling them to calm down. Nobody wanted to pause. Everyone wanted to perform. The signal was useful. The interruption was the problem."
          />
          <StoryCard
            phase="03 — Pivot"
            title="From feedback to mechanics"
            body="We stopped trying to fix the player. We started adapting the game. Stress became a performance signal — input to a system that adjusted around the player rather than against them."
          />
        </div>
      </div>
    </section>
  );
}

function StoryCard({
  phase,
  title,
  body,
}: {
  phase: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-bg p-8 lg:p-10">
      <div className="text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
        {phase}
      </div>
      <h3 className="mt-6 font-display text-2xl tracking-tight">{title}</h3>
      <p className="mt-4 text-fg-dim leading-relaxed">{body}</p>
    </div>
  );
}

// ============================================================
// FOOTER — credit + minimal contact block
// ============================================================

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <div className="font-display text-4xl tracking-tight">
              BlitzMind<span className="text-accent">.</span>
            </div>
            <p className="mt-3 text-fg-mute text-sm max-w-sm">
              A thesis project by Dhruv Deva. The adaptive controller for competitive play.
            </p>
          </div>
          <div className="md:text-right space-y-2">
            <a
              href="mailto:hello@blitzmind.example"
              className="block text-fg-dim hover:text-fg transition-colors text-sm"
            >
              hello@blitzmind.example
            </a>
            <a
              href="#"
              className="block text-fg-dim hover:text-fg transition-colors text-sm"
            >
              Portfolio →
            </a>
          </div>
        </div>

        {/* Bottom rule with live BPM */}
        <div className="mt-16 pt-6 border-t border-line flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-fg-mute font-mono">
          <span>© 2026 · Concept project</span>
          <span className="flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
            <LiveValue base={78} amplitude={3} suffix=" bpm" />
          </span>
        </div>
      </div>
    </footer>
  );
}

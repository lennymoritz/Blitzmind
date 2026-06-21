"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type StepKind = "video" | "image";

type Step = {
  id: string;
  kind: StepKind;
  src: string;
  poster?: string;
  eyebrow: string;
  title: string;
  caption: React.ReactNode;
  /** Optional in-frame decoration that fades in over the media. */
  decoration?: "dim" | "hud-mask" | "overlay-panel";
};

const STEPS: Step[] = [
  {
    id: "brightness",
    kind: "video",
    src: "/adaptive-brightness.mp4",
    poster: "/adaptive-poster-brightness.jpg",
    eyebrow: "Step 1 of 4 — Visual",
    title: "Brightness drops to your trigger level",
    caption: (
      <>
        <b>Adaptive brightness.</b> When your Calm Score crosses the trigger
        threshold, BlitzMind dims the screen to your configured floor — no
        menu, no pause. Eye strain drops on the worst rounds, when you'd never
        reach for the slider yourself.
      </>
    ),
    decoration: "dim",
  },
  {
    id: "hud",
    kind: "video",
    src: "/adaptive-hud-declutter.mp4",
    poster: "/adaptive-poster-hud.jpg",
    eyebrow: "Step 2 of 4 — HUD",
    title: "Non-critical HUD fades when stress spikes",
    caption: (
      <>
        <b>Focus Mode.</b> Kill feed, secondary chrome, and decorative info
        pull back, leaving ammo, health, and objective in front. The red
        callouts show what BlitzMind hides — they disappear in-game.
      </>
    ),
    decoration: "hud-mask",
  },
  {
    id: "overlay",
    kind: "video",
    src: "/adaptive-overlay-base.mp4",
    poster: "/adaptive-poster-overlay.jpg",
    eyebrow: "Step 3 of 4 — Overlay",
    title: "The BlitzMind side rail stays out of the way",
    caption: (
      <>
        <b>Live HRV and adaptive state, always glanceable.</b> A slim
        right-edge panel surfaces match identity, real-time HRV, the four
        active adaptations, and the elimination ticker — without colonizing
        the gameplay frame.
      </>
    ),
    decoration: "overlay-panel",
  },
  {
    id: "maps",
    kind: "image",
    src: "/adaptive-map-restriction.jpg",
    eyebrow: "Step 4 of 4 — Maps",
    title: "Ranked queues lock to maps that match your state",
    caption: (
      <>
        <b>Map restriction.</b> When your readiness signals drop below
        baseline, BlitzMind narrows the queue to maps where your performance
        holds up — surfaced inline in the game's own UI, branded honestly.
      </>
    ),
  },
];

export default function AdaptivePreviewLauncher() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const step = STEPS[idx];

  // Portal target only exists on the client.
  useEffect(() => setMounted(true), []);

  const next = useCallback(() => {
    setIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
  }, []);
  const prev = useCallback(() => {
    setIdx((i) => (i > 0 ? i - 1 : i));
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    setIdx(0);
  }, []);

  // keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, close]);

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // play current video; auto-advance on end
  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    const playPromise = v.play();
    if (playPromise?.catch) playPromise.catch(() => {});
    const onEnd = () => {
      if (idx < STEPS.length - 1) setIdx(idx + 1);
    };
    v.addEventListener("ended", onEnd);
    return () => v.removeEventListener("ended", onEnd);
  }, [idx, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIdx(0);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--color-app-border-strong,#323b4a)] bg-transparent px-3.5 py-2 text-[13px] font-medium text-[var(--color-app-text,#e8ecf2)] transition-colors hover:border-[var(--color-app-accent,#ff3344)] hover:bg-[color-mix(in_oklab,var(--color-app-accent,#ff3344)_12%,transparent)]"
        aria-haspopup="dialog"
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-app-accent,#ff3344)]"
          style={{ boxShadow: "0 0 8px var(--color-app-accent,#ff3344)" }}
          aria-hidden
        />
        Preview adaptation
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
        {open && (
          <motion.div
            key="adaptive-preview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adaptive-preview-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={close}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
            style={{
              background: "rgba(7,7,9,0.92)",
              backdropFilter: "blur(8px) saturate(0.85)",
            }}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-[1280px] flex-col gap-4"
            >
              {/* top */}
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="mb-1.5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-app-text-dim,#5a6478)]">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[var(--color-app-accent,#ff3344)]"
                      style={{ boxShadow: "0 0 8px var(--color-app-accent,#ff3344)" }}
                    />
                    {step.eyebrow}
                  </div>
                  <h2
                    id="adaptive-preview-title"
                    className="font-display text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-white"
                  >
                    {step.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close preview"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-app-border-strong,#323b4a)] text-[var(--color-app-text-mute,#8b95a8)] transition-colors hover:border-[var(--color-app-text-mute,#8b95a8)] hover:bg-[var(--color-app-surface,#131820)] hover:text-[var(--color-app-text,#e8ecf2)]"
                >
                  <span aria-hidden className="text-xl leading-none">
                    ×
                  </span>
                </button>
              </div>

              {/* stage */}
              <button
                type="button"
                onClick={next}
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-[14px] border border-[var(--color-app-border,#252d3a)] bg-black text-left"
                style={{
                  boxShadow:
                    "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02)",
                }}
                aria-label="Advance to next step"
              >
                {step.kind === "video" ? (
                  <video
                    key={step.id}
                    ref={videoRef}
                    src={step.src}
                    poster={step.poster}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={step.src}
                    alt="Map restriction surfaced inside the game UI"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {step.decoration === "dim" && <DimOverlay key={`dim-${step.id}`} />}
                {step.decoration === "hud-mask" && <HudMaskOverlay key={`mask-${step.id}`} />}
                {step.decoration === "overlay-panel" && (
                  <OverlayPanel key={`panel-${step.id}`} />
                )}
              </button>

              {/* foot */}
              <div className="flex items-center justify-between gap-5 px-0.5">
                <p className="max-w-[760px] flex-1 text-[13.5px] leading-[1.55] text-[var(--color-app-text-mute,#8b95a8)]">
                  {step.caption}
                </p>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="mr-1 font-mono text-[11px] text-[var(--color-app-text-dim,#5a6478)]">
                    {String(idx + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </span>
                  <div className="flex gap-1.5">
                    {STEPS.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdx(i);
                        }}
                        aria-label={`Go to step ${i + 1}`}
                        className={`h-[3px] rounded-[2px] transition-all duration-200 ${
                          i === idx
                            ? "w-7 bg-[var(--color-app-accent,#ff3344)]"
                            : i < idx
                            ? "w-[18px] bg-[var(--color-app-text-dim,#5a6478)]"
                            : "w-[18px] bg-[var(--color-app-border-strong,#323b4a)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-app-text-dim,#5a6478)] opacity-70">
                Click the video to advance ·{" "}
                <kbd className="mx-0.5 rounded-sm border border-[var(--color-app-border-strong,#323b4a)] bg-[var(--color-app-surface,#131820)] px-1.5 py-0.5">
                  ESC
                </kbd>{" "}
                to close ·{" "}
                <kbd className="mx-0.5 rounded-sm border border-[var(--color-app-border-strong,#323b4a)] bg-[var(--color-app-surface,#131820)] px-1.5 py-0.5">
                  ←
                </kbd>{" "}
                <kbd className="mx-0.5 rounded-sm border border-[var(--color-app-border-strong,#323b4a)] bg-[var(--color-app-surface,#131820)] px-1.5 py-0.5">
                  →
                </kbd>{" "}
                to navigate
              </div>
            </motion.div>
          </motion.div>
        )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

/* -------------------- Decorations -------------------- */

function DimOverlay() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-black"
      style={{ mixBlendMode: "multiply" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: reduce ? 0 : 0.4 }}
      transition={{ duration: 3.5, delay: 4.5, ease: "easeInOut" }}
    />
  );
}

function HudMaskOverlay() {
  const reduce = useReducedMotion();
  const boxes = [
    { className: "left-[4%] top-[4%] h-[18%] w-[15%]" },
    { className: "bottom-[6%] left-[4%] h-[10%] w-[18%]" },
    { className: "bottom-[6%] right-[4%] h-[14%] w-[16%]" },
    { className: "right-[4%] top-[14%] h-[6%] w-[8%]" },
  ];
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 7, times: [0, 0.1, 0.8, 1], delay: 0.3, ease: "easeOut" }}
    >
      {boxes.map((b, i) => (
        <span
          key={i}
          className={`absolute rounded-[3px] border border-[var(--color-app-accent,#ff3344)] bg-[color-mix(in_oklab,var(--color-app-accent,#ff3344)_50%,transparent)] ${b.className}`}
          style={{ mixBlendMode: "screen" }}
        />
      ))}
    </motion.span>
  );
}

function OverlayPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="absolute bottom-5 right-5 top-5 flex w-[280px] flex-col gap-3 rounded-[10px] border border-white/10 p-3.5 text-[12px]"
      style={{
        background: "rgba(10,10,12,0.78)",
        backdropFilter: "blur(12px) saturate(1.1)",
      }}
    >
      {/* Identity */}
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
        <div
          className="h-8 w-8 shrink-0 rounded-full border border-white/10"
          style={{ background: "linear-gradient(135deg,#2a2a32,#17171c)" }}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-white">
            HarnitK#7421
          </div>
          <div className="mt-px font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-app-text-dim,#5a6478)]">
            Competitive
          </div>
        </div>
        <div className="rounded-[3px] bg-white/5 px-1.5 py-[3px] font-mono text-[11px] text-white">
          09:32
        </div>
      </div>

      {/* HRV */}
      <div>
        <div className="mb-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-app-text-mute,#8b95a8)]">
          <span>Real-time HRV</span>
          <span className="text-[var(--color-app-accent,#ff3344)]">Avg 89 BPM</span>
        </div>
        <div
          className="relative h-[50px] overflow-hidden rounded-[4px] border border-[color-mix(in_oklab,var(--color-app-accent,#ff3344)_18%,transparent)]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent 0, transparent 9px, color-mix(in oklab, var(--color-app-accent,#ff3344) 7%, transparent) 9px, color-mix(in oklab, var(--color-app-accent,#ff3344) 7%, transparent) 10px), repeating-linear-gradient(90deg, transparent 0, transparent 14px, color-mix(in oklab, var(--color-app-accent,#ff3344) 7%, transparent) 14px, color-mix(in oklab, var(--color-app-accent,#ff3344) 7%, transparent) 15px)",
          }}
        >
          <svg
            viewBox="0 0 200 50"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <polyline
              points="0,28 12,30 22,18 28,38 36,29 48,31 56,15 64,40 76,28 88,30 96,20 104,36 116,29 124,31 136,18 148,38 158,28 168,30 180,22 192,32 200,29"
              fill="none"
              stroke="var(--color-app-accent,#ff3344)"
              strokeWidth="1.3"
            />
          </svg>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col">
        {[
          ["Adaptive UI", true],
          ["Brightness", true],
          ["Loadout", true],
          ["Adaptive settings", true],
        ].map(([label, on], i) => (
          <div
            key={String(label)}
            className={`flex items-center justify-between py-1.5 text-[11px] text-white ${
              i === 0 ? "" : "border-t border-white/5"
            }`}
          >
            <span>{label}</span>
            <MiniToggle on={Boolean(on)} />
          </div>
        ))}
      </div>

      {/* Elimination */}
      <div className="mt-auto">
        <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-app-text-mute,#8b95a8)]">
          Elimination
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            ["t1", "Player #1"],
            ["t2", "Player #2"],
            ["t3", "Player #3"],
          ].map(([t, name]) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-[4px] bg-white/[0.03] p-1 text-[11px] text-white"
            >
              <span
                className="h-[22px] w-[22px] shrink-0 rounded-[3px]"
                style={{
                  background:
                    t === "t1"
                      ? "linear-gradient(135deg,#3a4a2a,#1c2516)"
                      : t === "t2"
                      ? "linear-gradient(135deg,#4a2a2a,#251616)"
                      : "linear-gradient(135deg,#2a2a32,#16161a)",
                }}
              />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MiniToggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-block h-[14px] w-6 rounded-[7px] transition-colors ${
        on
          ? "bg-[var(--color-app-action,#4a90ff)]"
          : "bg-[var(--color-app-border-strong,#323b4a)]"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[10px] w-[10px] rounded-full bg-white transition-[left] duration-150 ${
          on ? "left-[12px]" : "left-[2px]"
        }`}
      />
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * StressSpike — the "site is the demo" moment.
 *
 * Watches scroll position. Once the visitor scrolls past the Problem section
 * (roughly), fires a one-time "stress event detected" sequence:
 *   1. Dim + slight desaturate the page for ~1.6s
 *   2. Show a toast in the top-right with "Stress event detected · Adapting"
 *   3. Pulse the page accent
 *   4. Fade back to normal
 *
 * Critically, this fires ONCE per session (sessionStorage flag), so a
 * visitor scrolling around doesn't trigger it repeatedly — it would lose
 * meaning. They can reload to see it again.
 *
 * Renders a fixed-position overlay at body level. Composes via mix-blend
 * so it doesn't fight with the section backgrounds.
 */
export function StressSpike() {
  const [firing, setFiring] = useState(false);
  const hasFired = useRef(false);

  useEffect(() => {
    // Don't fire again if user already saw it in this session
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("bm:spike-fired") === "1") {
        hasFired.current = true;
        return;
      }
    }

    const onScroll = () => {
      if (hasFired.current) return;

      // Look for the problem section's bottom edge as the trigger point
      const problem = document.getElementById("problem");
      if (!problem) return;

      const rect = problem.getBoundingClientRect();
      // Trigger when the bottom of the problem section is ~30% into viewport
      // (i.e. user has read most of it and is about to scroll past)
      const triggerY = window.innerHeight * 0.7;

      if (rect.bottom < triggerY) {
        hasFired.current = true;
        sessionStorage.setItem("bm:spike-fired", "1");
        setFiring(true);
        // Auto-clear after the sequence completes
        setTimeout(() => setFiring(false), 1900);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Page-wide dim layer */}
      <AnimatePresence>
        {firing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,59,59,0.08) 0%, rgba(0,0,0,0.42) 80%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Page-wide saturation/brightness shift via a sibling style tag */}
      {firing && (
        <style>{`
          main { filter: brightness(0.78) saturate(0.85); transition: filter 350ms ease-out; }
        `}</style>
      )}

      {/* Toast — top-right corner */}
      <AnimatePresence>
        {firing && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 right-6 z-50 pointer-events-none"
          >
            <div className="rounded-md border border-accent/40 bg-bg/95 backdrop-blur-md px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="block w-2 h-2 rounded-full bg-accent heartbeat" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-accent tabular-nums">
                    Stress event detected
                  </div>
                  <div className="mt-0.5 text-xs text-fg-dim tabular-nums">
                    Adapting interface · calm 54%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

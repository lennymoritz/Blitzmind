"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TweenedNumber — renders a number that smoothly animates between values.
 *
 * Used wherever a number is going to *change* (live BPM, calm score after a
 * match, win-rate when filters change, aggregate stats). The eye registers
 * an animated number as more present than one that snaps. Especially valuable
 * on dashboards where multiple numbers update simultaneously — the staggered
 * tweening gives the screen a "this is being measured" feeling.
 *
 * Defaults to a 600ms ease-out cubic curve. Auto-formats with a formatter
 * function if provided, or defaults to Math.round().
 *
 * Accessibility: respects `prefers-reduced-motion: reduce`. When the user
 * has that set in their OS, the value snaps to its target instead of tweening.
 *
 * Usage:
 *   <TweenedNumber value={calmScore} />
 *   <TweenedNumber value={hrv} format={(v) => `${Math.round(v)} ms`} />
 *   <TweenedNumber value={winRate} format={(v) => `${Math.round(v)}%`} />
 */
export function TweenedNumber({
  value,
  duration = 600,
  format,
  className,
  style,
}: {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    // Respect prefers-reduced-motion — snap instead of tween
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }

    // Cancel any in-progress tween before starting the new one
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic — slows toward the end, feels "settled"
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value, duration]);

  const text = format ? format(display) : Math.round(display).toString();

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}

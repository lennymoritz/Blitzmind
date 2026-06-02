"use client";

import { useEffect, useState } from "react";

/**
 * LiveValue — a number that drifts plausibly around a base.
 * Used for the hero "Calm Score: 78%" type displays. Pure design fiction —
 * gives the page a sense that something is being measured, without claiming
 * to actually measure anything.
 *
 * The wander is a slow random walk biased toward the base value (a sloppy
 * mean-reverting drift). Updates on `intervalMs`.
 */
export function LiveValue({
  base,
  amplitude = 4,
  intervalMs = 900,
  decimals = 0,
  suffix = "",
  className = "",
}: {
  base: number;
  amplitude?: number;
  intervalMs?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const [value, setValue] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((prev) => {
        // Wander: take a step in {-1, 0, +1} scaled by amplitude/4, then
        // pull a fraction back toward `base` so it doesn't drift away.
        const step = (Math.random() - 0.5) * amplitude * 0.5;
        const next = prev + step - (prev - base) * 0.18;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, amplitude, intervalMs]);

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

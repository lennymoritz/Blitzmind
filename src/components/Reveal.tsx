"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Reveal — scroll-triggered entrance. Fades + rises content as it enters the
 * viewport, once. Linear-style easing, restrained distance. This is the
 * marketing site's scroll-motion layer; wrap section headings, paragraphs,
 * and card grids in it (stagger via `delay`).
 *
 * Respects prefers-reduced-motion: renders content at rest, no animation.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

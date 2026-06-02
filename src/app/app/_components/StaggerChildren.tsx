"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * StaggerChildren — when a list of cards or tiles appears on first paint,
 * fade them in one after another instead of all at once. Makes the screen
 * feel composed instead of dumped.
 *
 * Each child is wrapped in a motion.div that fades from opacity 0 + 6px
 * translate-y to its rest state. Delay = index × 60ms.
 *
 * Important: this only fires on mount. Don't use for content that re-renders
 * frequently (live charts, etc).
 *
 * Accessibility: respects `prefers-reduced-motion: reduce`. When set, children
 * render immediately at their rest state with no animation.
 *
 * Usage:
 *   <StaggerChildren className="grid grid-cols-4 gap-3">
 *     <Card>...</Card>
 *     <Card>...</Card>
 *   </StaggerChildren>
 */
export function StaggerChildren({
  children,
  className,
  style,
  delay = 0,
  step = 60,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Initial delay before first child fades in, in ms. */
  delay?: number;
  /** Delay between each successive child, in ms. */
  step?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const childArray = Array.isArray(children) ? children : [children];

  // If user prefers reduced motion, render children directly without
  // motion wrappers — no opacity/transform animation, no stagger.
  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {childArray.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {childArray.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.42,
            delay: (delay + i * step) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ willChange: "opacity, transform" }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

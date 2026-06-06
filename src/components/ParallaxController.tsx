"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * ParallaxController — the controller render drifting behind a section as the
 * page scrolls, at low opacity and masked to the edges. Carries the product
 * through the whole site instead of confining it to the hardware section.
 *
 * Fills its nearest positioned ancestor (sections are `relative`), so it sits
 * behind that section's content. Movement is tied to the element's own scroll
 * progress, so each instance parallaxes independently.
 *
 * Respects prefers-reduced-motion: static, no drift.
 */
export function ParallaxController({
  className = "",
  distance = 90,
  opacity = 0.08,
  scale = 1,
  align = "center",
}: {
  className?: string;
  /** Total vertical drift in px across the scroll range. */
  distance?: number;
  opacity?: number;
  scale?: number;
  align?: "center" | "right" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  const objPos =
    align === "right" ? "object-right" : align === "left" ? "object-left" : "object-center";

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden z-0 ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          y: reduce ? 0 : y,
          scale,
          opacity,
          maskImage:
            "radial-gradient(60% 60% at 50% 45%, #000 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(60% 60% at 50% 45%, #000 25%, transparent 80%)",
        }}
      >
        <Image
          src="/controller-front.png"
          alt=""
          fill
          sizes="100vw"
          className={`${objPos} object-contain mix-blend-screen`}
        />
      </motion.div>
    </div>
  );
}

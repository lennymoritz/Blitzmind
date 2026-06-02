"use client";

/**
 * EcgLine — a recurring visual motif. Renders an animated ECG/heartbeat trace
 * as inline SVG. Used as section decoration and as the hero pulse line.
 *
 * Width is responsive (svg scales). The "amplitude" prop controls how spiky
 * the trace is; "speed" controls how fast it scrolls.
 */
export function EcgLine({
  className = "",
  stroke = "currentColor",
  strokeWidth = 1.25,
  amplitude = 1,
  speed = 12,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  amplitude?: number;
  speed?: number;
}) {
  // Build a tileable ECG path: flat baseline punctuated by P-QRS-T complexes.
  // The path is 400 units wide; we render it twice end-to-end and animate the
  // dashoffset so it scrolls infinitely.
  const a = amplitude;
  const path = [
    "M0 30",
    "L60 30",
    `L70 30 L74 ${30 - 4 * a} L78 ${30 + 2 * a} L82 ${30 - 28 * a} L86 ${30 + 14 * a} L90 30`,
    "L150 30",
    `L160 30 L164 ${30 - 3 * a} L168 ${30 + 1 * a} L172 ${30 - 24 * a} L176 ${30 + 12 * a} L180 30`,
    "L260 30",
    `L270 30 L274 ${30 - 5 * a} L278 ${30 + 2 * a} L282 ${30 - 30 * a} L286 ${30 + 16 * a} L290 30`,
    "L400 30",
  ].join(" ");

  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d={`${path} M400 30 ${path.slice(2)}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: "400 0",
          animation: `pulse-trace ${speed}s linear infinite`,
        }}
      />
    </svg>
  );
}

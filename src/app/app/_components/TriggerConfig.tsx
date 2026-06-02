"use client";

import { useState, useEffect } from "react";

/**
 * TriggerConfig — the "Adapt when [metric] drops below [threshold]" widget.
 *
 * Every sub-tab in Adaptive Control uses this pattern. Two dropdowns:
 *   - Metric (Calm Score / HRV / Stress / Engagement)
 *   - Threshold (a percentage, dragged via slider OR typed)
 *
 * Plus a live preview of the player's CURRENT metric value so the user can
 * see whether the trigger would fire right now. This live indicator drifts
 * around a base (just like the rest of the site) — when it crosses the
 * threshold, a "Would fire now" pill appears.
 *
 * This is the moment that makes the configurator feel alive — most products
 * make you "save and test," BlitzMind shows you immediately.
 */

const METRICS = [
  { id: "calm", label: "Calm Score", unit: "%", base: 72 },
  { id: "hrv", label: "HRV", unit: "ms", base: 68 },
  { id: "stress", label: "Stress", unit: "%", base: 28 },
  { id: "engagement", label: "Engagement", unit: "%", base: 78 },
] as const;

type MetricId = (typeof METRICS)[number]["id"];

interface TriggerValue {
  metric: MetricId;
  threshold: number;
}

interface TriggerConfigProps {
  value: TriggerValue;
  onChange: (next: TriggerValue) => void;
  /** Show a "live current value" indicator that drifts. Defaults true. */
  liveIndicator?: boolean;
}

export function TriggerConfig({
  value,
  onChange,
  liveIndicator = true,
}: TriggerConfigProps) {
  const metric = METRICS.find((m) => m.id === value.metric) ?? METRICS[0];
  const [live, setLive] = useState<number>(metric.base);

  // Drift the live value around the metric's base. When the user switches
  // metric we snap the live value to the new metric's base so it starts
  // in a believable place.
  useEffect(() => {
    setLive(metric.base);
  }, [metric.base]);

  useEffect(() => {
    if (!liveIndicator) return;
    const id = setInterval(() => {
      setLive((prev) => {
        const step = (Math.random() - 0.5) * 4;
        const next = prev + step - (prev - metric.base) * 0.15;
        return Math.max(0, Math.min(100, next));
      });
    }, 1000);
    return () => clearInterval(id);
  }, [metric.base, liveIndicator]);

  // For 'stress' metric, "would fire" means current > threshold (inverted)
  const wouldFire =
    metric.id === "stress" ? live > value.threshold : live < value.threshold;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
      {/* Metric picker */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute block mb-1.5">
          Trigger metric
        </label>
        <div className="relative">
          <select
            value={value.metric}
            onChange={(e) =>
              onChange({ ...value, metric: e.target.value as MetricId })
            }
            className="w-full appearance-none px-3 py-2 pr-9 rounded text-sm border outline-none transition-colors cursor-pointer"
            style={{
              background: "var(--color-app-surface-2)",
              borderColor: "var(--color-app-line-strong)",
              color: "var(--color-fg)",
            }}
          >
            {METRICS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 4 L5 7 L8 4"
              stroke="var(--color-fg-mute)"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>

      {/* Threshold slider + number */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute block mb-1.5">
          Threshold
        </label>
        <div
          className="flex items-center gap-3 px-3 py-2 rounded border"
          style={{
            background: "var(--color-app-surface-2)",
            borderColor: "var(--color-app-line-strong)",
          }}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={value.threshold}
            onChange={(e) =>
              onChange({ ...value, threshold: Number(e.target.value) })
            }
            className="bm-range flex-1"
          />
          <div className="flex items-baseline gap-0.5 font-mono text-sm tabular-nums shrink-0 w-12 text-right">
            <span className="text-fg">{value.threshold}</span>
            <span className="text-fg-mute text-xs">{metric.unit}</span>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      {liveIndicator && (
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">
            Live now
          </div>
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-colors"
            style={{
              background: wouldFire
                ? "rgba(255, 51, 68, 0.12)"
                : "var(--color-app-surface-2)",
              color: wouldFire
                ? "var(--color-app-accent)"
                : "var(--color-fg-dim)",
              border: wouldFire
                ? "1px solid var(--color-app-accent)"
                : "1px solid var(--color-app-line-strong)",
            }}
          >
            <span
              className="block w-1.5 h-1.5 rounded-full heartbeat"
              style={{
                background: wouldFire
                  ? "var(--color-app-accent)"
                  : "var(--color-calm)",
              }}
            />
            <span className="tabular-nums">
              {Math.round(live)}
              {metric.unit}
            </span>
            {wouldFire && (
              <span className="text-[9px] uppercase tracking-[0.15em]">
                fires
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export type { TriggerValue, MetricId };

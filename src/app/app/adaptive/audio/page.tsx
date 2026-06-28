"use client";

import { useState } from "react";
import { TriggerConfig, TriggerValue } from "../../_components/TriggerConfig";
import { ResearchNote } from "../../_components/ResearchNote";
import { Panel, Setting, Divider, Toggle } from "../video/page";

/**
 * Adaptive Control / Audio.
 *
 * Audio adapts in 4 ways when stress hits:
 *   1. Adaptive volume — lower the overall game volume so it feels less chaotic
 *   2. Auto-mute toxic — silence voice channels when toxicity is likely impacting focus
 *   3. Ambient calm — increase ambient/spatial audio (helps spatial awareness when overwhelmed)
 *   4. Audio cue priority — boost critical audio (footsteps, reloads) over non-critical
 *
 * Plus a master volume curve preview that shows where the system will
 * push the volume given the current trigger.
 */

export default function AudioTab() {
  const [trigger, setTrigger] = useState<TriggerValue>({
    metric: "calm",
    threshold: 50,
  });
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [adaptiveVolume, setAdaptiveVolume] = useState(true);
  const [autoMute, setAutoMute] = useState(true);
  const [ambientCalm, setAmbientCalm] = useState(false);
  const [cuePriority, setCuePriority] = useState(true);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] space-y-6">
      <Panel title="Trigger" subtitle="When audio adaptations fire">
        <TriggerConfig value={trigger} onChange={setTrigger} />
      </Panel>

      <Panel
        title="Volume curve"
        subtitle="Base volume and how it shifts when triggered"
      >
        {/* Volume slider */}
        <Setting label="Base volume" hint={`${volume}%`}>
          <div className="w-48">
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="bm-range w-full"
            />
          </div>
        </Setting>

        {/* Visual curve showing volume over calm */}
        <div
          className="mt-4 rounded border p-4"
          style={{
            background: "var(--color-app-surface-2)",
            borderColor: "var(--color-app-line)",
          }}
        >
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-fg-mute">
              Volume vs calm score
            </span>
            <span className="text-[10px] tabular-nums text-fg-mute">
              Adapts toward {Math.round(volume * 0.6)}% when triggered
            </span>
          </div>
          <VolumeCurve baseVolume={volume} threshold={trigger.threshold} enabled={enabled && adaptiveVolume} />
        </div>
      </Panel>

      <Panel
        title="Audio adjustments"
        subtitle="Granular controls — each fires independently when the trigger hits"
      >
        <Setting
          label="Adaptive volume"
          hint="Auto-reduce overall game volume during stress spikes"
        >
          <Toggle checked={adaptiveVolume} onChange={setAdaptiveVolume} />
        </Setting>
        <Divider />
        <Setting
          label="Auto-mute toxic teammates"
          hint="Silence voice channels when toxicity is detected during stress"
        >
          <Toggle checked={autoMute} onChange={setAutoMute} />
        </Setting>
        <Divider />
        <Setting
          label="Ambient calm boost"
          hint="Increase spatial/ambient audio for better situational awareness"
        >
          <Toggle checked={ambientCalm} onChange={setAmbientCalm} />
        </Setting>
        <Divider />
        <Setting
          label="Audio cue priority"
          hint="Boost critical cues (footsteps, reloads) over non-critical sounds"
        >
          <Toggle checked={cuePriority} onChange={setCuePriority} />
        </Setting>
      </Panel>

      <ResearchNote
        note={{
          source: "Interview",
          title: "Why mute-toxic became a flagship feature",
          body: "3 of 5 competitive players named toxic voice chat as their single biggest stress trigger — bigger than enemy presence or unfavorable engagements. We built auto-mute first because it produces a measurable HRV improvement within seconds of activation in pilot testing.",
        }}
      />
    </div>
  );
}

function VolumeCurve({
  baseVolume,
  threshold,
  enabled,
}: {
  baseVolume: number;
  threshold: number;
  enabled: boolean;
}) {
  // Draw a curve: volume stays at baseVolume when calm >= threshold,
  // drops to baseVolume * 0.6 when calm < threshold.
  // X axis: 0% calm (right side) to 100% calm (left side)... actually let's
  // do 0% on left, 100% on right (standard).
  const width = 600;
  const height = 80;
  const padding = { x: 10, y: 8 };
  const yMax = height - padding.y * 2;
  const xMax = width - padding.x * 2;

  const toY = (vol: number) => padding.y + (1 - vol / 100) * yMax;
  const toX = (calm: number) => padding.x + (calm / 100) * xMax;

  // Curve points
  const dropped = baseVolume * 0.6;
  const points = enabled
    ? `M ${toX(0)} ${toY(dropped)} L ${toX(threshold - 5)} ${toY(dropped)} L ${toX(threshold + 5)} ${toY(baseVolume)} L ${toX(100)} ${toY(baseVolume)}`
    : `M ${toX(0)} ${toY(baseVolume)} L ${toX(100)} ${toY(baseVolume)}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" aria-label="Volume curve preview">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => (
        <line
          key={v}
          x1={toX(v)}
          x2={toX(v)}
          y1={padding.y}
          y2={height - padding.y}
          stroke="var(--color-app-line)"
          strokeWidth="0.5"
        />
      ))}
      {/* Threshold marker */}
      <line
        x1={toX(threshold)}
        x2={toX(threshold)}
        y1={padding.y}
        y2={height - padding.y}
        stroke="var(--color-app-accent)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <text
        x={toX(threshold) + 3}
        y={padding.y + 9}
        fontSize="8"
        fontFamily="var(--tabular-nums)"
        fill="var(--color-app-accent)"
        textAnchor="start"
      >
        TRIGGER
      </text>
      {/* Curve */}
      <path d={points} stroke="var(--color-fg)" strokeWidth="1.5" fill="none" />
      {/* Labels */}
      <text x={toX(0)} y={height - 1} fontSize="8" fontFamily="var(--tabular-nums)" fill="var(--color-fg-mute)" textAnchor="start">0% calm</text>
      <text x={toX(100)} y={height - 1} fontSize="8" fontFamily="var(--tabular-nums)" fill="var(--color-fg-mute)" textAnchor="end">100%</text>
    </svg>
  );
}

"use client";

import { useState } from "react";
import { TriggerConfig, TriggerValue } from "../../_components/TriggerConfig";
import { ResearchNote } from "../../_components/ResearchNote";
import { Panel } from "../video/page";
import { maps } from "../../_lib/mockData";

/**
 * Adaptive Control / Maps.
 *
 * Three independent restriction policies, each with its own trigger:
 *   1. Ranked restriction — when stressed, only let player queue listed
 *      maps in Ranked playlists (the maps they perform best on)
 *   2. Map restriction — entirely block certain maps when stressed
 *      (the maps that historically spike stress)
 *   3. Training only — under severe stress, restrict to training playlists
 *
 * Each policy has its own toggle, trigger, and selected maps. Visual:
 * map thumbnails as tiles, click to toggle selection.
 */

type Policy = "ranked" | "block" | "training";

const policyConfig = {
  ranked: {
    label: "Ranked restriction",
    description: "Limit ranked queue to high-performance maps when stress is moderate",
    accent: "var(--color-warn)",
  },
  block: {
    label: "Hard block",
    description: "Block these maps entirely under high stress",
    accent: "var(--color-app-accent)",
  },
  training: {
    label: "Training-only mode",
    description: "Severe stress — restrict to training playlists",
    accent: "var(--color-calm)",
  },
} as const;

export default function MapsTab() {
  const [policies, setPolicies] = useState({
    ranked: {
      enabled: true,
      trigger: { metric: "calm" as const, threshold: 40 },
      mapIds: new Set(["refinery", "coastal", "pier", "yard"]),
    },
    block: {
      enabled: true,
      trigger: { metric: "calm" as const, threshold: 30 },
      mapIds: new Set(["pier", "harbor", "transit"]),
    },
    training: {
      enabled: false,
      trigger: { metric: "calm" as const, threshold: 20 },
      mapIds: new Set(["bunker", "highrise"]),
    },
  });

  const updateTrigger = (p: Policy, t: TriggerValue) => {
    setPolicies((s) => ({ ...s, [p]: { ...s[p], trigger: t } }));
  };
  const toggleEnabled = (p: Policy) => {
    setPolicies((s) => ({ ...s, [p]: { ...s[p], enabled: !s[p].enabled } }));
  };
  const toggleMap = (p: Policy, id: string) => {
    setPolicies((s) => {
      const next = new Set(s[p].mapIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...s, [p]: { ...s[p], mapIds: next } };
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] space-y-6">
      <div className="rounded-lg border p-5 flex items-start gap-4"
        style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden>
          <circle cx="10" cy="10" r="8" stroke="var(--color-app-accent)" strokeWidth="1.2" />
          <path d="M10 6 V11 M10 13 V14" stroke="var(--color-app-accent)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div className="text-xs text-fg-dim leading-relaxed">
          <span className="text-fg font-medium">Restriction is preference-based, not enforcement.</span>
          {" "}When triggered, BlitzMind hides restricted maps from your queue UI — you can still manually queue them. Tournament mode disables all restrictions.
        </div>
      </div>

      {(["ranked", "block", "training"] as const).map((p) => (
        <Panel
          key={p}
          title={
            <PolicyHeader
              label={policyConfig[p].label}
              accent={policyConfig[p].accent}
              enabled={policies[p].enabled}
              onToggle={() => toggleEnabled(p)}
            />
          }
          subtitle={policyConfig[p].description}
        >
          <div
            style={{
              opacity: policies[p].enabled ? 1 : 0.4,
              pointerEvents: policies[p].enabled ? "auto" : "none",
              transition: "opacity 200ms",
            }}
            className="space-y-5"
          >
            <TriggerConfig
              value={policies[p].trigger}
              onChange={(t) => updateTrigger(p, t)}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {maps.map((m) => (
                <MapTile
                  key={m.id}
                  map={m}
                  selected={policies[p].mapIds.has(m.id)}
                  onClick={() => toggleMap(p, m.id)}
                  accent={policyConfig[p].accent}
                />
              ))}
            </div>
            <div className="text-[10px] tabular-nums text-fg-mute uppercase tracking-[0.18em]">
              {policies[p].mapIds.size} map{policies[p].mapIds.size === 1 ? "" : "s"} selected
            </div>
          </div>
        </Panel>
      ))}

      <ResearchNote
        note={{
          source: "Survey",
          title: "Why preference over enforcement",
          body: "23 of 30 survey respondents said they would uninstall a product that hard-blocked them from playing what they wanted. We treat restrictions as friction, not walls — the map disappears from the queue UI but stays manually accessible. Reduces the cost of being wrong about a player's state.",
        }}
      />
    </div>
  );
}

function PolicyHeader({
  label,
  accent,
  enabled,
  onToggle,
}: {
  label: string;
  accent: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className="block w-1.5 h-1.5 rounded-full"
          style={{ background: accent }}
        />
        <span>{label}</span>
      </div>
      <button
        onClick={onToggle}
        className="relative w-9 h-5 rounded-full transition-colors"
        style={{
          background: enabled
            ? "var(--color-app-action)"
            : "var(--color-app-surface-3)",
        }}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: enabled ? "18px" : "2px" }}
        />
      </button>
    </div>
  );
}

function MapTile({
  map,
  selected,
  onClick,
  accent,
}: {
  map: typeof maps[number];
  selected: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded border p-3 text-left transition-all"
      style={{
        background: selected
          ? "var(--color-app-surface-2)"
          : "var(--color-app-surface)",
        borderColor: selected ? accent : "var(--color-app-line)",
      }}
    >
      {/* Stylized map preview */}
      <div
        className="aspect-[16/10] rounded mb-2 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-app-surface-3) 0%, var(--color-app-surface-2) 100%)",
        }}
      >
        <svg viewBox="0 0 100 60" className="w-full h-full" aria-hidden>
          {/* Random terrain shapes — same seed per map for consistency */}
          <rect x={5 + (map.name.length % 5)} y={10} width={20} height={15} fill="var(--color-app-line-strong)" />
          <rect x={35} y={5 + (map.name.length % 3)} width={25} height={20} fill="var(--color-app-line-strong)" />
          <rect x={70} y={15} width={20} height={12} fill="var(--color-app-line-strong)" />
          <rect x={10} y={35} width={30} height={15} fill="var(--color-app-line)" />
          <rect x={50} y={40} width={35} height={12} fill="var(--color-app-line)" />
          {selected && (
            <circle cx={50} cy={30} r={4} fill={accent} />
          )}
        </svg>
        {/* Selected checkmark badge */}
        {selected && (
          <div
            className="absolute top-1.5 right-1.5 w-4 h-4 rounded grid place-items-center text-[10px]"
            style={{ background: accent, color: "var(--color-app-bg)" }}
          >
            ✓
          </div>
        )}
      </div>
      <div className="text-sm text-fg font-medium truncate">{map.name}</div>
      <div className="text-[10px] text-fg-mute tabular-nums mt-0.5">
        {map.size} · {map.category.toUpperCase()}
      </div>
    </button>
  );
}

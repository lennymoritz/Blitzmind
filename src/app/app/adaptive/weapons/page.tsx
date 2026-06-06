"use client";

import { useState } from "react";
import { TriggerConfig, TriggerValue } from "../../_components/TriggerConfig";
import { ResearchNote } from "../../_components/ResearchNote";
import { Panel } from "../video/page";
import { weapons } from "../../_lib/mockData";

/**
 * Adaptive Control / Weapons.
 *
 * The user configures two weapon sets:
 *   - Primary: what they normally use (high-skill, high-recoil)
 *   - Stable: what they swap to when stress hits (forgiving weapons)
 *
 * When the trigger fires, the game auto-swaps loadouts. Player keeps
 * fighting; loadout changes silently.
 *
 * Interaction: each weapon card has a target-set toggle. Click to move
 * a weapon between Primary, Stable, or Off. Counts update live.
 */

type Slot = "primary" | "stable" | "off";

export default function WeaponsTab() {
  const [trigger, setTrigger] = useState<TriggerValue>({
    metric: "calm",
    threshold: 50,
  });

  // Initialize from the canonical default sets
  const [assignments, setAssignments] = useState<Record<string, Slot>>(() => {
    const init: Record<string, Slot> = {};
    weapons.forEach((w) => {
      init[w.id] =
        w.role === "primary"
          ? "primary"
          : w.role === "stable"
          ? "stable"
          : "off";
    });
    return init;
  });

  const cycle = (id: string) => {
    setAssignments((a) => {
      const order: Slot[] = ["off", "primary", "stable"];
      const next = order[(order.indexOf(a[id]) + 1) % order.length];
      return { ...a, [id]: next };
    });
  };

  const primaryCount = Object.values(assignments).filter((s) => s === "primary").length;
  const stableCount = Object.values(assignments).filter((s) => s === "stable").length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] space-y-6">
      <Panel title="Trigger" subtitle="When the swap fires">
        <TriggerConfig value={trigger} onChange={setTrigger} />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
        {/* PRIMARY SET */}
        <Panel
          title={`Primary loadout (${primaryCount})`}
          subtitle="What you use when you're dialed in"
        >
          <WeaponGrid
            weapons={weapons.filter((w) => assignments[w.id] === "primary")}
            onClick={cycle}
            slot="primary"
          />
        </Panel>

        {/* SWAP DIRECTION INDICATOR */}
        <div className="hidden lg:flex items-center justify-center px-2">
          <div className="text-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="mx-auto"
              aria-hidden
            >
              <path
                d="M8 14 H32 M24 6 L32 14 L24 22"
                stroke="var(--color-app-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 30 H8 M16 22 L8 30 L16 38"
                stroke="var(--color-fg-mute)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] font-mono">
              <div style={{ color: "var(--color-app-accent)" }}>Auto-swap</div>
              <div className="text-fg-mute mt-1">when triggered</div>
            </div>
          </div>
        </div>

        {/* STABLE SET */}
        <Panel
          title={`Stable loadout (${stableCount})`}
          subtitle="Lower recoil, forgiving spread, easier to control"
        >
          <WeaponGrid
            weapons={weapons.filter((w) => assignments[w.id] === "stable")}
            onClick={cycle}
            slot="stable"
          />
        </Panel>
      </div>

      {/* BENCH — weapons not in either set */}
      <Panel
        title="Bench"
        subtitle="Click any weapon to assign it. Cycles: bench → primary → stable → bench."
      >
        <WeaponGrid
          weapons={weapons.filter((w) => assignments[w.id] === "off")}
          onClick={cycle}
          slot="off"
        />
      </Panel>

      <ResearchNote
        note={{
          source: "Interview",
          title: "Why two sets, not one autopilot",
          body: "We initially designed full automation — the system would pick the optimal weapon. 4 of 5 interviewees rejected this as 'cheating myself out of the game.' The two-set design preserves player choice: they curate both sets, the system just swaps between configurations the player already endorsed.",
        }}
      />
    </div>
  );
}

function WeaponGrid({
  weapons: list,
  onClick,
  slot,
}: {
  weapons: ReadonlyArray<(typeof weapons)[number]>;
  onClick: (id: string) => void;
  slot: Slot;
}) {
  if (list.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-fg-mute font-mono">
        {slot === "off" ? "All weapons are assigned" : "No weapons assigned"}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {list.map((w) => (
        <button
          key={w.id}
          onClick={() => onClick(w.id)}
          className="text-left rounded border transition-all p-3 group"
          style={{
            background: "var(--color-app-surface-2)",
            borderColor: "var(--color-app-line)",
          }}
        >
          <WeaponSilhouette weaponClass={w.class} />
          <div className="mt-2">
            <div className="text-sm text-fg font-medium">{w.name}</div>
            <div className="text-[10px] text-fg-mute font-mono uppercase tracking-[0.15em]">
              {w.class}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
            <span className="text-fg-mute">ACC {w.accuracy}</span>
            <span
              className="px-1.5 py-0.5 rounded uppercase tracking-[0.15em]"
              style={{
                background: "var(--color-app-surface-3)",
                color:
                  w.recoil === "Low"
                    ? "var(--color-calm)"
                    : w.recoil === "Medium"
                    ? "var(--color-warn)"
                    : "var(--color-app-accent)",
              }}
            >
              {w.recoil} recoil
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function WeaponSilhouette({ weaponClass }: { weaponClass: string }) {
  // Simple stylized silhouette per weapon class — abstract, not photoreal
  const isAR = weaponClass.includes("Assault");
  const isSMG = weaponClass.includes("SMG");
  const isSniper = weaponClass.includes("Sniper") || weaponClass.includes("Marksman");
  const isShotgun = weaponClass.includes("Shotgun");
  const isPistol = weaponClass.includes("Sidearm");
  const isLMG = weaponClass.includes("LMG");

  return (
    <div className="h-12 flex items-center justify-center">
      <svg viewBox="0 0 100 40" className="w-full h-full" aria-hidden>
        {isAR && (
          <>
            <rect x="5" y="20" width="55" height="6" fill="var(--color-fg-dim)" />
            <rect x="38" y="14" width="8" height="6" fill="var(--color-fg-dim)" />
            <rect x="55" y="18" width="22" height="3" fill="var(--color-fg-dim)" />
            <rect x="20" y="26" width="6" height="8" fill="var(--color-fg-dim)" />
            <rect x="5" y="17" width="6" height="12" fill="var(--color-fg-dim)" />
          </>
        )}
        {isSMG && (
          <>
            <rect x="15" y="20" width="35" height="6" fill="var(--color-fg-dim)" />
            <rect x="48" y="18" width="14" height="3" fill="var(--color-fg-dim)" />
            <rect x="22" y="26" width="5" height="8" fill="var(--color-fg-dim)" />
            <rect x="15" y="13" width="20" height="7" fill="var(--color-fg-dim)" />
          </>
        )}
        {isSniper && (
          <>
            <rect x="5" y="20" width="70" height="4" fill="var(--color-fg-dim)" />
            <rect x="30" y="14" width="18" height="6" fill="var(--color-fg-dim)" />
            <circle cx="32" cy="17" r="2" fill="var(--color-app-surface)" />
            <circle cx="46" cy="17" r="2" fill="var(--color-app-surface)" />
            <rect x="20" y="24" width="6" height="8" fill="var(--color-fg-dim)" />
          </>
        )}
        {isShotgun && (
          <>
            <rect x="5" y="19" width="65" height="6" fill="var(--color-fg-dim)" />
            <rect x="50" y="17" width="20" height="2" fill="var(--color-fg-dim)" />
            <rect x="20" y="25" width="6" height="8" fill="var(--color-fg-dim)" />
            <rect x="10" y="14" width="14" height="6" fill="var(--color-fg-dim)" />
          </>
        )}
        {isPistol && (
          <>
            <rect x="30" y="18" width="30" height="5" fill="var(--color-fg-dim)" />
            <rect x="36" y="13" width="12" height="6" fill="var(--color-fg-dim)" />
            <rect x="32" y="23" width="5" height="9" fill="var(--color-fg-dim)" />
          </>
        )}
        {isLMG && (
          <>
            <rect x="5" y="20" width="60" height="6" fill="var(--color-fg-dim)" />
            <rect x="35" y="14" width="10" height="6" fill="var(--color-fg-dim)" />
            <rect x="60" y="18" width="16" height="3" fill="var(--color-fg-dim)" />
            <rect x="20" y="26" width="6" height="9" fill="var(--color-fg-dim)" />
            <ellipse cx="18" cy="25" rx="8" ry="5" fill="var(--color-fg-dim)" />
          </>
        )}
      </svg>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { AppHeader } from "../_components/AppHeader";
import { gameModes, maps, weapons } from "../_lib/mockData";

/**
 * Library — /app/library.
 *
 * Reference data the player can drill into. Three tabs:
 *   - Game Modes (8 modes, categorized)
 *   - Maps (8 maps with thumbnail + stats)
 *   - Weapons (10 weapons with class + recoil + accuracy)
 *
 * Useful destination during a match when the player wants to look up
 * a map's typical stress profile or a weapon's recoil class. Not
 * the centerpiece, but earns its place by giving the app structural
 * depth (without it, the navigation reads as too thin).
 */

type Tab = "modes" | "maps" | "weapons";

export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>("modes");

  return (
    <>
      <AppHeader
        eyebrow="Reference"
        title="Library"
        subtitle="Game modes, maps, weapons"
      />

      {/* Tab strip — we override the AppHeader tabs to use onClick instead of links */}
      <div
        className="px-8 -mt-px border-b"
        style={{
          background: "var(--color-app-bg)",
          borderColor: "var(--color-app-line)",
        }}
      >
        <LayoutGroup id="library-tabs">
          <div className="flex items-center gap-1">
            {(["modes", "maps", "weapons"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-3 py-2.5 text-sm -mb-px capitalize"
                style={{
                  color: tab === t ? "var(--color-fg)" : "var(--color-fg-dim)",
                  transition: "color 200ms ease",
                }}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="library-tab-underline"
                    className="absolute left-2 right-2 bottom-0 h-0.5"
                    style={{ background: "var(--color-app-accent)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px]">
        {tab === "modes" && <ModesView />}
        {tab === "maps" && <MapsView />}
        {tab === "weapons" && <WeaponsView />}
      </div>
    </>
  );
}

// ============================================================
// Modes view — categorized list
// ============================================================

function ModesView() {
  const categories = {
    core: { label: "Core multiplayer", description: "Standard team-based modes" },
    br: { label: "Battle royale", description: "Large-scale survival modes" },
    training: { label: "Training", description: "Practice & solo improvement" },
  };

  const grouped = (Object.keys(categories) as Array<keyof typeof categories>).map((key) => ({
    key,
    ...categories[key],
    modes: gameModes.filter((m) => m.category === key),
  }));

  return (
    <div className="space-y-10">
      {grouped.map((group) => (
        <section key={group.key}>
          <div className="mb-4">
            <h3 className="text-lg font-display font-medium tracking-tight">{group.label}</h3>
            <p className="text-xs text-fg-mute mt-0.5">{group.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {group.modes.map((mode) => (
              <div
                key={mode.id}
                className="rounded-lg border p-4 hover-lift transition-colors hover:bg-app-surface-2"
                style={{
                  background: "var(--color-app-surface)",
                  borderColor: "var(--color-app-line)",
                }}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span
                    className="text-base font-display tracking-tight"
                    style={{ color: "var(--color-fg)" }}
                  >
                    {mode.icon}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.18em] font-mono text-fg-mute">
                    {mode.players}
                  </span>
                </div>
                <div className="text-sm text-fg font-medium">{mode.name}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute mt-1">
                  {mode.category === "br"
                    ? "Battle royale"
                    : mode.category === "core"
                    ? "Core mode"
                    : "Training"}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ============================================================
// Maps view — gallery
// ============================================================

function MapsView() {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h3 className="text-lg font-display font-medium tracking-tight">All maps</h3>
          <p className="text-xs text-fg-mute mt-0.5">
            {maps.length} maps · sorted by play rate
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
          <div className="flex items-center gap-1.5">
            <span className="block w-2 h-2 rounded-full" style={{ background: "var(--color-app-accent)" }} />
            <span>BR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="block w-2 h-2 rounded-full" style={{ background: "var(--color-app-action)" }} />
            <span>Core</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {maps.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border overflow-hidden hover-lift"
            style={{
              background: "var(--color-app-surface)",
              borderColor: "var(--color-app-line)",
            }}
          >
            {/* Map preview */}
            <div
              className="aspect-[16/9] relative"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-app-surface-3) 0%, var(--color-app-surface-2) 100%)",
              }}
            >
              <svg viewBox="0 0 200 110" className="w-full h-full" aria-hidden>
                {/* Deterministic blocky terrain */}
                <rect x={10 + (m.name.length % 5)} y={15} width={40} height={25} fill="var(--color-app-line-strong)" />
                <rect x={60} y={10 + (m.name.length % 4)} width={50} height={35} fill="var(--color-app-line-strong)" />
                <rect x={120} y={20} width={45} height={28} fill="var(--color-app-line-strong)" />
                <rect x={20} y={60} width={60} height={30} fill="var(--color-app-line)" />
                <rect x={100} y={70} width={70} height={25} fill="var(--color-app-line)" />
                {/* Connectors */}
                <line x1={50} y1={40} x2={60} y2={40} stroke="var(--color-fg-mute)" strokeWidth="0.5" />
                <line x1={110} y1={45} x2={120} y2={40} stroke="var(--color-fg-mute)" strokeWidth="0.5" />
              </svg>
              {/* Category badge */}
              <div
                className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-[0.18em] font-mono"
                style={{
                  background:
                    m.category === "br"
                      ? "rgba(255, 51, 68, 0.2)"
                      : "rgba(74, 144, 255, 0.2)",
                  color:
                    m.category === "br"
                      ? "var(--color-app-accent)"
                      : "var(--color-app-action)",
                }}
              >
                {m.category}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-baseline justify-between">
                <div className="text-base text-fg font-medium">{m.name}</div>
                <div className="text-xs font-mono text-fg-mute">{m.size}</div>
              </div>
              <div
                className="mt-3 pt-3 border-t flex items-baseline justify-between text-xs"
                style={{ borderColor: "var(--color-app-line)" }}
              >
                <span className="text-fg-mute">Play rate</span>
                <span className="font-mono text-fg tabular-nums">{m.playRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Weapons view — grouped by class
// ============================================================

function WeaponsView() {
  // Group by class
  const byClass: Record<string, typeof weapons[number][]> = {};
  weapons.forEach((w) => {
    if (!byClass[w.class]) byClass[w.class] = [];
    byClass[w.class].push(w);
  });
  const classes = Object.keys(byClass);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-display font-medium tracking-tight">All weapons</h3>
        <p className="text-xs text-fg-mute mt-0.5">
          {weapons.length} weapons across {classes.length} classes
        </p>
      </div>

      {classes.map((cls) => (
        <section key={cls}>
          <h4 className="text-sm font-medium text-fg mb-3 flex items-baseline gap-2">
            <span>{cls}</span>
            <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute">
              {byClass[cls].length} weapons
            </span>
          </h4>
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--color-app-line)" }}
          >
            <div
              className="px-4 py-2.5 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute border-b"
              style={{
                background: "var(--color-app-surface)",
                borderColor: "var(--color-app-line)",
              }}
            >
              <span>Weapon</span>
              <span>Accuracy</span>
              <span>Recoil</span>
              <span className="text-right">Default role</span>
            </div>
            {byClass[cls].map((w, i) => (
              <div
                key={w.id}
                className="px-4 py-3 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center"
                style={{
                  background: "var(--color-app-surface)",
                  borderTop:
                    i === 0 ? "none" : "1px solid var(--color-app-line)",
                }}
              >
                <div className="text-sm text-fg font-medium">{w.name}</div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 rounded-full overflow-hidden flex-1 max-w-[80px]"
                    style={{ background: "var(--color-app-line)" }}
                  >
                    <div
                      className="h-full"
                      style={{
                        width: `${w.accuracy}%`,
                        background: "var(--color-fg)",
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-fg-dim tabular-nums w-6">
                    {w.accuracy}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded"
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
                    {w.recoil}
                  </span>
                </div>
                <div className="text-right text-xs font-mono text-fg-mute capitalize">
                  {w.role}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

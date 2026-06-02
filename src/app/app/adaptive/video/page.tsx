"use client";

import { useState } from "react";
import { TriggerConfig, TriggerValue } from "../../_components/TriggerConfig";
import { GameplayPreview, PreviewSettings } from "../../_components/GameplayPreview";
import { ResearchNote } from "../../_components/ResearchNote";

/**
 * Adaptive Control / Video.
 *
 * Three sections:
 *   1. Trigger — when does this adaptation fire?
 *   2. Visual Changes — what does the adaptation do? (brightness, color temp, focus mode)
 *   3. Overlays — which BlitzMind overlays show during gameplay?
 *
 * Right side: live gameplay preview that responds to every setting in
 * real-time. This is the "fire" moment of the entire app — the recruiter
 * drags the slider, the preview dims, they say "wait, what?"
 */

export default function VideoTab() {
  const [trigger, setTrigger] = useState<TriggerValue>({
    metric: "calm",
    threshold: 60,
  });

  const [settings, setSettings] = useState<PreviewSettings>({
    brightness: 60,
    colorTemperature: "neutral",
    focusMode: true,
    hrvOverlay: true,
    stressMinimalHud: true,
    criticalInfoHighlight: false,
  });

  const updateSetting = <K extends keyof PreviewSettings>(
    key: K,
    value: PreviewSettings[K]
  ) => setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div className="px-8 py-8 max-w-[1600px]">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-8">
        {/* ============ LEFT: configuration ============ */}
        <div className="space-y-6">
          {/* Trigger panel */}
          <Panel title="Trigger" subtitle="When this adaptation fires">
            <TriggerConfig value={trigger} onChange={setTrigger} />
          </Panel>

          {/* Visual changes */}
          <Panel
            title="Visual Changes"
            subtitle="Dim the screen, shift the palette, hide HUD elements"
          >
            {/* Brightness */}
            <Setting label="Brightness" hint={`${settings.brightness}%`}>
              <input
                type="range"
                min={20}
                max={100}
                value={settings.brightness}
                onChange={(e) =>
                  updateSetting("brightness", Number(e.target.value))
                }
                className="bm-range w-full"
              />
            </Setting>

            <Divider />

            {/* Color temperature */}
            <Setting
              label="Color Temperature"
              hint="Reduces eye strain during long sessions"
            >
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(
                  ["neutral", "softWarm", "eveningComfort", "reliefMode"] as const
                ).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => updateSetting("colorTemperature", tone)}
                    className="px-3 py-2 rounded text-xs transition-all border"
                    style={{
                      background:
                        settings.colorTemperature === tone
                          ? "var(--color-app-surface-3)"
                          : "var(--color-app-surface-2)",
                      borderColor:
                        settings.colorTemperature === tone
                          ? "var(--color-app-accent)"
                          : "var(--color-app-line-strong)",
                      color:
                        settings.colorTemperature === tone
                          ? "var(--color-fg)"
                          : "var(--color-fg-dim)",
                    }}
                  >
                    {{
                      neutral: "Neutral",
                      softWarm: "Soft Warm",
                      eveningComfort: "Evening",
                      reliefMode: "Relief",
                    }[tone]}
                  </button>
                ))}
              </div>
            </Setting>

            <Divider />

            {/* Focus mode */}
            <Setting label="Focus Mode" hint="Hide non-critical HUD when stress hits">
              <Toggle
                checked={settings.focusMode}
                onChange={(v) => updateSetting("focusMode", v)}
              />
            </Setting>

            <Divider />

            <Setting
              label="Critical Info Highlight"
              hint="Boost ammo, health, objective visibility"
            >
              <Toggle
                checked={settings.criticalInfoHighlight}
                onChange={(v) => updateSetting("criticalInfoHighlight", v)}
              />
            </Setting>
          </Panel>

          {/* Overlays */}
          <Panel
            title="Overlays"
            subtitle="BlitzMind-specific on-screen elements"
          >
            <Setting label="Real-time HRV display" hint="Slim rail, right edge">
              <Toggle
                checked={settings.hrvOverlay}
                onChange={(v) => updateSetting("hrvOverlay", v)}
              />
            </Setting>

            <Divider />

            <Setting
              label="Stress-triggered minimal HUD"
              hint="When stress spikes, kill feed and clutter fade"
            >
              <Toggle
                checked={settings.stressMinimalHud}
                onChange={(v) => updateSetting("stressMinimalHud", v)}
              />
            </Setting>
          </Panel>

          {/* Research note */}
          <div>
            <ResearchNote
              note={{
                source: "Testing",
                title: "Why brightness and not contrast",
                body: "In-school testing with 12 players showed brightness adjustment was felt more than contrast — players described it as 'the game getting calmer' rather than 'the game looking different.' Contrast adjustments triggered the suspicion that gameplay was being manipulated. Brightness shifts felt like an accessibility setting, not a competitive aid.",
              }}
            />
          </div>
        </div>

        {/* ============ RIGHT: live gameplay preview ============ */}
        <div className="xl:sticky xl:top-32 self-start">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm text-fg font-medium">Live preview</h3>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-fg-mute">
              Adjusts as you configure
            </span>
          </div>
          <GameplayPreview settings={settings} />
          <p className="mt-3 text-xs text-fg-mute leading-relaxed">
            What this looks like in-game when your physiology crosses the trigger threshold. Adjust any setting on the left — the preview responds instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Reusable layout atoms for all 5 adaptive sub-tabs
// ============================================================

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--color-app-surface)",
        borderColor: "var(--color-app-line)",
      }}
    >
      <header
        className="px-5 py-3.5 border-b"
        style={{ borderColor: "var(--color-app-line)" }}
      >
        <h3 className="text-sm font-medium text-fg">{title}</h3>
        {subtitle && (
          <p className="text-xs text-fg-mute mt-0.5">{subtitle}</p>
        )}
      </header>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </section>
  );
}

export function Setting({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-fg">{label}</div>
        {hint && <div className="text-xs text-fg-mute mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function Divider() {
  return (
    <div
      className="h-px -mx-5"
      style={{ background: "var(--color-app-line)" }}
    />
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors"
      style={{
        background: checked
          ? "var(--color-app-action)"
          : "var(--color-app-surface-3)",
      }}
      aria-checked={checked}
      role="switch"
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow"
        style={{ left: checked ? "18px" : "2px" }}
      />
    </button>
  );
}

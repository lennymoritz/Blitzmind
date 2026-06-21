"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppHeader, PrimaryButton, SecondaryButton } from "../_components/AppHeader";
import AdaptivePreviewLauncher from "./_components/AdaptivePreviewLauncher";

/**
 * Adaptive Control layout — shared header across all 5 sub-tabs.
 *
 * Routes:
 *   /app/adaptive          → redirects to /video (in page.tsx)
 *   /app/adaptive/video    → visual adaptations + overlays
 *   /app/adaptive/weapons  → adaptive loadout swap
 *   /app/adaptive/maps     → restrict ranked/maps under stress
 *   /app/adaptive/audio    → adaptive audio mixing
 *   /app/adaptive/controller → controller sensitivity/haptics
 *
 * Each sub-tab follows the same shape: trigger section + adaptation
 * settings + live preview. Layout owns the tab strip and Save button
 * so each sub-tab only worries about its own content.
 */

const tabs = [
  { href: "/app/adaptive/video", label: "Video" },
  { href: "/app/adaptive/audio", label: "Audio" },
  { href: "/app/adaptive/controller", label: "Device" },
  { href: "/app/adaptive/weapons", label: "Weapons" },
  { href: "/app/adaptive/maps", label: "Maps" },
];

export default function AdaptiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const handleSave = () => {
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  };

  return (
    <>
      <AppHeader
        eyebrow="Behavior configuration"
        title="Adaptive Control"
        subtitle="How BlitzMind adapts your game when your physiology shifts"
        actions={
          <>
            <AdaptivePreviewLauncher />
            <SecondaryButton>Reset</SecondaryButton>
            <PrimaryButton onClick={handleSave}>
              {savedAt ? "Saved ✓" : "Save changes"}
            </PrimaryButton>
          </>
        }
        tabs={tabs.map((t) => ({
          ...t,
          active: pathname === t.href || pathname?.startsWith(t.href + "/"),
        }))}
      />
      {children}
    </>
  );
}

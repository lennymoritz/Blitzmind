"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { profile } from "../_lib/mockData";

/**
 * Sidebar — primary navigation for the app.
 *
 * Desktop (lg+): fixed left, ~240px, always visible.
 * Mobile/tablet (<lg): collapses off-canvas. A fixed top bar exposes a
 * hamburger that slides the drawer in over a backdrop; the drawer closes on
 * navigation and on backdrop tap.
 *
 * Active route is highlighted with a shared-layout accent pill that slides
 * between items (Motion layoutId).
 */

const navItems = [
  { href: "/app/home", label: "Home", icon: HomeIcon, group: "main" },
  { href: "/app/live", label: "Live Match", icon: LiveIcon, group: "main" },
  { href: "/app/sessions", label: "Sessions", icon: SessionsIcon, group: "main" },
  { href: "/app/insights", label: "Insights", icon: InsightsIcon, group: "main" },
  { href: "/app/adaptive", label: "Adaptive Control", icon: AdaptIcon, group: "system" },
  { href: "/app/library", label: "Library", icon: LibraryIcon, group: "system" },
  { href: "/app/settings", label: "Settings", icon: SettingsIcon, group: "system" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 inset-x-0 h-14 z-40 flex items-center justify-between px-4 border-b backdrop-blur-md"
        style={{ background: "rgba(11,11,13,0.9)", borderColor: "var(--color-app-line)" }}
      >
        <Link href="/app/home" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded grid place-items-center font-display text-base font-medium"
            style={{ background: "var(--color-app-accent)", color: "var(--color-app-bg)" }}
          >
            B
          </div>
          <span className="font-display text-lg leading-none tracking-tight text-fg">BlitzMind</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 grid place-items-center rounded-md hover:bg-app-surface-2 transition-colors text-fg-dim"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M2 5 H16 M2 9 H16 M2 13 H16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[240px] z-50 border-r flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ background: "var(--color-app-surface)", borderColor: "var(--color-app-line)" }}
      >
        {/* Logo block */}
        <div className="h-16 px-5 flex items-center justify-between border-b" style={{ borderColor: "var(--color-app-line)" }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div
              className="w-7 h-7 rounded grid place-items-center font-display text-base font-medium"
              style={{ background: "var(--color-app-accent)", color: "var(--color-app-bg)" }}
            >
              B
            </div>
            <span className="font-display text-lg leading-none tracking-tight text-fg">BlitzMind</span>
          </Link>
          {/* Close (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden w-8 h-8 grid place-items-center rounded-md hover:bg-app-surface-2 transition-colors text-fg-mute"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
          <LayoutGroup id="sidebar-nav">
            {navItems
              .filter((i) => i.group === "main")
              .map((item) => (
                <NavLink key={item.href} item={item} active={pathname === item.href || pathname?.startsWith(item.href + "/")} />
              ))}

            <div className="my-4 mx-2 h-px" style={{ background: "var(--color-app-line)" }} />

            {navItems
              .filter((i) => i.group === "system")
              .map((item) => (
                <NavLink key={item.href} item={item} active={pathname === item.href || pathname?.startsWith(item.href + "/")} />
              ))}
          </LayoutGroup>
        </nav>

        {/* Footer — profile + live state */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "var(--color-app-line)" }}>
          <Link
            href="/app/settings"
            className="flex items-center gap-3 px-2 py-2 rounded-md transition-colors hover:bg-app-surface-2"
          >
            <div
              className="w-8 h-8 rounded-full grid place-items-center font-mono text-xs"
              style={{ background: "var(--color-app-surface-3)", color: "var(--color-fg-dim)" }}
            >
              HK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-fg truncate font-medium">{profile.handle}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
                <span className="text-[10px] text-fg-mute font-mono">Sensor live · 78 BPM</span>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="mt-3 px-2 py-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-mono text-fg-mute hover:text-fg-dim transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M6 2 L2 5 L6 8" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { href: string; label: string; icon: () => React.ReactNode };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group flex items-center gap-3 px-3 py-2 rounded-md relative"
      style={{ color: active ? "var(--color-fg)" : "var(--color-fg-dim)", transition: "color 200ms ease" }}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-md"
          style={{ background: "var(--color-app-surface-2)" }}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      {active && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r"
          style={{ background: "var(--color-app-accent)" }}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative w-4 h-4 grid place-items-center">
        <Icon />
      </span>
      <span className="relative text-sm tracking-tight">{item.label}</span>
    </Link>
  );
}

// Icons — tiny, stroke-only, 16x16 viewBox
function HomeIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 7 L8 2 L14 7 V13 H10 V9 H6 V13 H2 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>); }
function LiveIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /></svg>); }
function SessionsIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><rect x="2" y="3" width="12" height="3" stroke="currentColor" strokeWidth="1.2" /><rect x="2" y="7.5" width="12" height="3" stroke="currentColor" strokeWidth="1.2" /><rect x="2" y="12" width="12" height="2" stroke="currentColor" strokeWidth="1.2" /></svg>); }
function InsightsIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 13 L6 8 L9 11 L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" /><circle cx="14" cy="4" r="1" fill="currentColor" /></svg>); }
function AdaptIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" /><line x1="6" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="1.2" /><line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2" /><line x1="4" y1="6" x2="4" y2="10" stroke="currentColor" strokeWidth="1.2" /><line x1="12" y1="6" x2="12" y2="10" stroke="currentColor" strokeWidth="1.2" /></svg>); }
function LibraryIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><rect x="2" y="2" width="5" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="2" width="5" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.2" /></svg>); }
function SettingsIcon() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" /><path d="M8 1 L8 3 M8 13 L8 15 M1 8 L3 8 M13 8 L15 8 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M3 13 L4.5 11.5 M11.5 4.5 L13 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>); }

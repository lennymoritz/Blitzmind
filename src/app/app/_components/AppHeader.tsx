"use client";

/**
 * AppHeader — top bar that sits above every app screen content area.
 *
 * Contains: page title (left), optional subtitle, contextual actions (right).
 * Below the title row, optional tab strip for sub-navigation within a page
 * (used by Adaptive Control's 5 sub-tabs, Sessions detail view, etc).
 *
 * Motion: the red underline on the active tab uses Motion's layoutId so it
 * slides between tabs instead of jump-cutting. LayoutGroup is scoped per
 * AppHeader instance so multiple headers on a page wouldn't interfere
 * (though in practice we only render one).
 *
 * Designed as a slot-based component — each page passes title, optional
 * subtitle, optional actions, optional tabs.
 */

import Link from "next/link";
import { motion, LayoutGroup } from "motion/react";

export interface AppHeaderTab {
  href: string;
  label: string;
  active?: boolean;
}

export function AppHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  tabs,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tabs?: AppHeaderTab[];
}) {
  return (
    <div
      className="border-b sticky top-14 lg:top-0 z-30 backdrop-blur-md"
      style={{
        background: "rgba(8, 8, 10, 0.85)",
        borderColor: "var(--color-app-line)",
      }}
    >
      {/* Title row */}
      <div className="min-h-16 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-fg-mute mb-1">
              {eyebrow}
            </div>
          )}
          <div className="flex items-baseline gap-3">
            <h1
              className="font-display font-medium text-fg truncate"
              style={{
                fontSize: "clamp(22px, 2.4vw, 30px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <span className="text-xs text-fg-mute tabular-nums truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Tabs row — only renders if tabs provided */}
      {tabs && tabs.length > 0 && (
        <LayoutGroup id="app-header-tabs">
          <div className="px-4 sm:px-6 lg:px-8 flex items-center gap-1 -mb-px overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative px-3 py-2.5 text-sm"
                style={{
                  color: tab.active ? "var(--color-fg)" : "var(--color-fg-dim)",
                  transition: "color 200ms ease",
                }}
              >
                {tab.label}
                {tab.active && (
                  <motion.span
                    layoutId="header-tab-underline"
                    className="absolute left-2 right-2 bottom-0 h-0.5"
                    style={{ background: "var(--color-app-accent)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </LayoutGroup>
      )}
    </div>
  );
}

// ============================================================
// Common action buttons — used in headers
// ============================================================

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3.5 py-1.5 rounded text-sm font-medium transition-all disabled:opacity-50"
      style={{
        background: "var(--color-app-action)",
        color: "white",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--color-app-action-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--color-app-action)";
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded text-sm transition-colors border"
      style={{
        background: "transparent",
        color: "var(--color-fg-dim)",
        borderColor: "var(--color-app-line-strong)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-fg)";
        e.currentTarget.style.borderColor = "var(--color-fg-mute)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-fg-dim)";
        e.currentTarget.style.borderColor = "var(--color-app-line-strong)";
      }}
    >
      {children}
    </button>
  );
}

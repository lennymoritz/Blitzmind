"use client";

import Link from "next/link";
import { useState } from "react";
import { LiveValue } from "./LiveValue";

const links = [
  { href: "#problem", label: "Problem" },
  { href: "#system", label: "System" },
  { href: "#in-game", label: "In game" },
  { href: "#hardware", label: "Hardware" },
  { href: "#integrity", label: "Integrity" },
  { href: "#story", label: "Story" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line/60 backdrop-blur-md bg-bg/70">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-14 flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-lg tracking-tight leading-none"
        >
          BlitzMind<span className="text-accent">.</span>
        </Link>

        {/* Section anchors */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.14em] text-fg-dim">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative hover:text-fg transition-colors"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
            </a>
          ))}
          <a
            href="/onboarding"
            className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium text-white bg-accent overflow-hidden normal-case tracking-normal transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_20px_-4px_var(--color-accent)]"
          >
            <span className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative">Open app</span>
            <span className="relative transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Live BPM — the subtle "this page is measuring you" hint */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-fg-mute">
            <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
            <span className="font-mono">
              <LiveValue base={78} amplitude={3} intervalMs={1200} /> bpm
            </span>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 grid place-items-center rounded-md text-fg-dim hover:text-fg transition-colors"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M4 4 L14 14 M14 4 L4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 5 H16 M2 9 H16 M2 13 H16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="md:hidden border-t border-line/60 bg-bg/95 backdrop-blur-md px-6 py-4 flex flex-col">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-xs uppercase tracking-[0.16em] text-fg-dim hover:text-fg transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/onboarding"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-accent"
          >
            Open app →
          </a>
        </div>
      )}
    </header>
  );
}

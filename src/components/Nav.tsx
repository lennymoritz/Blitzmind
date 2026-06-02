"use client";

import Link from "next/link";
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
              className="hover:text-fg transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/onboarding"
            className="px-3 py-1.5 rounded border border-accent/40 text-accent hover:bg-accent/10 transition-colors normal-case tracking-normal"
          >
            Open app →
          </a>
        </nav>

        {/* Live BPM — the subtle "this page is measuring you" hint */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-fg-mute">
          <span className="block w-1.5 h-1.5 rounded-full bg-accent heartbeat" />
          <span className="font-mono">
            <LiveValue base={78} amplitude={3} intervalMs={1200} /> bpm
          </span>
        </div>
      </div>
    </header>
  );
}

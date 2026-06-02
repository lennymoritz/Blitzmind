"use client";

import { useState } from "react";

/**
 * ResearchNote — small footnote-style callout that surfaces *why* a
 * design decision was made. Pulls directly from the research insights
 * documented in the thesis (30 surveys, 5 interviews, in-school testing).
 *
 * Renders as a subtle marker by default; click to expand and read the note.
 * Designed to be unobtrusive — the recruiter who wants depth can find it,
 * the user who just wants to use the product never sees it.
 *
 * Each note has a "source" attribute citing where the insight came from
 * (Survey, Interview, Testing) which adds rigor.
 */

export interface ResearchNoteData {
  source: "Survey" | "Interview" | "Testing" | "Pivot";
  title: string;
  body: string;
}

export function ResearchNote({ note }: { note: ResearchNoteData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors"
        style={{
          color: open ? "var(--color-app-accent)" : "var(--color-fg-mute)",
        }}
        aria-expanded={open}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="0.8" />
          <text
            x="5"
            y="7.2"
            fontSize="5.5"
            fontFamily="var(--font-mono)"
            fill="currentColor"
            textAnchor="middle"
          >
            R
          </text>
        </svg>
        Research note
      </button>

      {open && (
        <div
          className="mt-2 p-3 rounded border max-w-md text-xs leading-relaxed"
          style={{
            background: "var(--color-app-surface)",
            borderColor: "var(--color-app-line)",
            color: "var(--color-fg-dim)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[9px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: "var(--color-app-surface-3)",
                color: "var(--color-fg-mute)",
              }}
            >
              {note.source}
            </span>
            <span className="text-[10px] font-mono text-fg-mute">
              n = source data
            </span>
          </div>
          <div className="text-fg text-xs mb-1.5 font-medium">{note.title}</div>
          <div>{note.body}</div>
        </div>
      )}
    </div>
  );
}

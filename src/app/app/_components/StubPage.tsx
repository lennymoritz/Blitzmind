"use client";

import { AppHeader } from "../_components/AppHeader";

/**
 * StubPage — honest placeholder for routes that will be built in
 * later sessions. Calls itself out explicitly. Renders inside the same
 * app shell so the navigation experience still works end-to-end.
 */
export function StubPage({
  title,
  eyebrow,
  description,
  comingIn,
}: {
  title: string;
  eyebrow: string;
  description: string;
  comingIn: string;
}) {
  return (
    <>
      <AppHeader eyebrow={eyebrow} title={title} />
      <div className="px-8 py-16 max-w-3xl">
        <div
          className="rounded-lg border p-12 text-center"
          style={{
            background: "var(--color-app-surface)",
            borderColor: "var(--color-app-line)",
          }}
        >
          <div className="text-[10px] uppercase tracking-[0.32em] font-mono text-fg-mute">
            {comingIn}
          </div>
          <h2 className="mt-6 text-2xl font-display tracking-tight text-fg">
            {title}
          </h2>
          <p className="mt-4 text-fg-dim text-sm leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";

/**
 * Onboarding layout — overrides the parent app layout to hide the sidebar.
 *
 * Onboarding is a full-screen flow because the user hasn't paired their
 * sensor yet, hasn't picked their game, hasn't calibrated baseline — so
 * showing the dashboard nav would let them escape into screens that
 * don't have data populated yet.
 *
 * The backdrop layers a faint blueprint grid, a top accent wash, and the
 * real controller render at very low opacity (masked to the edges so it
 * reads as atmosphere, not decoration). Content sits above it on its own
 * stacking context.
 *
 * Once onboarding finishes, they're routed to /app/home and the regular
 * app shell takes over.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ background: "var(--color-app-bg)" }}
    >
      {/* ===== Atmospheric backdrop ===== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(120% 100% at 50% 30%, #000 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(120% 100% at 50% 30%, #000 50%, transparent 100%)",
          }}
        />
        {/* top accent wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 50% -10%, rgba(255,51,68,0.10), transparent 55%)",
          }}
        />
        {/* controller render — low opacity watermark, masked + blurred */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[44%] w-[min(1100px,140vw)] aspect-[900/594] opacity-[0.07]"
          style={{
            maskImage:
              "radial-gradient(60% 60% at 50% 45%, #000 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 50% 45%, #000 30%, transparent 78%)",
            filter: "blur(1px)",
          }}
        >
          <Image
            src="/controller-front.png"
            alt=""
            fill
            sizes="100vw"
            className="object-contain mix-blend-screen"
            priority
          />
        </div>
        {/* bottom fade to seat content */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, var(--color-app-bg) 96%)",
          }}
        />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

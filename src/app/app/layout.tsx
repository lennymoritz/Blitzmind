import { AppSidebar } from "./_components/AppSidebar";

/**
 * App layout — wraps every /app/* route with the sidebar.
 *
 * Onboarding has its own layout (no sidebar — full-screen flow) so it
 * lives at /app/onboarding/* with its own layout.tsx override.
 *
 * Content area is offset by the sidebar width (240px) and lives in its
 * own scroll container so the sidebar stays fixed.
 *
 * Atmospheric backdrop: the marketing site's asterisk-burst motif lives
 * fixed behind every screen at 0.025 opacity + screen blend, so the
 * platform inherits the same brand surface without distracting from data.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--color-app-bg)" }}
    >
      {/* Asterisk burst — fixed, behind everything, very subtle. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden flex items-center justify-end pr-[-10vw]"
        style={{ mixBlendMode: "screen" }}
      >
        <svg
          viewBox="0 0 800 800"
          width="90vh"
          height="90vh"
          style={{ opacity: 0.025, transform: "translateX(20%)" }}
        >
          <g fill="#ffffff">
            {/* 8 elongated triangles radiating from center, marketing's signature burst */}
            <polygon points="400,400 380,40 420,40" />
            <polygon points="400,400 380,760 420,760" />
            <polygon points="400,400 40,380 40,420" />
            <polygon points="400,400 760,380 760,420" />
            <polygon points="400,400 146,118 174,90" />
            <polygon points="400,400 654,682 626,710" />
            <polygon points="400,400 682,146 710,174" />
            <polygon points="400,400 118,654 90,626" />
          </g>
        </svg>
      </div>

      <AppSidebar />
      <div className="lg:ml-[240px] min-h-screen pt-14 lg:pt-0 relative z-10">
        {children}
      </div>
    </div>
  );
}

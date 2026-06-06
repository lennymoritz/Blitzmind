import { AppSidebar } from "./_components/AppSidebar";

/**
 * App layout — wraps every /app/* route with the sidebar.
 *
 * Onboarding has its own layout (no sidebar — full-screen flow) so it
 * lives at /app/onboarding/* with its own layout.tsx override.
 *
 * Content area is offset by the sidebar width (240px) and lives in its
 * own scroll container so the sidebar stays fixed.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-app-bg)" }}
    >
      <AppSidebar />
      <div className="lg:ml-[240px] min-h-screen pt-14 lg:pt-0">{children}</div>
    </div>
  );
}

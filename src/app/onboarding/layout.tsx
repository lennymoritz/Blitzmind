/**
 * Onboarding layout — overrides the parent app layout to hide the sidebar.
 *
 * Onboarding is a full-screen flow because the user hasn't paired their
 * sensor yet, hasn't picked their game, hasn't calibrated baseline — so
 * showing the dashboard nav would let them escape into screens that
 * don't have data populated yet.
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
      {children}
    </div>
  );
}

const futureAreas = [
  "Orders and fulfillment",
  "Approval queues",
  "Receipt review",
  "Customer context",
  "Operational analytics",
] as const;

export default function WebDashboardPlaceholder() {
  return (
    <main className="dashboard-shell">
      <section className="placeholder-panel">
        <p className="eyebrow">app.neo.com</p>
        <h1>Neo Web Dashboard</h1>
        <p className="lede">Desktop operations workspace coming later.</p>
        <p>
          The current primary product remains the Expo mobile app for sellers
          and operators. This scaffold reserves the future web surface without
          duplicating mobile workflows or pretending backend features exist.
        </p>

        <div className="future-card">
          <h2>Future dashboard scope</h2>
          <ul>
            {futureAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>

        <div className="architecture-note">
          <h2>Auth boundary</h2>
          <p>
            Real dashboard routes should be protected with Clerk and should call
            Supabase Edge Functions through the approved API boundary. Do not
            put server secrets or direct database credentials in this app.
          </p>
        </div>
      </section>
    </main>
  );
}

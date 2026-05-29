import Link from "next/link";

const navItems = [
  "Features",
  "For Businesses",
  "Pricing",
  "About",
  "Resources",
] as const;

const trustNotes = [
  "No credit card required",
  "Set up in 3 minutes",
  "Cancel anytime",
] as const;

const metrics = [
  {
    detail: "NGN 184,250.00",
    label: "Pending receipts",
    tone: "success",
    value: "6",
  },
  {
    detail: "Need your reply",
    label: "Urgent chats",
    tone: "error",
    value: "4",
  },
  {
    detail: "Today",
    label: "Due follow-ups",
    tone: "warning",
    value: "7",
  },
] as const;

const queueItems = [
  {
    action: "Review receipt",
    badge: "1",
    detail: "Tunde · 2m ago",
    icon: "R",
    priority: "High priority",
    reason: "Check amount and bank alert before marking paid",
    status: "Transfer in",
    tone: "success",
    title: "Receipt needs review",
  },
  {
    action: "View inbox",
    badge: "4",
    detail: "4 customers · Oldest 12m ago",
    icon: "C",
    priority: "High priority",
    reason: "Customers waiting for your response",
    status: "Needs reply",
    tone: "info",
    title: "Urgent chats",
  },
  {
    action: "Open orders",
    badge: "3",
    detail: "3 orders · NGN 96,450.00",
    icon: "O",
    priority: "Medium",
    reason: "Send payment link or reminder",
    status: "Awaiting payment",
    tone: "warning",
    title: "Unpaid orders",
  },
  {
    action: "See follow-ups",
    badge: "7",
    detail: "7 customers",
    icon: "F",
    priority: "Medium",
    reason: "Reminders and status checks",
    status: "Due today",
    tone: "success",
    title: "Follow-ups due today",
  },
] as const;

const tabs = ["Today", "Inbox", "Approvals", "Follow-ups", "Settings"] as const;

const features = [
  {
    body: "Manage chats, customers, and orders without leaving WhatsApp.",
    icon: "WA",
    title: "WhatsApp at the core",
  },
  {
    body: "Get smart reply drafts, order summaries, and follow-up reminders.",
    icon: "AI",
    title: "AI that saves you time",
  },
  {
    body: "Orders, receipts, payments, customers, and follow-ups—all in one place.",
    icon: "BO",
    title: "Business, organized",
  },
  {
    body: "Your data is safe with enterprise-grade security and daily backups.",
    icon: "SR",
    title: "Secure & reliable",
  },
] as const;

function Header({ appUrl }: { appUrl: string }) {
  return (
    <header className="site-header">
      <Link aria-label="Neo home" className="brand" href="/">
        <span aria-hidden className="brand-mark">
          N
        </span>
        <span>Neo</span>
      </Link>

      <nav aria-label="Main navigation" className="main-nav">
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
            {item === "Resources" ? <span aria-hidden>⌄</span> : null}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a className="login-link" href={appUrl}>
          Log in
        </a>
        <a className="button button-primary button-small" href={appUrl}>
          Get started free
        </a>
      </div>
    </header>
  );
}

function HeroCopy({ appUrl }: { appUrl: string }) {
  return (
    <section aria-labelledby="hero-title" className="hero-copy">
      <div className="badge">
        <span aria-hidden className="badge-glyph" />
        <span>Built for WhatsApp. Powered by AI.</span>
      </div>

      <h1 id="hero-title">
        Run your business.
        <br />
        <span>Smarter</span>, not harder.
      </h1>

      <p className="hero-subtitle">
        Neo helps African small businesses manage customers, orders, payments,
        and follow-ups—all in one place. Save time. Stay organized. Grow with
        confidence.
      </p>

      <div className="hero-actions">
        <a className="button button-primary" href={appUrl}>
          Get started free <span aria-hidden>→</span>
        </a>
        <a className="button button-secondary" href="#features">
          <span aria-hidden className="play-icon">
            ▶
          </span>
          See how it works
        </a>
      </div>

      <ul className="trust-row" aria-label="Trust notes">
        {trustNotes.map((note) => (
          <li key={note}>
            <span aria-hidden>✓</span>
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetricCard({
  detail,
  label,
  tone,
  value,
}: (typeof metrics)[number]) {
  return (
    <div className="metric-card">
      <span aria-hidden className={`metric-icon tone-${tone}`}>
        {label.charAt(0)}
      </span>
      <strong>{value}</strong>
      <span>{label}</span>
      <small className={`tone-text-${tone}`}>{detail}</small>
    </div>
  );
}

function QueueCard({ item }: { item: (typeof queueItems)[number] }) {
  return (
    <article className="queue-card">
      <div className="queue-icon-wrap">
        <span aria-hidden className={`queue-icon tone-${item.tone}`}>
          {item.icon}
        </span>
        <span className="queue-count">{item.badge}</span>
      </div>

      <div className="queue-body">
        <div className="queue-title-row">
          <div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
          <span className="priority-pill">{item.priority}</span>
        </div>

        <div className="queue-action-row">
          <div>
            <span className={`status-pill tone-${item.tone}`}>{item.status}</span>
            <p>{item.reason}</p>
          </div>
          <span className="queue-button">{item.action}</span>
        </div>
      </div>
    </article>
  );
}

function DashboardPreview() {
  return (
    <div className="dashboard-preview" aria-label="Neo Today dashboard preview">
      <div className="dashboard-screen">
        <div className="dashboard-header">
          <div>
            <h2>Today</h2>
            <p>Good morning, Femi 👋</p>
          </div>
          <div className="dashboard-icons" aria-hidden>
            <span>!</span>
            <span>↻</span>
          </div>
        </div>

        <div className="status-chips">
          <span className="whatsapp-chip">WhatsApp connected</span>
          <span>Last synced 2m ago</span>
        </div>

        <div className="metric-strip">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="section-row">
          <h2>Priority queue</h2>
          <span>View all ›</span>
        </div>

        <div className="queue-list">
          {queueItems.map((item) => (
            <QueueCard item={item} key={item.title} />
          ))}
        </div>

        <article className="recommendation-card">
          <span aria-hidden className="recommendation-icon">
            AI
          </span>
          <div>
            <div className="recommendation-title">
              <h3>Neo recommendation</h3>
              <span>AI</span>
            </div>
            <p>
              3 paid receipts older than 24h have not been marked as paid.
              Reviewing now can keep your records clean.
            </p>
            <div className="recommendation-foot">
              <span>View suggestions ›</span>
              <small>You are in control</small>
            </div>
          </div>
        </article>

        <div className="tab-preview" aria-label="Mobile tab preview">
          {tabs.map((tab) => (
            <span className={tab === "Today" ? "active" : ""} key={tab}>
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingCards({ appUrl }: { appUrl: string }) {
  return (
    <aside className="floating-cards" aria-label="Neo assistant previews">
      <article className="floating-card ai-card">
        <div className="card-title-row">
          <h2>AI draft preview</h2>
          <span>Friendly</span>
        </div>
        <div className="message-preview">
          <p>
            “Good afternoon, ma. Thanks for reaching out. Your order is
            important to us and I’m happy to help. What exactly would you like
            to know?”
          </p>
          <small>11:35 AM</small>
        </div>
        <a className="button button-outline" href={appUrl}>
          Preview all drafts <span aria-hidden>◆</span>
        </a>
      </article>

      <article className="floating-card status-card">
        <span aria-hidden className="status-icon">
          WA
        </span>
        <div>
          <h2>WhatsApp status</h2>
          <p>
            <span aria-hidden />
            Connected
          </p>
        </div>
      </article>
    </aside>
  );
}

function HeroMockup({ appUrl }: { appUrl: string }) {
  return (
    <section className="hero-product" aria-label="Neo product preview">
      <DashboardPreview />
      <FloatingCards appUrl={appUrl} />
    </section>
  );
}

function FeatureStrip() {
  return (
    <section className="feature-strip" id="features" aria-labelledby="features-title">
      <h2 className="sr-only" id="features-title">
        Neo features
      </h2>
      {features.map((feature) => (
        <article className="feature-card" key={feature.title}>
          <span aria-hidden>{feature.icon}</span>
          <div>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function MarketingHome() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neo.com";

  return (
    <main>
      <Header appUrl={appUrl} />
      <section className="hero">
        <HeroCopy appUrl={appUrl} />
        <HeroMockup appUrl={appUrl} />
      </section>
      <FeatureStrip />
    </main>
  );
}

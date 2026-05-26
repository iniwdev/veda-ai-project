export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
          style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "rgba(99,102,241,0.1)" }}>
          Foundation Ready
        </div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          AI Assessment Creator
        </h1>
        <p className="text-lg max-w-md" style={{ color: "var(--muted-foreground)" }}>
          Production-grade monorepo foundation is set up. Ready to build.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { label: "Next.js 16", desc: "App Router + Turbopack" },
          { label: "Express 5", desc: "TypeScript + Health Check" },
          { label: "Docker", desc: "MongoDB + Redis" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border p-4 text-center space-y-1"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {item.label}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

// ─── Dashboard Route Layout ───────────────────────────────────────────────────
// This is a Server Component — it wraps all /dashboard/* routes
// with the fixed Sidebar + TopBar shell.

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

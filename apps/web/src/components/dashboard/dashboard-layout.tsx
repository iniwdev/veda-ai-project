import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

// ─── Dashboard Layout Shell ───────────────────────────────────────────────────
// This is the visual wrapper used by the App Router layout.tsx.
// Sidebar + TopBar are FIXED. Only children (content area) changes.

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F5F5F0] font-sans">
      {/* Fixed Sidebar — never re-mounts */}
      <Sidebar />

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Fixed TopBar */}
        <TopBar />

        {/* Dynamic content area — each view manages its own scroll */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

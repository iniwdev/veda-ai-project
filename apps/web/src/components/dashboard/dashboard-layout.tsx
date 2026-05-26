"use client";

import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { getSocket } from "@/lib/socket";
import { useAssignmentStore } from "@/store/assignment.store";
import { toast } from "sonner";

// ─── Dashboard Layout Shell ───────────────────────────────────────────────────
// This is the visual wrapper used by the App Router layout.tsx.
// Sidebar + TopBar are FIXED. Only children (content area) changes.

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const updateAssignmentStatus = useAssignmentStore((s) => s.updateAssignmentStatus);

  useEffect(() => {
    const socket = getSocket();

    const handleStarted = (data: { assignmentId: string }) => {
      updateAssignmentStatus(data.assignmentId, "processing");
    };

    const handleCompleted = (data: { assignmentId: string }) => {
      updateAssignmentStatus(data.assignmentId, "generated");
      toast.success("Assignment generated successfully!");
    };

    const handleFailed = (data: { assignmentId: string }) => {
      updateAssignmentStatus(data.assignmentId, "failed");
      toast.error("Assignment generation failed.");
    };

    socket.on("generation:started", handleStarted);
    socket.on("generation:completed", handleCompleted);
    socket.on("generation:failed", handleFailed);

    return () => {
      socket.off("generation:started", handleStarted);
      socket.off("generation:completed", handleCompleted);
      socket.off("generation:failed", handleFailed);
    };
  }, [updateAssignmentStatus]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fafafc] font-sans">
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

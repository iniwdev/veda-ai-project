"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/store/assignment.store";
import { EmptyState } from "@/components/assignments/empty-state";
import { AssignmentList } from "@/components/assignments/assignment-list";
import { CreateAssignment } from "@/components/assignments/create-assignment";

// ─── Assignments Page ─────────────────────────────────────────────────────────
// This is the ONLY place that decides which content to render.
// Sidebar + TopBar never re-mount — they live in the parent layout.

export default function AssignmentsPage() {
  const { view, fetchAssignments, isLoading } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (isLoading && view !== "create") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      {view === "empty" && <EmptyState />}
      {view === "list" && <AssignmentList />}
      {view === "create" && <CreateAssignment />}
    </>
  );
}

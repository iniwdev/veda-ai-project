"use client";

import { useAssignmentStore } from "@/store/assignment.store";
import { EmptyState } from "@/components/assignments/empty-state";
import { AssignmentList } from "@/components/assignments/assignment-list";
import { CreateAssignment } from "@/components/assignments/create-assignment";

// ─── Assignments Page ─────────────────────────────────────────────────────────
// This is the ONLY place that decides which content to render.
// Sidebar + TopBar never re-mount — they live in the parent layout.

export default function AssignmentsPage() {
  const view = useAssignmentStore((s) => s.view);

  return (
    <>
      {view === "empty" && <EmptyState />}
      {view === "list" && <AssignmentList />}
      {view === "create" && <CreateAssignment />}
    </>
  );
}

"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/store/assignment.store";
import { EmptyState } from "@/components/assignments/empty-state";
import { AssignmentList } from "@/components/assignments/assignment-list";
import { CreateAssignment } from "@/components/assignments/create-assignment";
import { GeneratedPaperView } from "@/components/generated-paper/generated-paper-view";

// ─── Assignments Page ─────────────────────────────────────────────────────────
// This is the ONLY place that decides which content to render.
// Sidebar + TopBar never re-mount — they live in the parent layout.

export default function AssignmentsPage() {
  const { assignments, view, selectedAssignmentId, fetchAssignments, isLoading } =
    useAssignmentStore();

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

  if (view === "create") return <CreateAssignment />;
  if (view === "view" && selectedAssignmentId)
    return <GeneratedPaperView assignmentId={selectedAssignmentId} />;

  if (assignments.length === 0) return <EmptyState />;

  return <AssignmentList />;
}

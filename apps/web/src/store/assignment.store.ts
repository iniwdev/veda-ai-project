"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Assignment, AssignmentView } from "@/types/assignment";

// ─── Seed Data ────────────────────────────────────────────────────────────────
// Toggle: empty array → shows EmptyState; populated → shows AssignmentList

const SEED_ASSIGNMENTS: Assignment[] = Array.from({ length: 8 }, (_, i) => ({
  id: `assignment-${i}`,
  title: "Quiz on Electricity",
  assignedOn: "20-06-2025",
  dueDate: i % 4 === 0 ? undefined : "21-06-2025",
}));

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AssignmentState {
  assignments: Assignment[];
  view: AssignmentView;
  searchQuery: string;

  // Actions
  setView: (view: AssignmentView) => void;
  setSearchQuery: (query: string) => void;
  deleteAssignment: (id: string) => void;
  navigateToCreate: () => void;
  cancelCreate: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAssignmentStore = create<AssignmentState>()(
  devtools(
    (set, get) => ({
      assignments: SEED_ASSIGNMENTS,
      // Derive initial view from seed data — no need to manually sync
      view: SEED_ASSIGNMENTS.length > 0 ? "list" : "empty",
      searchQuery: "",

      setView: (view) => set({ view }, false, "setView"),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, "setSearchQuery"),

      deleteAssignment: (id) =>
        set(
          (state) => {
            const next = state.assignments.filter((a) => a.id !== id);
            // Auto-transition to empty state when last assignment is deleted
            return {
              assignments: next,
              view: next.length === 0 ? "empty" : "list",
            };
          },
          false,
          "deleteAssignment",
        ),

      navigateToCreate: () => set({ view: "create" }, false, "navigateToCreate"),

      cancelCreate: () => {
        const { assignments } = get();
        set(
          { view: assignments.length > 0 ? "list" : "empty" },
          false,
          "cancelCreate",
        );
      },
    }),
    { name: "AssignmentStore" },
  ),
);

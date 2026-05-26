"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Assignment, AssignmentView } from "@/types/assignment";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";

import { apiClient } from "@/lib/api";
import type { ApiResponse } from "@repo/types";

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AssignmentState {
  assignments: Assignment[];
  view: AssignmentView;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Form Draft State
  createDraft: Partial<CreateAssignmentFormValues>;
  setCreateDraft: (draft: Partial<CreateAssignmentFormValues>) => void;
  clearCreateDraft: () => void;

  // Actions
  setView: (view: AssignmentView) => void;
  setSearchQuery: (query: string) => void;
  fetchAssignments: () => Promise<void>;
  addAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => Promise<void>;
  navigateToCreate: () => void;
  cancelCreate: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAssignmentStore = create<AssignmentState>()(
  devtools(
    (set, get) => ({
      assignments: [],
      view: "list", // Will be updated on fetch
      searchQuery: "",
      isLoading: false,
      error: null,
      createDraft: {},

      setCreateDraft: (draft) =>
        set((state) => ({ createDraft: { ...state.createDraft, ...draft } }), false, "setCreateDraft"),

      clearCreateDraft: () => set({ createDraft: {} }, false, "clearCreateDraft"),

      setView: (view) => set({ view }, false, "setView"),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, "setSearchQuery"),

      fetchAssignments: async () => {
        set({ isLoading: true, error: null }, false, "fetchAssignments/start");
        try {
          const res = await apiClient.get<ApiResponse<any[]>>("/assignments");
          const data = res.data || [];
          
          // Map backend format to frontend format
          const mappedAssignments: Assignment[] = data.map((item) => ({
            id: item._id,
            title: item.title,
            assignedOn: new Date(item.createdAt).toLocaleDateString("en-GB"),
            dueDate: item.dueDate,
          }));

          set(
            {
              assignments: mappedAssignments,
              view: mappedAssignments.length > 0 ? "list" : "empty",
              isLoading: false,
            },
            false,
            "fetchAssignments/success"
          );
        } catch (err: any) {
          set({ error: err.message, isLoading: false }, false, "fetchAssignments/error");
        }
      },

      addAssignment: (assignment) =>
        set(
          (state) => {
            const next = [assignment, ...state.assignments];
            return {
              assignments: next,
              view: "list",
            };
          },
          false,
          "addAssignment"
        ),

      deleteAssignment: async (id) => {
        // Optimistic delete
        const prevAssignments = get().assignments;
        
        set(
          (state) => {
            const next = state.assignments.filter((a) => a.id !== id);
            return {
              assignments: next,
              view: next.length === 0 ? "empty" : "list",
            };
          },
          false,
          "deleteAssignment/optimistic"
        );

        try {
          await apiClient.delete(`/assignments/${id}`);
        } catch (err) {
          // Revert on failure
          set({ assignments: prevAssignments, view: prevAssignments.length > 0 ? "list" : "empty" }, false, "deleteAssignment/revert");
          throw err;
        }
      },

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

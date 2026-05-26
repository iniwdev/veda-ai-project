"use client";

import { SlidersHorizontal, Search, X, Plus } from "lucide-react";
import { useAssignmentStore } from "@/store/assignment.store";
import { AssignmentCard } from "./assignment-card";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

// ─── Assignment List ──────────────────────────────────────────────────────────

export function AssignmentList() {
  const assignments = useAssignmentStore((s) => s.assignments);
  const searchQuery = useAssignmentStore((s) => s.searchQuery);
  const setSearchQuery = useAssignmentStore((s) => s.setSearchQuery);
  const deleteAssignment = useAssignmentStore((s) => s.deleteAssignment);
  const navigateToCreate = useAssignmentStore((s) => s.navigateToCreate);
  const setView = useAssignmentStore((s) => s.setView);
  const updateAssignmentStatus = useAssignmentStore((s) => s.updateAssignmentStatus);

  const handleGenerate = async (id: string) => {
    try {
      // Optimistically show processing state before the API call confirms
      updateAssignmentStatus(id, "processing");
      await apiClient.post(`/assignments/${id}/generate`, {});
      toast.success("Generation started");
    } catch (error: any) {
      // Revert optimistic update on failure
      updateAssignmentStatus(id, "failed");
      toast.error(error.message || "Failed to start generation");
    }
  };

  // Navigate to paper view where the PDF download button lives
  const handleDownload = (id: string) => {
    setView("view", id);
  };

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Panel with purple border glow — matches original design */}
      <div className="rounded-2xl border-2 border-[#7B5EA7] bg-[#FAFAFA] overflow-hidden shadow-[0_0_0_1px_rgba(123,94,167,0.15)]">
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h1 className="text-[15px] font-bold text-gray-900 leading-tight">
                Assignments
              </h1>
              <p className="text-[11.5px] text-gray-400 mt-0.5">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>

          {/* Filter + Search row */}
          <div className="flex items-center gap-3 mt-3">
            <button className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100">
              <SlidersHorizontal size={13} strokeWidth={2} />
              <span>Filter By</span>
            </button>

            <div className="flex-1 relative">
              <Search
                size={13}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Assignment"
                className="w-full pl-8 pr-3 py-2 text-[12.5px] bg-white border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#7B5EA7] focus:ring-1 focus:ring-[#7B5EA7]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onDelete={deleteAssignment}
              onView={(id) => setView("view", id)}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 py-16 text-center text-gray-400 text-[13px]">
              No assignments found.
            </div>
          )}
        </div>
      </div>

      {/* Floating Create Assignment button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={navigateToCreate}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white text-[13px] font-medium rounded-full px-5 py-3 shadow-lg transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-[#E8440A] flex items-center justify-center flex-shrink-0">
            <Plus size={11} strokeWidth={3} />
          </div>
          Create Assignment
        </button>
      </div>
    </div>
  );
}

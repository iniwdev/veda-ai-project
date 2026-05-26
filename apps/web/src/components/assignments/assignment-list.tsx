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
        <div className="flex-1 overflow-y-auto px-8 py-6 relative">
          <div className="max-w-[1200px] mx-auto w-full">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] flex-shrink-0" />
                <h1 className="text-[20px] font-extrabold text-gray-900 tracking-tight leading-tight">
                  Assignments
                </h1>
              </div>
              <p className="text-[13px] text-gray-400 font-medium ml-5">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>

          {/* Filter + Search row */}
          <div className="flex items-center gap-4 mb-8">
            <button className="flex items-center gap-2 text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors px-4 py-2 bg-transparent">
              <SlidersHorizontal size={16} strokeWidth={2.5} />
              <span>Filter By</span>
            </button>

            <div className="flex-1 max-w-[600px] relative">
              <div className="relative flex items-center">
                <Search
                  size={18}
                  strokeWidth={2.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Assignment"
                  className="w-full pl-12 pr-10 py-3 text-[14px] font-medium bg-white border border-gray-200 rounded-full text-gray-800 placeholder:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-32">
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
      </div>

      {/* Floating Create Assignment button */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafc] to-transparent pointer-events-none z-20" />
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={navigateToCreate}
          className="group flex items-center gap-3 bg-[#171717] hover:bg-black text-white text-[14px] font-semibold rounded-full px-6 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300"
        >
          <Plus
            size={18}
            strokeWidth={2.5}
            className="text-white group-hover:scale-110 transition-transform duration-300"
          />
          Create Assignment
        </button>
      </div>
    </div>
  );
}

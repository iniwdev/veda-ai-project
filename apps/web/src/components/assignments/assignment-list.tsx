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
    <div className="flex-1 overflow-y-auto px-6 py-8 relative">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] flex-shrink-0 animate-pulse" />
            <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Assignments
            </h1>
          </div>
          <p className="text-[15px] text-gray-500 font-medium ml-5">
            Manage and create assignments for your classes.
          </p>
        </div>

        {/* Filter + Search row */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 max-w-[480px] relative group">
            <div className="absolute inset-0 bg-gray-200/50 rounded-2xl blur-sm transition-all duration-300 group-hover:bg-gray-200/80" />
            <div className="relative flex items-center">
              <Search
                size={16}
                strokeWidth={2.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assignments..."
                className="w-full pl-11 pr-10 py-3.5 text-[14px] font-medium bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl text-gray-800 placeholder:text-gray-400 shadow-[0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-1"
                  aria-label="Clear search"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          <button className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <SlidersHorizontal size={16} strokeWidth={2} />
            <span>Filters</span>
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={navigateToCreate}
          className="group flex items-center gap-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white text-[15px] font-semibold rounded-full pl-2 pr-6 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)] hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Plus size={18} strokeWidth={2.5} className="text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          Create Assignment
        </button>
      </div>
    </div>
  );
}

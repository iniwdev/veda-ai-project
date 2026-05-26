"use client";

import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { Assignment } from "@/types/assignment";
import { useAssignmentStore } from "@/store/assignment.store";
import { apiClient } from "@/lib/api";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => Promise<void> | void;
  onView: (id: string) => void;
  onGenerate: (id: string) => void;
  onDownload?: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete, onView, onGenerate }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const status = assignment.status ?? "draft";
  const isGenerated = status === "generated";
  const isGenerating = status === "processing";
  const isFailed = status === "failed";

  const updateAssignmentStatus = useAssignmentStore((s) => s.updateAssignmentStatus);

  // Poll for status updates if this assignment is currently generating
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(async () => {
        try {
          const res = await apiClient.get<{ data: any; success: boolean }>(
            `/assignments/${assignment.id}`,
          );
          if (res.data?.status && res.data.status !== "processing") {
            updateAssignmentStatus(assignment.id, res.data.status);
          }
        } catch (error) {
          // Ignore polling errors
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, assignment.id, updateAssignmentStatus]);

  return (
    <div className="bg-white rounded-[20px] px-6 py-5 flex flex-col justify-between h-[144px] relative shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className="flex flex-col">
        {/* Header row: title + context menu */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[18px] font-bold text-gray-800 leading-tight tracking-tight">
            {assignment.title}
          </h3>

          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              aria-label="Assignment options"
            >
              <MoreVertical size={20} strokeWidth={2.5} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-2 min-w-[160px] overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                  <button
                    onClick={() => {
                      if (isGenerated) {
                        onView(assignment.id);
                      } else {
                        onGenerate(assignment.id);
                      }
                      setMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 text-[14px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors text-left"
                  >
                    {isGenerated ? "View Assignment" : "Generate Assignment"}
                  </button>

                  <button
                    onClick={() => {
                      onDelete(assignment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 text-[14px] font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="flex items-center gap-2 mt-2 h-6">
          {isGenerating && (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-[13px] font-semibold text-orange-600">Generating...</span>
            </>
          )}
          {isGenerated && (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
              <span className="text-[13px] font-semibold text-green-600">Generated</span>
            </>
          )}
          {isFailed && (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
              <span className="text-[13px] font-semibold text-red-600">Failed</span>
            </>
          )}
          {status === "draft" && (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300"></span>
              <span className="text-[13px] font-semibold text-gray-500">Draft</span>
            </>
          )}
        </div>
      </div>

      {/* Footer row: dates */}
      <div className="flex items-center justify-between text-[12px] mt-4 pt-4 border-t border-gray-50">
        <span className="text-gray-400 font-medium">
          <span className="text-gray-600 font-semibold">Assigned on :</span>{" "}
          {assignment.assignedOn || "20-06-2025"}
        </span>
        <span className="text-gray-400 font-medium">
          <span className="text-gray-600 font-semibold">Due :</span>{" "}
          {assignment.dueDate || "21-06-2025"}
        </span>
      </div>
    </div>
  );
}

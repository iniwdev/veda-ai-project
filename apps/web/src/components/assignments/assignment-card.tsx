"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import type { Assignment } from "@/types/assignment";

// ─── Assignment Card ──────────────────────────────────────────────────────────

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => Promise<void> | void;
  onView: (id: string) => void;
  onGenerate: (id: string) => void;
  onDownload?: (id: string) => void;
}

export function AssignmentCard({
  assignment,
  onDelete,
  onView,
  onGenerate,
}: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = assignment.status ?? "draft";
  const isGenerated = status === "generated";

  return (
    <div className="bg-white rounded-[20px] px-6 py-5 flex flex-col justify-between h-[116px] relative shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* Header row: title + context menu */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[18px] font-bold text-gray-800 leading-tight tracking-tight">
          {assignment.title}
        </h3>

        {/* ─── Context Menu ──────────────────────────────────────────────── */}
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
                  View Assignment
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

      {/* Footer row: dates */}
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-gray-500 font-medium">
          <span className="text-gray-800 font-bold">Assigned on :</span> {assignment.assignedOn || "20-06-2025"}
        </span>
        <span className="text-gray-500 font-medium">
          <span className="text-gray-800 font-bold">Due :</span> {assignment.dueDate || "21-06-2025"}
        </span>
      </div>
    </div>
  );
}

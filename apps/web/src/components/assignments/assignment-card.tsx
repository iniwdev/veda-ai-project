"use client";

import { useState } from "react";
import { Eye, Trash2, MoreVertical } from "lucide-react";
import type { Assignment } from "@/types/assignment";

// ─── Assignment Card ──────────────────────────────────────────────────────────

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete, onView }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-6 relative hover:shadow-sm transition-shadow">
      {/* Header row: title + context menu */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-semibold text-gray-800 leading-snug">
          {assignment.title}
        </h3>

        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Assignment options"
          >
            <MoreVertical size={15} strokeWidth={2} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />

              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-150 py-1 min-w-[148px] overflow-hidden">
                <button
                  onClick={() => {
                    onView(assignment.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Eye size={14} strokeWidth={1.8} />
                  View Assignment
                </button>
                <button
                  onClick={() => {
                    onDelete(assignment.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 size={14} strokeWidth={1.8} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer row: dates */}
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-600">Assigned on</span> :{" "}
          {assignment.assignedOn}
        </span>
        {assignment.dueDate && (
          <span className="text-gray-500">
            <span className="font-semibold text-gray-600">Due</span> :{" "}
            {assignment.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

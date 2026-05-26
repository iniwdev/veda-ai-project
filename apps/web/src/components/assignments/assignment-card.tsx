"use client";

import { useState } from "react";
import {
  Eye,
  Trash2,
  MoreVertical,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Download,
  Zap,
} from "lucide-react";
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
  onDownload,
}: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = assignment.status ?? "draft";
  const isGenerated = status === "generated";
  const isProcessing = status === "processing";
  const isDraftOrFailed = status === "draft" || status === "failed";

  return (
    <div className="group bg-white rounded-[24px] border border-gray-100 p-6 flex flex-col gap-5 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
      {/* Header row: title + context menu */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="text-[17px] font-bold text-gray-900 leading-snug truncate group-hover:text-orange-600 transition-colors duration-200">
            {assignment.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {isProcessing && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <Loader2 size={12} className="animate-spin" /> Processing…
              </span>
            )}
            {isGenerated && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <CheckCircle2 size={12} /> Generated
              </span>
            )}
            {status === "failed" && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                <AlertCircle size={12} /> Failed
              </span>
            )}
            {status === "draft" && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                <FileEdit size={12} /> Draft
              </span>
            )}
          </div>
        </div>

        {/* ─── Context Menu ──────────────────────────────────────────────── */}
        <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shadow-sm bg-white border border-gray-100"
              aria-label="Assignment options"
            >
              <MoreVertical size={16} strokeWidth={2} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 py-1.5 min-w-[180px] overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                {/* View — always visible, disabled until generated */}
                <button
                  onClick={() => {
                    if (!isGenerated) return;
                    onView(assignment.id);
                    setMenuOpen(false);
                  }}
                  disabled={!isGenerated}
                  title={!isGenerated ? "Generate the paper first" : "View generated paper"}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Eye size={16} strokeWidth={1.8} />
                  View Paper
                </button>

                {/* Download PDF — only when generated */}
                {isGenerated && onDownload && (
                  <button
                    onClick={() => {
                      onDownload(assignment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download size={16} strokeWidth={1.8} />
                    Download PDF
                  </button>
                )}

                {/* Generate — only for draft or failed */}
                {isDraftOrFailed && (
                  <button
                    onClick={() => {
                      onGenerate(assignment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-semibold text-orange-600 hover:bg-orange-50 transition-colors text-left"
                  >
                    <Zap size={16} strokeWidth={1.8} />
                    Generate Paper
                  </button>
                )}

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      onDelete(assignment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Inline Action Row (prominent, status-driven) ─────────────────── */}
      <div className="flex items-center gap-3">
        {/* Processing: show spinner message, no action */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-[13px] text-amber-600 font-medium">
            <Loader2 size={14} className="animate-spin flex-shrink-0" />
            Generating paper...
          </div>
        )}

        {/* Generated: View + Download buttons */}
        {isGenerated && (
          <>
            <button
              onClick={() => onView(assignment.id)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all duration-300 w-auto"
            >
              <Eye size={14} strokeWidth={2.5} />
              View Paper
            </button>
          </>
        )}

        {/* Draft or Failed: generate CTA */}
        {isDraftOrFailed && (
          <button
            onClick={() => onGenerate(assignment.id)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-semibold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 w-auto"
          >
            <Zap size={14} strokeWidth={2.5} className="text-orange-400" />
            {status === "failed" ? "Retry Generation" : "Generate Paper"}
          </button>
        )}
      </div>

      {/* Footer row: dates */}
      <div className="flex items-center justify-between text-[12px] border-t border-gray-100 pt-4 mt-2">
        <span className="text-gray-400 font-medium">
          <span className="text-gray-500">Assigned on</span> {assignment.assignedOn}
        </span>
        {assignment.dueDate && (
          <span className="text-gray-400 font-medium">
            <span className="text-gray-500">Due</span> {assignment.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

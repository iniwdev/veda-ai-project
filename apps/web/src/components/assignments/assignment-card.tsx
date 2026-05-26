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
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4 relative hover:shadow-sm transition-shadow">
      {/* Header row: title + context menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-gray-800 leading-snug truncate">
            {assignment.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            {isProcessing && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Loader2 size={10} className="animate-spin" /> Processing…
              </span>
            )}
            {isGenerated && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 size={10} /> Generated
              </span>
            )}
            {status === "failed" && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                <AlertCircle size={10} /> Failed
              </span>
            )}
            {status === "draft" && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                <FileEdit size={10} /> Draft
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
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Assignment options"
          >
            <MoreVertical size={15} strokeWidth={2} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px] overflow-hidden">
                {/* View — always visible, disabled until generated */}
                <button
                  onClick={() => {
                    if (!isGenerated) return;
                    onView(assignment.id);
                    setMenuOpen(false);
                  }}
                  disabled={!isGenerated}
                  title={!isGenerated ? "Generate the paper first" : "View generated paper"}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Eye size={14} strokeWidth={1.8} />
                  View Paper
                </button>

                {/* Download PDF — only when generated */}
                {isGenerated && onDownload && (
                  <button
                    onClick={() => {
                      onDownload(assignment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download size={14} strokeWidth={1.8} />
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
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#7B5EA7] hover:bg-[#7B5EA7]/5 transition-colors text-left font-medium"
                  >
                    <Zap size={14} strokeWidth={1.8} />
                    Generate Paper
                  </button>
                )}

                <div className="border-t border-gray-50 mt-1 pt-1">
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Inline Action Row (prominent, status-driven) ─────────────────── */}
      <div className="flex items-center gap-2">
        {/* Processing: show spinner message, no action */}
        {isProcessing && (
          <div className="flex items-center gap-1.5 text-[12px] text-amber-600 font-medium">
            <Loader2 size={12} className="animate-spin flex-shrink-0" />
            AI is generating your paper…
          </div>
        )}

        {/* Generated: View + Download buttons */}
        {isGenerated && (
          <>
            <button
              onClick={() => onView(assignment.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-semibold rounded-lg transition-colors"
            >
              <Eye size={12} strokeWidth={2} />
              View Paper
            </button>
          </>
        )}

        {/* Draft or Failed: generate CTA */}
        {isDraftOrFailed && (
          <button
            onClick={() => onGenerate(assignment.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7B5EA7] hover:bg-[#6A4D96] text-white text-[11.5px] font-semibold rounded-lg transition-colors"
          >
            <Zap size={12} strokeWidth={2} />
            {status === "failed" ? "Retry Generation" : "Generate Paper"}
          </button>
        )}
      </div>

      {/* Footer row: dates */}
      <div className="flex items-center justify-between text-[11.5px] border-t border-gray-50 pt-3 -mt-1">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-600">Assigned on</span>{" "}
          {assignment.assignedOn}
        </span>
        {assignment.dueDate && (
          <span className="text-gray-500">
            <span className="font-semibold text-gray-600">Due</span>{" "}
            {assignment.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

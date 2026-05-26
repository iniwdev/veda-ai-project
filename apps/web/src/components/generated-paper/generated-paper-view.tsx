"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Share } from "lucide-react";
import { useAssignmentStore } from "@/store/assignment.store";
import { apiClient } from "@/lib/api";
import { PaperSection } from "./paper-section";
import { ExportPdfButton } from "../pdf/export-pdf-button";
import type { ApiResponse } from "@repo/types";

interface GeneratedPaperViewProps {
  assignmentId: string;
}

export function GeneratedPaperView({ assignmentId }: GeneratedPaperViewProps) {
  const { assignments, setView } = useAssignmentStore();
  const [paper, setPaper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const assignment = assignments.find((a) => a.id === assignmentId);

  useEffect(() => {
    async function fetchPaper() {
      try {
        const res = await apiClient.get<ApiResponse<any>>(`/assignments/${assignmentId}/paper`);
        setPaper(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load paper");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPaper();
  }, [assignmentId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
        <p className="text-[13px] text-gray-500 font-medium">Loading assessment paper...</p>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
        <p className="text-[14px] text-red-500 font-medium">{error || "Paper not found"}</p>
        <button
          onClick={() => setView("list")}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-[13px] font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Calculate continuous question indexing across sections
  let currentQuestionIndex = 1;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F5F0]">
      {/* Top action bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("list")}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">
              {assignment?.title || "Assessment Paper"}
            </h1>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Generated Successfully
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[12.5px] font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Share size={14} />
            Share
          </button>
          <ExportPdfButton assignment={assignment} paper={paper} />
        </div>
      </div>

      {/* Paper rendering area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-[800px] mx-auto bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[1056px] px-10 py-12">
          
          {/* Paper Header / Student Info */}
          <div className="border-b-4 border-gray-900 pb-6 mb-8 text-center">
            <h1 className="text-[24px] font-black text-gray-900 uppercase tracking-widest">
              {assignment?.title || "Assessment"}
            </h1>
            <div className="flex items-center justify-center gap-6 mt-3 text-[13px] font-medium text-gray-600">
              <p>Total Marks: ________</p>
              <p>Time Allowed: ________</p>
            </div>
            
            <div className="flex items-center justify-between mt-8 text-[13px] font-semibold text-gray-800 border-t border-gray-200 pt-6 text-left">
              <div className="flex items-end gap-2">
                <span>Student Name:</span>
                <div className="border-b border-gray-400 w-48"></div>
              </div>
              <div className="flex items-end gap-2">
                <span>Date:</span>
                <div className="border-b border-gray-400 w-32"></div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8">
            {paper.sections.map((section: any, idx: number) => {
              const startIndex = currentQuestionIndex;
              currentQuestionIndex += section.questions.length;
              
              return (
                <PaperSection
                  key={idx}
                  sectionIndex={idx}
                  title={section.title}
                  instruction={section.instruction}
                  questions={section.questions}
                  startIndex={startIndex}
                />
              );
            })}
          </div>

          {/* End of paper indicator */}
          <div className="mt-16 text-center text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            — End of Paper —
          </div>
        </div>
      </div>
    </div>
  );
}

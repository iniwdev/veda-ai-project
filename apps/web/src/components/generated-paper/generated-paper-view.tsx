import { useEffect, useState, useMemo, useRef } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useAssignmentStore } from "@/store/assignment.store";
import { apiClient } from "@/lib/api";
import { PaperSection } from "./paper-section";
import { ExportPdfButton } from "../pdf/export-pdf-button";
import type { ApiResponse } from "@repo/types";

interface GeneratedPaperViewProps {
  assignmentId: string;
}

// Normalized Metadata Object
interface PaperMeta {
  schoolName: string;
  examTitle: string;
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
}

export function GeneratedPaperView({ assignmentId }: GeneratedPaperViewProps) {
  const { assignments, setView } = useAssignmentStore();
  const [paper, setPaper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const paperRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: paperRef,
    documentTitle: "Question_Paper",
  });

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

  const { flatQuestions, paperMeta } = useMemo(() => {
    let qIndex = 1;
    const flat: Array<{ qNum: number; answer: string; solution: string }> = [];
    let calculatedMarks = 0;

    if (paper?.sections) {
      paper.sections.forEach((section: any) => {
        section.questions.forEach((q: any) => {
          calculatedMarks += q.marks || 0;
          flat.push({
            qNum: qIndex++,
            answer: q.answer,
            solution: q.solution,
          });
        });
      });
    }

    // Single Normalized Metadata Object
    const meta = paper?.metadata || {};
    const normalizedMeta: PaperMeta = {
      schoolName: meta.schoolName || "DELHI PUBLIC SCHOOL",
      examTitle: meta.examTitle || "HALF YEARLY EXAMINATION",
      subject: meta.subject || "General",
      className: meta.className || "VIII",
      timeAllowed: meta.timeAllowed || "2 Hours",
      totalMarks: calculatedMarks > 0 ? calculatedMarks : (meta.totalMarks || assignment?.totalMarks || 100),
    };

    return { flatQuestions: flat, paperMeta: normalizedMeta };
  }, [paper, assignment]);

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

  let currentQuestionIndex = 1;

  // Header Builder
  const buildExamHeader = (meta: PaperMeta) => (
    <div className="border-b-[1px] border-black pb-2 mb-3 text-center print:border-b-2">
      <h1 className="text-[16px] font-bold text-black uppercase tracking-wider mb-0.5 print:text-[18px]">
        {meta.schoolName}
      </h1>
      <h2 className="text-[14px] font-bold text-black uppercase mb-2 print:text-[15px]">
        {meta.examTitle}
      </h2>
      <div className="flex justify-between items-center text-[12px] font-bold text-black mb-1 px-4 print:px-0">
        <p>Subject: {meta.subject}</p>
        <p>Class: {meta.className.toUpperCase().startsWith("CLASS") ? meta.className : `Class ${meta.className}`}</p>
      </div>
      <div className="flex justify-between items-center text-[12px] font-bold text-black px-4 print:px-0">
        <p>Time Allowed: {meta.timeAllowed}</p>
        <p>Maximum Marks: {meta.totalMarks}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      {/* Top action bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10 flex-shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("list")}
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-[14px] font-bold text-gray-900 leading-tight">
              {assignment?.title || "Assessment Paper"}
            </h1>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Generated
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePrint()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-medium rounded hover:bg-gray-50 transition-colors"
          >
            <Printer size={14} />
            Print
          </button>
          <ExportPdfButton assignment={assignment} />
        </div>
      </div>

      {/* Paper rendering area (Ultra-Compact Print-First Design) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 font-serif print:p-0 print:overflow-visible">
        <div id="question-paper" ref={paperRef} className="max-w-[794px] mx-auto bg-white min-h-[1123px] px-8 py-10 shadow-sm border border-gray-300 print:shadow-none print:border-none print:max-w-none print:mx-0 print:px-6 print:py-6">
          
          {buildExamHeader(paperMeta)}
          
          {/* Instructions & Student Info (Compact) */}
          <div className="mb-4 text-black">
            <div className="border border-black p-1.5 mb-2 bg-gray-50/30 print:bg-transparent">
              <ul className="list-none text-[10.5px] space-y-0.5 ml-1">
                <li><strong>General Instructions:</strong> All questions are compulsory. Read carefully. {assignment?.instructions}</li>
              </ul>
            </div>

            <div className="flex items-center justify-between text-[11px] px-2 mt-2">
              <div className="flex items-end gap-1">
                <span className="font-semibold">Name:</span>
                <div className="border-b border-black w-40"></div>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-semibold">Roll No:</span>
                <div className="border-b border-black w-20"></div>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-semibold">Section:</span>
                <div className="border-b border-black w-16"></div>
              </div>
            </div>
          </div>

          {/* Sections (Minimalist) */}
          <div className="flex flex-col gap-3">
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

          <div className="mt-4 text-center text-[10px] font-bold text-black uppercase tracking-widest">
            — End of Paper —
          </div>

          {/* Answer Key Section */}
          <div className="mt-8 pt-4 border-t-2 border-black print:break-before-page">
            <h2 className="text-[14px] font-bold text-black uppercase text-center mb-3">
              ANSWER KEY & SOLUTIONS
            </h2>
            
            <div className="space-y-2">
              {flatQuestions.map((fq) => (
                <div key={fq.qNum} className="border-b border-gray-300 pb-2 last:border-0 text-black">
                  <h3 className="text-[12px] font-bold mb-0.5">Q{fq.qNum}.</h3>
                  <div className="mb-1">
                    <span className="text-[11px] font-bold text-gray-700">Answer: </span>
                    <span className="text-[11px]">{fq.answer}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-700">Solution: </span>
                    <span className="text-[11px]">{fq.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

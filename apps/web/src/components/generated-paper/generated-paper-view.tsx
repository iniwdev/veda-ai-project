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

  // Generate a flat list of questions for the answer key
  let currentQuestionIndex = 1;
  const flatQuestions: Array<{ qNum: number; answer: string; solution: string }> = [];

  paper.sections.forEach((section: any) => {
    section.questions.forEach((q: any) => {
      flatQuestions.push({
        qNum: currentQuestionIndex++,
        answer: q.answer,
        solution: q.solution,
      });
    });
  });

  // Reset for actual rendering
  currentQuestionIndex = 1;

  // Attempt to parse metadata from AI generated paper
  const meta = paper?.metadata || {};
  const schoolName = meta.schoolName || "Delhi Public School";
  const subjectName = meta.subject || "General";
  const className = meta.className || "Class 10";
  const examTitle = meta.examTitle || "Question Paper";
  const timeAllowed = meta.timeAllowed || "2 Hours";
  const totalMarks = meta.totalMarks || assignment?.totalMarks || 100;

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
      <div className="flex-1 overflow-y-auto p-2 md:p-4 font-serif">
        <div className="max-w-[800px] mx-auto bg-white shadow-sm border border-gray-300 min-h-[1056px] px-6 py-8">
          
          {/* Professional Exam Header */}
          <div className="border-b-[1.5px] border-gray-900 pb-3 mb-4 text-center">
            <h1 className="text-[18px] font-bold text-gray-900 uppercase tracking-wide mb-1">
              {schoolName}
            </h1>
            <h2 className="text-[15px] font-bold text-gray-800 uppercase">
              {examTitle}
            </h2>
            <h3 className="text-[13px] font-semibold text-gray-800 mt-0.5">
              Subject: {subjectName} &nbsp;|&nbsp; {className.toUpperCase().startsWith("CLASS") ? className : `Class ${className}`}
            </h3>

            <div className="flex items-center justify-between mt-3 text-[12px] font-bold text-gray-800 px-2">
              <p>Time: {timeAllowed}</p>
              <p>Maximum Marks: {totalMarks}</p>
            </div>
            
            <div className="mt-3 text-left border border-gray-300 p-2 bg-gray-50/50">
              <ul className="list-disc list-inside text-[11px] text-gray-900 space-y-0.5 ml-1">
                <li>All questions are compulsory.</li>
                <li>Read all questions carefully before answering.</li>
              </ul>
            </div>

            <div className="mt-3 text-left">
              <div className="flex items-center justify-between text-[12px] text-gray-900">
                <div className="flex items-end gap-1">
                  <span className="font-semibold">Name:</span>
                  <div className="border-b border-gray-500 w-40"></div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-semibold">Roll No:</span>
                  <div className="border-b border-gray-500 w-20"></div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-semibold">Section:</span>
                  <div className="border-b border-gray-500 w-16"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-4">
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

          <div className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase">
            — End of Paper —
          </div>

          {/* Answer Key Section (Page Break ideally in print) */}
          <div className="mt-8 border-t-[1.5px] border-gray-900 pt-6 print:break-before-page">
            <h2 className="text-[16px] font-bold text-gray-900 uppercase text-center mb-4">
              ANSWER KEY & SOLUTIONS
            </h2>
            
            <div className="space-y-3">
              {flatQuestions.map((fq) => (
                <div key={fq.qNum} className="border-b border-gray-200 pb-3 last:border-0">
                  <h3 className="text-[13px] font-bold text-gray-900 mb-1">Question {fq.qNum}</h3>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded p-1.5 mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">Correct Answer:</span>
                    <span className="text-[12px] text-gray-900">{fq.answer}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
                    <span className="text-[11px] font-bold text-gray-700 block mb-0.5">Solution / Explanation:</span>
                    <span className="text-[12px] text-gray-800 leading-snug whitespace-pre-wrap">{fq.solution}</span>
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

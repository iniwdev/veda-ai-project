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

  // Derive some placeholder metadata for the academic look if not present
  const totalMarks = assignment?.totalMarks || 100;
  // A rough heuristic: 1 mark = ~1.5 minutes
  const timeAllowed = Math.round(totalMarks * 1.5); 

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
      <div className="flex-1 overflow-y-auto p-6 md:p-10 font-serif">
        <div className="max-w-[850px] mx-auto bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 min-h-[1056px] px-12 py-16">
          
          {/* Professional Exam Header */}
          <div className="border-b-[3px] border-gray-900 pb-6 mb-8 text-center">
            <h1 className="text-[22px] font-bold text-gray-900 uppercase tracking-widest mb-1">
              Delhi Public School, Sector-4, Bokaro
            </h1>
            <h2 className="text-[18px] font-bold text-gray-800">
              Subject: {assignment?.title || "Assessment"}
            </h2>
            <h3 className="text-[15px] font-medium text-gray-700 mt-1">Class: 8</h3>

            <div className="flex items-center justify-between mt-6 text-[14px] font-bold text-gray-800">
              <p>Time Allowed: {timeAllowed} Minutes</p>
              <p>Maximum Marks: {totalMarks}</p>
            </div>
            
            <div className="mt-6 text-left border border-gray-300 p-4 bg-gray-50/50">
              <p className="text-[14px] font-bold mb-2">General Instructions:</p>
              <ul className="list-disc list-inside text-[13px] text-gray-800 space-y-1 ml-2">
                <li>All questions are compulsory.</li>
                <li>Read all questions carefully before answering.</li>
                <li>Write neatly and legibly.</li>
                {assignment?.instructions && <li>{assignment.instructions}</li>}
              </ul>
            </div>

            <div className="mt-8 text-left">
              <p className="text-[14px] font-bold mb-4">Student Information:</p>
              <div className="flex items-center justify-between text-[14px] text-gray-800">
                <div className="flex items-end gap-2">
                  <span className="font-semibold">Name:</span>
                  <div className="border-b border-gray-500 w-56"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-semibold">Roll Number:</span>
                  <div className="border-b border-gray-500 w-32"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-semibold">Section:</span>
                  <div className="border-b border-gray-500 w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-10">
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

          <div className="mt-16 text-center text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            — End of Paper —
          </div>

          {/* Answer Key Section (Page Break ideally in print) */}
          <div className="mt-20 border-t-[3px] border-gray-900 pt-12 print:break-before-page">
            <h2 className="text-[20px] font-black text-gray-900 uppercase tracking-widest text-center mb-10">
              ANSWER KEY & SOLUTIONS
            </h2>
            
            <div className="space-y-8">
              {flatQuestions.map((fq) => (
                <div key={fq.qNum} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">Question {fq.qNum}</h3>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 mb-3">
                    <span className="text-[13px] font-bold text-emerald-800 block mb-1">Correct Answer:</span>
                    <span className="text-[14px] text-gray-900">{fq.answer}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <span className="text-[13px] font-bold text-gray-700 block mb-1">Solution / Explanation:</span>
                    <span className="text-[13.5px] text-gray-800 leading-relaxed whitespace-pre-wrap">{fq.solution}</span>
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

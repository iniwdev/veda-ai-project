"use client";

import { useState } from "react";

import { useAssignmentStore } from "@/store/assignment.store";
import type { QuestionRow, QuestionType } from "@/types/assignment";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPE_OPTIONS: QuestionType[] = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True/False",
  "Fill in the Blanks",
];

const INITIAL_ROWS: QuestionRow[] = [
  { id: "1", type: "Multiple Choice Questions", numQuestions: 4, marks: 1 },
  { id: "2", type: "Short Questions", numQuestions: 3, marks: 2 },
  { id: "3", type: "Diagram/Graph-Based Questions", numQuestions: 5, marks: 5 },
  { id: "4", type: "Numerical Problems", numQuestions: 5, marks: 5 },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-1 w-24 rounded-full transition-all ${
            step <= currentStep ? "bg-gray-800" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── File Upload ──────────────────────────────────────────────────────────────

function FileUpload() {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
        dragging
          ? "border-orange-400 bg-orange-50"
          : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 14V6M10 6L7 9M10 6L13 9"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M4 16h12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[13px] text-gray-500 font-medium">
        Choose a file or drag & drop it here
      </p>
      <p className="text-[11px] text-gray-400">JPEG, PNG, up to 10MB</p>
      <button className="mt-2 px-5 py-1.5 border border-gray-300 rounded-lg text-[12px] font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
        Browse Files
      </button>
    </div>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────

interface CounterProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}

function Counter({ value, onChange, min = 0 }: CounterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm leading-none"
      >
        −
      </button>
      <span className="text-[13px] font-semibold text-gray-800 w-4 text-center tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm leading-none"
      >
        +
      </button>
    </div>
  );
}

// ─── Question Row Item ────────────────────────────────────────────────────────

interface QuestionRowItemProps {
  row: QuestionRow;
  onChange: (id: string, field: keyof QuestionRow, value: string | number) => void;
  onRemove: (id: string) => void;
}

function QuestionRowItem({ row, onChange, onRemove }: QuestionRowItemProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Question type select */}
      <div className="flex-1 relative">
        <select
          value={row.type}
          onChange={(e) => onChange(row.id, "type", e.target.value as QuestionType)}
          className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-[12.5px] text-gray-700 font-medium bg-white focus:outline-none focus:border-gray-400 pr-8 cursor-pointer"
        >
          {QUESTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 5.5L7 9.5L11 5.5"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(row.id)}
        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="Remove question type"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* No. of Questions counter */}
      <div className="flex-shrink-0">
        <Counter
          value={row.numQuestions}
          onChange={(v) => onChange(row.id, "numQuestions", v)}
          min={1}
        />
      </div>

      {/* Marks counter */}
      <div className="flex-shrink-0">
        <Counter
          value={row.marks}
          onChange={(v) => onChange(row.id, "marks", v)}
          min={1}
        />
      </div>
    </div>
  );
}

// ─── Create Assignment ────────────────────────────────────────────────────────

export function CreateAssignment() {
  const cancelCreate = useAssignmentStore((s) => s.cancelCreate);

  const [rows, setRows] = useState<QuestionRow[]>(INITIAL_ROWS);
  const [dueDate, setDueDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const totalQuestions = rows.reduce((sum, r) => sum + r.numQuestions, 0);
  const totalMarks = rows.reduce((sum, r) => sum + r.numQuestions * r.marks, 0);

  function handleChange(id: string, field: keyof QuestionRow, value: string | number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function handleRemove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleAddRow() {
    const newRow: QuestionRow = {
      id: Date.now().toString(),
      type: "Multiple Choice Questions",
      numQuestions: 5,
      marks: 1,
    };
    setRows((prev) => [...prev, newRow]);
  }

  return (
    // Full-height flex column: scrollable content + sticky footer
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-6 py-6">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" />
            <div>
              <h1 className="text-[17px] font-bold text-gray-900 leading-tight">
                Create Assignment
              </h1>
              <p className="text-[12px] text-gray-400 font-normal mt-0.5">
                Set up a new assignment for your students
              </p>
            </div>
          </div>

          <StepIndicator currentStep={1} />

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5">
              <h2 className="text-[14px] font-bold text-gray-900 mb-1">
                Assignment Details
              </h2>
              <p className="text-[11.5px] text-gray-400 mb-5">
                Basic information about your assignment
              </p>

              {/* File upload */}
              <div className="mb-5">
                <FileUpload />
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  Upload images of your preferred document/image
                </p>
              </div>

              {/* Due date */}
              <div className="mb-5">
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12.5px] text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="1.5" y="3" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M5 1.5V4M10 1.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M1.5 6.5H13.5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Question type table */}
              <div className="mb-5">
                {/* Column headers */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex-1">
                    <span className="text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
                      Question Type
                    </span>
                  </div>
                  <div className="w-6" />
                  <div className="flex-shrink-0 w-[105px] text-center">
                    <span className="text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
                      No. of Questions
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-[80px] text-center">
                    <span className="text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">
                      Marks
                    </span>
                  </div>
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-2.5">
                  {rows.map((row) => (
                    <QuestionRowItem
                      key={row.id}
                      row={row}
                      onChange={handleChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

                {/* Add question type button */}
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-2 mt-3 text-[12.5px] font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 2V8M2 5H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span>Add Question Type</span>
                </button>

                {/* Totals */}
                <div className="flex flex-col items-end mt-4 gap-0.5">
                  <span className="text-[12px] font-semibold text-gray-700">
                    Total Questions : {totalQuestions}
                  </span>
                  <span className="text-[12px] font-semibold text-gray-700">
                    Total Marks : {totalMarks}
                  </span>
                </div>
              </div>

              {/* Additional information */}
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-2">
                  Additional Information (For better output)
                </label>
                <div className="relative border border-gray-200 rounded-xl overflow-hidden">
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="e.g Generate a question paper for 3 hour exam duration..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-[12.5px] text-gray-600 placeholder:text-gray-300 focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full transition-colors ${
                      isRecording
                        ? "bg-red-500 text-white"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="5" y="1" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <path
                        d="M2.5 7c0 2.485 2.015 4.5 4.5 4.5s4.5-2.015 4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                      <path d="M7 11.5V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky footer navigation — sits OUTSIDE the scrollable area */}
      <footer className="bg-white border-t border-gray-100 px-8 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={cancelCreate}
          className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl text-[12.5px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl text-[12.5px] font-semibold hover:bg-gray-800 transition-colors">
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </footer>
    </div>
  );
}

"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";
import { QUESTION_TYPE_OPTIONS } from "@/lib/validations/assignment";

// ─── Counter Component ────────────────────────────────────────────────────────

interface CounterProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}

function Counter({ value, onChange, min = 0 }: CounterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm leading-none"
      >
        −
      </button>
      <span className="text-[13px] font-semibold text-gray-800 w-4 text-center tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm leading-none"
      >
        +
      </button>
    </div>
  );
}

// ─── Question Config Table ────────────────────────────────────────────────────

export function QuestionConfigTable() {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext<CreateAssignmentFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");
  const totalQuestions = questions?.reduce((sum, r) => sum + r.numQuestions, 0) || 0;
  const totalMarks = questions?.reduce((sum, r) => sum + r.numQuestions * r.marks, 0) || 0;

  function handleAddRow() {
    append({
      id: Date.now().toString(),
      type: "Multiple Choice Questions",
      numQuestions: 5,
      marks: 1,
    });
  }

  return (
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
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3">
            {/* Question type select */}
            <div className="flex-1 relative">
              <select
                {...register(`questions.${index}.type`)}
                className={`w-full appearance-none border rounded-lg px-3 py-2 text-[12.5px] text-gray-700 font-medium bg-white focus:outline-none pr-8 cursor-pointer transition-colors ${
                  errors.questions?.[index]?.type ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-400"
                }`}
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
              type="button"
              onClick={() => remove(index)}
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
                value={watch(`questions.${index}.numQuestions`)}
                onChange={(v) => setValue(`questions.${index}.numQuestions`, v, { shouldValidate: true })}
                min={1}
              />
            </div>

            {/* Marks counter */}
            <div className="flex-shrink-0">
              <Counter
                value={watch(`questions.${index}.marks`)}
                onChange={(v) => setValue(`questions.${index}.marks`, v, { shouldValidate: true })}
                min={1}
              />
            </div>
          </div>
        ))}
      </div>
      
      {errors.questions && !Array.isArray(errors.questions) && (
        <p className="text-red-500 text-xs mt-2">
          {errors.questions.message}
        </p>
      )}

      {/* Add question type button */}
      <button
        type="button"
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
  );
}

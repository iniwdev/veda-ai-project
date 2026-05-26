"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";

export function InstructionsField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAssignmentFormValues>();
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div>
      <label className="block text-[12.5px] font-semibold text-gray-700 mb-2">
        Additional Information (For better output)
      </label>
      <div
        className={`relative border rounded-xl overflow-hidden transition-colors ${
          errors.instructions ? "border-red-400" : "border-gray-200"
        }`}
      >
        <textarea
          placeholder="e.g Generate a question paper for 3 hour exam duration..."
          rows={3}
          {...register("instructions")}
          className="w-full px-3 py-2.5 text-[12.5px] text-gray-600 placeholder:text-gray-300 focus:outline-none resize-none"
        />
        <button
          type="button"
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
      {errors.instructions && (
        <p className="text-red-500 text-xs mt-1">{errors.instructions.message}</p>
      )}
    </div>
  );
}

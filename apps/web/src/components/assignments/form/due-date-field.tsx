"use client";

import { useFormContext } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";

export function DueDateField() {
  const { register, formState: { errors } } = useFormContext<CreateAssignmentFormValues>();

  return (
    <div className="mb-5">
      <label className="block text-[12.5px] font-semibold text-gray-700 mb-2">
        Due Date
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="DD-MM-YYYY"
          {...register("dueDate")}
          className={`w-full border rounded-lg px-3 py-2 text-[12.5px] text-gray-600 placeholder:text-gray-300 focus:outline-none pr-10 transition-colors ${
            errors.dueDate
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-gray-400"
          }`}
        />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect x="1.5" y="3" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 1.5V4M10 1.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M1.5 6.5H13.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>
      {errors.dueDate && (
        <p className="text-red-500 text-xs mt-1">
          {errors.dueDate.message}
        </p>
      )}
    </div>
  );
}

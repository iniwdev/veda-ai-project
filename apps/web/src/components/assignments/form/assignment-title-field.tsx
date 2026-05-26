"use client";

import { useFormContext } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";

export function AssignmentTitleField() {
  const { register, formState: { errors } } = useFormContext<CreateAssignmentFormValues>();

  return (
    <div className="mb-5">
      <label className="block text-[12.5px] font-semibold text-gray-700 mb-2">
        Assignment Title
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="e.g. Midterm Physics Assessment"
          {...register("assignmentTitle")}
          className={`w-full border rounded-lg px-3 py-2 text-[12.5px] text-gray-600 placeholder:text-gray-300 focus:outline-none pr-10 transition-colors ${
            errors.assignmentTitle
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-gray-400"
          }`}
        />
      </div>
      {errors.assignmentTitle && (
        <p className="text-red-500 text-xs mt-1">
          {errors.assignmentTitle.message}
        </p>
      )}
    </div>
  );
}

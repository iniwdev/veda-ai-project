"use client";

import { useFormContext } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";
import { EXAM_TYPE_OPTIONS } from "@/lib/validations/assignment";

/**
 * PaperMetadataFields
 *
 * Collects all paper header fields explicitly from the user.
 * These values are injected verbatim into the AI prompt as STRICT constraints,
 * so the AI never guesses or hallucinates school names, duration, etc.
 */
export function PaperMetadataFields() {
  const { register } = useFormContext<CreateAssignmentFormValues>();

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-[12.5px] text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors";

  return (
    <div className="mb-5">
      <p className="text-[11.5px] text-gray-400 mb-3">
        These values appear in the paper header exactly as you enter them. Leave blank to let the AI
        infer.
      </p>

      {/* Row 1: School Name + Exam Type */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[11.5px] font-semibold text-gray-600 mb-1.5">
            School / Institution Name
          </label>
          <input
            type="text"
            placeholder="e.g. St. Mary's High School"
            {...register("schoolName")}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-gray-600 mb-1.5">
            Exam Type
          </label>
          <select
            {...register("examType")}
            className={`${inputClass} bg-white appearance-none cursor-pointer`}
          >
            <option value="">— Select exam type —</option>
            {EXAM_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Subject + Class */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[11.5px] font-semibold text-gray-600 mb-1.5">Subject</label>
          <input
            type="text"
            placeholder="e.g. Mathematics / Physics"
            {...register("subject")}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-gray-600 mb-1.5">
            Class / Grade
          </label>
          <input
            type="text"
            placeholder="e.g. Class X / Grade 10"
            {...register("className")}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3: Duration (full width) */}
      <div>
        <label className="block text-[11.5px] font-semibold text-gray-600 mb-1.5">
          Exam Duration
        </label>
        <input
          type="text"
          placeholder="e.g. 3 Hours / 90 Minutes"
          {...register("duration")}
          className={inputClass}
        />
      </div>
    </div>
  );
}

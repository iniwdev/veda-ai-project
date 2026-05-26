"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";

export function UploadZone() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateAssignmentFormValues>();
  const [dragging, setDragging] = useState(false);
  const file = watch("file");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // In a real app, you'd validate file size and type here
      setValue("file", e.dataTransfer.files[0], { shouldValidate: true });
    }
  };

  return (
    <div className="mb-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          dragging
            ? "border-orange-400 bg-orange-50"
            : errors.file
              ? "border-red-400 bg-red-50"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 14V6M10 6L7 9M10 6L13 9"
              stroke={errors.file ? "#EF4444" : "#9CA3AF"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 16h12"
              stroke={errors.file ? "#EF4444" : "#9CA3AF"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className={`text-[13px] font-medium ${errors.file ? "text-red-500" : "text-gray-500"}`}>
          {file ? file.name : "Choose a file or drag & drop it here"}
        </p>
        <p className="text-[11px] text-gray-400">JPEG, PNG, up to 10MB</p>
        <label className="mt-2 px-5 py-1.5 border border-gray-300 rounded-lg text-[12px] font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer inline-block">
          Browse Files
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, application/pdf, text/plain"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setValue("file", e.target.files[0], { shouldValidate: true });
              }
            }}
          />
        </label>
      </div>
      {errors.file && (
        <p className="text-red-500 text-xs mt-1 text-center">{errors.file.message as string}</p>
      )}
      {!errors.file && (
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Upload images of your preferred document/image
        </p>
      )}
    </div>
  );
}

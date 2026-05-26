"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAssignmentStore } from "@/store/assignment.store";
import { CreateAssignmentSchema } from "@/lib/validations/assignment";
import type { CreateAssignmentFormValues } from "@/lib/validations/assignment";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse } from "@repo/types";

import { UploadZone } from "./form/upload-zone";
import { AssignmentTitleField } from "./form/assignment-title-field";
import { DueDateField } from "./form/due-date-field";
import { QuestionConfigTable } from "./form/question-config-table";
import { InstructionsField } from "./form/instructions-field";

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

// ─── Create Assignment ────────────────────────────────────────────────────────

export function CreateAssignment() {
  const { cancelCreate, createDraft, setCreateDraft, addAssignment, clearCreateDraft } =
    useAssignmentStore();

  const methods = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(CreateAssignmentSchema),
    defaultValues: {
      assignmentTitle: createDraft.assignmentTitle || "",
      dueDate: createDraft.dueDate || "",
      questions:
        createDraft.questions && createDraft.questions.length > 0
          ? createDraft.questions
          : [
              { id: "1", type: "Multiple Choice Questions", numQuestions: 4, marks: 1 },
              { id: "2", type: "Short Questions", numQuestions: 3, marks: 2 },
              { id: "3", type: "Diagram/Graph-Based Questions", numQuestions: 5, marks: 5 },
              { id: "4", type: "Numerical Problems", numQuestions: 5, marks: 5 },
            ],
      instructions: createDraft.instructions || "",
      file: createDraft.file || undefined,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Persist draft to Zustand on change
  useEffect(() => {
    const subscription = watch((value) => {
      setCreateDraft(value as Partial<CreateAssignmentFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [watch, setCreateDraft]);

  const onSubmit = async (data: CreateAssignmentFormValues) => {
    try {
      // ── Step 1: Create assignment in DB ──────────────────────────────────
      const res = await apiClient.post<ApiResponse<any>>("/assignments", {
        title: data.assignmentTitle,
        dueDate: data.dueDate,
        instructions: data.instructions,
        questions: data.questions,
        totalMarks: data.questions.reduce((sum, q) => sum + q.numQuestions * q.marks, 0),
        uploadedFile: data.file ? "uploaded-file-placeholder" : undefined,
      });

      if (!res.data) {
        throw new Error("No data returned from server");
      }

      const raw = res.data;
      const assignmentId: string = raw._id ?? raw.id ?? "";

      if (!assignmentId) {
        throw new Error("Server did not return an assignment ID");
      }

      // ── Step 2: Optimistically add to store with "processing" status ──────
      // We set status to "processing" immediately so the card shows the
      // spinner right away without waiting for the socket event.
      addAssignment({
        id: assignmentId,
        title: raw.title ?? data.assignmentTitle,
        assignedOn: raw.createdAt
          ? new Date(raw.createdAt).toLocaleDateString("en-GB")
          : new Date().toLocaleDateString("en-GB"),
        dueDate: raw.dueDate ?? data.dueDate,
        status: "processing",
      });

      // ── Step 3: Navigate back to list immediately (assignment is visible) ─
      clearCreateDraft();
      cancelCreate(); // switches view → list

      toast.success("Assignment created! Generating paper...");

      // ── Step 4: Trigger AI generation (fire-and-forget from client side) ──
      // We do this AFTER navigation so the user immediately sees the card.
      // The socket events will update the card status in real time.
      apiClient
        .post(`/assignments/${assignmentId}/generate`, {})
        .catch((err: any) => {
          // Generation trigger failed — update store to reflect this
          useAssignmentStore.getState().updateAssignmentStatus(assignmentId, "failed");
          toast.error(err.message || "Failed to start generation");
        });
    } catch (error: any) {
      toast.error(error.message || "Failed to create assignment");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col overflow-hidden bg-gray-50/30"
      >
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

                <UploadZone />
                <AssignmentTitleField />
                <DueDateField />
                <QuestionConfigTable />
                <InstructionsField />
              </div>
            </div>
          </div>
        </main>

        {/* Sticky footer navigation */}
        <footer className="bg-white border-t border-gray-100 px-8 py-3 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={cancelCreate}
            className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl text-[12.5px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl text-[12.5px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create & Generate"}
            {!isSubmitting && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </footer>
      </form>
    </FormProvider>
  );
}

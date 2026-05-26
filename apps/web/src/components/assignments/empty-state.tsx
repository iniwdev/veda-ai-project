"use client";

import React from "react";
import { useAssignmentStore } from "@/store/assignment.store";

// ─── Icons ────────────────────────────────────────────────────────────────────

const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Empty State Illustration ────────────────────────────────────────────────

const EmptyStateIllustration = () => (
  <svg
    width="220"
    height="190"
    viewBox="0 0 220 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
    aria-hidden="true"
  >
    {/* Background oval */}
    <ellipse cx="110" cy="100" rx="100" ry="80" fill="#e5e7eb" />

    {/* Small top-right document/card */}
    <rect x="138" y="28" width="52" height="38" rx="6" fill="white" stroke="#d1d5db" strokeWidth="1" />
    <rect x="145" y="36" width="20" height="3" rx="1.5" fill="#d1d5db" />
    <rect x="145" y="43" width="28" height="3" rx="1.5" fill="#e5e7eb" />
    <rect x="145" y="50" width="24" height="3" rx="1.5" fill="#e5e7eb" />

    {/* Main document */}
    <rect x="60" y="42" width="80" height="100" rx="8" fill="white" stroke="#d1d5db" strokeWidth="1" />
    {/* Document header bar */}
    <rect x="60" y="42" width="80" height="20" rx="8" fill="#f3f4f6" />
    <rect x="60" y="54" width="80" height="8" rx="0" fill="#f3f4f6" />
    {/* Mini circles in header */}
    <circle cx="72" cy="52" r="3" fill="#e5e7eb" />
    <circle cx="82" cy="52" r="3" fill="#e5e7eb" />
    {/* Document lines */}
    <rect x="72" y="74" width="50" height="4" rx="2" fill="#e5e7eb" />
    <rect x="72" y="84" width="42" height="4" rx="2" fill="#e5e7eb" />
    <rect x="72" y="94" width="46" height="4" rx="2" fill="#e5e7eb" />
    <rect x="72" y="104" width="36" height="4" rx="2" fill="#e5e7eb" />
    <rect x="72" y="114" width="50" height="4" rx="2" fill="#e5e7eb" />
    <rect x="72" y="124" width="38" height="4" rx="2" fill="#e5e7eb" />

    {/* Magnifying glass circle */}
    <circle cx="130" cy="126" r="42" fill="white" fillOpacity="0.6" />
    <circle cx="128" cy="124" r="36" fill="white" stroke="#d1d5db" strokeWidth="2" />

    {/* Red X circle (inside lens) */}
    <circle cx="128" cy="124" r="24" fill="#ef4444" />
    {/* White X */}
    <line x1="119" y1="115" x2="137" y2="133" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <line x1="137" y1="115" x2="119" y2="133" stroke="white" strokeWidth="4" strokeLinecap="round" />

    {/* Magnifying glass handle */}
    <line x1="157" y1="151" x2="172" y2="167" stroke="#9ca3af" strokeWidth="7" strokeLinecap="round" />

    {/* Sparkle — top left */}
    <path d="M50 72 L52 66 L54 72 L60 74 L54 76 L52 82 L50 76 L44 74 Z" fill="#c4b5fd" />

    {/* Sparkle — bottom left */}
    <path d="M38 136 L39.5 131 L41 136 L46 137.5 L41 139 L39.5 144 L38 139 L33 137.5 Z" fill="#a78bfa" />

    {/* Small dots */}
    <circle cx="170" cy="60" r="4" fill="#c4b5fd" />
    <circle cx="44" cy="108" r="3" fill="#d1d5db" />
    <circle cx="185" cy="100" r="3" fill="#ddd6fe" />
  </svg>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

export const EmptyState: React.FC = () => {
  const navigateToCreate = useAssignmentStore((s) => s.navigateToCreate);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[480px] px-6">
      <EmptyStateIllustration />
      <div className="mt-6 text-center max-w-sm">
        <h2 className="text-[18px] font-bold text-gray-900 mb-2.5 tracking-[-0.01em]">
          No assignments yet
        </h2>
        <p className="text-[13.5px] text-gray-500 leading-[1.65] mb-7">
          Create your first assignment to start collecting and grading student submissions.
          You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <button
          onClick={navigateToCreate}
          className="inline-flex items-center gap-2 bg-[#111827] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#1f2937] active:scale-[0.98] transition-all duration-150 shadow-sm"
        >
          <PlusIcon size={15} />
          <span>Create Your First Assignment</span>
        </button>
      </div>
    </div>
  );
};

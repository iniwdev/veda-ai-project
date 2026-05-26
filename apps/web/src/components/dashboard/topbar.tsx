"use client";

import React from "react";

// ─── Icon components ─────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const GridIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Topbar (Header) ──────────────────────────────────────────────────────────

export const TopBar: React.FC = () => (
  <header className="h-[72px] bg-white flex items-center justify-between px-8 flex-shrink-0 z-20 rounded-tl-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
    {/* Left: back + breadcrumb */}
    <div className="flex items-center gap-4">
      <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
        <ArrowLeftIcon />
      </button>
      <div className="flex items-center gap-2.5 text-gray-400">
        <GridIcon size={18} />
        <span className="text-[15px] font-semibold text-gray-400 tracking-tight">Assignment</span>
      </div>
    </div>

    {/* Right: bell + user */}
    <div className="flex items-center gap-6">
      {/* Bell */}
      <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all duration-200">
        <BellIcon />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF5A20]" />
      </button>

      {/* User */}
      <button className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white hover:bg-gray-50 rounded-full transition-all duration-200 shadow-sm border border-gray-100">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-orange-50 flex items-center justify-center">
          <span className="text-lg">🧔🏼</span>
        </div>
        <span className="text-[14px] font-bold text-gray-900 tracking-tight">John Doe</span>
        <span className="text-gray-400">
          <ChevronDownIcon />
        </span>
      </button>
    </div>
  </header>
);

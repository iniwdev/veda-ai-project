"use client";

import React from "react";

// ─── Icon components ─────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const GridIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Topbar (Header) ──────────────────────────────────────────────────────────

export const TopBar: React.FC = () => (
  <header className="h-[52px] bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
    {/* Left: back + breadcrumb */}
    <div className="flex items-center gap-3">
      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
        <ArrowLeftIcon />
      </button>
      <div className="flex items-center gap-2 text-gray-500">
        <GridIcon size={16} />
        <span className="text-sm font-medium text-gray-600">Assignment</span>
      </div>
    </div>

    {/* Right: bell + user */}
    <div className="flex items-center gap-3">
      {/* Bell */}
      <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
        <BellIcon />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      {/* User */}
      <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
        </div>
        <span className="text-sm font-medium text-gray-800">John Doe</span>
        <span className="text-gray-400">
          <ChevronDownIcon />
        </span>
      </button>
    </div>
  </header>
);

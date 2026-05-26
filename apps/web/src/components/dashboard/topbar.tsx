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
  <header className="h-[64px] bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
    {/* Left: back + breadcrumb */}
    <div className="flex items-center gap-4">
      <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100/80 hover:text-gray-700 transition-all duration-200 shadow-sm border border-gray-100/50 bg-white/50">
        <ArrowLeftIcon />
      </button>
      <div className="flex items-center gap-2.5 text-gray-500">
        <GridIcon size={18} />
        <span className="text-[15px] font-semibold text-gray-700 tracking-tight">Assignments</span>
      </div>
    </div>

    {/* Right: bell + user */}
    <div className="flex items-center gap-4">
      {/* Bell */}
      <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition-all duration-200 shadow-sm border border-transparent hover:border-gray-100">
        <BellIcon />
        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-[2.5px] ring-white" />
      </button>

      {/* User */}
      <button className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-white transition-all duration-200 border border-transparent hover:border-gray-100 hover:shadow-sm">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-inner">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
            JD
          </div>
        </div>
        <span className="text-[14px] font-semibold text-gray-800 tracking-tight">John Doe</span>
        <span className="text-gray-400">
          <ChevronDownIcon />
        </span>
      </button>
    </div>
  </header>
);

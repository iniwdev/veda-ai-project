"use client";

import { Bell, ChevronDown, LayoutGrid } from "lucide-react";

// ─── TopBar ───────────────────────────────────────────────────────────────────

export function TopBar() {
  return (
    <header className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0 z-10">
      {/* Left: back arrow + breadcrumb */}
      <div className="flex items-center gap-2 text-gray-400">
        <button
          className="hover:text-gray-600 transition-colors"
          aria-label="Go back"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
          <LayoutGrid size={14} strokeWidth={1.8} />
          <span>Assignment</span>
        </div>
      </div>

      {/* Right: notification bell + user */}
      <div className="flex items-center gap-3">
        <button
          className="relative text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E8440A] rounded-full" />
        </button>

        <button className="flex items-center gap-2 text-[13px] font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            JD
          </div>
          <span>John Doe</span>
          <ChevronDown size={13} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

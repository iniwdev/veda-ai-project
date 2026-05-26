"use client";

import React, { useState } from "react";
import { useAssignmentStore } from "@/store/assignment.store";

// ─── Icon components (Lucide-style inline SVGs) ───────────────────────────────

const GridIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const WandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5" />
    <path d="m3 21 3-3-8.5-8.5a1.5 1.5 0 0 1 0-2.12L8 2l2 2" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── VedaAI Logo Icon ─────────────────────────────────────────────────────────

const VedaAILogo = () => (
  <div className="flex items-center gap-2.5">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3C7 3 3 7 3 12C3 14.5 4 16.8 5.7 18.4L3 21H12C17 21 21 17 21 12C21 7 17 3 12 3Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <span className="text-[17px] font-semibold text-gray-900 tracking-[-0.01em]">VedaAI</span>
  </div>
);

// ─── Navigation Item ──────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
      transition-colors duration-100 cursor-pointer
      ${active
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
      }
    `}
  >
    <span className={`flex-shrink-0 ${active ? "text-gray-800" : "text-gray-500"}`}>
      {icon}
    </span>
    <span className="leading-none">{label}</span>
  </button>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Assignments");
  const navigateToCreate = useAssignmentStore((s) => s.navigateToCreate);

  const navItems = [
    { icon: <GridIcon />, label: "Home" },
    { icon: <UsersIcon />, label: "My Groups" },
    { icon: <FileTextIcon />, label: "Assignments" },
    { icon: <WandIcon />, label: "AI Teacher's Toolkit" },
    { icon: <BookIcon />, label: "My Library" },
  ];

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white flex flex-col border-r border-gray-100 h-full">
      {/* Logo */}
      <div className="px-4 pt-5 pb-5">
        <VedaAILogo />
      </div>

      {/* Create Assignment Button */}
      <div className="px-3 pb-5">
        <div
          className="rounded-full p-[1.5px]"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%)",
          }}
        >
          <button
            onClick={navigateToCreate}
            className="w-full bg-[#0f172a] text-white text-sm font-semibold rounded-full py-2.5 px-4 flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-colors duration-150"
          >
            <PlusIcon size={15} />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.label}
            onClick={() => setActiveNav(item.label)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-3 pb-4">
        {/* Divider */}
        <div className="border-t border-gray-100 mb-3" />

        {/* Settings */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-100 mb-3">
          <SettingsIcon />
          <span>Settings</span>
        </button>

        {/* School Profile Card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden">
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="white" fillOpacity="0.9" />
                <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="rgba(249,115,22,0.8)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          {/* School info */}
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate">
              Delhi Public School
            </p>
            <p className="text-[11px] text-gray-500 leading-tight truncate mt-0.5">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

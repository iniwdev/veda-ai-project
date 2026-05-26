"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssignmentStore } from "@/store/assignment.store";

// ─── Icon components (Lucide-style inline SVGs) ───────────────────────────────

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

const UsersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const WandIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5" />
    <path d="m3 21 3-3-8.5-8.5a1.5 1.5 0 0 1 0-2.12L8 2l2 2" />
  </svg>
);

const BookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── VedaAI Logo Icon ─────────────────────────────────────────────────────────

const VedaAILogo = () => (
  <div className="flex items-center gap-2.5">
    <div
      className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 8l6 10 10-14"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className="text-[22px] font-extrabold text-gray-900 tracking-tight">VedaAI</span>
  </div>
);

// ─── Navigation Item ──────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active = false, onClick, badge }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      group w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium
      transition-all duration-300 cursor-pointer
      ${
        active
          ? "bg-gray-100/80 text-gray-900"
          : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
      }
    `}
  >
    <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
      <span
        className={`flex-shrink-0 transition-colors duration-300 ${active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
      >
        {icon}
      </span>
      <span className="leading-none">{label}</span>
    </div>
    {badge && (
      <span className="bg-[#FF5A20] text-white text-[10px] font-bold px-2 py-0.5 rounded-full transition-transform duration-300 group-hover:scale-105">
        {badge}
      </span>
    )}
  </Link>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const navigateToCreate = useAssignmentStore((s) => s.navigateToCreate);
  const setView = useAssignmentStore((s) => s.setView);

  const navItems = [
    { icon: <GridIcon />, label: "Home", href: "/dashboard/home" },
    { icon: <UsersIcon />, label: "My Groups", href: "/dashboard/groups" },
    {
      icon: <FileTextIcon />,
      label: "Assignments",
      href: "/dashboard/assignments",
      badge: 10,
      onClick: () => setView("list"),
    },
    { icon: <WandIcon />, label: "AI Teacher's Toolkit", href: "/dashboard/toolkit" },
    { icon: <BookIcon />, label: "My Library", href: "/dashboard/library" },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white flex flex-col border-r-2 border-[#1E88E5] h-full shadow-[2px_0_12px_rgba(0,0,0,0.03)]">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <VedaAILogo />
      </div>

      {/* Create Assignment Button */}
      <div className="px-5 pb-8">
        <div className="ring-[3px] ring-offset-4 ring-offset-white ring-[#FF5A20] rounded-full mx-1 hover:ring-opacity-80 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,90,32,0.3)]">
          <button
            onClick={navigateToCreate}
            className="w-full bg-[#1A1A1A] text-white text-[14px] font-semibold rounded-full py-3.5 px-4 flex items-center justify-center gap-2.5 hover:bg-black transition-colors duration-150"
          >
            <PlusIcon size={16} />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            onClick={item.onClick}
            active={pathname?.startsWith(item.href) || false}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-4 pb-6">
        {/* Settings */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-100 mb-4">
          <SettingsIcon />
          <span>Settings</span>
        </button>

        {/* School Profile Card */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 cursor-pointer transition-colors shadow-sm border border-gray-100">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-[#FFE4D6] flex items-center justify-center border border-orange-200">
            <span className="text-xl">🧑‍🏫</span>
          </div>
          {/* School info */}
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-900 leading-tight truncate">
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

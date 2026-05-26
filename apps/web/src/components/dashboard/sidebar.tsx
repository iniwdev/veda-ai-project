"use client";

import { usePathname } from "next/navigation";
import { LayoutGrid, Users, FileText, Wrench, Library, Settings, Plus } from "lucide-react";
import { useAssignmentStore } from "@/store/assignment.store";

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", icon: LayoutGrid, href: "/dashboard" },
  { label: "My Groups", icon: Users, href: "/dashboard/groups" },
  { label: "Assignments", icon: FileText, href: "/dashboard/assignments", badge: 10 },
  { label: "AI Teacher's Toolkit", icon: Wrench, href: "/dashboard/toolkit" },
  { label: "My Library", icon: Library, href: "/dashboard/library" },
] as const;

// ─── VedaAI Logo ─────────────────────────────────────────────────────────────

function VedaLogo() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-[18px] border-b border-gray-100">
      <div className="w-8 h-8 bg-[#E8440A] rounded-lg flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M4 4 L9 14 L14 4"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <span className="font-semibold text-[15px] text-gray-800 tracking-tight">VedaAI</span>
    </div>
  );
}

// ─── Create Assignment Button ─────────────────────────────────────────────────

function CreateAssignmentButton() {
  const navigateToCreate = useAssignmentStore((s) => s.navigateToCreate);

  return (
    <div className="px-4 py-3">
      <button
        onClick={navigateToCreate}
        className="w-full flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white text-[13px] font-medium rounded-xl px-4 py-2.5 transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-[#E8440A] flex items-center justify-center flex-shrink-0">
          <Plus size={11} strokeWidth={3} className="text-white" />
        </div>
        <span>Create Assignment</span>
      </button>
    </div>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-[13.5px] font-medium transition-colors ${
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      }`}
    >
      <Icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {"badge" in item && item.badge != null && (
        <span className="bg-[#E8440A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
          {item.badge}
        </span>
      )}
    </a>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] min-w-[200px] h-screen bg-white border-r border-gray-100 flex flex-col select-none">
      <VedaLogo />
      <CreateAssignmentButton />

      <nav className="flex-1 pt-1 pb-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="border-t border-gray-100">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Settings size={15} strokeWidth={1.8} />
          <span>Settings</span>
        </a>

        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="white" fillOpacity="0.9" />
                <polyline
                  points="9 22 9 12 15 12 15 22"
                  fill="none"
                  stroke="rgba(249,115,22,0.8)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-800 truncate leading-tight">
              Delhi Public School
            </p>
            <p className="text-[10.5px] text-gray-400 truncate leading-tight">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

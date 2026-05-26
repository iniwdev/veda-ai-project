/**
 * Global app store — Zustand with immer-friendly patterns.
 * Split into domain slices as the app grows.
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AppState {
  // UI
  sidebarOpen: boolean;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, "setSidebarOpen"),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, "toggleSidebar"),
    }),
    { name: "AppStore" },
  ),
);

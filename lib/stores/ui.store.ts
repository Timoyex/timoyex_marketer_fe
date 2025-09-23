import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean; // Mobile sidebar (overlay)
  sidebarCollapsed: boolean; // Desktop collapse state
  theme: "light" | "dark" | "system";
  currentPage: string;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  setTheme: (theme: "light" | "dark" | "system") => void;
  setCurrentPage: (page: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false, // ✅ new state
  theme: "system",
  currentPage: "overview",

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebarCollapsed: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setTheme: (theme) => set({ theme }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

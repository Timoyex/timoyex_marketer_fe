import { create } from "zustand";

interface DashboardStats {
  totalRecruits: number;
  directRecruits: number;
  monthlyRevenue: number;
  pendingPayments: number;
  conversionRate: number;
  totalClicks: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  level: number;
  recruits: number;
  earnings: number;
  joinedDate: string;
  status: "active" | "inactive";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface DashboardState {
  stats: DashboardStats | null;
  teamMembers: TeamMember[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setStats: (stats: DashboardStats) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  teamMembers: [],
  notifications: [],
  isLoading: false,
  error: null,

  setStats: (stats) => set({ stats }),

  setTeamMembers: (teamMembers) => set({ teamMembers }),

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

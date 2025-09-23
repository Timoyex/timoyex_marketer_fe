import { AuthResponse } from "./auth";
import { apiClient } from "./client";

export interface DashboardStats {
  totalRecruits: number;
  directRecruits: number;
  monthlyRevenue: number;
  pendingPayments: number;
  conversionRate: number;
  totalClicks: number;
  levelProgress: {
    current: number;
    target: number;
    percentage: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  level: number;
  recruits: number;
  earnings: number;
  joinedDate: string;
  status: "active" | "inactive";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface EarningsData {
  id: string;
  amount: number;
  type: "commission" | "bonus" | "referral";
  status: "pending" | "paid" | "processing";
  date: string;
  description: string;
}

export const dashboardApi = {
  // Get dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  // Get team members
  getTeamMembers: async (
    page = 1,
    limit = 10
  ): Promise<{
    members: TeamMember[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get(
      `/dashboard/team?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get notifications
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get("/dashboard/notifications");
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/dashboard/notifications/${id}/read`);
  },

  // Get earnings
  getEarnings: async (
    page = 1,
    limit = 10
  ): Promise<{
    earnings: EarningsData[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get(
      `/dashboard/earnings?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get referral links
  getReferralLinks: async (): Promise<{
    marketerLink: string;
    shopperLink: string;
  }> => {
    const response = await apiClient.get("/dashboard/referral-links");
    return response.data;
  },

  // Update profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }): Promise<AuthResponse["user"]> => {
    const response = await apiClient.patch("/dashboard/profile", data);
    return response.data;
  },
};

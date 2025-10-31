import { create } from "zustand";

export type NotificationType = "info" | "general";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: Priority;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  setNotifications: (n: Notification[]) => void;
  markAllAsRead: () => void;
  delete: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  delete: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  setNotifications: (list) =>
    set({
      notifications: list.filter((n) => !n.isRead),
      unreadCount: list.filter((n) => !n.isRead).length,
    }),
  markAllAsRead: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },
}));

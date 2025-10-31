"use client";

import { FE_URL } from "@/app.config";
import {
  useNotificationStore,
  Notification,
} from "@/lib/stores/notifications.store";
import { useProfileStore } from "@/lib/stores/profile.store";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const NOTIFICATIONS_EVENTS = {
  NEW: "notifications:new",
  PENDING: "notifications:pending",
  FETCH_PENDING: "notifications:fetch-pending",
  CONNECTION_READY: "connection:ready",
  ERROR: "error",
};

export function NotificationsProvider() {
  // this runs only in the browser
  useNotifications();
  return null; // it doesn’t render UI, just sets up socket listeners
}

/**
 * Hook: subscribes to task notifications from socket.io
 */
export function useNotifications() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const profile = useProfileStore((s) => s.profile);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (socketRef.current) return; // prevent duplicate sockets
    const socket = io(`${FE_URL}/notifications`, {
      transports: ["websocket", "pollig"],
      auth: {
        token: profile?.id,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to notifications socket", socket.id);
    });
    // CREATED
    socket.on(NOTIFICATIONS_EVENTS.NEW, (n: Notification) => {
      console.log(n, "new");
      addNotification(n);
    });

    // UPDATED
    socket.on(
      NOTIFICATIONS_EVENTS.PENDING,
      (notifications: Record<string, unknown>) => {
        console.log(notifications, "pending");
        setNotifications(
          notifications.notifications as unknown as Notification[]
        );
      }
    );

    socket.on(NOTIFICATIONS_EVENTS.CONNECTION_READY, (data) => {
      console.log("✅ Connection ready acknowledged:", data);

      console.log("📤 Requesting pending notifications...");
      socket.emit(NOTIFICATIONS_EVENTS.FETCH_PENDING);
    });

    // 4️⃣ Register error listener
    socket.on(NOTIFICATIONS_EVENTS.ERROR, (error) => {
      console.error("❌ Server error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });
    // cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(NOTIFICATIONS_EVENTS.NEW);
      socket.off(NOTIFICATIONS_EVENTS.PENDING);
      socket.off(NOTIFICATIONS_EVENTS.CONNECTION_READY);
      socket.off(NOTIFICATIONS_EVENTS.ERROR);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addNotification, setNotifications]);
}

"use client";

import { VerifyGuard } from "@/guards";
import clsx from "clsx";
import { NotificationsProvider } from "@/hooks/notification.ws";
import { AdminSidebar } from "./components/sidebar";
import { AdminHeader } from "./components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <NotificationsProvider />
      {/* this sidebar is collapsible */}
      <AdminSidebar />
      <AdminHeader />

      {/* Main content */}

      <main className={clsx("transition-all duration-300")}>{children}</main>
    </div>
  );
}

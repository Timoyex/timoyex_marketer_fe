// app/(dashboard)/layout.tsx
"use client";

import { Header } from "@/components/custom/header";
import { Sidebar } from "@/components/custom/sidebar";
import { Breadcrumb } from "./components/breadcrumb";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { VerifyGuard } from "@/guards";
import clsx from "clsx";
import { useSettingsStore, useUIStore } from "@/lib/stores";
import { NotificationsProvider } from "@/hooks/notification.ws";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    sidebarCollapsed, //desktop
  } = useUIStore();

  const { preferences } = useSettingsStore();

  return (
    <div className="min-h-screen bg-background">
      <NotificationsProvider />
      <Header />
      {/* this sidebar is collapsible */}
      <Sidebar />

      {/* Main content */}

      <main
        className={clsx(
          "transition-all duration-300",
          !sidebarCollapsed ? "md:pl-60 lg:pl-64" : "md:pl-15 lg:pl-20"
        )}
      >
        <div className="p-4 lg:p-6">
          <ThemeProvider
            attribute="class"
            defaultTheme={preferences?.theme || "system"}
            disableTransitionOnChange
            enableColorScheme
            enableSystem
          >
            <VerifyGuard>
              <Breadcrumb />
              {children}
            </VerifyGuard>
          </ThemeProvider>
        </div>
      </main>
    </div>
  );
}

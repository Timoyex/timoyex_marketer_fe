// app/(dashboard)/layout.tsx
"use client";

import { Header } from "@/components/custom/header";
import { Sidebar } from "@/components/custom/sidebar";
import { Breadcrumb } from "./components/breadcrumb";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { AuthGuard } from "@/guards/auth.guard";
import { VerifyGuard } from "@/guards";
import clsx from "clsx";
import { useUIStore } from "@/lib/stores";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    sidebarCollapsed, //desktop
  } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* this sidebar is collapsible */}
      <Sidebar />

      {/* Main content */}
      {/* Todo
      add themes based on user preference
      */}
      <main
        className={clsx(
          "transition-all duration-300",
          !sidebarCollapsed ? "md:pl-60 lg:pl-64" : "md:pl-15 lg:pl-20"
        )}
      >
        <div className="p-4 lg:p-6">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthGuard>
              <VerifyGuard>
                <Breadcrumb />
                {children}
              </VerifyGuard>
            </AuthGuard>
          </ThemeProvider>
        </div>
      </main>
    </div>
  );
}

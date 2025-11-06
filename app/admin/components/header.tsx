"use client";

import { Bell, Menu, Shield } from "lucide-react";
import { useUIStore } from "@/lib/stores";
import { useProfile } from "@/hooks/profile.hook";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();
  const { profileQuery } = useProfile();

  const profile = profileQuery.data;
  const {
    setSidebarOpen, //set for moibile
  } = useUIStore();

  const titles: Record<string, { title: string; desc: string }> = {
    "/admin/dashboard": {
      title: "Admin Dashboard",
      desc: "Manage users, payments, and announcements",
    },
    "/admin/users": {
      title: "User Management",
      desc: "Manage all user accounts and profiles",
    },
    "/admin/payments": {
      title: "Payments",
      desc: "Process and manage all payment requests",
    },
    "/admin/announcements": {
      title: "Announcements",
      desc: "Create and manage announcements for all users",
    },
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 lg:ml-64">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {titles[pathname]?.title || ""}
              </h1>
              <p className="text-slate-600">{titles[pathname]?.desc || ""}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{`${
                profile?.firstName || ""
              } ${profile?.lastName || ""}`}</p>
              <p className="text-xs text-slate-500">Super Administrator</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

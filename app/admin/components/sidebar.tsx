"use client";
import {
  Users,
  Megaphone,
  LogOut,
  BarChart3,
  CreditCard,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import Image from "next/image";
import { useState } from "react";
import { useUIStore } from "@/lib/stores";

// Define your sidebar items
const navigationItems = [
  {
    name: "Overview",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
  },
];

export function AdminSidebar() {
  const { logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarOpen,
    setSidebarOpen, //set for moibile
  } = useUIStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Image
            src="/timoyex-logo.jpg"
            alt="TIMOYEX International"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div>
            <span className="text-white font-bold text-sm">TIMOYEX</span>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-medium text-xs">ADMIN</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-8">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-red-600 text-white border-r-2 border-red-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

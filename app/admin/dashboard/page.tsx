"use client";

import { useState } from "react";
import {
  Users,
  CreditCard,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { AdminNotificationCenter } from "@/components/custom/admin-notification-center";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "blue",
    },
    {
      title: "Pending Payments",
      value: "₦1,247,500",
      change: "+8%",
      changeType: "positive" as const,
      icon: CreditCard,
      color: "green",
    },
    {
      title: "Active Marketers",
      value: "1,234",
      change: "+15%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Announcements Sent",
      value: "47",
      change: "+3",
      changeType: "neutral" as const,
      icon: Megaphone,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      type: "user",
      message: "New user registration: Sarah Johnson",
      time: "2 minutes ago",
      status: "success",
    },
    {
      type: "payment",
      message: "Payment request from John Doe (₦52,400)",
      time: "5 minutes ago",
      status: "pending",
    },
    {
      type: "announcement",
      message: "Monthly newsletter sent to 2,847 users",
      time: "1 hour ago",
      status: "success",
    },
    {
      type: "user",
      message: "Level upgrade: Mike Chen reached Level 5",
      time: "2 hours ago",
      status: "success",
    },
  ];

  const navigationItems = [
    {
      name: "Overview",
      href: "/admin/dashboard",
      icon: BarChart3,
      active: true,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      active: false,
    },
    {
      name: "Payment Management",
      href: "/admin/payments",
      icon: CreditCard,
      active: false,
    },
    {
      name: "Announcements",
      href: "/admin/announcements",
      icon: Megaphone,
      active: false,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
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
                item.active
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
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Image
                  src="/timoyex-logo.jpg"
                  alt="TIMOYEX International"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600">
                    Manage users, payments, and announcements
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-slate-600 hover:text-slate-900 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500">Super Administrator</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {stat.value}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-slate-600"
                        }`}
                      >
                        {stat.change} from last month
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${
                        stat.color === "blue"
                          ? "bg-blue-100"
                          : stat.color === "green"
                          ? "bg-green-100"
                          : stat.color === "purple"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <stat.icon
                        className={`w-6 h-6 ${
                          stat.color === "blue"
                            ? "text-blue-600"
                            : stat.color === "green"
                            ? "text-green-600"
                            : stat.color === "purple"
                            ? "text-purple-600"
                            : "text-orange-600"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Admin Notification Center */}
            <AdminNotificationCenter />

            {/* Payment Qualification Alerts */}
            <Card className="p-6 bg-white border border-gray-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Qualification Alerts
                  </h3>
                  <p className="text-sm text-gray-600">
                    Marketers ready for monthly payments
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Sample qualification alerts */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Sarah Johnson - Level 3
                        </span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Team Revenue: ₦22.5M (Required: ₦20M) ✓</p>
                        <p>• Direct Recruits: 68 (Required: 65) ✓</p>
                        <p>• Total Recruits: 720 (Required: 650) ✓</p>
                        <p className="font-semibold">
                          Qualifies for: ₦80,000 monthly salary
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve Payment
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Michael Chen - Level 2
                        </span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Team Revenue: ₦12.8M (Required: ₦10M) ✓</p>
                        <p>• Direct Recruits: 18 (Required: 15) ✓</p>
                        <p>• Total Recruits: 165 (Required: 150) ✓</p>
                        <p className="font-semibold">
                          Qualifies for: ₦50,000 monthly salary
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve Payment
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">
                          David Wilson - Level 4
                        </span>
                      </div>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• Team Revenue: ₦38.2M (Required: ₦40M) ❌</p>
                        <p>• Direct Recruits: 105 (Required: 100) ✓</p>
                        <p>• Total Recruits: 1,050 (Required: 1,000) ✓</p>
                        <p className="font-semibold">
                          Needs ₦1.8M more team revenue
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                      Not Qualified
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Payment Qualifications
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Manage Users
                    </h3>
                    <p className="text-sm text-slate-600">
                      View and manage all user accounts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Process Payments
                    </h3>
                    <p className="text-sm text-slate-600">
                      Handle payment requests and payouts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Megaphone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Send Announcements
                    </h3>
                    <p className="text-sm text-slate-600">
                      Create and broadcast messages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-100"
                          : activity.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-slate-100"
                      }`}
                    >
                      {activity.status === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : activity.status === "pending" ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

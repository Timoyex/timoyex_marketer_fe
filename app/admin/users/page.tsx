"use client"

import { useState } from "react"
import {
  Users,
  Search,
  MoreHorizontal,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  Menu,
  X,
  LogOut,
  BarChart3,
  CreditCard,
  Megaphone,
  Settings,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const navigationItems = [
    { name: "Overview", href: "/admin/dashboard", icon: BarChart3, active: false },
    { name: "User Management", href: "/admin/users", icon: Users, active: true },
    { name: "Payment Management", href: "/admin/payments", icon: CreditCard, active: false },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone, active: false },
    { name: "Settings", href: "/admin/settings", icon: Settings, active: false },
  ]

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      level: 2,
      levelName: "Intermediate/Amateur Marketer",
      totalRecruits: 89,
      directRecruits: 12,
      monthlyEarnings: "₦52,400",
      teamRevenue: "₦8.5M",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      upline: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      level: 5,
      levelName: "Senior II Marketer",
      totalRecruits: 2847,
      directRecruits: 284,
      monthlyEarnings: "₦200,000",
      teamRevenue: "₦75M",
      status: "active",
      joinDate: "2023-08-20",
      lastActive: "30 minutes ago",
      upline: "Mike Chen",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      level: 8,
      levelName: "Expert Marketer",
      totalRecruits: 15420,
      directRecruits: 1542,
      monthlyEarnings: "₦700,000",
      teamRevenue: "₦170M",
      status: "active",
      joinDate: "2023-03-10",
      lastActive: "1 hour ago",
      upline: "Admin",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      level: 1,
      levelName: "Apprentice/Beginner",
      totalRecruits: 23,
      directRecruits: 3,
      monthlyEarnings: "₦0",
      teamRevenue: "₦2.1M",
      status: "pending",
      joinDate: "2024-11-01",
      lastActive: "5 minutes ago",
      upline: "John Doe",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@example.com",
      level: 3,
      levelName: "Junior Marketer",
      totalRecruits: 456,
      directRecruits: 45,
      monthlyEarnings: "₦80,000",
      teamRevenue: "₦20M",
      status: "suspended",
      joinDate: "2023-12-05",
      lastActive: "2 days ago",
      upline: "Sarah Johnson",
    },
  ]

  const getLevelBadgeColor = (level: number) => {
    if (level <= 2) return "bg-gray-100 text-gray-800"
    if (level <= 4) return "bg-blue-100 text-blue-800"
    if (level <= 6) return "bg-green-100 text-green-800"
    if (level <= 8) return "bg-purple-100 text-purple-800"
    return "bg-yellow-100 text-yellow-800"
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === "all" || user.level.toString() === filterLevel
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesLevel && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Image src="/timoyex-logo.jpg" alt="TIMOYEX" width={32} height={32} className="rounded" />
            <div>
              <span className="text-white font-bold text-sm">TIMOYEX</span>
              <div className="flex items-center gap-1">
                <Badge className="bg-red-600 text-white text-xs px-1 py-0">ADMIN</Badge>
                <Shield className="w-3 h-3 text-red-500" />
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
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
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
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
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Image src="/timoyex-logo.jpg" alt="TIMOYEX" width={40} height={40} className="rounded" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                  <p className="text-slate-600">Manage all user accounts and profiles</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </header>

        {/* User Management Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">2,847</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Users</p>
                    <p className="text-2xl font-bold text-slate-900">2,654</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Users</p>
                    <p className="text-2xl font-bold text-slate-900">156</p>
                  </div>
                  <XCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Suspended</p>
                    <p className="text-2xl font-bold text-slate-900">37</p>
                  </div>
                  <Ban className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                      <SelectItem value="5">Level 5</SelectItem>
                      <SelectItem value="6">Level 6</SelectItem>
                      <SelectItem value="7">Level 7</SelectItem>
                      <SelectItem value="8">Level 8</SelectItem>
                      <SelectItem value="9">Level 9</SelectItem>
                      <SelectItem value="10">Level 10</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Level</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Recruits</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Earnings</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Last Active</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <p className="text-xs text-slate-400">Upline: {user.upline}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getLevelBadgeColor(user.level)} border-0`}>Level {user.level}</Badge>
                          <p className="text-xs text-slate-500 mt-1">{user.levelName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-900">{user.totalRecruits} total</p>
                            <p className="text-sm text-slate-500">{user.directRecruits} direct</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-900">{user.monthlyEarnings}</p>
                            <p className="text-sm text-slate-500">Team: {user.teamRevenue}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusBadgeColor(user.status)} border-0 capitalize`}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-slate-600">{user.lastActive}</p>
                          <p className="text-xs text-slate-400">Joined {user.joinDate}</p>
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="w-4 h-4 mr-2" />
                                View Activity
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

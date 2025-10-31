"use client"

import { useState } from "react"
import {
  Megaphone,
  Plus,
  Search,
  MoreHorizontal,
  Send,
  Edit,
  Trash2,
  Users,
  Calendar,
  Eye,
  Shield,
  Menu,
  LogOut,
  BarChart3,
  CreditCard,
  Settings,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function AnnouncementManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general",
    targetAudience: "all",
    priority: "normal",
    scheduledDate: "",
  })

  const navigationItems = [
    { name: "Overview", href: "/admin/dashboard", icon: BarChart3, active: false },
    { name: "User Management", href: "/admin/users", icon: Users, active: false },
    { name: "Payment Management", href: "/admin/payments", icon: CreditCard, active: false },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone, active: true },
    { name: "Settings", href: "/admin/settings", icon: Settings, active: false },
  ]

  const announcements = [
    {
      id: "ANN-001",
      title: "Monthly Performance Review - December 2024",
      content:
        "Dear Marketers, we are pleased to announce the December performance results. Top performers will receive special recognition and bonuses. Check your dashboard for detailed metrics.",
      type: "performance",
      status: "sent",
      priority: "high",
      targetAudience: "all",
      recipients: 2847,
      openRate: "78%",
      createdDate: "2024-12-27",
      sentDate: "2024-12-27",
      createdBy: "Admin",
    },
    {
      id: "ANN-002",
      title: "New Level 10 Benefits Announcement",
      content:
        "We are excited to introduce enhanced benefits for Level 10 Ultimate Marketers, including increased house fund to ₦25M and additional franchise opportunities.",
      type: "system",
      status: "draft",
      priority: "high",
      targetAudience: "level-8-plus",
      recipients: 45,
      openRate: "0%",
      createdDate: "2024-12-26",
      sentDate: null,
      createdBy: "Admin",
    },
    {
      id: "ANN-003",
      title: "Holiday Season Bonus Program",
      content:
        "Special holiday bonuses are now available for all active marketers who meet their monthly targets. Additional Dubai trip opportunities for Level 8+ marketers.",
      type: "promotion",
      status: "scheduled",
      priority: "normal",
      targetAudience: "active",
      recipients: 2654,
      openRate: "0%",
      createdDate: "2024-12-25",
      sentDate: "2024-12-31",
      createdBy: "Admin",
    },
    {
      id: "ANN-004",
      title: "System Maintenance Notice",
      content:
        "The marketer dashboard will undergo scheduled maintenance on January 1st, 2025 from 2:00 AM to 4:00 AM. All services will be temporarily unavailable during this period.",
      type: "system",
      status: "sent",
      priority: "normal",
      targetAudience: "all",
      recipients: 2847,
      openRate: "92%",
      createdDate: "2024-12-24",
      sentDate: "2024-12-24",
      createdBy: "Admin",
    },
    {
      id: "ANN-005",
      title: "New Referral Code System Update",
      content:
        "We have updated our referral code system to provide better tracking and rewards. All existing codes remain valid, and new features are now available in your dashboard.",
      type: "feature",
      status: "sent",
      priority: "low",
      targetAudience: "all",
      recipients: 2847,
      openRate: "65%",
      createdDate: "2024-12-23",
      sentDate: "2024-12-23",
      createdBy: "Admin",
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "sent":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "system":
        return "bg-purple-100 text-purple-800"
      case "performance":
        return "bg-green-100 text-green-800"
      case "promotion":
        return "bg-orange-100 text-orange-800"
      case "feature":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || announcement.status === filterStatus
    const matchesType = filterType === "all" || announcement.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateAnnouncement = () => {
    console.log("[v0] Creating announcement:", newAnnouncement)
    // TODO: Implement actual announcement creation logic
    setCreateDialogOpen(false)
    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      targetAudience: "all",
      priority: "normal",
      scheduledDate: "",
    })
  }

  const totalSent = announcements.filter((a) => a.status === "sent").length
  const totalDrafts = announcements.filter((a) => a.status === "draft").length
  const totalScheduled = announcements.filter((a) => a.status === "scheduled").length
  const avgOpenRate =
    announcements
      .filter((a) => a.status === "sent")
      .reduce((sum, a) => sum + Number.parseInt(a.openRate.replace("%", "")), 0) / totalSent

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="text-white font-bold text-lg">Admin Panel</span>
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
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Announcement Management</h1>
                <p className="text-slate-600">Create and manage announcements for all users</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
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
          </div>
        </header>

        {/* Announcement Management Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Sent</p>
                    <p className="text-2xl font-bold text-slate-900">{totalSent}</p>
                  </div>
                  <Send className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Drafts</p>
                    <p className="text-2xl font-bold text-slate-900">{totalDrafts}</p>
                  </div>
                  <Edit className="w-8 h-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Scheduled</p>
                    <p className="text-2xl font-bold text-slate-900">{totalScheduled}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Open Rate</p>
                    <p className="text-2xl font-bold text-slate-900">{Math.round(avgOpenRate)}%</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-600" />
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
                      placeholder="Search announcements by title, content, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">All Announcements ({filteredAnnouncements.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Recipients</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Open Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnnouncements.map((announcement) => (
                      <tr key={announcement.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-900">{announcement.title}</p>
                            <p className="text-sm text-slate-500 line-clamp-2">{announcement.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getPriorityBadgeColor(announcement.priority)} border-0 text-xs`}>
                                {announcement.priority}
                              </Badge>
                              <span className="text-xs text-slate-400">{announcement.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getTypeBadgeColor(announcement.type)} border-0 capitalize`}>
                            {announcement.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusBadgeColor(announcement.status)} border-0 capitalize`}>
                            {announcement.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900">
                              {announcement.recipients.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 capitalize">{announcement.targetAudience}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-900">{announcement.openRate}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-slate-600">
                            {announcement.status === "sent"
                              ? `Sent ${announcement.sentDate}`
                              : `Created ${announcement.createdDate}`}
                          </p>
                          {announcement.status === "scheduled" && (
                            <p className="text-xs text-blue-600">Scheduled: {announcement.sentDate}</p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {announcement.status === "draft" && (
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="w-4 h-4 mr-2" />
                                  View Recipients
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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

      {/* Create Announcement Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <Select
                  value={newAnnouncement.type}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
              <Textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Enter announcement content"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
                <Select
                  value={newAnnouncement.targetAudience}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="level-1-3">Level 1-3</SelectItem>
                    <SelectItem value="level-4-6">Level 4-6</SelectItem>
                    <SelectItem value="level-7-10">Level 7-10</SelectItem>
                    <SelectItem value="level-8-plus">Level 8+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <Select
                  value={newAnnouncement.priority}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Schedule Date (Optional)</label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.scheduledDate}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scheduledDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleCreateAnnouncement}>
                Save as Draft
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleCreateAnnouncement}>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

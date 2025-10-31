"use client"

import { useState } from "react"
import {
  CreditCard,
  Search,
  MoreHorizontal,
  Check,
  X,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Shield,
  Menu,
  LogOut,
  BarChart3,
  Users,
  Megaphone,
  Settings,
  Download,
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

export default function PaymentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAmount, setFilterAmount] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const navigationItems = [
    { name: "Overview", href: "/admin/dashboard", icon: BarChart3, active: false },
    { name: "User Management", href: "/admin/users", icon: Users, active: false },
    { name: "Payment Management", href: "/admin/payments", icon: CreditCard, active: true },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone, active: false },
    { name: "Settings", href: "/admin/settings", icon: Settings, active: false },
  ]

  const payments = [
    {
      id: "PAY-001",
      user: {
        name: "John Doe",
        email: "john@example.com",
        level: 2,
        avatar: "/placeholder-user.jpg",
        joinDate: "2024-01-15",
        directRecruits: 8,
        totalNetwork: 45,
      },
      amount: "₦52,400",
      type: "Monthly Salary",
      status: "pending",
      requestDate: "2024-12-27",
      dueDate: "2024-12-31",
      bankDetails: {
        accountName: "John Doe",
        accountNumber: "1234567890",
        bankName: "First Bank",
        bankCode: "011",
        verified: true,
      },
      teamRevenue: "₦8.5M",
      qualificationMet: true,
      qualificationDetails: {
        minimumTeamRevenue: "₦5M",
        actualTeamRevenue: "₦8.5M",
        minimumDirectRecruits: 5,
        actualDirectRecruits: 8,
        minimumNetworkSize: 30,
        actualNetworkSize: 45,
        activeMonths: 11,
        minimumActiveMonths: 6,
      },
      note: "Monthly salary for Level 2 marketer",
    },
    {
      id: "PAY-002",
      user: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        level: 5,
        avatar: "/placeholder-user.jpg",
        joinDate: "2023-08-20",
        directRecruits: 25,
        totalNetwork: 180,
      },
      amount: "₦200,000",
      type: "Monthly Salary",
      status: "approved",
      requestDate: "2024-12-25",
      dueDate: "2024-12-30",
      bankDetails: {
        accountName: "Sarah Johnson",
        accountNumber: "0987654321",
        bankName: "GTBank",
        bankCode: "058",
        verified: true,
      },
      teamRevenue: "₦75M",
      qualificationMet: true,
      qualificationDetails: {
        minimumTeamRevenue: "₦50M",
        actualTeamRevenue: "₦75M",
        minimumDirectRecruits: 20,
        actualDirectRecruits: 25,
        minimumNetworkSize: 150,
        actualNetworkSize: 180,
        activeMonths: 16,
        minimumActiveMonths: 12,
      },
      note: "Monthly salary for Level 5 marketer - Assistant Branch Manager",
    },
    {
      id: "PAY-003",
      user: {
        name: "Mike Chen",
        email: "mike@example.com",
        level: 8,
        avatar: "/placeholder-user.jpg",
        joinDate: "2023-03-10",
        directRecruits: 50,
        totalNetwork: 420,
      },
      amount: "₦700,000",
      type: "Monthly Salary + Car Bonus",
      status: "processing",
      requestDate: "2024-12-24",
      dueDate: "2024-12-29",
      bankDetails: {
        accountName: "Mike Chen",
        accountNumber: "1122334455",
        bankName: "Access Bank",
        bankCode: "044",
        verified: true,
      },
      teamRevenue: "₦170M",
      qualificationMet: true,
      qualificationDetails: {
        minimumTeamRevenue: "₦150M",
        actualTeamRevenue: "₦170M",
        minimumDirectRecruits: 40,
        actualDirectRecruits: 50,
        minimumNetworkSize: 400,
        actualNetworkSize: 420,
        activeMonths: 21,
        minimumActiveMonths: 18,
      },
      note: "Monthly salary for Level 8 Expert Marketer + SUV car bonus",
    },
    {
      id: "PAY-004",
      user: {
        name: "Emily Davis",
        email: "emily@example.com",
        level: 1,
        avatar: "/placeholder-user.jpg",
        joinDate: "2024-11-01",
        directRecruits: 2,
        totalNetwork: 8,
      },
      amount: "₦10,000",
      type: "Commission",
      status: "rejected",
      requestDate: "2024-12-26",
      dueDate: "2024-12-31",
      bankDetails: {
        accountName: "Emily Davis",
        accountNumber: "5566778899",
        bankName: "UBA",
        bankCode: "033",
        verified: false,
      },
      teamRevenue: "₦2.1M",
      qualificationMet: false,
      qualificationDetails: {
        minimumTeamRevenue: "₦5M",
        actualTeamRevenue: "₦2.1M",
        minimumDirectRecruits: 5,
        actualDirectRecruits: 2,
        minimumNetworkSize: 15,
        actualNetworkSize: 8,
        activeMonths: 1,
        minimumActiveMonths: 3,
      },
      note: "Commission request - Multiple qualification criteria not met",
    },
    {
      id: "PAY-005",
      user: {
        name: "David Wilson",
        email: "david@example.com",
        level: 3,
        avatar: "/placeholder-user.jpg",
        joinDate: "2024-05-12",
        directRecruits: 12,
        totalNetwork: 68,
      },
      amount: "₦80,000",
      type: "Monthly Salary",
      status: "pending",
      requestDate: "2024-12-27",
      dueDate: "2024-12-31",
      bankDetails: {
        accountName: "David Wilson",
        accountNumber: "9988776655",
        bankName: "Zenith Bank",
        bankCode: "057",
        verified: true,
      },
      teamRevenue: "₦20M",
      qualificationMet: true,
      qualificationDetails: {
        minimumTeamRevenue: "₦15M",
        actualTeamRevenue: "₦20M",
        minimumDirectRecruits: 10,
        actualDirectRecruits: 12,
        minimumNetworkSize: 60,
        actualNetworkSize: 68,
        activeMonths: 7,
        minimumActiveMonths: 6,
      },
      note: "Monthly salary for Level 3 Junior Marketer",
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
        return <Check className="w-4 h-4" />
      case "processing":
        return <TrendingUp className="w-4 h-4" />
      case "completed":
        return <Check className="w-4 h-4" />
      case "rejected":
        return <X className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    const matchesAmount =
      filterAmount === "all" ||
      (filterAmount === "low" && Number.parseInt(payment.amount.replace(/[₦,]/g, "")) < 100000) ||
      (filterAmount === "medium" &&
        Number.parseInt(payment.amount.replace(/[₦,]/g, "")) >= 100000 &&
        Number.parseInt(payment.amount.replace(/[₦,]/g, "")) < 500000) ||
      (filterAmount === "high" && Number.parseInt(payment.amount.replace(/[₦,]/g, "")) >= 500000)
    return matchesSearch && matchesStatus && matchesAmount
  })

  const handlePaymentAction = (payment: any, action: "approve" | "reject") => {
    setSelectedPayment(payment)
    setActionType(action)
    setActionDialogOpen(true)
  }

  const confirmAction = () => {
    console.log(`[v0] ${actionType} payment ${selectedPayment?.id} with note: ${actionNote}`)
    // TODO: Implement actual payment processing logic
    setActionDialogOpen(false)
    setActionNote("")
    setSelectedPayment(null)
    setActionType(null)
  }

  const openPaymentDetails = (payment: any) => {
    setSelectedPayment(payment)
    setDetailsDialogOpen(true)
  }

  const totalPending = payments.filter((p) => p.status === "pending").length
  const totalAmount = payments.reduce((sum, p) => sum + Number.parseInt(p.amount.replace(/[₦,]/g, "")), 0)
  const approvedToday = payments.filter((p) => p.status === "approved").length
  const rejectedToday = payments.filter((p) => p.status === "rejected").length

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
                <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
                <p className="text-slate-600">Process and manage all payment requests</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
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

        {/* Payment Management Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-slate-900">{totalPending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-900">₦{totalAmount.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved Today</p>
                    <p className="text-2xl font-bold text-slate-900">{approvedToday}</p>
                  </div>
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Rejected Today</p>
                    <p className="text-2xl font-bold text-slate-900">{rejectedToday}</p>
                  </div>
                  <X className="w-8 h-8 text-red-600" />
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
                      placeholder="Search by user name, email, or payment ID..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterAmount} onValueChange={setFilterAmount}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Amounts</SelectItem>
                      <SelectItem value="low">Under ₦100K</SelectItem>
                      <SelectItem value="medium">₦100K - ₦500K</SelectItem>
                      <SelectItem value="high">Above ₦500K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Payment Requests ({filteredPayments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Payment ID</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">User & Level</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Amount & Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Bank Details</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Qualification</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-900">{payment.id}</p>
                          <p className="text-xs text-slate-500">Requested {payment.requestDate}</p>
                          <p className="text-xs text-slate-400">Due: {payment.dueDate}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600">
                                {payment.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{payment.user.name}</p>
                              <p className="text-sm text-slate-500">Level {payment.user.level}</p>
                              <p className="text-xs text-slate-400">{payment.user.email}</p>
                              <p className="text-xs text-slate-400">
                                {payment.user.directRecruits} direct • {payment.user.totalNetwork} total
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-900 text-lg">{payment.amount}</p>
                          <p className="text-sm text-slate-500">Team: {payment.teamRevenue}</p>
                          <p className="text-xs text-slate-400">{payment.type}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-900">{payment.bankDetails.accountName}</p>
                            <p className="text-xs text-slate-600">{payment.bankDetails.bankName}</p>
                            <p className="text-xs text-slate-500">{payment.bankDetails.accountNumber}</p>
                            <div className="flex items-center gap-1">
                              {payment.bankDetails.verified ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-red-600" />
                              )}
                              <span
                                className={`text-xs ${payment.bankDetails.verified ? "text-green-600" : "text-red-600"}`}
                              >
                                {payment.bankDetails.verified ? "Verified" : "Unverified"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {payment.qualificationMet ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span
                                className={`text-sm font-medium ${payment.qualificationMet ? "text-green-600" : "text-red-600"}`}
                              >
                                {payment.qualificationMet ? "Qualified" : "Not Qualified"}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 space-y-0.5">
                              <div
                                className={`${payment.qualificationDetails.actualTeamRevenue >= payment.qualificationDetails.minimumTeamRevenue ? "text-green-600" : "text-red-600"}`}
                              >
                                Revenue: {payment.qualificationDetails.actualTeamRevenue} /{" "}
                                {payment.qualificationDetails.minimumTeamRevenue}
                              </div>
                              <div
                                className={`${payment.qualificationDetails.actualDirectRecruits >= payment.qualificationDetails.minimumDirectRecruits ? "text-green-600" : "text-red-600"}`}
                              >
                                Recruits: {payment.qualificationDetails.actualDirectRecruits} /{" "}
                                {payment.qualificationDetails.minimumDirectRecruits}
                              </div>
                              <div
                                className={`${payment.qualificationDetails.actualNetworkSize >= payment.qualificationDetails.minimumNetworkSize ? "text-green-600" : "text-red-600"}`}
                              >
                                Network: {payment.qualificationDetails.actualNetworkSize} /{" "}
                                {payment.qualificationDetails.minimumNetworkSize}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={`${getStatusBadgeColor(payment.status)} border-0 capitalize flex items-center gap-1`}
                          >
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </Badge>
                          {new Date(payment.dueDate) < new Date() && payment.status === "pending" && (
                            <p className="text-xs text-red-500 mt-1">Overdue</p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {payment.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handlePaymentAction(payment, "approve")}
                                  disabled={!payment.qualificationMet || !payment.bankDetails.verified}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handlePaymentAction(payment, "reject")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openPaymentDetails(payment)}>
                                  View Full Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                                <DropdownMenuItem>Payment History</DropdownMenuItem>
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

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Payment" : "Reject Payment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                Payment ID: <span className="font-medium">{selectedPayment?.id}</span>
              </p>
              <p className="text-sm text-slate-600">
                User: <span className="font-medium">{selectedPayment?.user.name}</span>
              </p>
              <p className="text-sm text-slate-600">
                Amount: <span className="font-medium">{selectedPayment?.amount}</span>
              </p>
              <p className="text-sm text-slate-600">
                Bank:{" "}
                <span className="font-medium">
                  {selectedPayment?.bankDetails.bankName} - {selectedPayment?.bankDetails.accountNumber}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {actionType === "approve" ? "Approval Note" : "Rejection Reason"}
              </label>
              <Textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={actionType === "approve" ? "Add approval note..." : "Explain reason for rejection..."}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                onClick={confirmAction}
              >
                {actionType === "approve" ? "Approve Payment" : "Reject Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Payment Information Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details - {selectedPayment?.id}</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-slate-600">
                        {selectedPayment.user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{selectedPayment.user.name}</p>
                      <p className="text-sm text-slate-500">{selectedPayment.user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Level</p>
                      <p className="font-medium">{selectedPayment.user.level}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Join Date</p>
                      <p className="font-medium">{selectedPayment.user.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Direct Recruits</p>
                      <p className="font-medium">{selectedPayment.user.directRecruits}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Total Network</p>
                      <p className="font-medium">{selectedPayment.user.totalNetwork}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bank Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-slate-600">Account Name</p>
                      <p className="font-medium">{selectedPayment.bankDetails.accountName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Account Number</p>
                      <p className="font-medium">{selectedPayment.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Bank Name</p>
                      <p className="font-medium">{selectedPayment.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Bank Code</p>
                      <p className="font-medium">{selectedPayment.bankDetails.bankCode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPayment.bankDetails.verified ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${selectedPayment.bankDetails.verified ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedPayment.bankDetails.verified ? "Account Verified" : "Account Not Verified"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-sm text-slate-600">Amount</p>
                      <p className="font-bold text-lg">{selectedPayment.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Type</p>
                      <p className="font-medium">{selectedPayment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Request Date</p>
                      <p className="font-medium">{selectedPayment.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Due Date</p>
                      <p className="font-medium">{selectedPayment.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Revenue</p>
                      <p className="font-medium">{selectedPayment.teamRevenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Status</p>
                      <Badge className={`${getStatusBadgeColor(selectedPayment.status)} border-0 capitalize`}>
                        {selectedPayment.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Note</p>
                    <p className="text-sm">{selectedPayment.note}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Qualification Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Qualification Status
                    {selectedPayment.qualificationMet ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Team Revenue</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{selectedPayment.qualificationDetails.actualTeamRevenue}</p>
                        <p className="text-xs text-slate-500">
                          Required: {selectedPayment.qualificationDetails.minimumTeamRevenue}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Direct Recruits</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {selectedPayment.qualificationDetails.actualDirectRecruits}
                        </p>
                        <p className="text-xs text-slate-500">
                          Required: {selectedPayment.qualificationDetails.minimumDirectRecruits}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Network Size</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{selectedPayment.qualificationDetails.actualNetworkSize}</p>
                        <p className="text-xs text-slate-500">
                          Required: {selectedPayment.qualificationDetails.minimumNetworkSize}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Active Months</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{selectedPayment.qualificationDetails.activeMonths}</p>
                        <p className="text-xs text-slate-500">
                          Required: {selectedPayment.qualificationDetails.minimumActiveMonths}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

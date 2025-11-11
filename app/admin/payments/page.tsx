"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPayments } from "@/hooks/admin-payments.hook";
import { AdminInfoCardV2 } from "@/components/custom/admincardV2";
import { useCursorPagination } from "@/lib/pagination-fn";
import { DataTable } from "@/components/custom/dataTable";
import { EmptyState, paymentColumns } from "./components/columns";

export default function PaymentManagement() {
  const { paymentStatsQuery, paymentListQuery, isPaymentListLoading } =
    useAdminPayments({});

  const paymentStats = paymentStatsQuery.data;
  const paymentsV2 = paymentListQuery.data;
  const paymentData = paymentsV2?.payments;

  const [searchQuery, setSearchQuery] = useState("");

  const pagination = useCursorPagination();

  function FilterSlots({ table }: { table: any }) {
    const statusValue =
      (table.getColumn("status")?.getFilterValue() as string) ?? "";

    return (
      <Select
        value={statusValue}
        onValueChange={(val) => table.getColumn("status")?.setFilterValue(val)}
      >
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
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [actionNote, setActionNote] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmAction = () => {
    console.log(
      `[v0] ${actionType} payment ${selectedPayment?.id} with note: ${actionNote}`
    );
    // TODO: Implement actual payment processing logic
    setActionDialogOpen(false);
    setActionNote("");
    setSelectedPayment(null);
    setActionType(null);
  };

  const stats = [
    {
      title: "Pending Requests",
      value: Number(paymentStats?.byStatus?.pending.count) || 0,
      icon: Clock,
      iconBg: "text-yellow-600",
      bgColor: "text-yellow-100",
      desc: "Need Attending To!",
    },
    {
      title: "Total Amount (Requested/Rejected/Approved)",
      value: Number(paymentStats?.totalAmount || 0).toLocaleString("en-NG", {
        currency: "NGN",
        notation: "compact",
        style: "currency",
      }),
      icon: DollarSign,
      iconBg: "text-green-600",
      bgColor: "text-green-100",
      desc: "(Approximate)",
    },
    {
      title: "Approved Today",
      value: paymentStats?.today?.processing || 0,
      icon: Check,
      iconBg: "text-green-600",
      bgColor: "text-green-100",
      desc: "Requests Approved Today",
    },
    {
      title: "Rejected Today",
      value: paymentStats?.today?.rejected || 0,
      icon: X,
      iconBg: "text-red-600",
      bgColor: "text-red-100",
      desc: "Requests Rejected/Declined Today",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Payment Management Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((s, index) => (
              <AdminInfoCardV2
                title={s.title}
                value={s.value}
                icon={s.icon}
                iconBg={s.iconBg}
                bgColor={s.bgColor}
                desc={s.desc || ""}
                key={index}
              />
            ))}
          </div>

          {/* Payments Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Payment Requests ({paymentsV2?.total || 0})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isPaymentListLoading && (
                <DataTable
                  data={[]}
                  columns={paymentColumns}
                  emptyState={<EmptyState />}
                />
              )}
              {!isPaymentListLoading && (
                <DataTable
                  data={paymentData || []}
                  columns={paymentColumns}
                  searchPlaceholder="Search announcements by title, message, or ID..."
                  emptyState={<EmptyState />}
                  filterSlot={({ table }) => <FilterSlots table={table} />}
                  globalSearchColumns={["title"]}
                  serverSide={{
                    searchQuery,
                    onSearchChange: (value) => {
                      setSearchQuery(value);
                      pagination.reset();
                    },
                    hasMore:
                      Boolean(paymentsV2?.nextCursor) ??
                      paymentsV2?.hasMore ??
                      false,
                    onNextPage: () => {
                      if (paymentsV2?.nextCursor) {
                        pagination.goNext(paymentsV2?.nextCursor!);
                      }
                    },
                    onPrevPage: () => {
                      if (paymentsV2?.prevCursor) {
                        pagination.goPrev(paymentsV2?.prevCursor!);
                      }
                    },
                    onFirstPage: pagination.reset,
                    canGoPrev: !!paymentsV2?.prevCursor,
                    isFirstPage: pagination.cursor === null,
                    isLoading: isPaymentListLoading,
                    currentPageSize: paymentData?.length || 0,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Payment" : "Reject Payment"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                Payment ID:{" "}
                <span className="font-medium">{selectedPayment?.id}</span>
              </p>
              <p className="text-sm text-slate-600">
                User:{" "}
                <span className="font-medium">
                  {selectedPayment?.user.name}
                </span>
              </p>
              <p className="text-sm text-slate-600">
                Amount:{" "}
                <span className="font-medium">{selectedPayment?.amount}</span>
              </p>
              <p className="text-sm text-slate-600">
                Bank:{" "}
                <span className="font-medium">
                  {selectedPayment?.bankDetails.bankName} -{" "}
                  {selectedPayment?.bankDetails.accountNumber}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {actionType === "approve"
                  ? "Approval Note"
                  : "Rejection Reason"}
              </label>
              <Textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "Add approval note..."
                    : "Explain reason for rejection..."
                }
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
                onClick={confirmAction}
              >
                {actionType === "approve"
                  ? "Approve Payment"
                  : "Reject Payment"}
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
                      <p className="font-medium text-slate-900">
                        {selectedPayment.user.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedPayment.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Level</p>
                      <p className="font-medium">
                        {selectedPayment.user.level}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Join Date</p>
                      <p className="font-medium">
                        {selectedPayment.user.joinDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Direct Recruits</p>
                      <p className="font-medium">
                        {selectedPayment.user.directRecruits}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Total Network</p>
                      <p className="font-medium">
                        {selectedPayment.user.totalNetwork}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Bank Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-slate-600">Account Name</p>
                      <p className="font-medium">
                        {selectedPayment.bankDetails.accountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Account Number</p>
                      <p className="font-medium">
                        {selectedPayment.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Bank Name</p>
                      <p className="font-medium">
                        {selectedPayment.bankDetails.bankName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Bank Code</p>
                      <p className="font-medium">
                        {selectedPayment.bankDetails.bankCode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPayment.bankDetails.verified ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          selectedPayment.bankDetails.verified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedPayment.bankDetails.verified
                          ? "Account Verified"
                          : "Account Not Verified"}
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
                      <p className="font-bold text-lg">
                        {selectedPayment.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Type</p>
                      <p className="font-medium">{selectedPayment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Request Date</p>
                      <p className="font-medium">
                        {selectedPayment.requestDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Due Date</p>
                      <p className="font-medium">{selectedPayment.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Revenue</p>
                      <p className="font-medium">
                        {selectedPayment.teamRevenue}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Status</p>
                      <Badge
                        className={`${getStatusBadgeColor(
                          selectedPayment.status
                        )} border-0 capitalize`}
                      >
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
                      <span className="text-sm text-slate-600">
                        Team Revenue
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {
                            selectedPayment.qualificationDetails
                              .actualTeamRevenue
                          }
                        </p>
                        <p className="text-xs text-slate-500">
                          Required:{" "}
                          {
                            selectedPayment.qualificationDetails
                              .minimumTeamRevenue
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        Direct Recruits
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {
                            selectedPayment.qualificationDetails
                              .actualDirectRecruits
                          }
                        </p>
                        <p className="text-xs text-slate-500">
                          Required:{" "}
                          {
                            selectedPayment.qualificationDetails
                              .minimumDirectRecruits
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        Network Size
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {
                            selectedPayment.qualificationDetails
                              .actualNetworkSize
                          }
                        </p>
                        <p className="text-xs text-slate-500">
                          Required:{" "}
                          {
                            selectedPayment.qualificationDetails
                              .minimumNetworkSize
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        Active Months
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {selectedPayment.qualificationDetails.activeMonths}
                        </p>
                        <p className="text-xs text-slate-500">
                          Required:{" "}
                          {
                            selectedPayment.qualificationDetails
                              .minimumActiveMonths
                          }
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
    </div>
  );
}

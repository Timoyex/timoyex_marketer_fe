import { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  BellOff,
  Check,
  Clock,
  TrendingUp,
  X,
} from "lucide-react";
import { AdminPaymentsList } from "@/lib/api";
import { getEarningType } from "../../dashboard/page";
import { PaymentActions } from "./paymentActions";
import { Badge } from "@/components/ui/badge";

export const getEarningTypeColor = (type: string) => {
  switch (type) {
    case "direct_sales":
      return "bg-green-100 text-green-800";
    case "team_commission":
      return "bg-purple-100 text-purple-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};
export const getStatusBadgeColor = (status: string) => {
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

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "approved":
      return <Check className="w-4 h-4" />;
    case "processing":
      return <TrendingUp className="w-4 h-4" />;
    case "completed":
      return <Check className="w-4 h-4" />;
    case "rejected":
    case "cancelled":
    case "failed":
      return <X className="w-4 h-4" />;

    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <BellOff className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No new payment requests.</h3>
    <p className="text-muted-foreground text-center max-w-md">
      You're all caught up! Check back later for new requests.
    </p>
  </div>
);

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Column definitions
export const paymentColumns: ColumnDef<AdminPaymentsList>[] = [
  {
    accessorKey: "user",

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          User & Level
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      const initials = `${payment.user.firstName.charAt(
        0
      )}${payment.user.lastName.charAt(0)}`;

      return (
        <div className="pl-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 capitalize">
                {initials}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-900 capitalize">
                {payment.user?.firstName || ""} {payment.user?.lastName || ""}
              </p>
              <p className="text-sm text-slate-500">
                Level {payment.user.level}
              </p>
              <p className="text-xs text-slate-400">{payment.user.email}</p>
            </div>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Amount
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="pl-4">
          <p className="font-bold text-slate-900 text-lg">
            {Number(payment.amount).toLocaleString("en-NG", {
              currency: "NGN",
              style: "currency",
              notation: "compact",
            })}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Bank Details
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="pl-4">
          {payment.user.bankAccount ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">
                {payment.user.bankAccount?.accountName}
              </p>
              <p className="text-xs text-slate-600">
                {payment.user.bankAccount?.bankName}
              </p>
              <p className="text-xs text-slate-500">
                {payment.user.bankAccount?.accountNumber}
              </p>
              <div className="flex items-center gap-1">
                {payment.user.bankAccount?.isVerified ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-600" />
                )}
                <span
                  className={`text-xs ${
                    payment.user.bankAccount?.isVerified
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {payment.user.bankAccount?.isVerified
                    ? "Verified"
                    : "Unverified"}
                </span>
              </div>
            </div>
          ) : (
            "N/A"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "earningType",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Type
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="pl-4">
          <Badge
            className={`${getEarningTypeColor(
              payment.earningType
            )} border-0 capitalize flex items-center gap-1`}
          >
            {getEarningType(payment.earningType)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="pl-4">
          <Badge
            className={`${getStatusBadgeColor(
              payment.status
            )} border-0 capitalize flex items-center gap-1`}
          >
            {getStatusIcon(payment.status)}
            {payment.status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Actions
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return <PaymentActions payment={payment} />;
    },
  },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPaymentsList } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";
import { getEarningType } from "../../dashboard/page";
import { getStatusBadgeColor } from "./columns";
import { Badge } from "@/components/ui/badge";

export const PaymentRecord = ({
  payment,
}: {
  payment: Partial<AdminPaymentsList>;
}) => {
  const initials = `${payment.user?.firstName.charAt(
    0
  )}${payment.user?.lastName.charAt(0)}`;
  return (
    <div className="flex  gap-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-slate-600 capitalize">
                {initials}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-900">
                {payment.user?.firstName} {payment.user?.lastName}
              </p>
              <p className="text-sm text-slate-500">{payment.user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Level</p>
              <p className="font-medium">{payment.user?.level}</p>
            </div>
            <div>
              <p className="text-slate-600">Join Date</p>
              <p className="font-medium">
                {formatDate(
                  payment.user?.createdAt || new Date().toISOString()
                )}
              </p>
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
              <p className="font-medium">
                {payment.user?.bankAccount?.accountName}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Account Number</p>
              <p className="font-medium">
                {payment.user?.bankAccount?.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Bank Name</p>
              <p className="font-medium">
                {payment.user?.bankAccount?.bankName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {payment.user?.bankAccount?.isVerified ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  payment.user?.bankAccount?.isVerified
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {payment.user?.bankAccount?.isVerified
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
              <p className="font-bold text-lg">{payment.amount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Type</p>
              <p className="font-medium">
                {getEarningType(payment.earningType || "")}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Request Date</p>
              <p className="font-medium">{payment.createdAt}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Status</p>
              <Badge
                className={`${getStatusBadgeColor(
                  payment.status || "pending"
                )} border-0 capitalize`}
              >
                {payment.status}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600">Description</p>
            <p className="text-sm">{payment.description || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Note</p>
            <p className="text-sm">{payment.note || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, X } from "lucide-react";
import { AdminPaymentsList } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogContainer } from "@/components/custom/dialog-container";
import { PaymentDialog } from "./payment-dialog";
import { PaymentRecord } from "./payment-record";
import { OTPDialog } from "./otp-dialog";

export const PaymentActions = ({
  payment,
}: {
  payment: Partial<AdminPaymentsList>;
}) => {
  return (
    <div className="flex items-center gap-2">
      {payment.status === "pending" && (
        <>
          <DialogContainer
            title="Approve Payment"
            desc=""
            dialogComp={<PaymentDialog payment={payment} type="approve" />}
          >
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!payment.user?.bankAccount?.isVerified}
            >
              <Check className="w-4 h-4" />
            </Button>
          </DialogContainer>

          <DialogContainer
            title="Reject Request"
            desc=""
            dialogComp={<PaymentDialog payment={payment} type="reject" />}
          >
            <Button size="sm" variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </DialogContainer>
        </>
      )}
      {payment.status === "processing" && payment.requireOTP && (
        <DialogContainer
          title="Enter OTP to Approve Payment"
          desc=""
          dialogComp={<OTPDialog payment={payment} />}
        >
          <Button
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Enter OTP
          </Button>
        </DialogContainer>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogContainer
            title="Payment Details"
            desc=""
            dialogComp={<PaymentRecord payment={payment} />}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              View Full Details
            </DropdownMenuItem>
          </DialogContainer>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAdminPayments } from "@/hooks/admin-payments.hook";

export function PaymentInfoCard({
  name,
  level,
  amount,
  type = "Sale Commission",
  userId,
  id,
}: {
  name: string;
  level: string | number;
  amount?: number;
  type?: string;
  id: string;
  userId: string;
}) {
  const { updatePayment } = useAdminPayments({});

  const handleApprove = async () => {
    await updatePayment({
      id,
      data: { status: "processing", userId },
    });
  };
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              {name} - Level {level}
            </span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p className="font-semibold capitalize">
              Requested for:{" "}
              {Number(amount).toLocaleString("en-NG", {
                style: "currency",
                notation: "compact",
                currencySign: "accounting",
                currency: "NGN",
              })}{" "}
              in {type}
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve Payment
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Approve Payment of{" "}
                {Number(amount).toLocaleString("en-NG", {
                  style: "currency",
                  currencySign: "accounting",
                  currency: "NGN",
                })}
                ?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

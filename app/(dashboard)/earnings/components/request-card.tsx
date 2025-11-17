import { EarningHistoryEntity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/profile.hook";
import { useEarnings } from "@/hooks/earning.hook";
import { formatDate } from "@/lib/utils";

export const EarningCard = ({ earning }: { earning: EarningHistoryEntity }) => {
  const { profileQuery, isLoading } = useProfile();
  const { requestWithdrawal, isPaymentsUpdating } = useEarnings({});
  const bankAccount = profileQuery.data?.bankAccount;

  const canRequestPayment = bankAccount && bankAccount.isVerified;

  const handleRequest = async () => {
    await requestWithdrawal(earning.id);
    return;
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">
              {Number(earning.amount || 0).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </h3>
            <p className="text-sm text-gray-600">{earning.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 ml-12">
          <span className="capitalize">{earning.type?.replace("_", " ")}</span>
          <span>•</span>
          <span>{formatDate(new Date(earning.createdAt).toISOString())}</span>
          <span>•</span>
        </div>
      </div>

      <Button
        onClick={handleRequest}
        disabled={isLoading || !canRequestPayment || isPaymentsUpdating}
        className={`ml-4 ${
          !canRequestPayment
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Request Payment
      </Button>
    </div>
  );
};

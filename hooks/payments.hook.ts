import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { paymentsApi, PaymentsFilter } from "@/lib/api";
import { toast } from "sonner";

const PAYMENT_QUERY_KEY = ["payments"];

export function usePayments(params?: PaymentsFilter) {
  const queryClient = useQueryClient();
  // Get profile query
  const paymentHistoryQuery = useQuery({
    queryKey: [...PAYMENT_QUERY_KEY, params],
    queryFn: async () => {
      const response = await paymentsApi.history(params);

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update profile mutation
  const requestPaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await paymentsApi.requestWithdrawal(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PAYMENT_QUERY_KEY, params],
      });

      toast.success("Payment Requested Successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request payment");
    },
  });

  return {
    // Queries
    paymentHistoryQuery,

    // Actions
    requestWithdrawal: (id: string) => requestPaymentMutation.mutate(id),
    refetchPayments: paymentHistoryQuery.refetch,

    // States
    isPaymentsLoading: paymentHistoryQuery.isPending,
    isPaymentsUpdating: requestPaymentMutation.isPending,

    // Errors
    paymentHistoryError: paymentHistoryQuery.error,
    withdrawalError: requestPaymentMutation.error,
  };
}

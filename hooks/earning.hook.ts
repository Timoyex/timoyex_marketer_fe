import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { EarningFilter, earningsApi, paymentsApi } from "@/lib/api";
import { toast } from "sonner";

const PROFILE_QUERY_KEY = ["earnings"];

export function useEarnings(params?: EarningFilter) {
  const queryClient = useQueryClient();
  // Get profile query
  const earningsOverviewQuery = useQuery({
    queryKey: [...PROFILE_QUERY_KEY, params],
    queryFn: async () => {
      const response = await earningsApi.overview(params);

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  const earningsBreakdownQuery = useQuery({
    queryKey: [...PROFILE_QUERY_KEY, params],
    queryFn: async () => {
      const response = await earningsApi.breakdown(params);

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  const earningsHistoryQuery = useQuery({
    queryKey: [...PROFILE_QUERY_KEY, "history", params],
    queryFn: async () => {
      const response = await earningsApi.history(params);

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
        queryKey: [...PROFILE_QUERY_KEY, params],
      });

      toast.success("Payment Requested Successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request payment");
    },
  });

  return {
    // Queries
    earningsBreakdownQuery,
    earningsHistoryQuery: earningsHistoryQuery,
    earningsOverviewQuery,

    // Actions
    requestWithdrawal: (id: string) => requestPaymentMutation.mutateAsync(id),

    // States
    isOverviewLoading: earningsOverviewQuery.isPending,
    isBreakdownLoading: earningsBreakdownQuery.isPending,
    isHistoryLoading: earningsHistoryQuery.isPending,
    isPaymentsUpdating: requestPaymentMutation.isPending,

    // Errors
    overviewError: earningsOverviewQuery.error,
    breakdownError: earningsBreakdownQuery.error,
    historyError: earningsHistoryQuery.error,
  };
}

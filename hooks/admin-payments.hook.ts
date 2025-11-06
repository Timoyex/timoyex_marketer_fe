import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { paymentsApi, PaymentsEntity, PaymentsFilter } from "@/lib/api";
import { toast } from "sonner";

const PAYMENT_QUERY_KEY = ["admin-payments"];

export function useAdminPayments(params?: PaymentsFilter) {
  const queryClient = useQueryClient();
  // Get profile query
  const paymentListQuery = useQuery({
    queryKey: [...PAYMENT_QUERY_KEY, params],
    queryFn: async () => {
      const response = await paymentsApi.list(params);

      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    retryDelay: 60 * 1000,
  });
  const paymentStatsQuery = useQuery({
    queryKey: [...PAYMENT_QUERY_KEY, "stats"],
    queryFn: async () => {
      const response = await paymentsApi.stats();

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retryDelay: 60 * 1000,
  });

  // Update Payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: paymentsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PAYMENT_QUERY_KEY, params],
      });
      queryClient.invalidateQueries({
        queryKey: [...PAYMENT_QUERY_KEY, "stats"],
      });
      toast.success("Payment Updated Successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update payment");
    },
    onMutate: () => toast.success("Payment Updating"),
  });

  return {
    // Queries
    paymentListQuery,
    paymentStatsQuery,

    // Actions
    updatePayment: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PaymentsEntity>;
    }) => updatePaymentMutation.mutateAsync({ id, data }),

    // States
    isPaymentStatsLoading: paymentStatsQuery.isPending,
    isPaymentListLoading: paymentListQuery.isPending,

    // Errors
    paymentListError: paymentListQuery.error,
    paymentStatsError: paymentStatsQuery.error,
  };
}

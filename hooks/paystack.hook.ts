import { useQuery } from "@tanstack/react-query";

import { paystackApi } from "@/lib/api";

const PAYSTACK_QUERY_KEY = ["paystack"];

export function usePaystack() {
  // Get profile query
  const paystackQuery = useQuery({
    queryKey: PAYSTACK_QUERY_KEY,
    queryFn: async () => {
      const response = await paystackApi.getBanks();

      return response.data;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000, // 60 minutes
  });

  return {
    // Queries
    banksQuery: paystackQuery,

    // States
    isBanksLoading: paystackQuery.isPending,

    // Errors
    paystackBanksError: paystackQuery.error,
  };
}

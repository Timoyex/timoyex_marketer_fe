import { useQuery } from "@tanstack/react-query";

import { revenueApi } from "@/lib/api";

const REVENUE_QUERY_KEY = ["revenue"];

export function useRevenue() {
  // Get profile query
  const revenueOverviewQuery = useQuery({
    queryKey: REVENUE_QUERY_KEY,
    queryFn: async () => {
      const response = await revenueApi.overview();

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 10 minutes
  });

  return {
    // Queries
    revenueOverviewQuery,

    // States
    isRevenueLoading: revenueOverviewQuery.isPending,

    // Errors
    revenueOverviewError: revenueOverviewQuery.error,
  };
}

import { useQuery } from "@tanstack/react-query";

import { EarningFilter, earningsApi } from "@/lib/api";

const PROFILE_QUERY_KEY = ["earnings"];

export function useEarnings(params?: EarningFilter) {
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
    queryKey: [...PROFILE_QUERY_KEY, params],
    queryFn: async () => {
      const response = await earningsApi.history(params);

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    // Queries
    earningsBreakdownQuery,
    earningsHistoryQuery,
    earningsOverviewQuery,

    // States
    isOverviewLoading: earningsOverviewQuery.isPending,
    isBreakdownLoading: earningsBreakdownQuery.isPending,
    isHistoryLoading: earningsHistoryQuery.isPending,

    // Errors
    overviewError: earningsOverviewQuery.error,
    breakdownError: earningsBreakdownQuery.error,
    historyError: earningsHistoryQuery.error,
  };
}

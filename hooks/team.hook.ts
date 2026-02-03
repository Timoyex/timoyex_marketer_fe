import { SearchTeamQuery, teamApi } from "@/lib/api/team";
import { useQuery } from "@tanstack/react-query";

export function useTeam(ref: string, params?: any) {
  const directMembersQuery = useQuery({
    queryKey: ["team", "direct", ref, params],
    queryFn: async () => {
      const response = await teamApi.getDirect({ ref });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!ref, // Only run query if id exists
  });

  const downlineQueryV2 = useQuery({
    queryKey: ["team", "downline", ref, params],
    queryFn: async () => {
      const response = await teamApi.getDownlineV2({ ref, params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!ref, // Only run query if id exists
  });

  const teamStatsQuery = useQuery({
    queryKey: ["team", "stats", ref],
    queryFn: async () => {
      const response = await teamApi.getTeamStats(ref);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!ref, // Only run query if id exists
  });

  const searchQuery = useQuery({
    queryKey: ["search", "team", ref, params],
    queryFn: async () => {
      const response = await teamApi.searchMembers(params);
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 10 minutes
    enabled: params?.hasOwnProperty("search") && params?.search.length > 0, // Only run query if  search param is present
  });

  return {
    directMembers: directMembersQuery.data,
    directIsLoading: directMembersQuery.isLoading,
    directError: directMembersQuery.error,
    hasDirectMemberError: directMembersQuery.isError,
    directMemberRefetch: directMembersQuery.refetch,

    // downlineMembers: downlineQuery.data,
    // downlineIsLoading: downlineQuery.isLoading,
    // downlineError: downlineQuery.error,
    // hasDownlineMembersError: downlineQuery.isError,
    // downlineMembersRefetch: downlineQuery.refetch,

    downlineMembersV2: downlineQueryV2.data,
    downlineIsLoadingV2: downlineQueryV2.isLoading,
    downlineErrorV2: downlineQueryV2.error,
    hasDownlineMembersErrorV2: downlineQueryV2.isError,
    downlineMembersRefetchV2: downlineQueryV2.refetch,

    teamStats: teamStatsQuery.data,
    teamStatsIsLoading: teamStatsQuery.isLoading,
    teamStatsError: teamStatsQuery.error,
    hasTeamStatsError: teamStatsQuery.isError,
    teamStatsRefetch: teamStatsQuery.refetch,

    searchMembers: searchQuery.data,
    searchIsLoading: searchQuery.isLoading,
    searchError: searchQuery.error,
    hasSearchError: searchQuery.isError,
    searchMembersRefetch: searchQuery.refetch,
    searchEnabled: searchQuery.isEnabled,
    searchSuccess: searchQuery.isSuccess,
  };
}

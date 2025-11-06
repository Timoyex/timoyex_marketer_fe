// hooks/use-profile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListUsersQuery, UpdateUserRequest, usersApi } from "@/lib/api/users";
import { toast } from "sonner";

const USERS_QUERY_KEY = ["users"];

export function useUsers(params: ListUsersQuery = {}) {
  const queryClient = useQueryClient();
  // Get profile query
  const usersQuery = useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await usersApi.list({ params });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const statsQuery = useQuery({
    queryKey: [...USERS_QUERY_KEY, "stats"],
    queryFn: async () => {
      const response = await usersApi.stats();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const updateUserMutation = useMutation({
    mutationFn: usersApi.update,
    onMutate: () => toast.success("Updating User"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USERS_QUERY_KEY, params],
      });
      queryClient.invalidateQueries({
        queryKey: [...USERS_QUERY_KEY, "stats"],
      });
      return;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
      return;
    },
  });
  return {
    // Queries
    usersQuery,
    statsQuery,

    // Action
    updateUser: ({ id, dto }: { id: string; dto: UpdateUserRequest }) =>
      updateUserMutation.mutateAsync({ id, data: dto }),

    // States
    isUsersLoading: usersQuery.isPending,
    isStatsLoading: statsQuery.isPending,

    // Errors
    userError: usersQuery.error,
    statsError: statsQuery.error,
  };
}

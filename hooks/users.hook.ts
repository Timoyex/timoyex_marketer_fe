// hooks/use-profile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListUsersQuery, UpdateUserRequest, usersApi } from "@/lib/api/users";
import { toast } from "sonner";
import { profileApi } from "@/lib/api";

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

  // Update profile mutation
  const deleteUserMutation = useMutation({
    mutationFn: usersApi.delete,
    onMutate: () => toast.success("Account Deletion Request Sent"),
    onSuccess: () => {
      toast.success("Account deletion in progress");
    },
    onError: (error: any) => {
      toast.error(
        "Failed to start deletion process. Please try again in a while."
      );
    },
  });
  return {
    // Queries
    usersQuery,
    statsQuery,

    // Action
    updateUser: ({ id, dto }: { id: string; dto: UpdateUserRequest }) =>
      updateUserMutation.mutateAsync({ id, data: dto }),
    deleteUser: (id: string) => deleteUserMutation.mutateAsync(id),

    // States
    isUsersLoading: usersQuery.isPending,
    isStatsLoading: statsQuery.isPending,
    isUserDeleting: deleteUserMutation.isPending,

    isUserDeleted: deleteUserMutation.isSuccess,

    // Errors
    userError: usersQuery.error,
    statsError: statsQuery.error,
    deleteUserError: deleteUserMutation.error,
  };
}

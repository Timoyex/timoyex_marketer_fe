// hooks/use-profile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileStore, UserProfile } from "@/lib/stores/profile.store";
import { profileApi } from "@/lib/api";
import { toast } from "sonner";
import { simpleJsonToFormData } from "@/lib/form.utils";

const PROFILE_QUERY_KEY = ["profile"];

export function useProfile() {
  const queryClient = useQueryClient();
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);

  // Get profile query
  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await profileApi.get();
      setProfile(response.data);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation<
    UserProfile,
    Error,
    { data: Partial<UserProfile>; hasImage?: boolean }
  >({
    mutationFn: async ({ data, hasImage }) => {
      let payload: Partial<UserProfile> | FormData = data;

      if (hasImage) {
        payload = simpleJsonToFormData(data);
      }
      const response = await profileApi.update(payload);
      return response.data;
    },
    onSuccess: (updatedProfile, variables) => {
      // Update Zustand store
      setProfile(updatedProfile);

      // Update React Query cache
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);

      // Force refetch if images were involved (to get new URLs)
      if (variables.hasImage) {
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      }

      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  return {
    // Data
    profile,

    // Queries
    profileQuery,

    // Actions
    updateProfile: (data: Partial<UserProfile>, hasImage?: boolean) =>
      updateProfileMutation.mutate({ data, hasImage }),
    refetchProfile: profileQuery.refetch,

    // States
    isLoading: profileQuery.isPending,
    isUpdating: updateProfileMutation.isPending,

    // Errors
    getError: profileQuery.error,
    updateError: updateProfileMutation.error,
  };
}

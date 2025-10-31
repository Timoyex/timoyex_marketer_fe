// hooks/use-profile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationSettings, Preferences, settingsApi } from "@/lib/api";
import { toast } from "sonner";
import { useSettingsStore } from "@/lib/stores";

const SETTINGS_QUERY_KEY = ["settings"];

export function useSettings() {
  const { setPreferences } = useSettingsStore();
  const queryClient = useQueryClient();

  // Get settings query
  const settingsQuery = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await settingsApi.getSettings();

      setPreferences(response.data.preferences);

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update Settings  mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (body: {
      preferences: Partial<Preferences>;
      notifications: Partial<NotificationSettings>;
    }) => {
      const response = await settingsApi.updateSettings(body);

      return response.data;
    },
    onSuccess: () => {
      // Update Zustand store

      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  return {
    // Queries
    settingsQuery,

    // Actions
    updateSettings: (body: {
      preferences: Partial<Preferences>;
      notifications: Partial<NotificationSettings>;
    }) => updateSettingsMutation.mutate(body),

    refetchSettings: settingsQuery.refetch,

    // States
    isLoading: settingsQuery.isPending,

    isUpdating: updateSettingsMutation.isPending,

    // Errors
    getError: settingsQuery.error,
    updateError: updateSettingsMutation.error,
  };
}

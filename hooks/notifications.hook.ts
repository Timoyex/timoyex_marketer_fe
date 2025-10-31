// hooks/use-profile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationQuery, notificationsApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Notification,
  useNotificationStore,
} from "@/lib/stores/notifications.store";

const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export function useNotifications(
  params: NotificationQuery = {},
  type?: string
) {
  const queryClient = useQueryClient();
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  // Get notifications query
  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await notificationsApi.getAll({ params });
      setNotifications(
        response?.data?.notifications as unknown as Notification[]
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get notifications query
  const notificationsTypeQuery = useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, type, params],
    queryFn: async () => {
      const response = await notificationsApi.getAllByType({ type, params });
      setNotifications(
        response?.data?.notifications as unknown as Notification[]
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!type, // Only run if type is provided
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationsApi.markAsRead(id);

      markAsRead(id);
      return response.data;
    },
    onSuccess: () => {
      // Update Zustand store

      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to read");
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await notificationsApi.readAll();

      markAllAsRead();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Mark all as read mutation
  const markTypeAsReadMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await notificationsApi.readAllByType(type);

      markAllAsRead();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationsApi.delete(id);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  return {
    // Queries
    notificationsQuery,
    notificationsTypeQuery,

    // Actions
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    markTypeAsRead: (type: string) => markTypeAsReadMutation.mutate(type),
    delete: (id: string) => deleteMutation.mutate(id),
    refetchProfile: notificationsQuery.refetch,

    // States
    isLoading: notificationsQuery.isPending,
    isTypeLoading: notificationsTypeQuery.isPending,
    isUpdating: markAsReadMutation.isPending,
    isUpdatingAll: markAllAsReadMutation.isPending,
    isUpdatingType: markTypeAsReadMutation.isPending,

    // Errors
    getError: notificationsQuery.error,
    getTypeError: notificationsTypeQuery.error,
    markAsReadError: markAsReadMutation.error,
    markAllAsReadError: markAllAsReadMutation.error,
    markTypeAsReadError: markTypeAsReadMutation.error,
    deleteError: deleteMutation.error,
  };
}

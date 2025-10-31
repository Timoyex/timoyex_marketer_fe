// hooks/use-profile.ts
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { NotificationQuery, notificationsApi } from "@/lib/api";
import { toast } from "sonner";
import { useNotificationStore } from "@/lib/stores/notifications.store";

const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export function useNotifications(
  params: NotificationQuery = {},
  type?: string
) {
  const queryClient = useQueryClient();
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  // Get notifications query
  const notificationsQuery = useInfiniteQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],

    queryFn: async ({ pageParam }) => {
      const response = await notificationsApi.getAll({
        params: {
          ...params,
          cursor: pageParam, // Pass cursor for pagination
        },
      });
      return response.data;
    },

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,

    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const allNotifications =
    notificationsQuery.data?.pages.flatMap((page) => page.notifications) ?? [];

  const latestPage =
    notificationsQuery.data?.pages[notificationsQuery.data.pages.length - 1];

  // Get typed notifications query
  const notificationsTypeQuery = useInfiniteQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, type, params],

    queryFn: async ({ pageParam }) => {
      const response = await notificationsApi.getAllByType({
        type,
        params: {
          ...params,
          cursor: pageParam, // Pass cursor for pagination
        },
      });
      return response.data;
    },

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,

    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!type, // Only run if type is provided
  });

  const allTypedNotifications =
    notificationsTypeQuery.data?.pages.flatMap((page) => page.notifications) ??
    [];

  const latestTypedPage =
    notificationsTypeQuery.data?.pages[
      notificationsTypeQuery.data.pages.length - 1
    ];

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

    hasNextPage: notificationsTypeQuery.hasNextPage,
    hasPreviousPage: notificationsTypeQuery.hasPreviousPage,
    fetchNextPage: notificationsTypeQuery.fetchNextPage,
    isFetchNextPage: notificationsTypeQuery.isFetchingNextPage,
    fetchPreviousPage: notificationsTypeQuery.fetchPreviousPage,
    isFetchPreviousPage: notificationsTypeQuery.isFetchingPreviousPage,

    // Data
    notifications: allNotifications,
    total: latestPage?.total ?? 0,
    unreadCount: latestPage?.unreadCount ?? 0,

    // Data[Typed]
    typedNotifications: allTypedNotifications,
    typedTotal: latestTypedPage?.total ?? 0,
    typedUnreadCount: latestTypedPage?.unreadCount ?? 0,

    // Actions
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    markTypeAsRead: (type: string) => markTypeAsReadMutation.mutate(type),
    delete: (id: string) => deleteMutation.mutate(id),
    refetchProfile: notificationsQuery.refetch,

    // States
    isLoading: notificationsQuery.isPending,
    notificationTypeQueryLoading: notificationsTypeQuery.isPending,
    isUpdating: markAsReadMutation.isPending,
    isUpdatingAll: markAllAsReadMutation.isPending,
    isUpdatingType: markTypeAsReadMutation.isPending,

    // Errors
    getError: notificationsQuery.error,
    markAsReadError: markAsReadMutation.error,
    markAllAsReadError: markAllAsReadMutation.error,
    markTypeAsReadError: markTypeAsReadMutation.error,
    deleteError: deleteMutation.error,
  };
}

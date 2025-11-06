// hooks/use-profile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AnnouncememtDTO,
  Announcement,
  AnnouncementQuery,
  announcementsApi,
} from "@/lib/api";
import { toast } from "sonner";

const ANNOUNCEMENTS_QUERY_KEY = ["announcememts"];

export function useAnnouncements({
  params = {},
  id,
}: {
  params?: AnnouncementQuery;
  id?: string;
}) {
  const queryCLient = useQueryClient();
  // Get notifications query
  const announcememtListQuery = useQuery({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await announcementsApi.list({ params });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get notifications query
  const announcememtQuery = useQuery({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await announcementsApi.get(id!);

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id, // Only run if type is provided
  });

  // Get notifications query
  const announcememtStatsQuery = useQuery({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "stats"],
    queryFn: async () => {
      const response = await announcementsApi.stats();

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // create mutation
  const createMutation = useMutation({
    mutationFn: announcementsApi.create,
    onSuccess: () => {
      toast.success("Anouncement Created");
      queryCLient.invalidateQueries({
        queryKey: [...ANNOUNCEMENTS_QUERY_KEY, params],
      });
      queryCLient.invalidateQueries({
        queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "stats"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create");
    },
  });

  // update mutation
  const updateMutation = useMutation({
    mutationFn: announcementsApi.update,
    onSuccess: () => {
      toast.success("Anouncement Updated");
      queryCLient.invalidateQueries({
        queryKey: [...ANNOUNCEMENTS_QUERY_KEY, params],
      });
      queryCLient.invalidateQueries({
        queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "stats"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update announcement");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: announcementsApi.delete,

    onMutate: () => toast.success("Deleting"),
    onSuccess: () => {
      toast.success("Deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete");
    },
  });

  return {
    // Queries
    announcememtListQuery,
    announcememtQuery,
    announcememtStatsQuery,

    // Actions
    create: (data: AnnouncememtDTO) => createMutation.mutateAsync(data),
    update: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
      updateMutation.mutateAsync({ id, data }),
    remove: (id: string) => deleteMutation.mutateAsync(id),

    // States
    isListLoading: announcememtListQuery.isPending,
    isLoading: announcememtQuery.isPending,
    isStatsLoading: announcememtStatsQuery.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: deleteMutation.isPending,

    // Errors
    listError: announcememtListQuery.error,
    getError: announcememtQuery.error,
    statsError: announcememtStatsQuery.error,
    createError: createMutation.error,
    updateError: createMutation.error,
    removeError: deleteMutation.error,
  };
}

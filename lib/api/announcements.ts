import { EndpointResponse } from "../stores";

import { apiClient } from "./client";

export interface Announcement {
  id: string;
  userId: string;
  title: string;
  content: string;
  priority: Priority;
  status: Status;
  scheduledAt?: string | Date | null;
  sentAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface AnnouncememtDTO {
  title: string;
  content: string;
  priority: Priority;
  status: Status;
  scheduledAt?: string;
}

export type Priority = "low" | "medium" | "high" | "urgent";
export enum PriorityEnum {
  low = "low",
  medium = "medium",
  high = "high",
  urgent = "urgent",
}

export type Status = "draft" | "scheduled" | "sent";
export enum StatusEnum {
  draft = "draft",
  scheduled = "scheduled",
  sent = "sent",
}

export interface ListAnnouncementsResponse extends EndpointResponse {
  data: {
    announcements: Array<Announcement>;
    total: number;
    hasMore?: boolean;
    nextCursor?: string;
    prevCursor?: string;
  };
}
export interface AnnouncementResponse extends EndpointResponse {
  data: Announcement;
}

export interface AnnouncementStatsResponse extends EndpointResponse {
  data: {
    total: number;
    byStatus: {
      draft: number;
      scheduled: number;
      sent: number;
    };
    byPriority: {
      low: number;
      medium: number;
      high: number;
      urgent: number;
    };
    recentSent: number;
  };
}

export interface AnnouncementQuery {
  cursor?: string;
  limit?: number;
  status?: Status;
  priority?: Priority;
}

export const announcementsApi = {
  // Get All
  list: async ({
    params,
  }: {
    params: AnnouncementQuery;
  }): Promise<ListAnnouncementsResponse> => {
    const response = await apiClient.get("/v1/announcements", { params });
    return response.data;
  },

  // Get Unread Count
  get: async (id: string): Promise<AnnouncementResponse> => {
    const response = await apiClient.get(`/v1/announcements/${id}`);
    return response.data;
  },

  // Mark As Read

  create: async (data: AnnouncememtDTO): Promise<AnnouncementResponse> => {
    const response = await apiClient.post(`/v1/announcements`, data);
    return response.data;
  },

  // Read All
  stats: async (): Promise<AnnouncementStatsResponse> => {
    const response = await apiClient.get("/v1/announcements/stats");
    return response.data;
  },

  // Read All
  update: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Announcement>;
  }): Promise<AnnouncementResponse> => {
    const response = await apiClient.patch(`/v1/announcements/${id}`, data);
    return response.data;
  },

  // Delete
  delete: async (id: string): Promise<AnnouncementResponse> => {
    const response = await apiClient.delete(`/v1/announcements/${id}`);
    return response.data;
  },
};

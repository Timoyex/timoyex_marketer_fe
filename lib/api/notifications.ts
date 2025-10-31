import { EndpointResponse } from "../stores";

import { apiClient } from "./client";

export interface NotificationResponse extends EndpointResponse {
  data: {
    notifications: Array<Record<string, unknown>>;
    total: number;
    unreadCount: number;
    nextCursor?: string;
    prevCursor?: string;
  };
}

export interface NotificationQuery {
  cursor?: string;
  limit?: number;
  unread?: boolean;
}

export interface CursorParam {
  nextCursor?: string;
  prevCursor?: string;
}

export const notificationsApi = {
  // Get All
  getAll: async ({
    params,
  }: {
    params: NotificationQuery;
  }): Promise<NotificationResponse> => {
    const response = await apiClient.get("/v1/notifications", { params });
    return response.data;
  },

  // Get All[Type]
  getAllByType: async ({
    params,
    type = "info",
  }: {
    params: NotificationQuery;
    type?: string;
  }): Promise<NotificationResponse> => {
    const response = await apiClient.get(`/v1/notifications/type`, {
      params: { ...params, type },
    });
    return response.data;
  },

  // Get Unread Count
  getUnreadCount: async (): Promise<NotificationResponse> => {
    const response = await apiClient.get("/v1/notifications/count");
    return response.data;
  },

  // Mark As Read

  markAsRead: async (id: string): Promise<NotificationResponse> => {
    const response = await apiClient.patch(`/v1/notifications/${id}/read`);
    return response.data;
  },

  // Read All
  readAll: async (): Promise<NotificationResponse> => {
    const response = await apiClient.patch("/v1/notifications/read-all");
    return response.data;
  },

  // Read All
  readAllByType: async (type: string): Promise<NotificationResponse> => {
    const response = await apiClient.patch(
      "/v1/notifications/type/read-all",
      undefined,
      { params: { type } }
    );
    return response.data;
  },

  // Delete
  delete: async (id: string): Promise<NotificationResponse> => {
    const response = await apiClient.delete(`/v1/notifications/${id}`);
    return response.data;
  },
};

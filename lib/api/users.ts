import { EndpointResponse, ListQuery } from "../stores";
import { UserProfile } from "../stores/profile.store";
import { apiClient } from "./client";

export interface ListUsersResponse extends EndpointResponse {
  data: {
    profiles: UserProfile[];
    nextCursor: string;
    prevCursor: string;
    count: string;
    hasMore?: boolean;
  };
}

export interface UsersStatsResponse extends EndpointResponse {
  data: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
  };
}

export interface ListUsersQuery extends ListQuery {
  status?: "active" | "pending" | "inactive";
  level?: number;
}

export interface UpdateUserRequest extends Partial<UserProfile> {}
export const usersApi = {
  // List
  list: async ({
    params,
  }: {
    params: ListUsersQuery;
  }): Promise<ListUsersResponse> => {
    const response = await apiClient.get("/v1/admin/users", { params });
    return response.data;
  },

  // Stats
  stats: async (): Promise<UsersStatsResponse> => {
    const response = await apiClient.get("/v1/admin/users/stats");
    return response.data;
  },

  // Register
  update: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserRequest;
  }): Promise<UsersStatsResponse> => {
    const response = await apiClient.patch(`/v1/admin/users/${id}`, data);
    return response.data;
  },
};

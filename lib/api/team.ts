import { EndpointResponse } from "../stores";
import { apiClient } from "./client";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  marketerCode: string;
  status: string;
  createdAt: string;
  memberOf: string;
  level?: number;
  downline?: number;
  directCount?: number;
  totalDownlineCount?: number;
}

export interface TeamQuery {
  page?: number;
  limit?: number;
  downline?: number;
}

export interface TeamQueryV2 {
  cursor?: string;
  limit?: number;
  downline?: number;
}

export interface TeamStats {
  directMembers: number;
  totalDownlines: number;
  maxDepth: number;
  totalEarnings: number;
  directCommissions: number;
  indirectCommissions: number;
  currentMonthEarnings: number;
  teamVolume: number;
  directMembersDist: Array<{
    month: string;
    monthYear: string;
    users: number;
    date: string;
  }>;
}

export interface TeamResponse extends EndpointResponse {
  data: {
    members: Array<Member>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeamResponseV2 extends EndpointResponse {
  data: {
    members: Array<Member>;
    nextCursor?: string;
    prevCursor?: string;
    hasMore?: boolean;
  };
}
export interface TeamStatsResponse extends EndpointResponse {
  data: TeamStats;
}

export const teamApi = {
  // get direct members
  getDirect: async ({
    ref,
    params,
  }: {
    ref: string;
    params?: TeamQuery;
  }): Promise<TeamResponse> => {
    const response = await apiClient.get(`/v1/team/members/${ref}`, {
      params: params,
    });
    return response.data;
  },

  // get all downline
  getDownline: async ({
    ref,
    params,
  }: {
    ref: string;
    params?: TeamQuery;
  }): Promise<TeamResponse> => {
    const response = await apiClient.get(`/v1/team/${ref}`, {
      params: params,
    });
    return response.data;
  },

  getDownlineV2: async ({
    ref,
    params,
  }: {
    ref: string;
    params?: TeamQueryV2;
  }): Promise<TeamResponseV2> => {
    const response = await apiClient.get(`/v2/team/${ref}`, {
      params: params,
    });
    return response.data;
  },

  // get team stats
  getTeamStats: async (ref: string): Promise<TeamStatsResponse> => {
    const response = await apiClient.get(`/v1/team/stats/${ref}`);
    return response.data;
  },
};

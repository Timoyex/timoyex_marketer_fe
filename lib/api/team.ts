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
}

export interface TeamQuery {
  page?: number;
  limit?: number;
  downline?: number;
}

export interface TeamStats {
  directMembers: number;
  totalDownlines: number;
  // activeMembers: number;
  maxDepth: number;
  totalEarnings: number;
  directCommissions: number;
  indirectCommissions: number;
  currentMonthEarnings: number;
  teamVolume: number;
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

  // get team stats
  getTeamStats: async (ref: string): Promise<TeamStatsResponse> => {
    const response = await apiClient.get(`/v1/team/stats/${ref}`);
    return response.data;
  },
};

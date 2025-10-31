import { EndpointResponse } from "../stores";

import { apiClient } from "./client";

export interface EarningBreakDownEntity {
  type: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface EarningsSummaryEntity {
  totalEarnings: number;
  totalTransactions: number;
  periodEarnings: number;
  periodStart: string;
  periodEnd: string;
  pendingEarnings: number;
  pendingCount: number;
  lastPayoutDate: string | null;
  currency: string;
  appliedFilters: {
    type: string | null;
    status: string | null;
  };
}
export interface EarningHistoryEntity {
  id: string;
  type?: "direct_sales" | "team_commission" | null;
  status?: "pending" | "processing" | "approved" | "paid" | "rejected" | null;
  amount: number;
  description: string;
  createdAt: Date;
  processedAt: Date;
}

export interface EarningTimeSeriesEntity {
  month: string;
  total: number;
  direct_sales: number;
  team_commission: number;
  [key: string]: number | string; // Dynamic keys for each earning type
}

export interface EarningOverviewResponse extends EndpointResponse {
  data: {
    summary: EarningsSummaryEntity;
    breakdown: Array<EarningBreakDownEntity>;
    analytics?: {
      earningsTimeSeries: Array<EarningTimeSeriesEntity>;
      period: {
        start: string;
        end: string;
      };
    };
  };
}

export interface EarningBreakdownResponse extends EndpointResponse {
  data: {
    breakdown: Array<EarningBreakDownEntity>;
  };
}

export interface EarningHistoryResponse extends EndpointResponse {
  data: {
    earnings: Array<EarningHistoryEntity>;
  };
}

export interface EarningFilter {
  startDate?: Date;
  endDate?: Date;
  type?: "direct_sales" | "team_commission" | null;
  status?: "pending" | "processing" | "approved" | "paid" | "rejected" | null;
  includeStats?: boolean;
}

export const earningsApi = {
  // Get All Stats (include time series analytics)
  overview: async (
    params?: EarningFilter
  ): Promise<EarningOverviewResponse> => {
    const response = await apiClient.get("/v1/earnings/overview", {
      params,
    });
    return response.data;
  },

  // breakdown
  breakdown: async (
    params?: EarningFilter
  ): Promise<EarningBreakdownResponse> => {
    const response = await apiClient.get("/v1/earnings/breakdown", {
      params,
    });
    return response.data;
  },

  //Verify

  history: async (params?: EarningFilter): Promise<EarningHistoryResponse> => {
    const response = await apiClient.get("/v1/earnings/history", {
      params,
    });
    return response.data;
  },
};

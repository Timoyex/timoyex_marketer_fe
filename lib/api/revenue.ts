import { EndpointResponse } from "../stores";

import { apiClient } from "./client";

export interface RevenueDistribution {
  month: string;
  monthYear: string;
  amount: number;
  date: string;
}

export interface RevenueOverviewResponse extends EndpointResponse {
  data: {
    totalMonthlyRevenue: number;
    revenueDistribution: Array<RevenueDistribution>;
  };
}

export const revenueApi = {
  // Get All Stats (include time series analytics)
  overview: async (): Promise<RevenueOverviewResponse> => {
    const response = await apiClient.get("/v1/revenue/overview");
    return response.data;
  },
};

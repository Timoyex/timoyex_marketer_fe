import { EndpointResponse, ListQuery } from "../stores";

import { apiClient } from "./client";

type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface PaymentsEntity {
  id: string;
  amount: number;
  type: string;
  status: PaymentStatus;
  reference: string;
  description: string;
  createdAt: Date;
  processedAt?: string | Date | null;
}
export interface WithdrawalEntity {
  id: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
}

export interface PaymentsHistoryResponse extends EndpointResponse {
  data: {
    payments: Array<PaymentsEntity>;
    lastPayout?: number | null;
    pending: number;
    nextCursor?: string;
    prevCursor?: string;
    hasMore: boolean;
    total: number;
  };
}

export interface WithdrawalResponse extends EndpointResponse {
  data: WithdrawalEntity;
}
export interface PaymentsFilter extends ListQuery {
  status?: PaymentStatus;
}

export const paymentsApi = {
  //   request payout from earnings
  requestWithdrawal: async (id: string): Promise<WithdrawalResponse> => {
    const response = await apiClient.post(
      `/v1/payments/${id}/request-withdrawal`
    );
    return response.data;
  },

  //   payment history
  history: async (
    params?: PaymentsFilter
  ): Promise<PaymentsHistoryResponse> => {
    const response = await apiClient.get(`/v1/payments/history`, { params });
    return response.data;
  },
};

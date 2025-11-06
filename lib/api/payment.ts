import { EndpointResponse, ListQuery } from "../stores";
import { BankAccount } from "../stores/profile.store";

import { apiClient } from "./client";

type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "rejected"
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
  earningType?: string;
  note?: string;
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

export interface PaymentsStats {
  total: number;
  totalAmount: number;
  byStatus: {
    pending: { count: number; amount: number };
    processing: { count: number; amount: number };
    completed: { count: number; amount: number };
    failed: { count: number; amount: number };
    rejected: { count: number; amount: number };
    cancelled: { count: number; amount: number };
  };
  today: {
    processing: number;
    rejected: number;
  };
}

export interface PaymentsStatsResponse extends EndpointResponse {
  data: PaymentsStats;
}
export interface AdminPaymentsList {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  userId: string;
  earningType: "direct_sales" | "team_commission";
  description?: string;
  note?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    level: 0;
    bankAccount?: BankAccount | undefined;
    createdAt: string;
  };
}

export interface AdminPaymentsListResponse extends EndpointResponse {
  data: {
    payments: Array<AdminPaymentsList>;
    nextCursor?: string | null;
    prevCursor?: string | null;
    count: number;
    total: number;
    hasMore?: boolean;
  };
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

  /***************         Admin Endpoints         ***********************/

  // list payments
  list: async (params?: PaymentsFilter): Promise<AdminPaymentsListResponse> => {
    const response = await apiClient.get(`/v1/admin/payments`, { params });
    return response.data;
  },

  //  stats

  stats: async (): Promise<PaymentsStatsResponse> => {
    const response = await apiClient.get(`/v1/admin/payments/stats`);
    return response.data;
  },

  update: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<PaymentsEntity>;
  }): Promise<string> => {
    const response = await apiClient.patch(
      `/v1/admin/payments/${id}/update`,
      data
    );
    return response.data;
  },
};

import { PAYSTACK_KEY } from "@/app.config";
import { EndpointResponse } from "../stores";
import { apiClient } from "./client";
import axios from "axios";

export interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: string;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaystackBanksReponse extends EndpointResponse {
  data: Array<PaystackBank>;
}

export const paystackApi = {
  // get direct members
  getBanks: async (): Promise<PaystackBanksReponse> => {
    const response = await axios.get(`https://api.paystack.co/bank`, {
      headers: {
        Authorization: PAYSTACK_KEY,
      },
    });
    return response.data;
  },
};

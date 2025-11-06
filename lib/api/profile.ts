import { UserProfile } from "../stores/profile.store";
import { apiClient } from "./client";

interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

interface UpdateProfileRequest extends Partial<UserProfile> {}

export const profileApi = {
  // Login
  get: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get("/v1/profile");
    return response.data;
  },

  // Register
  update: async (
    data: UpdateProfileRequest | FormData
  ): Promise<ProfileResponse> => {
    const response = await apiClient.patch("/v1/profile", data);
    return response.data;
  },
};

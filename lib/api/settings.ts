import { EndpointResponse } from "../stores";

import { apiClient } from "./client";

export type Theme = "light" | "dark" | "system";

export interface Preferences {
  theme: Theme;
  language: string; // e.g., "English"
  timezone: string; // e.g., "West Africa Time (WAT)"
  currency: string; // e.g., "Nigerian Naira (₦)"
}

export interface EmailNotificationSettings {
  isActive: boolean;
  companyAnnouncements: boolean;
  teamUpdates: boolean;
  paymentAlerts: boolean;
  marketingEmails: boolean;
}

export interface SmsNotificationSettings {
  isActive: boolean;
  paymentAlerts: boolean;
  urgentUpdates: boolean;
}

export interface InAppNotificationSettings {
  isActive: boolean;
  allNotifications: boolean;
  notificationSounds: boolean;
}

export interface NotificationSettings {
  email: EmailNotificationSettings;
  sms: SmsNotificationSettings;
  inApp: InAppNotificationSettings;
}

export interface SettingsResponse extends EndpointResponse {
  data: {
    notifications: NotificationSettings;
    preferences: Preferences;
  };
}

export const settingsApi = {
  // Get Settings and Preferences
  getSettings: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get("/v1/settings");
    return response.data;
  },

  // updateSettings
  updateSettings: async (body: {
    preferences: Partial<Preferences>;
    notifications: Partial<NotificationSettings>;
  }): Promise<Partial<SettingsResponse>> => {
    const response = await apiClient.patch(`/v1/settings`, body);
    return response.data;
  },
};

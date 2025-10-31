import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NotificationSettings, Preferences } from "../api";

export interface SettingsState {
  // States
  preferences: Preferences | null;
  notifications: NotificationSettings | null;

  // Actions
  setPreferences: (preferences: Preferences) => void;
  setNotificationSettings: (notifications: NotificationSettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      preferences: null,
      notifications: null,

      setPreferences: (preferences: Preferences) => {
        set({ preferences });
      },
      setNotificationSettings: (notifications: NotificationSettings) => {
        set({ notifications });
      },
    }),
    {
      name: "settings-store",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);

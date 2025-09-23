import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  sub: string;
  id: string;
  email: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verifyError: string | null;

  // Actions
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setVerifyError: (message: string) => void;
  login: ({
    user,
    access_token,
    refresh_token,
  }: {
    user: User;
    access_token: string;
    refresh_token: string;
  }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      refresh_token: null,
      access_token: null,
      isAuthenticated: false,
      isLoading: false,
      verifyError: null,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAccessToken: (access_token) => set({ access_token }),
      setRefreshToken: (refresh_token) => set({ refresh_token }),
      setVerifyError: (verifyError) => set({ verifyError }),

      login: ({ user, access_token, refresh_token }) =>
        set({
          user,
          access_token,
          refresh_token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

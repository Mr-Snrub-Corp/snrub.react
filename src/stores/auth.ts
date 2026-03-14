import { isAxiosError } from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "../types/user";
import { authApi } from "@/services/api";
import type { AuthResponse } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        user: null,
        setAuth: (token, user) => set({ token, user }),
        clearAuth: () => set({ token: null, user: null }),
        setUser: (user) => set({ user }),
        login: async (email: string, password: string) => {
          try {
            const data: AuthResponse = await authApi.login({ email, password });
            set({ user: data.user, token: data.access_token });
          } catch (error) {
            const message = isAxiosError(error)
              ? (error.response?.data?.detail ?? error.message)
              : "Login failed";
            throw new Error(message);
          }
        },
      }),
      { name: "auth" },
    ),
    { name: "auth", enabled: process.env.NODE_ENV !== "production" },
  ),
);

export const selectIsAdmin = (s: AuthState) =>
  s.user?.role === "admin" || s.user?.role === "super_admin";
export const selectIsSuperAdmin = (s: AuthState) =>
  s.user?.role === "super_admin";

import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
      login: async (email: string, password: string) => {
        const res = await authApi.login({ email, password });
        const data = res as AuthResponse;
        set({ user: data.user, token: data.access_token });
      },
    }),
    { name: "auth" },
  ),
);

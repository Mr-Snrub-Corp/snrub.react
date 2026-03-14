import { isAxiosError } from "axios";
import { create } from "zustand";
import type { User } from "@/types/user";
import { usersApi } from "@/services/api";
import { devtools } from "zustand/middleware";

interface UsersState {
  users: User[] | null;
  setUsers: (users: User[]) => void;
  fetchUsers: () => Promise<void>;
  reset: () => void;
}

export const useUsersStore = create<UsersState>()(
  devtools(
    (set) => ({
      users: null,
      setUsers: (users: User[]) => set({ users }),
      reset: () => set({ users: null }),
      fetchUsers: async () => {
        try {
          const users = await usersApi.get();
          set({ users });
        } catch (error) {
          const message = isAxiosError(error)
            ? (error.response?.data?.detail ?? error.message)
            : "Failed to fetch users";
          throw new Error(message);
        }
      },
    }),
    { name: "user", enabled: process.env.NODE_ENV !== "production" },
  ),
);

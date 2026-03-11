import { isAxiosError } from "axios";
import { create } from "zustand";
import type { User } from "@/types/user";
import { usersApi } from "@/services/api";

interface UsersState {
  users: User[] | null;
  setUsers: (users: User[]) => void;
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>()((set) => ({
  users: null,
  setUsers: (users: User[]) => set({ users }),
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
}));

import { isAxiosError } from "axios";
import { create } from "zustand";
import type { User } from "@/types/user";
import { usersApi } from "@/services/api";
import { devtools } from "zustand/middleware";

interface UsersState {
  users: User[] | null;
  setUsers: (users: User[]) => void;
  fetchUsers: () => Promise<void>;
  createUser: (data: Partial<User>) => Promise<User>;
  deleteUser: (uid: string) => Promise<void>;
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
      createUser: async (data: Partial<User>) => {
        try {
          const user = await usersApi.create(data);
          set((state) => ({
            users: state.users ? [...state.users, user] : [user],
          }));
          return user;
        } catch (error) {
          const message = isAxiosError(error)
            ? (error.response?.data?.detail ?? error.message)
            : "Failed to create user";
          throw new Error(message);
        }
      },
      deleteUser: async (uid: string) => {
        try {
          await usersApi.deleteOne(uid);
          set((state) => ({
            users: state.users ? state.users.filter((u) => u.uid !== uid) : null,
          }));
        } catch (error) {
          const message = isAxiosError(error)
            ? (error.response?.data?.detail ?? error.message)
            : "Failed to delete user";
          throw new Error(message);
        }
      },
    }),
    { name: "user", enabled: process.env.NODE_ENV !== "production" },
  ),
);

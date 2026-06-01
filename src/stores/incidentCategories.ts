import { isAxiosError } from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IncidentCategory } from "@/types/incidentCategory";
import { incidentCategoriesApi } from "@/services/api";

interface IncidentCategoriesState {
  incidentCategories: Record<string, IncidentCategory>;
  fetchIncidentCategories: () => Promise<void>;
  reset: () => void;
}

export const useIncidentCategoriesStore = create<IncidentCategoriesState>()(
  devtools(
    (set) => ({
      incidentCategories: {},
      reset: () => set({ incidentCategories: {} }),
      fetchIncidentCategories: async () => {
        try {
          const categories: IncidentCategory[] =
            await incidentCategoriesApi.get();
          set({
            incidentCategories: Object.fromEntries(
              categories.map((c) => [c.uid, c]),
            ),
          });
        } catch (error) {
          const message = isAxiosError(error)
            ? (error.response?.data?.detail ?? error.message)
            : "Failed to fetch incident categories";
          throw new Error(message);
        }
      },
    }),
    {
      name: "incidentCategories",
      enabled: process.env.NODE_ENV !== "production",
    },
  ),
);

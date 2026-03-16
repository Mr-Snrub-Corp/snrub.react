import { isAxiosError } from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IncidentType } from "@/types/incidentType";
import { incidentTypesApi } from "@/services/api";

interface IncidentTypesState {
  incidentTypes: Record<string, IncidentType>;
  fetchIncidentTypes: () => Promise<void>;
  reset: () => void;
}

export const useIncidentTypesStore = create<IncidentTypesState>()(
  devtools(
    (set) => ({
      incidentTypes: {},
      reset: () => set({ incidentTypes: {} }),
      fetchIncidentTypes: async () => {
        try {
          const types: IncidentType[] = await incidentTypesApi.get();
          set({
            incidentTypes: Object.fromEntries(
              types.map((t) => [t.uid, t]),
            ),
          });
        } catch (error) {
          const message = isAxiosError(error)
            ? (error.response?.data?.detail ?? error.message)
            : "Failed to fetch incident types";
          throw new Error(message);
        }
      },
    }),
    { name: "incidentTypes", enabled: process.env.NODE_ENV !== "production" },
  ),
);

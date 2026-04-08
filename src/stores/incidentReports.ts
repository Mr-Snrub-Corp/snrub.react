import { isAxiosError } from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IncidentReport } from "@/types/incidentReport";
import { incidentReportsApi } from "@/services/api";

interface IncidentReportsState {
  incidentReports: Record<string, IncidentReport>;
  setReports: (reports: IncidentReport[]) => void;
  fetchReports: (params?: Record<string, string>) => Promise<void>;
  reset: () => void;
}

export const useIncidentReportsStore = create<IncidentReportsState>()(
  devtools(
    (set) => ({
      incidentReports: {},
      setReports: (reports) =>
        set({
          incidentReports: Object.fromEntries(
            reports.map((r) => [r.uid, r]),
          ),
        }),
      reset: () => set({ incidentReports: {} }),
      fetchReports: async (params?) => {
        try {
          const reports: IncidentReport[] = await incidentReportsApi.get(params);
          set({
            incidentReports: Object.fromEntries(
              reports.map((r) => [r.uid, r]),
            ),
          });
        } catch (error) {
          const message = isAxiosError(error)
            ? (error.response?.data?.detail ?? error.message)
            : "Failed to fetch incident reports";
          throw new Error(message);
        }
      },
    }),
    { name: "incidentReports", enabled: process.env.NODE_ENV !== "production" },
  ),
);

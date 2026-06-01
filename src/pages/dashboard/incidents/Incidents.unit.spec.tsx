import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { IncidentReport } from "@/types/incidentReport";
import type { IncidentType } from "@/types/incidentType";

const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

const fetchReportsMock = vi.fn();
const fetchIncidentTypesMock = vi.fn();

const reportsState = { incidentReports: {} as Record<string, IncidentReport> };
vi.mock("@/stores/incidentReports", () => ({
  useIncidentReportsStore: (
    sel: (s: {
      incidentReports: Record<string, IncidentReport>;
      fetchReports: typeof fetchReportsMock;
    }) => unknown,
  ) =>
    sel({
      incidentReports: reportsState.incidentReports,
      fetchReports: fetchReportsMock,
    }),
}));

const typesState = { incidentTypes: {} as Record<string, IncidentType> };
vi.mock("@/stores/incidentTypes", () => ({
  useIncidentTypesStore: (
    sel: (s: {
      incidentTypes: Record<string, IncidentType>;
      fetchIncidentTypes: typeof fetchIncidentTypesMock;
    }) => unknown,
  ) =>
    sel({
      incidentTypes: typesState.incidentTypes,
      fetchIncidentTypes: fetchIncidentTypesMock,
    }),
}));

const authState = { user: { role: "admin" as string } };
vi.mock("@/stores/auth", () => ({
  useAuthStore: (sel: (s: typeof authState) => unknown) => sel(authState),
  selectIsAdmin: (s: typeof authState) =>
    s.user?.role === "admin" || s.user?.role === "super_admin",
}));

import Incidents from "./Incidents";

const MOCK_TYPE: IncidentType = {
  uid: "t-1",
  code: "UFS",
  name: "Unrequested Fission Surplus",
  category_id: "cat-1",
  default_severity: 7,
  description: "Unexpected increase in fission rate.",
  created: "2024-01-01T00:00:00Z",
  updated: "2024-01-01T00:00:00Z",
};

const MOCK_REPORT: IncidentReport = {
  uid: "r-1",
  incident_type_id: "t-1",
  description: "During a routine power ramp in Sector 7G.",
  severity: 7,
  status: "reported",
  escalation_level: "none",
  reported_by_user_id: "u-1",
  occurred_at: "2026-06-01T00:00:00Z",
  subjects: [],
  created: "2026-06-01T00:00:00Z",
  updated: "2026-06-01T00:00:00Z",
};

describe("Incidents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user.role = "admin";
    reportsState.incidentReports = {};
    typesState.incidentTypes = {};
  });

  it("shows skeleton while loading (before stores resolve)", () => {
    fetchReportsMock.mockReturnValue(new Promise(() => {}));
    fetchIncidentTypesMock.mockReturnValue(new Promise(() => {}));

    render(<Incidents />);

    expect(screen.queryByText("Recent Incidents")).toBeInTheDocument();
    expect(
      screen.queryByText("Unrequested Fission Surplus"),
    ).not.toBeInTheDocument();
  });

  it("renders report rows with type name, date and severity after loading", async () => {
    reportsState.incidentReports = { "r-1": MOCK_REPORT };
    typesState.incidentTypes = { "t-1": MOCK_TYPE };
    fetchReportsMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<Incidents />);

    expect(
      await screen.findByText("Unrequested Fission Surplus"),
    ).toBeInTheDocument();
    expect(screen.getByText("June 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("navigates to /dashboard/incidents/types when Incident Types button is clicked", async () => {
    fetchReportsMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<Incidents />);

    await userEvent.click(
      screen.getByTestId("incidents.list.incident-types-btn"),
    );
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/incidents/types");
  });

  it("shows Incident Reports button for admin", () => {
    fetchReportsMock.mockReturnValue(new Promise(() => {}));
    fetchIncidentTypesMock.mockReturnValue(new Promise(() => {}));
    authState.user.role = "admin";

    render(<Incidents />);

    expect(
      screen.getByTestId("incidents.list.incident-reports-btn"),
    ).toBeInTheDocument();
  });

  it("hides Incident Reports button for non-admin", () => {
    fetchReportsMock.mockReturnValue(new Promise(() => {}));
    fetchIncidentTypesMock.mockReturnValue(new Promise(() => {}));
    authState.user.role = "viewer";

    render(<Incidents />);

    expect(
      screen.queryByTestId("incidents.list.incident-reports-btn"),
    ).not.toBeInTheDocument();
  });

  it("shows empty state when no reports are returned", async () => {
    reportsState.incidentReports = {};
    typesState.incidentTypes = {};
    fetchReportsMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<Incidents />);

    expect(
      await screen.findByText("No reported incidents."),
    ).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { IncidentCategory } from "@/types/incidentCategory";
import type { IncidentType } from "@/types/incidentType";

const fetchIncidentCategoriesMock = vi.fn();
const fetchIncidentTypesMock = vi.fn();

const categoriesState = {
  incidentCategories: {} as Record<string, IncidentCategory>,
};
vi.mock("@/stores/incidentCategories", () => ({
  useIncidentCategoriesStore: (
    sel: (s: {
      incidentCategories: Record<string, IncidentCategory>;
      fetchIncidentCategories: typeof fetchIncidentCategoriesMock;
    }) => unknown,
  ) =>
    sel({
      incidentCategories: categoriesState.incidentCategories,
      fetchIncidentCategories: fetchIncidentCategoriesMock,
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

import IncidentTypes from "./IncidentTypes";

const MOCK_CATEGORY: IncidentCategory = {
  uid: "cat-1",
  name: "Reactor Physics & Core Stability",
  description: "Conditions threatening reactor stability.",
};

const MOCK_TYPE: IncidentType = {
  uid: "t-1",
  code: "UFS",
  name: "Unrequested Fission Surplus",
  category_id: "cat-1",
  default_severity: 6,
  description: "Unexpected increase in fission rate.",
  created: "2024-01-01T00:00:00Z",
  updated: "2024-01-01T00:00:00Z",
};

describe("IncidentTypes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    categoriesState.incidentCategories = {};
    typesState.incidentTypes = {};
  });

  it("shows skeleton while loading", () => {
    fetchIncidentCategoriesMock.mockReturnValue(new Promise(() => {}));
    fetchIncidentTypesMock.mockReturnValue(new Promise(() => {}));

    render(<IncidentTypes />);

    expect(screen.getByText("Incident Types")).toBeInTheDocument();
    expect(
      screen.queryByText("Reactor Physics & Core Stability"),
    ).not.toBeInTheDocument();
  });

  it("renders category group headers after loading", async () => {
    categoriesState.incidentCategories = { "cat-1": MOCK_CATEGORY };
    typesState.incidentTypes = { "t-1": MOCK_TYPE };
    fetchIncidentCategoriesMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<IncidentTypes />);

    expect(
      await screen.findByText("Reactor Physics & Core Stability"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Conditions threatening reactor stability."),
    ).toBeInTheDocument();
  });

  it("renders incident types under the correct category", async () => {
    categoriesState.incidentCategories = { "cat-1": MOCK_CATEGORY };
    typesState.incidentTypes = { "t-1": MOCK_TYPE };
    fetchIncidentCategoriesMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<IncidentTypes />);

    expect(
      await screen.findByText("Unrequested Fission Surplus"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Unexpected increase in fission rate."),
    ).toBeInTheDocument();
  });

  it("renders a severity badge for each incident type", async () => {
    categoriesState.incidentCategories = { "cat-1": MOCK_CATEGORY };
    typesState.incidentTypes = { "t-1": MOCK_TYPE };
    fetchIncidentCategoriesMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<IncidentTypes />);

    await screen.findByText("Unrequested Fission Surplus");
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("uses data-testid on category group and table", async () => {
    categoriesState.incidentCategories = { "cat-1": MOCK_CATEGORY };
    typesState.incidentTypes = { "t-1": MOCK_TYPE };
    fetchIncidentCategoriesMock.mockResolvedValue(undefined);
    fetchIncidentTypesMock.mockResolvedValue(undefined);

    render(<IncidentTypes />);

    await screen.findByText("Unrequested Fission Surplus");
    expect(
      screen.getByTestId("incidents.types.category-group"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("incidents.types.table")).toBeInTheDocument();
  });
});

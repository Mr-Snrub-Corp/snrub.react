import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { User } from "@/types/user";

const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ uid: "u-1" }),
}));

const getOne = vi.fn();
vi.mock("@/services/api", () => ({
  usersApi: {
    getOne: (...args: unknown[]) => getOne(...args),
  },
}));

const authState = { user: { role: "admin" as string } };
vi.mock("@/stores/auth", () => ({
  useAuthStore: (sel: (s: typeof authState) => unknown) => sel(authState),
  selectIsAdmin: (s: typeof authState) =>
    s.user?.role === "admin" || s.user?.role === "super_admin",
}));

import EmployeeDetail from "./EmployeeDetail";

const TEST_USER: User = {
  uid: "u-1",
  email: "alice@snrub-corp.io",
  name: "Alice Holloway",
  role: "admin",
  status: "active",
};

describe("EmployeeDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user.role = "admin";
  });

  it("shows a loading skeleton while the API call is pending", () => {
    getOne.mockReturnValue(new Promise(() => {}));
    render(<EmployeeDetail />);

    expect(
      screen.queryByTestId("employees.detail.name"),
    ).not.toBeInTheDocument();
    // Skeleton renders several <div> elements — verify the user data is absent
    expect(screen.queryByText("Alice Holloway")).not.toBeInTheDocument();
  });

  it("renders user name, email, role and status after the API resolves", async () => {
    getOne.mockResolvedValue({ ...TEST_USER });
    render(<EmployeeDetail />);

    expect(
      await screen.findByTestId("employees.detail.name"),
    ).toHaveTextContent("Alice Holloway");
    expect(screen.getByTestId("employees.detail.email")).toHaveTextContent(
      "alice@snrub-corp.io",
    );
    expect(screen.getByTestId("employees.detail.role")).toHaveTextContent(
      "Admin",
    );
    expect(screen.getByTestId("employees.detail.status")).toHaveTextContent(
      "Active",
    );
  });

  it("shows a not-found message when the API resolves to null", async () => {
    getOne.mockResolvedValue(null);
    render(<EmployeeDetail />);

    expect(await screen.findByText(/user not found/i)).toBeInTheDocument();
    expect(
      screen.queryByTestId("employees.detail.name"),
    ).not.toBeInTheDocument();
  });

  it("renders Edit button for admin and hides it for viewer", async () => {
    getOne.mockResolvedValue({ ...TEST_USER });
    const { rerender } = render(<EmployeeDetail />);

    await screen.findByTestId("employees.detail.name");
    expect(screen.getByTestId("employees.detail.edit-btn")).toBeInTheDocument();

    authState.user.role = "viewer";
    rerender(<EmployeeDetail />);
    expect(
      screen.queryByTestId("employees.detail.edit-btn"),
    ).not.toBeInTheDocument();
  });
});

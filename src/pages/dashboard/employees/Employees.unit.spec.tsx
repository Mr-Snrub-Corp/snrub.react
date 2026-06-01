import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "@/types/user";

const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

const fetchUsersMock = vi.fn();
const deleteUserMock = vi.fn();
const mockStore = {
  users: [] as User[] | null,
  fetchUsers: (...args: unknown[]) => fetchUsersMock(...args),
  deleteUser: (...args: unknown[]) => deleteUserMock(...args),
};
vi.mock("@/stores/users", () => ({
  useUsersStore: (sel: (s: typeof mockStore) => unknown) => sel(mockStore),
}));

const authState = { user: { role: "super_admin" as string } };
vi.mock("@/stores/auth", () => ({
  useAuthStore: (sel: (s: typeof authState) => unknown) => sel(authState),
  selectIsSuperAdmin: (s: typeof authState) => s.user?.role === "super_admin",
}));

import Employees from "./Employees";

const TEST_USERS: User[] = [
  {
    uid: "u-1",
    email: "alice@snrub-corp.io",
    name: "Alice",
    role: "admin",
    status: "active",
  },
  {
    uid: "u-2",
    email: "burns@snrub-corp.io",
    name: "Burns",
    role: "viewer",
    status: "inactive",
  },
];

describe("Employees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.users = [...TEST_USERS];
    fetchUsersMock.mockResolvedValue(undefined);
    deleteUserMock.mockResolvedValue(undefined);
    authState.user.role = "super_admin";
  });

  it("renders a table row for each user", () => {
    render(<Employees />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@snrub-corp.io")).toBeInTheDocument();
    expect(screen.getByText("Burns")).toBeInTheDocument();
    expect(screen.getByText("burns@snrub-corp.io")).toBeInTheDocument();
  });

  it("shows Add User button for super_admin and hides it for admin", () => {
    const { rerender } = render(<Employees />);
    expect(screen.getByTestId("employees.list.add-btn")).toBeInTheDocument();

    authState.user.role = "admin" as const;
    rerender(<Employees />);
    expect(
      screen.queryByTestId("employees.list.add-btn"),
    ).not.toBeInTheDocument();
  });

  it("calls deleteUser with the correct uid after confirming deletion", async () => {
    render(<Employees />);

    const deleteButtons = screen.getAllByTestId("employees.list.delete-btn");
    await userEvent.click(deleteButtons[0]);

    await screen.findByTestId("shared.delete-dialog.confirm-btn");
    await userEvent.click(
      screen.getByTestId("shared.delete-dialog.confirm-btn"),
    );

    await waitFor(() => expect(deleteUserMock).toHaveBeenCalledWith("u-1"));
  });

  it("does not call deleteUser when deletion is cancelled", async () => {
    render(<Employees />);

    const deleteButtons = screen.getAllByTestId("employees.list.delete-btn");
    await userEvent.click(deleteButtons[0]);

    await screen.findByTestId("shared.delete-dialog.cancel-btn");
    await userEvent.click(
      screen.getByTestId("shared.delete-dialog.cancel-btn"),
    );

    expect(deleteUserMock).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "@/types/user";

const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ uid: "u-1" }),
}));

const getOne = vi.fn();
const updateOne = vi.fn();
vi.mock("@/services/api", () => ({
  usersApi: {
    getOne: (...args: unknown[]) => getOne(...args),
    updateOne: (...args: unknown[]) => updateOne(...args),
  },
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

import EmployeeEdit from "./EmployeeEdit";

const TEST_USER: User = {
  uid: "u-1",
  email: "alice@snrub-corp.io",
  name: "Alice",
  role: "admin",
  status: "active",
};

describe("EmployeeEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOne.mockResolvedValue({ ...TEST_USER });
    updateOne.mockResolvedValue({ ...TEST_USER });
  });

  it("pre-fills email and name from the fetched user", async () => {
    render(<EmployeeEdit />);

    const emailInput = await screen.findByTestId(
      "employees.edit-form.email-input",
    );
    expect(emailInput).toHaveValue(TEST_USER.email);
    expect(screen.getByTestId("employees.edit-form.name-input")).toHaveValue(
      TEST_USER.name,
    );
  });

  it("submits updated values via usersApi.updateOne and navigates to detail", async () => {
    render(<EmployeeEdit />);
    await screen.findByTestId("employees.edit-form.email-input");

    await userEvent.click(
      screen.getByTestId("employees.edit-form.update-btn"),
    );

    await waitFor(() =>
      expect(updateOne).toHaveBeenCalledWith("u-1", {
        email: TEST_USER.email,
        name: TEST_USER.name,
        role: TEST_USER.role,
        status: TEST_USER.status,
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/employees/u-1");
  });

  it("navigates to detail on cancel without calling updateOne", async () => {
    render(<EmployeeEdit />);
    await screen.findByTestId("employees.edit-form.email-input");

    await userEvent.click(
      screen.getByTestId("employees.edit-form.cancel-btn"),
    );

    expect(updateOne).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/employees/u-1");
  });
});

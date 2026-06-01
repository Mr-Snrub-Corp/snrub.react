import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

const createUserMock = vi.fn();
const mockStore = {
  createUser: (...args: unknown[]) => createUserMock(...args),
};
vi.mock("@/stores/users", () => ({
  useUsersStore: (sel: (s: typeof mockStore) => unknown) => sel(mockStore),
}));

import EmployeeNew from "./EmployeeNew";

const VALID_EMAIL = "homer@snrub-corp.io";
const VALID_NAME = "Homer Simpson";
const VALID_PASSWORD = "Donuts1!";

describe("EmployeeNew", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Create button is disabled when required fields are empty", () => {
    render(<EmployeeNew />);
    expect(screen.getByTestId("employees.new-form.create-btn")).toBeDisabled();
  });

  it("shows an inline validation error when an invalid email is blurred", async () => {
    render(<EmployeeNew />);

    const emailInput = screen.getByTestId("employees.new-form.email-input");
    await userEvent.type(emailInput, "not-an-email");
    await userEvent.tab();

    await screen.findByText(/valid email/i);
  });

  it("navigates to the employees list on cancel without calling createUser", async () => {
    render(<EmployeeNew />);

    await userEvent.click(screen.getByTestId("employees.new-form.cancel-btn"));

    expect(createUserMock).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/employees");
  });

  it("calls createUser with form values and navigates to the new user's detail page", async () => {
    createUserMock.mockResolvedValue({
      uid: "u-new",
      email: VALID_EMAIL,
      name: VALID_NAME,
      role: "viewer",
      status: "inactive",
    });
    render(<EmployeeNew />);

    await userEvent.type(
      screen.getByTestId("employees.new-form.email-input"),
      VALID_EMAIL,
    );
    await userEvent.type(
      screen.getByTestId("employees.new-form.name-input"),
      VALID_NAME,
    );
    await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);

    await userEvent.click(screen.getByTestId("employees.new-form.create-btn"));

    await waitFor(() =>
      expect(createUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ email: VALID_EMAIL, name: VALID_NAME }),
      ),
    );
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/employees/u-new");
  });

  it("displays a server error when createUser rejects", async () => {
    createUserMock.mockRejectedValue(new Error("Email already in use"));
    render(<EmployeeNew />);

    await userEvent.type(
      screen.getByTestId("employees.new-form.email-input"),
      VALID_EMAIL,
    );
    await userEvent.type(
      screen.getByTestId("employees.new-form.name-input"),
      VALID_NAME,
    );
    await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);

    await userEvent.click(screen.getByTestId("employees.new-form.create-btn"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email already in use",
    );
  });
});

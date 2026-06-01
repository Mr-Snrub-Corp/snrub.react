import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const defaultProps = {
  open: true,
  header: "Delete Employee",
  description: "Are you sure you want to delete this employee? This action cannot be undone.",
  confirmButtonLabel: "Delete",
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

describe("DeleteConfirmDialog", () => {
  it("renders title and description when open", () => {
    render(<DeleteConfirmDialog {...defaultProps} />);
    expect(screen.getByTestId("shared.delete-dialog.title")).toHaveTextContent(
      "Delete Employee",
    );
    expect(
      screen.getByTestId("shared.delete-dialog.description"),
    ).toHaveTextContent(
      "Are you sure you want to delete this employee? This action cannot be undone.",
    );
  });

  it("does not render content when closed", () => {
    render(<DeleteConfirmDialog {...defaultProps} open={false} />);
    expect(
      screen.queryByTestId("shared.delete-dialog.title"),
    ).not.toBeInTheDocument();
  });

  it("renders custom header", () => {
    render(<DeleteConfirmDialog {...defaultProps} header="Remove Member" />);
    expect(screen.getByTestId("shared.delete-dialog.title")).toHaveTextContent(
      "Remove Member",
    );
  });

  it("renders custom confirmButtonLabel", () => {
    render(
      <DeleteConfirmDialog {...defaultProps} confirmButtonLabel="Yes, delete" />,
    );
    expect(screen.getByTestId("shared.delete-dialog.confirm-btn")).toHaveTextContent(
      "Yes, delete",
    );
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    render(<DeleteConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByTestId("shared.delete-dialog.confirm-btn"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked", async () => {
    const onClose = vi.fn();
    render(<DeleteConfirmDialog {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByTestId("shared.delete-dialog.cancel-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the X close button is clicked", async () => {
    const onClose = vi.fn();
    render(<DeleteConfirmDialog {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

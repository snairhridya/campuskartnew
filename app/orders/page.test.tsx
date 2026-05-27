import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrdersPage from "./page";
import { useRouter } from "next/navigation";

type MockedFn<T extends (...args: any[]) => any> = T & vi.Mock<ReturnType<T>, Parameters<T>>;

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("OrdersPage", () => {
  const pushMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as MockedFn<typeof useRouter>).mockReturnValue({ push: pushMock, back: vi.fn() });
  });

  it("renders order history and order cards", () => {
    render(<OrdersPage />);

    expect(screen.getByRole("heading", { name: /Order History/i })).toBeInTheDocument();
    expect(screen.getByText(/CK-A7X92B/)).toBeInTheDocument();
    expect(screen.getByText(/CK-P3M77K/)).toBeInTheDocument();
    expect(screen.getByText(/\$944\.00/)).toBeInTheDocument();
  });

  it("filters orders by tab (Pending Pickup)", async () => {
    render(<OrdersPage />);

    const pendingTab = screen.getByRole("tab", { name: /Pending Pickup/i });
    await userEvent.click(pendingTab);

    expect(screen.getByText(/CK-P3M77K/)).toBeInTheDocument();
    expect(screen.queryByText(/CK-A7X92B/)).not.toBeInTheDocument();
  });
});

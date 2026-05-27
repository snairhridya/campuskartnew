import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartPage from "./page";
import { useRouter } from "next/navigation";

type MockedFn<T extends (...args: any[]) => any> = T & vi.Mock<ReturnType<T>, Parameters<T>>;

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CartPage", () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as MockedFn<typeof useRouter>).mockReturnValue({
      push: pushMock,
      back: vi.fn(),
    });
  });

  it("renders the cart summary and products", () => {
    render(<CartPage />);

    expect(screen.getByRole("heading", { name: /Your Cart \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText(/MacBook Pro \(2022\) - M2 Chip/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculus: Early Transcendentals/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$944\.00/).length).toBeGreaterThan(0);
  });

  it("increases quantity and updates the order summary", async () => {
    render(<CartPage />);

    const increaseButton = screen.getByRole("button", {
      name: /Increase quantity of MacBook Pro \(2022\) - M2 Chip/i,
    });

    await userEvent.click(increaseButton);

    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$1843\.00/).length).toBeGreaterThan(0);
  });

  it("removes an item and navigates to checkout", async () => {
    render(<CartPage />);

    const removeButton = screen.getByRole("button", {
      name: /Remove Calculus: Early Transcendentals from cart/i,
    });

    await userEvent.click(removeButton);

    expect(screen.queryByText(/Calculus: Early Transcendentals/i)).not.toBeInTheDocument();

    const checkoutButton = screen.getByRole("button", {
      name: /^Proceed to Checkout$/i,
    });
    await userEvent.click(checkoutButton);

    expect(pushMock).toHaveBeenCalledWith("/checkout");
  });
});

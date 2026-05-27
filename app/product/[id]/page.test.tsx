import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductDetailPage from "./page";
import { useParams, useRouter } from "next/navigation";

type MockedFn<T extends (...args: any[]) => any> = T & vi.Mock<ReturnType<T>, Parameters<T>>;

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

describe("ProductDetailPage", () => {
  const pushMock = vi.fn();
  const backMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as MockedFn<typeof useRouter>).mockReturnValue({
      push: pushMock,
      back: backMock,
    });
  });

  it("renders product details for a valid product id", async () => {
    (useParams as unknown as MockedFn<typeof useParams>).mockReturnValue({ id: "1" });

    render(<ProductDetailPage />);

    expect(screen.getByRole("heading", { name: /MacBook Pro \(2022\)/i })).toBeInTheDocument();
    expect(screen.getByText(/\$899\.00/)).toBeInTheDocument();

    const [addToCartButton] = screen.getAllByRole("button", { name: /Add to Cart/i });
    await userEvent.click(addToCartButton);
    expect(screen.getAllByRole("button", { name: /✓ ADDED!/i })[0]).toBeInTheDocument();

    const wishlistButton = screen.getByRole("button", { name: /Add to wishlist/i });
    await userEvent.click(wishlistButton);
    expect(screen.getByRole("button", { name: /Remove from wishlist/i })).toBeInTheDocument();
  });

  it("shows a not found page for an invalid product id", async () => {
    (useParams as unknown as MockedFn<typeof useParams>).mockReturnValue({ id: "999" });

    render(<ProductDetailPage />);

    expect(screen.getByText(/Product not found/i)).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /Back to Home/i });
    await userEvent.click(backButton);
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});

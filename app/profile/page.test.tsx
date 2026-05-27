import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "./page";
import { useRouter } from "next/navigation";

type MockedFn<T extends (...args: any[]) => any> = T & vi.Mock<ReturnType<T>, Parameters<T>>;

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ProfilePage", () => {
  const pushMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as MockedFn<typeof useRouter>).mockReturnValue({ push: pushMock, back: vi.fn() });
  });

  it("renders profile info and stats", () => {
    render(<ProfilePage />);

    expect(screen.getByText(/Aditya Kumar/)).toBeInTheDocument();
    expect(screen.getByText(/aditya.kumar@iitb.ac.in/)).toBeInTheDocument();
    expect(screen.getByText(/Bought/)).toBeInTheDocument();
    expect(screen.getByText(/Sold/)).toBeInTheDocument();
  });

  it("logout requires double-tap to confirm and then redirects", async () => {
    render(<ProfilePage />);

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    await userEvent.click(logoutButton);

    // After first click it should prompt confirmation
    expect(screen.getByRole("button", { name: /Tap again to confirm logout/i })).toBeInTheDocument();

    // Click again to confirm and expect navigation to /login
    await userEvent.click(screen.getByRole("button", { name: /Tap again to confirm logout/i }));
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});

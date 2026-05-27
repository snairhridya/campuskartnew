import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("LoginPage", () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: pushMock, back: vi.fn() });
  });

  it("shows validation error when submitting empty login form", async () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: /Login/i });
    await userEvent.click(loginButton);

    expect(screen.getByText(/Please enter your email and password\./i)).toBeInTheDocument();
  });

  it("logs in successfully and redirects to home", async () => {
    render(<LoginPage />);

    const email = screen.getByLabelText(/Email Address/i);
    const password = screen.getByLabelText(/Password/i);
    await userEvent.type(email, "student@uni.edu");
    await userEvent.type(password, "password123");

    const loginButton = screen.getByRole("button", { name: /Login/i });
    await userEvent.click(loginButton);

    // Button should show loading state
    expect(screen.getByText(/Logging in\.{3}|Logging in/i)).toBeInTheDocument();

    // wait for the simulated API call to finish (1500ms in source)
    await new Promise((r) => setTimeout(r, 1600));

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});

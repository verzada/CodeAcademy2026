import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IdemForm } from "@/app/components/IdemForm";

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("IdemForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the form with author and content fields", () => {
    renderWithProviders(<IdemForm />);
    expect(screen.getByLabelText("Author")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderWithProviders(<IdemForm />);
    expect(screen.getByRole("button", { name: "Publish Idem" })).toBeInTheDocument();
  });

  it("disables submit button when fields are empty", () => {
    renderWithProviders(<IdemForm />);
    expect(screen.getByRole("button", { name: "Publish Idem" })).toBeDisabled();
  });

  it("enables submit button when both fields have content", async () => {
    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Test Author");
    await user.type(screen.getByLabelText("Content"), "Test content");
    expect(screen.getByRole("button", { name: "Publish Idem" })).toBeEnabled();
  });

  it("shows character count for author field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Hello");
    expect(screen.getByText("5/50 characters")).toBeInTheDocument();
  });

  it("shows character count for content field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Content"), "Hi");
    expect(screen.getByText("2/280 characters")).toBeInTheDocument();
  });

  it("shows success message after successful publish", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, id: "idem-123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Test Author");
    await user.type(screen.getByLabelText("Content"), "Test content");
    await user.click(screen.getByRole("button", { name: "Publish Idem" }));

    expect(await screen.findByText(/Idem published/)).toBeInTheDocument();
  });

  it("shows error message when publish fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Validation failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Test Author");
    await user.type(screen.getByLabelText("Content"), "Test content");
    await user.click(screen.getByRole("button", { name: "Publish Idem" }));

    expect(await screen.findByText("Validation failed")).toBeInTheDocument();
  });

  it("shows network error on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Test Author");
    await user.type(screen.getByLabelText("Content"), "Test content");
    await user.click(screen.getByRole("button", { name: "Publish Idem" }));

    expect(await screen.findByText("Network error. Please check your connection.")).toBeInTheDocument();
  });

  it("clears form fields after successful publish", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, id: "idem-123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Test Author");
    await user.type(screen.getByLabelText("Content"), "Test content");
    await user.click(screen.getByRole("button", { name: "Publish Idem" }));

    await screen.findByText(/Idem published/);
    expect(screen.getByLabelText("Author")).toHaveValue("");
    expect(screen.getByLabelText("Content")).toHaveValue("");
  });

  it("shows fallback error message when server returns no message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<IdemForm />);
    await user.type(screen.getByLabelText("Author"), "Test Author");
    await user.type(screen.getByLabelText("Content"), "Test content");
    await user.click(screen.getByRole("button", { name: "Publish Idem" }));

    expect(await screen.findByText("Failed to publish idem")).toBeInTheDocument();
  });
});

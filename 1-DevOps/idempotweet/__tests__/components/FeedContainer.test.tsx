import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock environment variables before importing the component
const originalEnv = { ...process.env };

describe("FeedContainer", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  function renderWithProviders(ui: React.ReactElement) {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  }

  it("renders IdemsFeed", async () => {
    process.env.NEXT_PUBLIC_ENABLE_IDEM_FORM = "false";
    process.env.NEXT_PUBLIC_SHOW_SEEDED_IDEMS = "false";
    const { FeedContainer } = await import("@/app/components/FeedContainer");
    renderWithProviders(<FeedContainer />);
    // IdemsFeed renders a loading spinner initially
    expect(screen.getByText((_, el) => el?.className?.includes("animate-spin") ?? false)).toBeInTheDocument();
  });

  it("renders IdemForm when NEXT_PUBLIC_ENABLE_IDEM_FORM is true", async () => {
    process.env.NEXT_PUBLIC_ENABLE_IDEM_FORM = "true";
    process.env.NEXT_PUBLIC_SHOW_SEEDED_IDEMS = "false";
    const { FeedContainer } = await import("@/app/components/FeedContainer");
    renderWithProviders(<FeedContainer />);
    expect(screen.getByText("Create New Idem")).toBeInTheDocument();
  });

  it("does not render IdemForm when NEXT_PUBLIC_ENABLE_IDEM_FORM is false", async () => {
    process.env.NEXT_PUBLIC_ENABLE_IDEM_FORM = "false";
    process.env.NEXT_PUBLIC_SHOW_SEEDED_IDEMS = "false";
    const { FeedContainer } = await import("@/app/components/FeedContainer");
    renderWithProviders(<FeedContainer />);
    expect(screen.queryByText("Create New Idem")).not.toBeInTheDocument();
  });
});

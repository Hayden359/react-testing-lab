import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../components/App";

describe("App", () => {
  it("renders the bank title and loaded transactions", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              date: "2019-12-01",
              description: "App test transaction",
              category: "Test",
              amount: 10,
            },
          ]),
      }),
    );

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "The Royal Bank of Flatiron" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("App test transaction")).toBeInTheDocument();
  });
});

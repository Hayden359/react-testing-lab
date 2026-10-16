import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";
import Transaction from "../../components/Transaction";
import TransactionsList from "../../components/TransactionsList";

const transactions = [
  {
    id: "1",
    date: "2019-12-01",
    description: "Paycheck",
    category: "Income",
    amount: 1000,
  },
  {
    id: "2",
    date: "2019-12-02",
    description: "Lunch",
    category: "Food",
    amount: -10.5,
  },
];

describe("TransactionsList", () => {
  it("renders the table headings and all transaction rows", () => {
    render(<TransactionsList transactions={transactions} />);

    for (const heading of ["Date", "Description", "Category", "Amount", "DELETE"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText("Paycheck")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("renders an empty transaction list without data rows", () => {
    render(<TransactionsList transactions={[]} />);

    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});

describe("AccountContainer initial display", () => {
  it("loads and displays transactions on startup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(transactions),
      }),
    );

    render(<AccountContainer />);

    expect(await screen.findByText("Paycheck")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
  });
});
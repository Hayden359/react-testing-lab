import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountContainer from "../../components/AccountContainer";
import Search from "../../components/Search";
import Sort from "../../components/Sort";

const transactions = [
  {    id: "1",
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
    {
    id: "3",
    date: "2019-12-03",
    description: "Groceries",
    category: "Food",
    amount: -25,
  },
];

describe("Search", () => {
  it("passes the current input value to setSearch", () => {
    const setSearch = vi.fn();

    render(<Search setSearch={setSearch} />);
    fireEvent.change(
      screen.getByPlaceholderText("Search your Recent Transactions"),
      { target: { value: "Lunch" } },
    );

    expect(setSearch).toHaveBeenCalledWith("Lunch");
  });
});

describe("Sort", () => {
  it("passes the selected sort field to onSort", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(<Sort onSort={onSort} />);
    await user.selectOptions(screen.getByRole("combobox"), "category");

    expect(onSort).toHaveBeenCalledWith("category");
  });
});

describe("AccountContainer search and sort", () => {
  it("filters the displayed transactions as the search changes", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(transactions),
      }),
    );

    render(<AccountContainer />);
    await screen.findByText("Paycheck");

    await user.type(
      screen.getByPlaceholderText("Search your Recent Transactions"),
      "lunch",
    );

    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.queryByText("Paycheck")).not.toBeInTheDocument();
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
  });

  it("sorts the displayed transactions by the selected field", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(transactions),
      }),
    );
    render(<AccountContainer />);
    await screen.findByText("Paycheck");

    await user.selectOptions(screen.getByRole("combobox"), "description");

    const rows = screen.getAllByRole("row").slice(1);
    const descriptions = rows.map((row) => within(row).getAllByRole("cell")[1].textContent);
    expect(descriptions).toEqual(["Groceries", "Lunch", "Paycheck"]);
  });
});
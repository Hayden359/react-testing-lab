import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountContainer from "../../components/AccountContainer";
import AddTransactionForm from "../../components/AddTransactionForm";

describe("AddTransactionForm", () => {
  it("submits the entered transaction values", async () => {
    const user = userEvent.setup();
    const postTransaction = vi.fn();

    const { container } = render(
      <AddTransactionForm postTransaction={postTransaction} />,
    );

    await user.type(screen.getByPlaceholderText("Description"), "Coffee");
    await user.type(screen.getByPlaceholderText("Category"), "Food");
    await user.type(screen.getByPlaceholderText("Amount"), "-4.50");
    fireEvent.change(container.querySelector('input[name="date"]'), {
      target: { value: "2019-12-18" },
    });
    await user.click(screen.getByRole("button", { name: "Add Transaction" }));

    expect(postTransaction).toHaveBeenCalledWith({
      date: "2019-12-18",
      description: "Coffee",
      category: "Food",
      amount: "-4.5",
    });
  });
});

describe("AccountContainer transaction submission", () => {
  it("posts a new transaction and displays the returned transaction", async () => {
    const user = userEvent.setup();
    const initialTransactions = [
      {
        id: "1",
        date: "2019-12-17",
        description: "Lunch",
        category: "Food",
        amount: -12,
      },
    ];
    const createdTransaction = {
      id: "2",
      date: "2019-12-18",
      description: "Coffee",
      category: "Food",
      amount: "-4.5",
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(initialTransactions),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdTransaction),
      });
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<AccountContainer />);
    await screen.findByText("Lunch");

    await user.type(screen.getByPlaceholderText("Description"), "Coffee");
    await user.type(screen.getByPlaceholderText("Category"), "Food");
    await user.type(screen.getByPlaceholderText("Amount"), "-4.50");
    fireEvent.change(container.querySelector('input[name="date"]'), {
      target: { value: "2019-12-18" },
    });
    await user.click(screen.getByRole("button", { name: "Add Transaction" }));

    await screen.findByText("Coffee");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(
      "http://localhost:6001/transactions",
    );
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "2019-12-18",
        description: "Coffee",
        category: "Food",
        amount: "-4.5",
      }),
    });
  });
});
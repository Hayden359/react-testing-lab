import React from "react";

function AddTransactionForm({postTransaction}) {
  function submitForm(e){
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTransaction = {
      date: formData.get("date"),
      description: formData.get("description"),
      category: formData.get("category"),
      amount: formData.get("amount")
    }
    postTransaction(newTransaction)

  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={(e)=>{submitForm(e)}}>
        <div className="inline fields">
          <input type="date" name="date" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="category" placeholder="Category" />
          <input type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;

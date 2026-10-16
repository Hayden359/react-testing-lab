import React, {useState, useEffect} from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions,setTransactions] = useState([])
  const [search,setSearch] = useState("")
  const [sortBy, setSortBy] = useState("")

  useEffect(()=>{
    fetch("http://localhost:6001/transactions")
    .then(r=>r.json())
    .then(data=>setTransactions(data))
  },[])

  function postTransaction(newTransaction){
    fetch('http://localhost:6001/transactions',{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
    .then(r=>r.json())
    .then(data=>setTransactions([...transactions,data]))
  }
  
  const visibleTransactions = transactions
    .filter((transaction) => {
      const query = search.trim().toLowerCase()
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      )
    })
    .sort((first, second) =>
      sortBy ? first[sortBy].localeCompare(second[sortBy]) : 0
    )

  return (
    <div>
      <Search setSearch={setSearch}/>
      <AddTransactionForm postTransaction={postTransaction}/>
      <Sort onSort={setSortBy}/>
      <TransactionsList transactions={visibleTransactions} />
    </div>
  );
}

export default AccountContainer;

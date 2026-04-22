import { useEffect, useMemo, useState } from "react";
import { addExpense, getExpenses } from "../api";
import { getToken } from "../auth";

const emptyExpense = { title: "", amount: "", category: "" };

export default function DashboardPage() {
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  useEffect(() => {
    loadExpenses();
  }, []);

  function updateExpenseField(event) {
    const { name, value } = event.target;
    setExpenseForm((prev) => ({ ...prev, [name]: value }));
  }

  async function loadExpenses() {
    try {
      setIsLoading(true);
      const response = await getExpenses(getToken());
      setExpenses(response.data || []);
      setMessage("Loaded previous expenses");
    } catch (error) {
      setMessage(error.response?.data || "Could not fetch expenses");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddExpense(event) {
    event.preventDefault();

    try {
      setIsLoading(true);
      await addExpense(
        {
          ...expenseForm,
          amount: Number(expenseForm.amount)
        },
        getToken()
      );
      setExpenseForm(emptyExpense);
      setMessage("Expense added successfully");
      await loadExpenses();
    } catch (error) {
      setMessage(error.response?.data || "Could not add expense");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page dashboard-page">
      <section className="panel">
        <h2>Add New Expense</h2>
        <form className="stack-form" onSubmit={handleAddExpense}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={expenseForm.title}
            onChange={updateExpenseField}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={expenseForm.amount}
            onChange={updateExpenseField}
            min="0"
            step="0.01"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={expenseForm.category}
            onChange={updateExpenseField}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Expense"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="expense-header">
          <h2>My Previous Expenses</h2>
          <button type="button" onClick={loadExpenses} disabled={isLoading}>
            Refresh
          </button>
        </div>

        <p className="message">{message}</p>
        <div className="summary">Total: Rs {totalAmount.toFixed(2)}</div>

        <ul className="expense-list">
          {expenses.length === 0 && <li className="empty">No expenses yet</li>}
          {expenses.map((item) => (
            <li key={item._id}>
              <strong>{item.title}</strong>
              <span>{item.category}</span>
              <span>Rs {Number(item.amount).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

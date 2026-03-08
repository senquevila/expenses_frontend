import { Plus } from "lucide-react";

export function Transactions() {
  const periods = [
    { id: 1, name: "Q1 2026", active: true },
    { id: 2, name: "Q4 2025", active: false },
    { id: 3, name: "Q3 2025", active: false },
    { id: 4, name: "Q2 2025", active: false },
  ];

  const transactions = [
    { id: 1, date: "Mar 2, 2026", description: "Grocery Store", account: "Checking", amount: "-$125.50" },
    { id: 2, date: "Mar 1, 2026", description: "Salary Deposit", account: "Checking", amount: "+$3,500.00" },
    { id: 3, date: "Feb 28, 2026", description: "Electric Bill", account: "Checking", amount: "-$89.00" },
    { id: 4, date: "Feb 27, 2026", description: "Restaurant", account: "Credit Card", amount: "-$45.20" },
    { id: 5, date: "Feb 26, 2026", description: "Gas Station", account: "Credit Card", amount: "-$52.00" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
          <Plus className="size-5" />
          Add Transaction
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-700 mb-2">Period</label>
        <select className="px-4 py-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 min-w-[200px]">
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.name} {period.active && "(Active)"}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-100 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Date</th>
              <th className="text-left px-6 py-3 font-semibold">Description</th>
              <th className="text-left px-6 py-3 font-semibold">Account</th>
              <th className="text-right px-6 py-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-zinc-50">
                <td className="px-6 py-4">{transaction.date}</td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4">{transaction.account}</td>
                <td className={`px-6 py-4 text-right font-semibold ${
                  transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
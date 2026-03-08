import { Plus, ArrowLeftRight, Link2, Clock } from "lucide-react";

export function Accounts() {
  const accounts = [
    { id: 1, name: "Checking Account", type: "Asset", balance: "$5,240.00" },
    { id: 2, name: "Savings Account", type: "Asset", balance: "$12,850.00" },
    { id: 3, name: "Credit Card", type: "Liability", balance: "$1,320.00" },
    { id: 4, name: "Investment Portfolio", type: "Asset", balance: "$25,600.00" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors">
            <ArrowLeftRight className="size-5" />
            Transfer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors">
            <Link2 className="size-5" />
            Associate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors">
            <Clock className="size-5" />
            Programmed
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Plus className="size-5" />
            Create Account
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">{account.name}</h2>
                <p className="text-zinc-500 text-sm">{account.type}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{account.balance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
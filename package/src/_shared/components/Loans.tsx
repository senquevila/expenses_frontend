"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export function Loans() {
  const [filter, setFilter] = useState<"all" | "active">("all");
  
  const loans = [
    { id: 1, name: "Home Mortgage", lender: "First Bank", balance: "$245,800.00", rate: "3.5%", payment: "$1,200/mo", active: true },
    { id: 2, name: "Car Loan", lender: "Auto Finance Co", balance: "$18,450.00", rate: "4.2%", payment: "$385/mo", active: true },
    { id: 3, name: "Student Loan", lender: "Education Loans Inc", balance: "$32,100.00", rate: "5.8%", payment: "$295/mo", active: false },
  ];

  const filteredLoans = filter === "active" ? loans.filter(loan => loan.active) : loans;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loans</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
          <Plus className="size-5" />
          Add Loan
        </button>
      </div>
      
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "all"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          All Loans
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "active"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Active Only
        </button>
      </div>
      
      <div className="grid gap-4">
        {filteredLoans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-semibold">{loan.name}</h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs ${
                      loan.active
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {loan.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm">{loan.lender}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{loan.balance}</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm mb-4">
              <div>
                <p className="text-zinc-500">Interest Rate</p>
                <p className="font-semibold">{loan.rate}</p>
              </div>
              <div>
                <p className="text-zinc-500">Monthly Payment</p>
                <p className="font-semibold">{loan.payment}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-100">
              {loan.active ? (
                <button className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors text-sm">
                  Mark as Inactive
                </button>
              ) : (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Mark as Active
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
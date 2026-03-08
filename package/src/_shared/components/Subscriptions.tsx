"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export function Subscriptions() {
  const [filter, setFilter] = useState<"all" | "active">("all");
  
  const subscriptions = [
    { id: 1, name: "Netflix", category: "Entertainment", amount: "$15.99", frequency: "Monthly", nextBilling: "Mar 15, 2026", active: true },
    { id: 2, name: "Spotify Premium", category: "Entertainment", amount: "$10.99", frequency: "Monthly", nextBilling: "Mar 8, 2026", active: true },
    { id: 3, name: "Adobe Creative Cloud", category: "Software", amount: "$54.99", frequency: "Monthly", nextBilling: "Mar 20, 2026", active: false },
    { id: 4, name: "Gym Membership", category: "Health", amount: "$45.00", frequency: "Monthly", nextBilling: "Mar 1, 2026", active: true },
  ];

  const filteredSubscriptions = filter === "active" ? subscriptions.filter(sub => sub.active) : subscriptions;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
          <Plus className="size-5" />
          Add Subscription
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
          All Subscriptions
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
        {filteredSubscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-semibold">{subscription.name}</h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs ${
                      subscription.active
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {subscription.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm">{subscription.category}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{subscription.amount}</p>
                <p className="text-sm text-zinc-500">{subscription.frequency}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-100 mb-4">
              <p className="text-sm text-zinc-600">
                Next billing: <span className="font-semibold">{subscription.nextBilling}</span>
              </p>
            </div>
            <div>
              {subscription.active ? (
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
"use client";

import { useEffect } from "react";
import { Plus, ArrowLeftRight, Link2, Clock } from "lucide-react";
import { useAccountStore } from "@/_store/account.store";

export function Accounts() {
  const { accounts, loading, fetchAll } = useAccountStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      {loading ? (
        <p className="text-zinc-500">Loading accounts...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <h2 className="text-lg font-semibold leading-tight">{account.name}</h2>
              <div className="flex items-center justify-between">
                {account.parent !== null && (
                  <p className="text-zinc-400 text-xs">Parent: {account.parent}</p>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full text-white ${
                      account.account_type.toLowerCase().startsWith("fix")
                        ? "bg-blue-500"
                        : account.account_type.toLowerCase().startsWith("var")
                        ? "bg-yellow-400"
                        : "bg-zinc-400"
                    }`}
                  >
                    {account.account_type}
                  </span>
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded-full text-white ${
                      account.sign < 0 ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {account.sign < 0 ? "−" : "+"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useTransactionStore } from "@/_store/transaction.store";
import { Transaction } from "@/_models/transaction.model";
import { Period } from "@/_models/period.model";
import { periodService } from "@/_services/period.service";
import TransactionForm from "@/_shared/components/TransactionForm";
import Money from "@/_shared/components/Money";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function Transactions() {
  const transactions = useTransactionStore((s) => s.transactions);
  const loading = useTransactionStore((s) => s.loading);
  const fetchAll = useTransactionStore((s) => s.fetchAll);
  const page = useTransactionStore((s) => s.page);
  const totalCount = useTransactionStore((s) => s.totalCount);
  const hasNext = useTransactionStore((s) => s.hasNext);
  const hasPrevious = useTransactionStore((s) => s.hasPrevious);
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");

  useEffect(() => {
    periodService.getAll().then(setPeriods);
    fetchAll();
  }, [fetchAll]);

  const filterParams = {
    year: selectedYear || undefined,
    month: selectedMonth || undefined,
  } as { year?: number; month?: number };
  const hasMatchingPeriod =
    selectedYear !== "" && selectedMonth !== ""
      ? periods.some(
          (p) => p.year === selectedYear && p.month === selectedMonth,
        )
      : false;

  useEffect(() => {
    if (selectedYear === "" && selectedMonth === "") {
      fetchAll();
      return;
    }
    if (selectedYear !== "" && selectedMonth !== "") {
      if (hasMatchingPeriod)
        fetchAll({ year: selectedYear, month: selectedMonth });
      return;
    }
    if (selectedYear !== "") fetchAll({ year: selectedYear });
    if (selectedMonth !== "") fetchAll({ month: selectedMonth });
  }, [selectedYear, selectedMonth, fetchAll, hasMatchingPeriod]);

  function goToPage(p: number) {
    fetchAll({ ...filterParams, page: p });
  }

  const years = [...new Set(periods.map((p) => p.year))].sort((a, b) => b - a);

  const periodNotFound =
    selectedYear !== "" && selectedMonth !== "" ? !hasMatchingPeriod : false;

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white text-sm"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white text-sm"
          >
            <option value="">All months</option>
            {ALL_MONTHS.map((m) => (
              <option key={m} value={m}>
                {MONTH_NAMES[m - 1]}
              </option>
            ))}
          </select>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
                <Plus className="size-5" />
                Add Transaction
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                <Dialog.Title className="text-xl font-semibold mb-4">
                  New Transaction
                </Dialog.Title>
                <TransactionForm onCancel={() => setOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <Dialog.Root
        open={!!editingTransaction}
        onOpenChange={(o) => !o && setEditingTransaction(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Edit Transaction
            </Dialog.Title>
            {editingTransaction && (
              <TransactionForm
                transaction={editingTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {periodNotFound ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-zinc-500">
          No period found for {MONTH_NAMES[(selectedMonth as number) - 1]}{" "}
          {selectedYear}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-100 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Date</th>
                <th className="text-left px-6 py-3 font-semibold">
                  Description
                </th>
                <th className="text-left px-6 py-3 font-semibold">Account</th>
                <th className="text-right px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-zinc-50">
                  <td className="px-6 py-4">{transaction.payment_date}</td>
                  <td className="px-6 py-4">{transaction.description}</td>
                  <td className="px-6 py-4">{transaction.account.name}</td>
                  <td className="px-6 py-4 text-right">
                    <Money value={transaction.amount} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="p-1.5 rounded hover:bg-zinc-100 transition-colors"
                      aria-label="Edit transaction"
                    >
                      <Pencil className="size-4 text-zinc-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 border-t bg-zinc-50">
            <span className="text-sm text-zinc-500">{totalCount} total</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={!hasPrevious}
                className="p-1.5 rounded hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-zinc-700">Page {page}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasNext}
                className="p-1.5 rounded hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

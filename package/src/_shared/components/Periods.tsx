"use client";

import { Plus } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { usePeriodStore } from "@/_store/period.store";
import PeriodForm from "@/_shared/components/PeriodForm";

export default function Periods() {
  const { periods, fetchAll, loading, toggle } = usePeriodStore();
  const [filter, setFilter] = useState<"all" | "closed">("all");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = filter === "closed" ? periods.filter((p) => p.closed) : periods;

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Periods</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
              <Plus className="size-5" />
              Create Period
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <Dialog.Title className="text-xl font-semibold mb-4">New Period</Dialog.Title>
              <PeriodForm onCancel={() => setOpen(false)} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-100 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Period</th>
              <th className="text-right px-6 py-3 font-semibold">Total</th>
              <th className="text-center px-6 py-3 font-semibold">Closed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((period) => (
              <tr key={period.id} className="border-b hover:bg-zinc-50">
                <td className="px-6 py-4">{period.year}-{String(period.month).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-right">{period.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <Switch.Root
                    className="w-11 h-6 bg-zinc-300 rounded-full relative data-[state=checked]:bg-green-600 outline-none cursor-pointer transition-colors"
                    checked={period.closed}
                    onCheckedChange={() => toggle(period.id)}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
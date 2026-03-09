"use client";

import { Plus } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { usePeriodStore } from "@/_store/period.store";

export default function Periods() {
  const { periods, fetchAll, loading, error, toggle } = usePeriodStore();
  const [filter, setFilter] = useState<"all" | "active">("all");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = filter === "active" ? periods.filter((p) => p.active) : periods;

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Periods</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
          <Plus className="size-5" />
          Create Period
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-100 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Year</th>
              <th className="text-left px-6 py-3 font-semibold">Month</th>
              <th className="text-left px-6 py-3 font-semibold">Total</th>
              <th className="text-left px-6 py-3 font-semibold">Closed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((period) => (
              <tr key={period.id} className="border-b hover:bg-zinc-50">
                <td className="px-6 py-4">{period.year}</td>
                <td className="px-6 py-4">{period.month}</td>
                <td className="px-6 py-4">{period.total}</td>
                <td className="px-6 py-4 text-center">
                  <Switch.Root
                    className="w-11 h-6 bg-zinc-300 rounded-full relative data-[state=checked]:bg-green-600 outline-none cursor-pointer transition-colors"
                    checked={!period.closed}
                    onCheckedChange={() => toogle(period.id)}
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
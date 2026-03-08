import { Plus } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

export function Periods() {
  const periods = [
    { id: 1, name: "Q1 2026", start: "Jan 1", end: "Mar 31", status: "Active" },
    { id: 2, name: "Q4 2025", start: "Oct 1", end: "Dec 31", status: "Closed" },
    { id: 3, name: "Q3 2025", start: "Jul 1", end: "Sep 30", status: "Closed" },
  ];

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
              <th className="text-left px-6 py-3 font-semibold">Period Name</th>
              <th className="text-left px-6 py-3 font-semibold">Start Date</th>
              <th className="text-left px-6 py-3 font-semibold">End Date</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-center px-6 py-3 font-semibold">Active</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id} className="border-b hover:bg-zinc-50">
                <td className="px-6 py-4">{period.name}</td>
                <td className="px-6 py-4">{period.start}</td>
                <td className="px-6 py-4">{period.end}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      period.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {period.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Switch.Root
                    className="w-11 h-6 bg-zinc-300 rounded-full relative data-[state=checked]:bg-green-600 outline-none cursor-pointer transition-colors"
                    defaultChecked={period.status === "Active"}
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
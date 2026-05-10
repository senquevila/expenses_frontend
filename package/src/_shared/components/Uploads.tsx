"use client";

import { Plus, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useUploadStore } from "@/_store/upload.store";
import { Upload } from "@/_models/upload.model";
import UploadForm from "@/_shared/components/UploadForm";
import Pagination from "@/_shared/components/Pagination";

function fileName(url: string | null): string {
  if (!url) return "—";
  return url.split("/").pop() ?? url;
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

function parseSummary(
  result: string | null,
): { created: number; total: number } | null {
  if (!result) return null;
  try {
    const parsed = JSON.parse(result);
    const s = parsed?.summary;
    if (s && typeof s.created === "number" && typeof s.total === "number")
      return s;
  } catch {}
  return null;
}

export default function Uploads() {
  const { uploads, count, page, totalPages, fetchPage, loading, remove } =
    useUploadStore();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleDelete = async (upload: Upload) => {
    if (confirmId === upload.id) {
      await remove(upload.id);
      setConfirmId(null);
    } else {
      setConfirmId(upload.id);
    }
  };

  if (loading && uploads.length === 0)
    return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Uploads</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
              <Plus className="size-5" />
              New Upload
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <Dialog.Title className="text-xl font-semibold mb-4">
                New Upload
              </Dialog.Title>
              <UploadForm onCancel={() => setOpen(false)} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-100 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">File</th>
              <th className="text-left px-6 py-3 font-semibold">Start Date</th>
              <th className="text-left px-6 py-3 font-semibold">End Date</th>
              <th className="text-center px-6 py-3 font-semibold">Rows</th>
              <th className="text-center px-6 py-3 font-semibold">Result</th>
              <th className="text-left px-6 py-3 font-semibold">Created</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {uploads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                  No uploads yet.
                </td>
              </tr>
            )}
            {uploads.map((upload) => {
              const summary = parseSummary(
                typeof upload.result === "string" ? upload.result : null,
              );
              return (
                <tr key={upload.id} className="border-b hover:bg-zinc-50">
                  <td
                    className="px-6 py-4 text-sm font-mono truncate max-w-xs"
                    title={upload.file ?? ""}
                  >
                    {fileName(upload.file)}
                  </td>
                  <td className="px-6 py-4">{formatDate(upload.start_date)}</td>
                  <td className="px-6 py-4">{formatDate(upload.end_date)}</td>
                  <td className="px-6 py-4 text-center">
                    {upload.dimension?.rows ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {summary ? (
                      <span className="text-green-700 font-medium">
                        {summary.created}/{summary.total}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {formatDate(upload.created)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {confirmId === upload.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-zinc-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(upload)}
                          className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1 text-sm bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(upload.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded"
                        title="Delete upload"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={fetchPage}
        count={count}
        itemLabel="upload"
      />
    </div>
  );
}

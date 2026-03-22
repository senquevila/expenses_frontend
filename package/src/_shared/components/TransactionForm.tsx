"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTransactionRequestSchema } from "@/_models/transaction.model";
import { useTransactionStore } from "@/_store/transaction.store";

interface TransactionFormProps {
    onCancel?: () => void;
}

type FormValues = import("@/_models/transaction.model").CreateTransactionRequest;

const today = new Date().toISOString().split("T")[0];

export default function TransactionForm({ onCancel }: TransactionFormProps) {
  const add = useTransactionStore((s) => s.add);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(CreateTransactionRequestSchema),
    defaultValues: {
      payment_date: today,
      amount: 0,
      local_amount: 0,
      description: "",
      period: undefined,
      account: undefined,
      currency: undefined,
      identifier: null,
      upload: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await add(data);
      onCancel?.();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Period</label>
        <input type="number" {...register("period", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Account</label>
        <input type="number" {...register("account", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <input type="number" {...register("currency", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input type="date" {...register("payment_date")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.payment_date && <p className="text-red-500 text-sm mt-1">{errors.payment_date.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input type="text" {...register("description")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Local Amount</label>
        <input type="number" step="0.01" {...register("local_amount", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.local_amount && <p className="text-red-500 text-sm mt-1">{errors.local_amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Identifier</label>
        <input type="text" {...register("identifier")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="size-5 inline-block mr-2" />
          Add Transaction
        </button>
        <button type="button" onClick={() => onCancel?.()} className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

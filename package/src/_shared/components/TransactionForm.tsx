"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTransactionRequestSchema, Transaction } from "@/_models/transaction.model";
import { Currency } from "@/_models/currency.model";
import { currencyService } from "@/_services/currency.service";
import { useTransactionStore } from "@/_store/transaction.store";
import { usePeriodStore } from "@/_store/period.store";
import { useAccountStore } from "@/_store/account.store";

interface TransactionFormProps {
    onCancel?: () => void;
    transaction?: Transaction;
}

type FormValues = import("@/_models/transaction.model").CreateTransactionRequest;

const today = new Date().toISOString().split("T")[0];

export default function TransactionForm({ onCancel, transaction }: TransactionFormProps) {
  const add = useTransactionStore((s) => s.add);
  const edit = useTransactionStore((s) => s.edit);
  const periods = usePeriodStore((s) => s.periods);
  const fetchPeriods = usePeriodStore((s) => s.fetchAll);
  const accounts = useAccountStore((s) => s.accounts);
  const fetchAccounts = useAccountStore((s) => s.fetchAll);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(CreateTransactionRequestSchema),
    defaultValues: transaction
      ? {
          payment_date: transaction.payment_date,
          amount: transaction.amount,
          description: transaction.description ?? "",
          period: transaction.period.id,
          account: transaction.account.id,
          identifier: transaction.identifier,
          upload: transaction.upload,
        }
      : {
          payment_date: today,
          amount: { value: 0, currency: "HNL" },
          description: "",
          period: undefined,
          account: undefined,
          identifier: null,
          upload: null,
        },
  });

  useEffect(() => {
    fetchPeriods();
    fetchAccounts();
  }, [fetchPeriods, fetchAccounts]);

  useEffect(() => {
    if (periods.length === 0) return;
    const lastPeriod = periods.reduce((a, b) =>
      a.year * 12 + a.month >= b.year * 12 + b.month ? a : b
    );
    if (!getValues("period")) {
      setValue("period", lastPeriod.id);
    }
  }, [periods, getValues, setValue]);

  useEffect(() => {
    let isMounted = true;

    const loadCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        const data = await currencyService.getAll();
        if (!isMounted) {
          return;
        }

        setCurrencies(data);

        const fallbackCurrencyAlpha3 = data[0]?.alpha3;

        if (fallbackCurrencyAlpha3 && !getValues("amount.currency")) {
          setValue("amount.currency", fallbackCurrencyAlpha3);
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      } finally {
        if (isMounted) {
          setLoadingCurrencies(false);
        }
      }
    };

    loadCurrencies();

    return () => {
      isMounted = false;
    };
  }, [getValues, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (transaction) {
        await edit(transaction.id, data);
      } else {
        await add(data);
      }
      onCancel?.();
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Period</label>
        <select {...register("period", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" disabled={periods.length === 0}>
          <option value="">Select period</option>
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.year}-{String(period.month).padStart(2, "0")}
            </option>
          ))}
        </select>
        {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Account</label>
        <select {...register("account", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" disabled={accounts.length === 0}>
          <option value="">Select account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account.message}</p>}
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
        <div className="flex gap-2">
          <input type="number" step="0.01" {...register("amount.value", { valueAsNumber: true })} placeholder="Value" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          <select
            {...register("amount.currency")}
            className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            disabled={loadingCurrencies || currencies.length === 0}
          >
            <option value="">Currency</option>
            {currencies.map((currency) => (
              <option key={currency.id} value={currency.alpha3}>
                {currency.alpha3}
              </option>
            ))}
          </select>
        </div>
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>
      {(errors.amount?.value?.message || errors.amount?.currency?.message) && (
        <p className="text-red-500 text-sm mt-1">
          {errors.amount?.value?.message || errors.amount?.currency?.message}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="size-5 inline-block mr-2" />
          {transaction ? "Save Changes" : "Add Transaction"}
        </button>
        <button type="button" onClick={() => onCancel?.()} className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

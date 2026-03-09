"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePeriodRequestSchema, CreatePeriodRequest } from "@/_models/period.model";
import { usePeriodStore } from "@/_store/period.store";

interface PeriodFormProps {
    onCancel?: () => void;
}

export default function PeriodForm({ onCancel }: PeriodFormProps) {
  const { add } = usePeriodStore();

    const { register, handleSubmit, formState: { errors } } = useForm<CreatePeriodRequest>({
        resolver: zodResolver(CreatePeriodRequestSchema),
        defaultValues: {
            month: 1,
            year: new Date().getFullYear(),
            total: 0,
            closed: false,
        },
    });

    const onSubmit = async (data: CreatePeriodRequest) => {
        try {
            await add(data);
            onCancel?.();
        } catch (error) {
            console.error("Failed to create period:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input type="number" {...register("year")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <input type="number" {...register("month")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <input type="number" {...register("total")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                {errors.total && <p className="text-red-500 text-sm mt-1">{errors.total.message}</p>}
            </div>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("closed")} className="form-checkbox" />
                    Closed
                </label>
            </div>
            <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Plus className="size-5 inline-block mr-2" />
                    Create Period
                </button>
                <button type="button" onClick={() => onCancel?.()} className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    );
}
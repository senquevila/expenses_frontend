"use client";

interface AmountProps {
  value: number;
  className?: string;
}

export default function Amount({ value, className = "" }: AmountProps) {
  return (
    <span
      className={`font-semibold ${value >= 0 ? "text-green-600" : "text-red-600"} ${className}`}
    >
      {value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

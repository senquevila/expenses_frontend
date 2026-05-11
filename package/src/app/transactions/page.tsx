import Transactions from "@/_shared/components/Transactions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { year, month } = await searchParams;
  const parsedYear = year ? Number(year) : NaN;
  const validYear =
    Number.isInteger(parsedYear) && parsedYear > 0 ? parsedYear : undefined;
  const parsedMonth = month ? Number(month) : NaN;
  const validMonth =
    Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : undefined;
  return <Transactions initialYear={validYear} initialMonth={validMonth} />;
}

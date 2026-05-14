import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePostsByYearMonth } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const y = Number(year);
  const m = Number(month);
  const filtered = Number.isFinite(y) && Number.isFinite(m)
    ? await getActivePostsByYearMonth(y, m)
    : [];

  return (
    <AppLayout sidebar={{ selectedYear: year, selectedMonth: month }}>
      <Main posts={filtered} />
    </AppLayout>
  );
}

import { AppLayout } from "@/components/Layout/AppLayout";
import { PaginatedBlogList } from "@/components/Blog/InfiniteScrollList";
import { getActivePostsByYearMonthInitial, getActivePostsByYearMonthCount } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const y = Number(year);
  const m = Number(month);
  
  const [initialPosts, total] = Number.isFinite(y) && Number.isFinite(m)
    ? await Promise.all([
        getActivePostsByYearMonthInitial(y, m, 10),
        getActivePostsByYearMonthCount(y, m),
      ])
    : [[], 0];

  return (
    <AppLayout sidebar={{ selectedYear: year, selectedMonth: month }}>
      <main>
        <PaginatedBlogList 
          initialPosts={initialPosts} 
          total={total}
          filterType="history"
          year={y}
          month={m}
        />
      </main>
    </AppLayout>
  );
}

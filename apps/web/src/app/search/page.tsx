import { AppLayout } from "@/components/Layout/AppLayout";
import { PaginatedBlogList } from "@/components/Blog/InfiniteScrollList";
import { searchActivePostsInitial, searchActivePostsCount } from "@/functions/db-posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [initialPosts, total] = await Promise.all([
    searchActivePostsInitial(q ?? "", 10),
    searchActivePostsCount(q ?? ""),
  ]);

  return (
    <AppLayout query={q}>
      <main>
        <PaginatedBlogList 
          initialPosts={initialPosts} 
          total={total}
          filterType="search"
          query={q}
        />
      </main>
    </AppLayout>
  );
}

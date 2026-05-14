import { AppLayout } from "@/components/Layout/AppLayout";
import { PaginatedBlogList } from "@/components/Blog/InfiniteScrollList";
import { getActivePostsByCategorySlugInitial, getActivePostsByCategorySlugCount } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const [initialPosts, total] = await Promise.all([
    getActivePostsByCategorySlugInitial(name, 10),
    getActivePostsByCategorySlugCount(name),
  ]);

  return (
    <AppLayout sidebar={{ categorySlug: name }}>
      <main>
        <PaginatedBlogList 
          initialPosts={initialPosts} 
          total={total}
          filterType="category"
          category={name}
        />
      </main>
    </AppLayout>
  );
}

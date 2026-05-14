import { AppLayout } from "@/components/Layout/AppLayout";
import { PaginatedBlogList } from "@/components/Blog/InfiniteScrollList";
import { getActivePostsByTagSlugInitial, getActivePostsByTagSlugCount } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const [initialPosts, total] = await Promise.all([
    getActivePostsByTagSlugInitial(name, 10),
    getActivePostsByTagSlugCount(name),
  ]);

  return (
    <AppLayout sidebar={{ tagSlug: name }}>
      <main>
        <PaginatedBlogList 
          initialPosts={initialPosts} 
          total={total}
          filterType="tags"
          tag={name}
        />
      </main>
    </AppLayout>
  );
}

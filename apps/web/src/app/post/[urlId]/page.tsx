import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { getActivePostByUrlId, increaseViewsByUrlId } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const existing = await getActivePostByUrlId(urlId);

  if (!existing) {
    return (
      <AppLayout>
        <p className="text-primary">Article not found</p>
      </AppLayout>
    );
  }
  const post = await increaseViewsByUrlId(urlId);

  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}

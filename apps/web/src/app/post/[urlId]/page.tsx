import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { getCommentsByPostId } from "@/functions/comments";
import {
  getActivePostByUrlId,
  increaseViewsByUrlId,
} from "@/functions/db-posts";
import { getCurrentCommenter } from "@/utils/auth";

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
  const [comments, currentCommenter] = await Promise.all([
    getCommentsByPostId(post.id),
    getCurrentCommenter(),
  ]);

  return (
    <AppLayout>
      <BlogDetail
        post={post}
        comments={comments}
        currentCommenter={currentCommenter}
      />
    </AppLayout>
  );
}

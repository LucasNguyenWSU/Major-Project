import { client } from "@repo/db/client";
import type { CommentNode } from "@/types/commenting";

type DbComment = Omit<CommentNode, "replies">;

export async function getCommentsByPostId(postId: number) {
  const comments = await client.db.comment.findMany({
    where: { postId },
    select: {
      id: true,
      parentId: true,
      authorName: true,
      authorRole: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return buildCommentTree(comments);
}

function buildCommentTree(comments: DbComment[]) {
  const byId = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  for (const comment of comments) {
    byId.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of byId.values()) {
    if (comment.parentId) {
      const parent = byId.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
        continue;
      }
    }

    roots.push(comment);
  }

  return roots;
}

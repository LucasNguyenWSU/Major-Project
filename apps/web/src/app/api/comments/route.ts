import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { getCurrentCommenter } from "@/utils/auth";

const MAX_COMMENT_LENGTH = 1000;

export async function POST(request: Request) {
  const commenter = await getCurrentCommenter();
  if (!commenter) {
    return NextResponse.json(
      { error: "Sign in before commenting" },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    urlId?: unknown;
    parentId?: unknown;
    content?: unknown;
  };

  const urlId = typeof body.urlId === "string" ? body.urlId.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const parentId =
    typeof body.parentId === "number" && Number.isInteger(body.parentId)
      ? body.parentId
      : null;

  if (!urlId) {
    return NextResponse.json({ error: "Missing post" }, { status: 400 });
  }

  if (!content || content.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json(
      { error: `Comment must be 1-${MAX_COMMENT_LENGTH} characters` },
      { status: 400 },
    );
  }

  const post = await client.db.post.findFirst({
    where: { urlId, active: true },
    select: { id: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (parentId) {
    const parent = await client.db.comment.findFirst({
      where: { id: parentId, postId: post.id },
      select: { id: true },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 },
      );
    }
  }

  const comment = await client.db.comment.create({
    data: {
      postId: post.id,
      parentId,
      content,
      authorName: commenter.displayName,
      authorRole: commenter.role,
      userId: commenter.role === "user" ? commenter.id : null,
    },
    select: { id: true },
  });

  return NextResponse.json({ comment });
}

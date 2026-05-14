import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

function getUserIp(value: string | null) {
  if (!value) return "127.0.0.1";
  return value.split(",")[0]?.trim() || "127.0.0.1";
}

export async function POST(request: Request) {
  const body = (await request.json()) as { urlId?: string };
  if (!body.urlId) {
    return NextResponse.json({ error: "Missing urlId" }, { status: 400 });
  }

  const post = await client.db.post.findUnique({ where: { urlId: body.urlId } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const requestHeaders = await headers();
  const userIP = getUserIp(requestHeaders.get("x-forwarded-for"));
  const existing = await client.db.like.findUnique({
    where: { postId_userIP: { postId: post.id, userIP } },
  });

  if (existing) {
    await client.db.like.delete({
      where: { postId_userIP: { postId: post.id, userIP } },
    });
  } else {
    await client.db.like.create({
      data: { postId: post.id, userIP },
    });
  }

  const likes = await client.db.like.count({ where: { postId: post.id } });
  return NextResponse.json({ likes, liked: !existing });
}

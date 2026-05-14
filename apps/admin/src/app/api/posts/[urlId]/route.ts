import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

type Payload = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ urlId: string }> },
) {
  const { urlId } = await params;
  const body = (await request.json()) as Payload;

  const updated = await client.db.post.update({
    where: { urlId },
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
      content: body.content,
      imageUrl: body.imageUrl,
      tags: body.tags,
    },
  });

  return NextResponse.json({ urlId: updated.urlId });
}

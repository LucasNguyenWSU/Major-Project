import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { toUrlPath } from "@repo/utils/url";

type Payload = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const baseUrlId = toUrlPath(body.title);
  let urlId = baseUrlId;
  let counter = 1;
  while (await client.db.post.findUnique({ where: { urlId } })) {
    counter += 1;
    urlId = `${baseUrlId}-${counter}`;
  }

  const created = await client.db.post.create({
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
      content: body.content,
      imageUrl: body.imageUrl,
      tags: body.tags,
      urlId,
      active: true,
    },
  });

  return NextResponse.json({ urlId: created.urlId });
}

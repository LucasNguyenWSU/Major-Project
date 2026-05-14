import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ urlId: string }> },
) {
  const { urlId } = await params;
  const existing = await client.db.post.findUnique({ where: { urlId } });

  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const updated = await client.db.post.update({
    where: { urlId },
    data: { active: !existing.active },
  });

  return NextResponse.json({ active: updated.active });
}

import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";

type DbPostWithCount = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  tags: string;
  active: boolean;
  _count: { likes: number };
};

function toPost(post: DbPostWithCount): Post {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    likes: post._count.likes,
    tags: post.tags,
    active: post.active,
  };
}

export async function getAllPosts() {
  const rows = await client.db.post.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { likes: true } } },
  });
  return rows.map(toPost);
}

export async function getPostByUrlId(urlId: string) {
  const row = await client.db.post.findUnique({
    where: { urlId },
    include: { _count: { select: { likes: true } } },
  });
  return row ? toPost(row) : null;
}

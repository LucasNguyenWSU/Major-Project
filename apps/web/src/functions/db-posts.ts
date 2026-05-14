import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

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

export async function getActivePostByUrlId(urlId: string) {
  const row = await client.db.post.findFirst({
    where: { urlId, active: true },
    include: { _count: { select: { likes: true } } },
  });
  return row ? toPost(row) : null;
}

export async function increaseViewsByUrlId(urlId: string) {
  const row = await client.db.post.update({
    where: { urlId },
    data: { views: { increment: 1 } },
    include: { _count: { select: { likes: true } } },
  });
  return toPost(row);
}

export async function getPostsForSidebar() {
  return client.db.post.findMany({
    select: {
      category: true,
      tags: true,
      date: true,
      active: true,
    },
  });
}

export async function getActivePosts() {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows.map(toPost);
}

export async function getActivePostsInitial(take: number = 10) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
    take,
  });
  return rows.map(toPost);
}

export async function getActivePostsCount() {
  return client.db.post.count({
    where: { active: true },
  });
}

export async function getActivePostsByCategorySlug(slug: string) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) => toUrlPath(post.category) === slug);
}

export async function getActivePostsByTagSlug(slug: string) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) =>
      post.tags
        .split(",")
        .map((t) => t.trim())
        .some((t) => toUrlPath(t) === slug),
    );
}

export async function getActivePostsByYearMonth(year: number, month: number) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) => {
      const d = new Date(post.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
}

export async function searchActivePosts(query: string) {
  const trimmed = query.trim();
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  const posts = rows.map(toPost);

  if (!trimmed) {
    return posts;
  }

  const lower = trimmed.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lower) ||
      post.description.toLowerCase().includes(lower),
  );
}

export async function searchActivePostsInitial(query: string, take: number = 10) {
  const trimmed = query.trim();
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  const posts = rows.map(toPost);

  let filtered = posts;
  if (trimmed) {
    const lower = trimmed.toLowerCase();
    filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        post.description.toLowerCase().includes(lower),
    );
  }

  return filtered.slice(0, take);
}

export async function searchActivePostsCount(query: string) {
  const trimmed = query.trim();
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  const posts = rows.map(toPost);

  if (!trimmed) {
    return posts.length;
  }

  const lower = trimmed.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lower) ||
      post.description.toLowerCase().includes(lower),
  ).length;
}

export async function getActivePostsByCategorySlugInitial(slug: string, take: number = 10) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) => toUrlPath(post.category) === slug)
    .slice(0, take);
}

export async function getActivePostsByCategorySlugCount(slug: string) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) => toUrlPath(post.category) === slug).length;
}

export async function getActivePostsByTagSlugInitial(slug: string, take: number = 10) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) =>
      post.tags
        .split(",")
        .map((t) => t.trim())
        .some((t) => toUrlPath(t) === slug),
    )
    .slice(0, take);
}

export async function getActivePostsByTagSlugCount(slug: string) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) =>
      post.tags
        .split(",")
        .map((t) => t.trim())
        .some((t) => toUrlPath(t) === slug),
    ).length;
}

export async function getActivePostsByYearMonthInitial(year: number, month: number, take: number = 10) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) => {
      const d = new Date(post.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .slice(0, take);
}

export async function getActivePostsByYearMonthCount(year: number, month: number) {
  const rows = await client.db.post.findMany({
    where: { active: true },
    include: { _count: { select: { likes: true } } },
    orderBy: { date: "desc" },
  });
  return rows
    .map(toPost)
    .filter((post) => {
      const d = new Date(post.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    }).length;
}

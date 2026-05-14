import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const skip = Math.max(0, parseInt(searchParams.get("skip") || "0", 10));
    const take = Math.min(100, Math.max(1, parseInt(searchParams.get("take") || "10", 10)));

    // Filter type
    const filterType = searchParams.get("type") || "all";

    // Get total count for pagination info
    const totalCount = await client.db.post.count({
      where: { active: true },
    });

    let rows;

    switch (filterType) {
      case "search": {
        const query = searchParams.get("query") || "";
        const lowerQuery = query.toLowerCase();
        const allRows = await client.db.post.findMany({
          where: { active: true },
          include: { _count: { select: { likes: true } } },
          orderBy: { date: "desc" },
        });
        const filtered = allRows
          .filter(
            (post) =>
              post.title.toLowerCase().includes(lowerQuery) ||
              post.description.toLowerCase().includes(lowerQuery),
          );
        rows = filtered.slice(skip, skip + take);
        break;
      }

      case "category": {
        const categorySlug = searchParams.get("category") || "";
        const allRows = await client.db.post.findMany({
          where: { active: true },
          include: { _count: { select: { likes: true } } },
          orderBy: { date: "desc" },
        });
        const filtered = allRows.filter((post) =>
          toUrlPath(post.category) === categorySlug ? true : false
        );
        rows = filtered.slice(skip, skip + take);
        break;
      }

      case "tags": {
        const tagSlug = searchParams.get("tag") || "";
        const allRows = await client.db.post.findMany({
          where: { active: true },
          include: { _count: { select: { likes: true } } },
          orderBy: { date: "desc" },
        });
        const filtered = allRows.filter((post) =>
          post.tags
            .split(",")
            .map((t) => t.trim())
            .some((t) => toUrlPath(t) === tagSlug)
        );
        rows = filtered.slice(skip, skip + take);
        break;
      }

      case "history": {
        const year = parseInt(searchParams.get("year") || "0", 10);
        const month = parseInt(searchParams.get("month") || "0", 10);
        const allRows = await client.db.post.findMany({
          where: { active: true },
          include: { _count: { select: { likes: true } } },
          orderBy: { date: "desc" },
        });
        const filtered = allRows.filter((post) => {
          const d = new Date(post.date);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        });
        rows = filtered.slice(skip, skip + take);
        break;
      }

      default: {
        // "all" or default case
        rows = await client.db.post.findMany({
          where: { active: true },
          include: { _count: { select: { likes: true } } },
          orderBy: { date: "desc" },
          skip,
          take,
        });
      }
    }

    const posts = rows.map(toPost);

    return NextResponse.json({
      posts,
      total: totalCount,
      hasMore: skip + take < totalCount,
      skip,
      take,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

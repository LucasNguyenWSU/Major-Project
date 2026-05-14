import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export function activePosts(posts: Post[]): Post[] {
  return posts.filter((p) => p.active);
}

export function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function filterByCategorySlug(posts: Post[], slug: string): Post[] {
  return sortByDateDesc(
    activePosts(posts).filter((p) => toUrlPath(p.category) === slug),
  );
}

export function filterByTagSlug(posts: Post[], slug: string): Post[] {
  return sortByDateDesc(
    activePosts(posts).filter((p) =>
      p.tags
        .split(",")
        .map((t) => t.trim())
        .some((t) => toUrlPath(t) === slug),
    ),
  );
}

export function filterByYearMonth(
  posts: Post[],
  year: number,
  month: number,
): Post[] {
  return sortByDateDesc(
    activePosts(posts).filter((p) => {
      const d = p.date;
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    }),
  );
}

export function searchPosts(posts: Post[], q: string): Post[] {
  const trimmed = q.trim();
  const base = activePosts(posts);
  if (!trimmed) return sortByDateDesc(base);
  const lower = trimmed.toLowerCase();
  return sortByDateDesc(
    base.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower),
    ),
  );
}

export function findActivePostByUrlId(
  posts: Post[],
  urlId: string,
): Post | undefined {
  return activePosts(posts).find((p) => p.urlId === urlId);
}

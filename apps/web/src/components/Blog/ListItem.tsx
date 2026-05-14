import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";

function formatPostDate(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function BlogListItem({ post }: { post: Post }) {
  const tagParts = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article
      className="flex flex-row gap-8 border-b border-gray-200 pb-8 dark:border-gray-700"
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="relative h-40 w-56 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Link
          href={`/post/${post.urlId}`}
          className="text-primary hover:text-primaryHover text-xl font-semibold"
        >
          {post.title}
        </Link>
        <Link
          href={`/category/${toUrlPath(post.category)}`}
          className="text-secondary hover:text-primaryHover w-fit text-sm"
        >
          {post.category}
        </Link>
        <p className="text-secondary line-clamp-3 text-sm">
          {post.description}
        </p>
        <p className="text-secondary text-sm">{formatPostDate(post.date)}</p>
        <div className="flex flex-wrap gap-2">
          {tagParts.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${toUrlPath(tag)}`}
              className="text-wsu text-sm hover:underline"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="text-secondary flex gap-4 text-sm">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}

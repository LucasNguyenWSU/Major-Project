import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { marked } from "marked";
import Link from "next/link";
import { LikeButton } from "./LikeButton";

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

export async function BlogDetail({ post }: { post: Post }) {
  const bodyHtml = await marked.parse(post.content);
  const tagParts = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article
      className="text-primary max-w-3xl"
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-40 md:w-56 dark:bg-gray-800">
          <img
            src={post.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            <Link
              href={`/post/${post.urlId}`}
              className="hover:text-primaryHover"
            >
              {post.title}
            </Link>
          </h1>

          <Link
            href={`/category/${toUrlPath(post.category)}`}
            className="text-secondary hover:text-primaryHover w-fit text-sm"
          >
            {post.category}
          </Link>

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
            <LikeButton urlId={post.urlId} initialLikes={post.likes} />
          </div>
        </div>
      </div>

      <section
        data-test-id="content-markdown"
        className="text-primary mt-10 max-w-none [&_h1]:text-2xl [&_h2]:mt-6 [&_h2]:text-xl [&_p]:my-3"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </article>
  );
}

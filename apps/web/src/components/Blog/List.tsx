import type { Post } from "@repo/db/data";
import Link from "next/link";

import { BlogListItem } from "./ListItem";

const DEFAULT_PAGE_SIZE = 5;

type BlogListProps = {
  posts: Post[];
  currentPage?: number;
  pageSize?: number;
};

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

export function BlogList({
  posts,
  currentPage,
  pageSize = DEFAULT_PAGE_SIZE,
}: BlogListProps) {
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const paginationEnabled = currentPage !== undefined;
  const page = paginationEnabled ? clampPage(currentPage, totalPages) : 1;
  const start = (page - 1) * pageSize;
  const visiblePosts = paginationEnabled
    ? posts.slice(start, start + pageSize)
    : posts;

  return (
    <div className="py-6">
      <p className="text-secondary mb-6 text-sm font-medium">
        {posts.length} Posts
      </p>
      <div className="flex flex-col gap-8">
        {visiblePosts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </div>
      {paginationEnabled && totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-between gap-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700"
        >
          <Link
            href={`/?page=${page - 1}`}
            aria-disabled={page === 1}
            className={
              page === 1
                ? "text-secondary pointer-events-none rounded-lg border border-gray-200 px-3 py-2 opacity-50 dark:border-gray-700"
                : "text-primary rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            }
          >
            Previous
          </Link>
          <span className="text-secondary" data-test-id="web-page-indicator">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/?page=${page + 1}`}
            aria-disabled={page === totalPages}
            className={
              page === totalPages
                ? "text-secondary pointer-events-none rounded-lg border border-gray-200 px-3 py-2 opacity-50 dark:border-gray-700"
                : "text-primary rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            }
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  );
}

export default BlogList;

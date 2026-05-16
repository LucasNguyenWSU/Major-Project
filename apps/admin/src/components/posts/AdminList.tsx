"use client";

import type { Post } from "@repo/db/data";
import { cx } from "@repo/utils/classes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LogoutButton } from "../auth/LogoutButton";

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";

type Props = {
  posts: Post[];
};

const PAGE_SIZE = 5;

export function AdminList({ posts }: Props) {
  const router = useRouter();
  const [filterContent, setFilterContent] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function togglePostActive(post: Post) {
    setStatusMessage(null);
    setUpdatingId(post.id);
    try {
      const response = await fetch(`/api/posts/${post.urlId}/active`, {
        method: "PATCH",
      });
      if (!response.ok) {
        setStatusMessage("Unable to update post status");
        return;
      }
      const data = (await response.json()) as { active: boolean };
      setStatusMessage(
        `Status updated for "${post.title}": ${data.active ? "Active" : "Inactive"}`,
      );
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = useMemo(() => {
    let result = [...posts];

    if (filterContent.trim()) {
      const query = filterContent.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query),
      );
    }

    if (filterTag.trim()) {
      const query = filterTag.toLowerCase();
      result = result.filter((post) => post.tags.toLowerCase().includes(query));
    }

    if (filterDate.trim().length === 8) {
      const day = Number(filterDate.slice(0, 2));
      const month = Number(filterDate.slice(2, 4)) - 1;
      const year = Number(filterDate.slice(4, 8));
      const from = new Date(year, month, day);
      result = result.filter((post) => post.date >= from);
    }

    if (showActiveOnly) {
      result = result.filter((post) => post.active);
    }

    result.sort((a, b) => {
      if (sortBy === "title-asc" || sortBy === "title-desc") {
        const cmp = a.title.localeCompare(b.title);
        return sortBy === "title-asc" ? cmp : -cmp;
      }

      const aTime = a.date.getTime();
      const bTime = b.date.getTime();
      if (aTime === bTime) return 0;
      const cmp = aTime < bTime ? -1 : 1;
      return sortBy === "date-asc" ? cmp : -cmp;
    });

    return result;
  }, [posts, filterContent, filterTag, filterDate, sortBy, showActiveOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetPage() {
    setPage(1);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-secondary text-sm">
          Showing{" "}
          <span className="text-primary font-medium">{filtered.length}</span>{" "}
          posts
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/posts/create"
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            Create Post
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
        <label className="space-y-1 text-sm">
          <span className="text-secondary">Filter by Content:</span>
          <input
            value={filterContent}
            onChange={(e) => {
              setFilterContent(e.target.value);
              resetPage();
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-950"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-secondary">Filter by Tag:</span>
          <input
            value={filterTag}
            onChange={(e) => {
              setFilterTag(e.target.value);
              resetPage();
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-950"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-secondary">Filter by Date Created:</span>
          <input
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              resetPage();
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-950"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-secondary">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              resetPage();
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="title-asc">Title Ascending</option>
            <option value="title-desc">Title Descending</option>
            <option value="date-asc">Date Ascending</option>
            <option value="date-desc">Date Descending</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => {
              setShowActiveOnly(e.target.checked);
              resetPage();
            }}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-secondary">Show Active Posts Only</span>
        </label>
      </div>

      {statusMessage && (
        <p className="text-primary rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {statusMessage}
        </p>
      )}

      <div className="space-y-4">
        {paginated.map((post) => {
          const tags = post.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t) => `#${t}`)
            .join(", ");

          const date = post.date;
          const day = String(date.getDate()).padStart(2, "0");
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
          const month = months[date.getMonth()];
          const formattedDate = `Posted on ${month} ${day}, ${date.getFullYear()}`;

          return (
            <article
              key={post.id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-start dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-28 md:w-44 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h2 className="min-w-0">
                  <Link
                    href={`/post/${post.urlId}`}
                    className="text-primary hover:text-primaryHover text-lg font-semibold"
                  >
                    {post.title}
                  </Link>
                </h2>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="text-secondary">{post.category}</span>
                  <span className="text-secondary">{formattedDate}</span>
                </div>

                <p className="text-wsu text-sm">{tags}</p>

                <div className="pt-1">
                  <button
                    type="button"
                    disabled={updatingId === post.id}
                    onClick={() => togglePostActive(post)}
                    className={cx(
                      "rounded-full border px-3 py-1 text-sm font-medium",
                      {
                        "border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900":
                          post.active,
                        "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700":
                          !post.active,
                        "opacity-60": updatingId === post.id,
                      },
                    )}
                  >
                    {post.active ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-lg border border-gray-300 px-3 py-2 font-medium disabled:opacity-50 dark:border-gray-700"
          >
            Previous
          </button>
          <span className="text-secondary" data-test-id="admin-page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="rounded-lg border border-gray-300 px-3 py-2 font-medium disabled:opacity-50 dark:border-gray-700"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

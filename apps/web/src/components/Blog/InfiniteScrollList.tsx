"use client";

import type { Post } from "@repo/db/data";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogListItem } from "./ListItem";

interface PaginatedBlogListProps {
  initialPosts: Post[];
  total: number;
  pageSize?: number;
  filterType?: "all" | "search" | "category" | "tags" | "history";
  query?: string;
  category?: string;
  tag?: string;
  year?: number;
  month?: number;
}

export function PaginatedBlogList({
  initialPosts,
  total,
  pageSize = 10,
  filterType = "all",
  query,
  category,
  tag,
  year,
  month,
}: PaginatedBlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (currentPage === 1) {
      setPosts(initialPosts);
    } else {
      setIsLoading(true);
      const fetchPosts = async () => {
        try {
          const skip = (currentPage - 1) * pageSize;
          const params = new URLSearchParams({
            skip: skip.toString(),
            take: pageSize.toString(),
            type: filterType,
          });

          if (filterType === "search" && query) {
            params.append("query", query);
          } else if (filterType === "category" && category) {
            params.append("category", category);
          } else if (filterType === "tags" && tag) {
            params.append("tag", tag);
          } else if (filterType === "history" && year && month) {
            params.append("year", year.toString());
            params.append("month", month.toString());
          }

          const response = await fetch(`/api/posts?${params.toString()}`);
          const data = await response.json();
          setPosts(data.posts || []);
        } catch (error) {
          console.error("Error loading posts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    }
  }, [currentPage, pageSize, filterType, query, category, tag, year, month, initialPosts]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-6">
      <p className="mb-6 text-sm font-medium text-secondary">
        {total > 0 ? `${total} Posts` : "No Posts"}
      </p>

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-secondary">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="flex flex-col gap-8 mb-8">
            {posts.map((post) => (
              <BlogListItem key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div
              className="flex justify-center items-center gap-2 mt-8"
              data-test-id="pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                data-test-id="pagination-prev"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 border rounded text-sm ${
                        currentPage === page
                          ? "bg-blue-500 text-white border-blue-500"
                          : "hover:bg-gray-100"
                      }`}
                      data-test-id={`pagination-page-${page}`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                data-test-id="pagination-next"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="text-secondary">No posts found</p>
        </div>
      )}
    </div>
  );
}

export default PaginatedBlogList;


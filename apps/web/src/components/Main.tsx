import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
  currentPage,
}: {
  posts: Post[];
  className?: string;
  currentPage?: number;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} currentPage={currentPage} />
    </main>
  );
}

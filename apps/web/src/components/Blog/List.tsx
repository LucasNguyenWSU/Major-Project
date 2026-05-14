import type { Post } from "@repo/db/data";

import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="py-6">
      <p className="mb-6 text-sm font-medium text-secondary">
        {posts.length} Posts
      </p>
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default BlogList;

import { getActivePostsInitial, getActivePostsCount } from "@/functions/db-posts";
import { PaginatedBlogList } from "@/components/Blog/InfiniteScrollList";
import { AppLayout } from "../components/Layout/AppLayout";
import styles from "./page.module.css";

export default async function Home() {
  const [initialPosts, total] = await Promise.all([
    getActivePostsInitial(10),
    getActivePostsCount(),
  ]);

  return (
    <AppLayout>
      <main className={styles.main}>
        <PaginatedBlogList initialPosts={initialPosts} total={total} />
      </main>
    </AppLayout>
  );
}

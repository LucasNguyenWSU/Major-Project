import { getPostsForSidebar } from "@/functions/db-posts";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Link from "next/link";

export async function LeftMenu({
  selectedCategorySlug,
  selectedTagSlug,
  selectedYear,
  selectedMonth,
}: {
  selectedCategorySlug?: string;
  selectedTagSlug?: string;
  selectedYear?: string;
  selectedMonth?: string;
}) {
  const posts = await getPostsForSidebar();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 p-6 dark:border-gray-700">
      <div className="mb-8 text-lg font-semibold text-primary">
        <Link href="/" className="text-primary hover:text-primaryHover">Full-Stack Blog</Link>
      </div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <CategoryList posts={posts} selectedSlug={selectedCategorySlug} />
            <HistoryList
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              posts={posts}
            />
            <TagList selectedTagSlug={selectedTagSlug} posts={posts} />
        </ul>
      </nav>
    </aside>
  );
}

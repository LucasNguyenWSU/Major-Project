import { categories } from "@/functions/categories";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({
  posts,
  selectedSlug,
}: {
  posts: { category: string; active: boolean }[];
  selectedSlug?: string;
}) {
  return (
    <LinkList title="Categories">
      {categories(posts).map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={toUrlPath(item.name) === (selectedSlug ?? "")}
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}

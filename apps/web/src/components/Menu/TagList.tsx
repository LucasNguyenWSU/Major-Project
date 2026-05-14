import { toUrlPath } from "@repo/utils/url";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function TagList({
  selectedTagSlug,
  posts,
}: {
  selectedTagSlug?: string;
  posts: { tags: string; active: boolean }[];
}) {
  const postTags = tags(posts);

  return (
    <LinkList title="Tags">
      {postTags.map((t) => (
        <SummaryItem
          key={t.name}
          count={t.count}
          name={t.name}
          isSelected={toUrlPath(t.name) === (selectedTagSlug ?? "")}
          link={`/tags/${toUrlPath(t.name)}`}
          title={`Tag / ${t.name}`}
        />
      ))}
    </LinkList>
  );
}

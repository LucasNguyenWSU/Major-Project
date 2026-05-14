import Link from "../../mocks/link";
import { cx } from "@repo/utils/classes";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <Link
        href={link}
        title={title || undefined}
        className={cx("text-primary", {
          "hover:text-primaryHover": !isSelected,
          selected: isSelected,
          "text-[var(--color-wsu)]": isSelected,
        })}
      >
        <span>{name}</span>{" "}
        <span data-test-id="post-count" className="tabular-nums">
          ({count})
        </span>
      </Link>
    </li>
  );
}

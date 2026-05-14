import { history } from "@/functions/history";

import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: { date: Date; active: boolean }[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList title="History">
      {historyItems.map((h) => (
        <SummaryItem
          key={`${h.year}-${h.month}`}
          count={h.count}
          name={`${months[h.month]} ${h.year}`}
          isSelected={
            selectedYear === String(h.year) && selectedMonth === String(h.month)
          }
          link={`/history/${h.year}/${h.month}`}
          title={`History / ${months[h.month]}, ${h.year}`}
        />
      ))}
    </LinkList>
  );
}

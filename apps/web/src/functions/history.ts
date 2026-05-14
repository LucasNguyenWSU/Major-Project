export function history(
  posts: { date: Date; active: boolean }[],
): { month: number; year: number; count: number }[] {
  const map = new Map<string, number>();

  for (const post of posts.filter((p) => p.active)) {
    const d = post.date;
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const key = `${year}-${month}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  const entries = [...map.entries()].map(([key, count]) => {
    const [yStr, mStr] = key.split("-");
    const year = Number(yStr);
    const month = Number(mStr);
    return { month, year, count };
  });

  entries.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return entries;
}

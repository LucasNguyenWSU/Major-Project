export function tags(posts: { tags: string; active: boolean }[]) {
  const tagCount = new Map<string, number>();

  for (const post of posts.filter((p) => p.active)) {
    const parts = post.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    for (const tag of parts) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }

  return [...tagCount.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

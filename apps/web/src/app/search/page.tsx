import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { searchActivePosts } from "@/functions/db-posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const filtered = await searchActivePosts(q ?? "");

  return (
    <AppLayout query={q}>
      <Main posts={filtered} />
    </AppLayout>
  );
}

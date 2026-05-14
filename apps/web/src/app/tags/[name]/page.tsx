import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePostsByTagSlug } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filtered = await getActivePostsByTagSlug(name);

  return (
    <AppLayout sidebar={{ tagSlug: name }}>
      <Main posts={filtered} />
    </AppLayout>
  );
}

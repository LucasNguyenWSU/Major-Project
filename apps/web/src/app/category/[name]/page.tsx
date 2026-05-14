import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePostsByCategorySlug } from "@/functions/db-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filtered = await getActivePostsByCategorySlug(name);

  return (
    <AppLayout sidebar={{ categorySlug: name }}>
      <Main posts={filtered} />
    </AppLayout>
  );
}

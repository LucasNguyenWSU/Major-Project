import { getActivePosts } from "@/functions/db-posts";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const visible = await getActivePosts();
  const currentPage = parsePage(params.page);

  return (
    <AppLayout>
      <Main posts={visible} className={styles.main} currentPage={currentPage} />
    </AppLayout>
  );
}

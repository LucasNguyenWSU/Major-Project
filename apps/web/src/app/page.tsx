import { getActivePosts } from "@/functions/db-posts";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

export default async function Home() {
  const visible = await getActivePosts();

  return (
    <AppLayout>
      <Main posts={visible} className={styles.main} />
    </AppLayout>
  );
}

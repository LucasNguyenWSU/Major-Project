import { isLoggedIn } from "../utils/auth";
import { AdminList } from "../components/posts/AdminList";
import { LoginForm } from "../components/auth/LoginForm";
import { getAllPosts } from "../utils/posts";


export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10 text-primary">
        <LoginForm />
      </main>
    );
  }

  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 text-primary">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin of Full Stack Blog</h1>
            <p className="text-secondary mt-1 text-sm">
              Manage posts, preview content, and edit metadata.
            </p>
          </div>
        </div>
        <AdminList posts={posts} />
      </div>
    </main>
  );
}


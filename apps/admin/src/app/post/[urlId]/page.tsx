import { notFound } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import { PostEditorForm } from "../../../components/posts/PostEditorForm";
import { LoginForm } from "../../../components/auth/LoginForm";
import { getPostByUrlId } from "../../../utils/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  }

  const { urlId } = await params;
  const post = await getPostByUrlId(urlId);

  if (!post) {
    return notFound();
  }

  return <PostEditorForm mode="edit" post={post} />;
}


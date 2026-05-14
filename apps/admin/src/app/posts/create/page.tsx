import { isLoggedIn } from "../../../utils/auth";
import { PostEditorForm } from "../../../components/posts/PostEditorForm";
import { LoginForm } from "../../../components/auth/LoginForm";

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  }

  return <PostEditorForm mode="create" />;
}


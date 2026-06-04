import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/Layout/AppLayout";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AppLayout>
      <LoginForm nextPath={next} />
    </AppLayout>
  );
}

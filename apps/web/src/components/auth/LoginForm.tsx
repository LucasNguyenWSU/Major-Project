"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, displayName, password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Invalid username or password");
        return;
      }

      setPassword("");

      router.push(getSafeNextPath(nextPath));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <div className="rounded-lg border border-gray-200 bg-[var(--background)] p-6 shadow-sm dark:border-gray-800">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-secondary mt-1 text-sm">
          Sign in to comment, or use admin credentials to comment as admin.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-md px-3 py-2 text-sm ${
              mode === "login"
                ? "bg-primary text-[var(--background)]"
                : "text-secondary hover:text-primary"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-md px-3 py-2 text-sm ${
              mode === "register"
                ? "bg-primary text-[var(--background)]"
                : "text-secondary hover:text-primary"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400 dark:border-gray-700"
              required
            />
          </div>

          {mode === "register" ? (
            <div className="space-y-2">
              <label htmlFor="display-name" className="text-sm font-medium">
                Display name
              </label>
              <input
                id="display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400 dark:border-gray-700"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              className="w-full rounded-lg border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400 dark:border-gray-700"
              required
            />
          </div>

          {error && <p className="text-wsu text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Commenter } from "@/types/commenting";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({
  query,
  currentCommenter,
}: {
  query?: string;
  currentCommenter: Commenter | null;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <form action="#" method="GET" className="min-w-0 flex-1">
        <input
          type="search"
          name="q"
          placeholder="Search…"
          className="text-primary placeholder:text-secondary box-border h-10 w-full min-w-[12rem] max-w-md rounded-md border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm shadow-sm outline-none ring-offset-[var(--background)] focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 dark:border-gray-600 dark:focus:border-gray-500"
          defaultValue={query ?? ""}
          onChange={handleSearch}
        />
      </form>
      <div className="flex items-center gap-x-4">
        {currentCommenter ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-secondary">
              {currentCommenter.role === "admin"
                ? "Admin"
                : currentCommenter.displayName}
            </span>
            {currentCommenter.role === "admin" ? (
              <span className="bg-wsu rounded-sm px-2 py-1 text-xs font-semibold text-white">
                Admin
              </span>
            ) : null}
            <button
              type="button"
              disabled={signingOut}
              onClick={signOut}
              className="text-secondary hover:text-primary disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-wsu hover:bg-wsu-light rounded-md px-3 py-2 text-sm font-medium text-white"
          >
            Login
          </Link>
        )}
        <ThemeSwitch />
      </div>
    </div>
  );
}

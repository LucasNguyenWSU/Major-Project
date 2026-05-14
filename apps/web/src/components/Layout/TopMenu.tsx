"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <form action="#" method="GET" className="min-w-0 flex-1">
        <input
          type="search"
          name="q"
          placeholder="Search…"
          className="box-border h-10 w-full max-w-md min-w-[12rem] rounded-md border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm text-primary shadow-sm outline-none ring-offset-[var(--background)] placeholder:text-secondary focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 dark:border-gray-600 dark:focus:border-gray-500"
          defaultValue={query ?? ""}
          onChange={handleSearch}
        />
      </form>
      <div className="flex items-center gap-x-6">
        <ThemeSwitch />
      </div>
    </div>
  );
}

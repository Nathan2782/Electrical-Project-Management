"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q");
    const q = typeof value === "string" ? value.trim() : "";
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
        <Search size={17} className="shrink-0 text-[var(--color-text-muted)]" />
        <input
          name="q"
          type="text"
          autoFocus
          defaultValue={initialQuery}
          placeholder="Try '3/4 EMT', 'Panel A', or '210.8'..."
          className="w-full min-w-0 bg-transparent text-[14px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
      </div>
    </form>
  );
}

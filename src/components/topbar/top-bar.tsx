"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell } from "lucide-react";
import { ProfileMenu } from "@/components/profile/profile-menu";
import type { ShellUser } from "@/components/shell/app-shell";
import type { RoleId } from "@/lib/roles";

export function TopBar({
  currentUser,
  activeRole,
  unreadNotifCount,
  onOpenMobileSidebar,
}: {
  currentUser: ShellUser;
  activeRole: RoleId;
  unreadNotifCount: number;
  onOpenMobileSidebar: () => void;
}) {
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q");
    const q = typeof value === "string" ? value.trim() : "";
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b border-[var(--color-border)] bg-white px-3 py-2 md:h-14 md:px-4">
      <button
        onClick={onOpenMobileSidebar}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <form onSubmit={handleSearchSubmit} className="min-w-0 flex-1 max-w-xl">
        <div className="flex h-9 items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 focus-within:border-[var(--color-primary)] focus-within:bg-white focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
          <Search size={15} className="shrink-0 text-[var(--color-text-muted)]" />
          <input
            name="q"
            type="text"
            placeholder="Search projects, prints, materials, NEC codes..."
            className="w-full min-w-0 bg-transparent text-[13.5px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
          />
        </div>
      </form>

      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
          aria-label="Notifications"
        >
          <Bell size={19} />
          {!!unreadNotifCount && (
            <span className="absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#E0334F] px-1 text-[9.5px] font-bold text-white">
              {unreadNotifCount}
            </span>
          )}
        </Link>
        <ProfileMenu currentUser={currentUser} activeRole={activeRole} variant="topbar" />
      </div>
    </header>
  );
}

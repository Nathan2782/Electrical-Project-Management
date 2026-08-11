"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, MessageSquare, CheckSquare, Menu } from "lucide-react";
import clsx from "clsx";

export function MobileBottomNav({
  unreadNotifCount,
  onOpenMore,
}: {
  unreadNotifCount: number;
  onOpenMore: () => void;
}) {
  const pathname = usePathname();
  const segments = pathname?.split("/") ?? [];
  const currentProjectId = segments[1] === "projects" ? segments[2] : undefined;

  const items = [
    { href: "/home", icon: Home, label: "Home", match: (p: string) => p === "/home" },
    {
      href: "/projects",
      icon: LayoutGrid,
      label: "Projects",
      match: (p: string) => p === "/projects",
    },
    {
      href: currentProjectId ? `/projects/${currentProjectId}/conversation` : "/projects",
      icon: MessageSquare,
      label: "Conversation",
      match: (p: string) => p.endsWith("/conversation"),
      badge: unreadNotifCount,
    },
    {
      href: currentProjectId ? `/projects/${currentProjectId}/tasks` : "/projects",
      icon: CheckSquare,
      label: "Tasks",
      match: (p: string) => p.endsWith("/tasks"),
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-[var(--color-border)] bg-white md:hidden">
      {items.map((item) => {
        const active = pathname ? item.match(pathname) : false;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={clsx(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium",
              active ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"
            )}
          >
            <item.icon size={20} strokeWidth={active ? 2.4 : 2} />
            {item.label}
            {!!item.badge && (
              <span className="absolute right-[22%] top-1.5 h-2 w-2 rounded-full bg-[#E0334F]" />
            )}
          </Link>
        );
      })}
      <button
        onClick={onOpenMore}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium text-[var(--color-text-secondary)]"
      >
        <Menu size={20} />
        More
      </button>
    </nav>
  );
}

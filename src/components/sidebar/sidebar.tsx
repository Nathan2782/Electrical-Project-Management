"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, Bell, Users, PanelLeft, Zap } from "lucide-react";
import clsx from "clsx";
import { SidebarContent } from "@/components/sidebar/sidebar-content";
import type { ShellProject, ShellUser } from "@/components/shell/app-shell";
import { isForeman, type RoleId } from "@/lib/roles";

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  projects,
  currentUser,
  activeRole,
  currentProjectId,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  projects: ShellProject[];
  currentUser: ShellUser;
  activeRole: RoleId;
  currentProjectId?: string;
}) {
  if (collapsed) {
    return (
      <CollapsedRail
        onExpand={onToggleCollapsed}
        projects={projects}
        activeRole={activeRole}
        currentProjectId={currentProjectId}
      />
    );
  }

  return (
    <div className="relative flex w-[248px] flex-col">
      <SidebarContent
        projects={projects}
        currentUser={currentUser}
        activeRole={activeRole}
        currentProjectId={currentProjectId}
      />
      <button
        onClick={onToggleCollapsed}
        title="Collapse sidebar"
        className="absolute right-2 top-3.5 flex h-6 w-6 items-center justify-center rounded text-[var(--color-sidebar-text-muted)] hover:bg-[var(--color-sidebar-bg-hover)] hover:text-white"
      >
        <PanelLeft size={15} />
      </button>
    </div>
  );
}

function CollapsedRail({
  onExpand,
  projects,
  activeRole,
  currentProjectId,
}: {
  onExpand: () => void;
  projects: ShellProject[];
  activeRole: RoleId;
  currentProjectId?: string;
}) {
  const pathname = usePathname();
  const totalUnread = projects.reduce((sum, p) => sum + p.unreadCount, 0);

  return (
    <div className="flex h-full w-[64px] flex-col items-center bg-[var(--color-sidebar-bg)] py-4">
      <button
        onClick={onExpand}
        title="Expand sidebar"
        className="mb-4 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)]"
      >
        <Zap size={16} className="text-white" fill="white" />
      </button>

      <div className="flex flex-col items-center gap-1">
        <RailLink href="/home" icon={Home} active={pathname === "/home"} />
        <RailLink href="/projects" icon={LayoutGrid} active={pathname === "/projects"} />
        <RailLink href="/search" icon={Search} active={pathname === "/search"} />
        <RailLink href="/notifications" icon={Bell} active={pathname === "/notifications"} badge={totalUnread} />
        {isForeman(activeRole) && (
          <RailLink href="/crew" icon={Users} active={pathname === "/crew"} />
        )}
      </div>

      <div className="my-3 h-px w-8 bg-[var(--color-sidebar-border)]" />

      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}/conversation`}
            title={project.name}
            className={clsx(
              "relative flex h-9 w-9 items-center justify-center rounded-lg text-[12px] font-semibold text-white transition-transform hover:scale-105",
              project.id === currentProjectId && "ring-2 ring-white/70"
            )}
            style={{ backgroundColor: project.color }}
          >
            {project.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
            {!!project.unreadCount && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E0334F] px-1 text-[9px] font-bold text-white">
                {project.unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function RailLink({
  href,
  icon: Icon,
  active,
  badge,
}: {
  href: string;
  icon: typeof Home;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "relative flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-sidebar-text)] transition-colors hover:bg-[var(--color-sidebar-bg-hover)] hover:text-white",
        active && "bg-[var(--color-sidebar-bg-active)] text-white"
      )}
    >
      <Icon size={17} />
      {!!badge && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E0334F] px-1 text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

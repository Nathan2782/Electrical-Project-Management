"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { SIDEBAR_PROJECT_SECTIONS } from "@/lib/nav";
import { ProfileMenu } from "@/components/profile/profile-menu";
import type { ShellProject, ShellUser } from "@/components/shell/app-shell";
import type { RoleId } from "@/lib/roles";

function WorkspaceLink({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: typeof Home;
  label: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] font-medium transition-colors",
        active
          ? "bg-[var(--color-sidebar-bg-active)] text-white"
          : "text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-bg-hover)] hover:text-white"
      )}
    >
      <Icon size={17} strokeWidth={2} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {!!badge && (
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E0334F] px-1 text-[10.5px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function SidebarContent({
  projects,
  currentUser,
  activeRole,
  currentProjectId,
}: {
  projects: ShellProject[];
  currentUser: ShellUser;
  activeRole: RoleId;
  currentProjectId?: string;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(currentProjectId ? [currentProjectId] : [])
  );

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalUnread = projects.reduce((sum, p) => sum + p.unreadCount, 0);

  return (
    <div className="flex h-full w-full flex-col bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)]">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary)]">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-white">Voltline</p>
          <p className="truncate text-[11px] text-[var(--color-sidebar-text-muted)]">
            {currentUser.name.split(" ")[0]}&rsquo;s workspace
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 pb-3">
        <div className="flex flex-col gap-0.5 pb-4">
          <WorkspaceLink href="/home" icon={Home} label="Home" active={pathname === "/home"} />
          <WorkspaceLink
            href="/projects"
            icon={LayoutGrid}
            label="Projects"
            active={pathname === "/projects"}
          />
          <WorkspaceLink href="/search" icon={Search} label="Search" active={pathname === "/search"} />
          <WorkspaceLink
            href="/notifications"
            icon={Bell}
            label="Notifications"
            active={pathname === "/notifications"}
            badge={totalUnread}
          />
        </div>

        <div className="flex items-center justify-between px-2.5 pb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-sidebar-text-muted)]">
            Projects
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {projects.map((project) => {
            const isExpanded = expanded.has(project.id);
            const isCurrentProject = project.id === currentProjectId;
            return (
              <div key={project.id}>
                <div
                  className={clsx(
                    "group flex items-center gap-1 rounded-md pr-2 transition-colors",
                    isCurrentProject && !isExpanded
                      ? "bg-[var(--color-sidebar-bg-hover)]"
                      : "hover:bg-[var(--color-sidebar-bg-hover)]"
                  )}
                >
                  <button
                    onClick={() => toggleExpanded(project.id)}
                    className="flex h-7 w-6 shrink-0 items-center justify-center text-[var(--color-sidebar-text-muted)]"
                    aria-label={isExpanded ? "Collapse project" : "Expand project"}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <Link
                    href={`/projects/${project.id}/conversation`}
                    className="flex min-w-0 flex-1 items-center gap-2 py-[7px] text-[13.5px] font-medium text-[var(--color-sidebar-text)] hover:text-white"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="min-w-0 flex-1 truncate">{project.name}</span>
                  </Link>
                  {!!project.unreadCount && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E0334F] px-1 text-[10.5px] font-semibold text-white">
                      {project.unreadCount}
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <div className="ml-7 flex flex-col gap-0.5 border-l border-[var(--color-sidebar-border)] pl-2.5 py-0.5">
                    {SIDEBAR_PROJECT_SECTIONS.map((section) => {
                      const href = `/projects/${project.id}/${section.slug}`;
                      const active = pathname === href;
                      return (
                        <Link
                          key={section.slug}
                          href={href}
                          className={clsx(
                            "flex items-center gap-2 rounded-md px-2 py-[5px] text-[12.5px] transition-colors",
                            active
                              ? "bg-[var(--color-sidebar-bg-active)] text-white font-medium"
                              : "text-[var(--color-sidebar-text-muted)] hover:bg-[var(--color-sidebar-bg-hover)] hover:text-white"
                          )}
                        >
                          <section.icon size={14} className="shrink-0" />
                          <span className="truncate">{section.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[var(--color-sidebar-border)] p-2">
        <ProfileMenu currentUser={currentUser} activeRole={activeRole} variant="sidebar" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { TopBar } from "@/components/topbar/top-bar";
import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { MobileSidebarSheet } from "@/components/mobile/mobile-sidebar-sheet";
import { QuickActionFab } from "@/components/quick-actions/quick-action-fab";
import type { RoleId } from "@/lib/roles";

export type ShellUser = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  email: string;
};

export type ShellProject = {
  id: string;
  name: string;
  color: string;
  unreadCount: number;
};

export function AppShell({
  currentUser,
  activeRole,
  projects,
  unreadNotifCount,
  children,
}: {
  currentUser: ShellUser;
  activeRole: RoleId;
  projects: ShellProject[];
  unreadNotifCount: number;
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState<string | null>(null);
  const pathname = usePathname();

  const currentProjectId = pathname?.startsWith("/projects/")
    ? pathname.split("/")[2]
    : undefined;

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--color-bg-shell)]">
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
          projects={projects}
          currentUser={currentUser}
          activeRole={activeRole}
          currentProjectId={currentProjectId}
        />
      </div>

      <MobileSidebarSheet
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        projects={projects}
        currentUser={currentUser}
        activeRole={activeRole}
        currentProjectId={currentProjectId}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          currentUser={currentUser}
          activeRole={activeRole}
          unreadNotifCount={unreadNotifCount}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-hidden pb-14 md:pb-0">{children}</main>
      </div>

      <QuickActionFab currentProjectId={currentProjectId} activeRole={activeRole} projects={projects} />
      <MobileBottomNav unreadNotifCount={unreadNotifCount} onOpenMore={() => setMobileSidebarOpen(true)} />
    </div>
  );
}

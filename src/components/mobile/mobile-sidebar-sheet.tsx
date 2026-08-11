"use client";

import { X } from "lucide-react";
import { SidebarContent } from "@/components/sidebar/sidebar-content";
import type { ShellProject, ShellUser } from "@/components/shell/app-shell";
import type { RoleId } from "@/lib/roles";

export function MobileSidebarSheet({
  open,
  onClose,
  projects,
  currentUser,
  activeRole,
  currentProjectId,
}: {
  open: boolean;
  onClose: () => void;
  projects: ShellProject[];
  currentUser: ShellUser;
  activeRole: RoleId;
  currentProjectId?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-[82%] max-w-[300px] flex-col shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <SidebarContent
          projects={projects}
          currentUser={currentUser}
          activeRole={activeRole}
          currentProjectId={currentProjectId}
        />
      </div>
    </div>
  );
}

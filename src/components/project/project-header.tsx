"use client";

import Link from "next/link";
import { Search, PanelRight, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { MembersPopover } from "@/components/project/members-popover";
import { MoreMenu } from "@/components/project/more-menu";
import { PROJECT_STATUS_LABELS } from "@/lib/status";
import type {
  ProjectMemberSummary,
  ProjectSummary,
} from "@/components/project/project-workspace-shell";
import { ROLE_LABELS, ROLE_SHORT_LABELS, type RoleId } from "@/lib/roles";

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "var(--color-status-active)",
  ON_HOLD: "var(--color-status-attention)",
  COMPLETE: "var(--color-status-complete)",
};

export function ProjectHeader({
  project,
  members,
  activeRole,
  rightPanelOpen,
  onToggleRightPanel,
}: {
  project: ProjectSummary;
  members: ProjectMemberSummary[];
  activeRole: RoleId;
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-white px-4 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-[15px] font-semibold text-[var(--color-text)]">
            {project.name}
          </h1>
          <span
            className="flex items-center gap-1 text-[11px] font-medium"
            style={{ color: STATUS_DOT[project.status] ?? STATUS_DOT.ACTIVE }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: STATUS_DOT[project.status] ?? STATUS_DOT.ACTIVE }}
            />
            {PROJECT_STATUS_LABELS[project.status] ?? project.status}
          </span>
        </div>
        <p className="truncate text-[12px] text-[var(--color-text-secondary)]">
          {project.clientName} · {project.phase} · {members.length} Member
          {members.length === 1 ? "" : "s"}
        </p>
      </div>

      <span
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-primary-tint)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-primary)]"
        title="Your active role — switch it from the profile menu"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
        <span className="hidden sm:inline">{ROLE_LABELS[activeRole]}</span>
        <span className="sm:hidden">{ROLE_SHORT_LABELS[activeRole]}</span>
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <Link
          href="/search"
          className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
          title="Search"
        >
          <Search size={17} />
        </Link>
        <MembersPopover members={members} />
        <button
          onClick={onToggleRightPanel}
          className={clsx(
            "hidden h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] lg:flex",
            rightPanelOpen && "bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
          )}
          title="Project information"
        >
          <PanelRight size={17} />
        </button>
        <MoreMenu
          projectId={project.id}
          project={project}
          activeRole={activeRole}
          trigger={
            <span className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--color-bg-subtle)]">
              <MoreHorizontal size={18} />
            </span>
          }
        />
      </div>
    </div>
  );
}

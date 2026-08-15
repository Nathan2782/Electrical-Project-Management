"use client";

import { useState } from "react";
import { ProjectHeader } from "@/components/project/project-header";
import { SecondaryNav } from "@/components/project/secondary-nav";
import { RightPanel } from "@/components/project/right-panel";
import type { RoleId } from "@/lib/roles";

export type ProjectSummary = {
  id: string;
  name: string;
  clientName: string;
  phase: string;
  status: string;
  address: string | null;
};

export type ProjectMemberSummary = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
};

export type PinnedMessageSummary = {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
};

export type TodayTaskSummary = {
  id: string;
  title: string;
  status: string;
  assigneeName: string | null;
  dueDate: string | null;
};

export function ProjectWorkspaceShell({
  project,
  members,
  activeRole,
  openIssues,
  materialNeeds,
  pinnedMessages,
  todayTasks,
  children,
}: {
  project: ProjectSummary;
  members: ProjectMemberSummary[];
  activeRole: RoleId;
  openIssues: number;
  materialNeeds: number;
  pinnedMessages: PinnedMessageSummary[];
  todayTasks: TodayTaskSummary[];
  children: React.ReactNode;
}) {
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <ProjectHeader
          project={project}
          members={members}
          activeRole={activeRole}
          rightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen((v) => !v)}
        />
        <SecondaryNav project={project} activeRole={activeRole} />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
      {rightPanelOpen && (
        <div className="hidden lg:block h-full w-[300px] shrink-0 border-l border-[var(--color-border)] bg-white">
          <RightPanel
            project={project}
            members={members}
            openIssues={openIssues}
            materialNeeds={materialNeeds}
            pinnedMessages={pinnedMessages}
            todayTasks={todayTasks}
            onClose={() => setRightPanelOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
